import { DatabaseManager } from '../database/DatabaseManager';
import { TABLES } from '../database/config';

export interface SyncQueueItem {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: string; // JSON stringified data
  created_at: string;
  retry_count: number;
  last_error?: string;
}

export class SyncQueueService {
  private static instance: SyncQueueService;
  private dbManager: DatabaseManager;

  private constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  public static getInstance(): SyncQueueService {
    if (!SyncQueueService.instance) {
      SyncQueueService.instance = new SyncQueueService();
    }
    return SyncQueueService.instance;
  }

  // Add operation to sync queue
  public async addToQueue(
    tableName: string,
    recordId: string,
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    data: any
  ): Promise<void> {
    try {
      const queueItem = {
        id: this.generateId(),
        table_name: tableName,
        record_id: recordId,
        operation,
        data: JSON.stringify(data),
        created_at: new Date().toISOString(),
        retry_count: 0,
      };

      await this.dbManager.insert(TABLES.SYNC_QUEUE, queueItem);

    } catch {

      throw error;
    }
  }

  // Get pending sync items
  public async getPendingItems(limit: number = 50): Promise<SyncQueueItem[]> {
    try {
      const items = await this.dbManager.select(
        TABLES.SYNC_QUEUE,
        '*',
        'retry_count < ?',
        [5], // Max 5 retries
        'created_at ASC',
        limit
      );

      return items.map(item => ({
        ...item,
        data: JSON.parse(item.data),
      }));
    } catch {

      return [];
    }
  }

  // Mark item as synced (remove from queue)
  public async markAsSynced(id: string): Promise<void> {
    try {
      await this.dbManager.delete(TABLES.SYNC_QUEUE, 'id = ?', [id]);

    } catch {

      throw error;
    }
  }

  // Mark item as failed (increment retry count)
  public async markAsFailed(id: string, error: string): Promise<void> {
    try {
      // First get the current item
      const [currentItem] = await this.dbManager.select(TABLES.SYNC_QUEUE, '*', 'id = ?', [id]);

      if (!currentItem) {
        throw new Error(`Sync queue item ${id} not found`);
      }

      // Increment retry count
      const newRetryCount = (currentItem.retry_count || 0) + 1;

      // Update with new values
      await this.dbManager.update(
        TABLES.SYNC_QUEUE,
        {
          retry_count: newRetryCount,
          last_error: error,
        },
        'id = ?',
        [id]
      );

    } catch (dbError) {

      throw dbError;
    }
  }

  // Get failed items (exceeded retry limit)
  public async getFailedItems(): Promise<SyncQueueItem[]> {
    try {
      const items = await this.dbManager.select(
        TABLES.SYNC_QUEUE,
        '*',
        'retry_count >= ?',
        [5],
        'created_at ASC'
      );

      return items.map(item => ({
        ...item,
        data: JSON.parse(item.data),
      }));
    } catch {

      return [];
    }
  }

  // Clear failed items
  public async clearFailedItems(): Promise<void> {
    try {
      const deletedCount = await this.dbManager.delete(TABLES.SYNC_QUEUE, 'retry_count >= ?', [5]);

    } catch {

      throw error;
    }
  }

  // Get queue statistics
  public async getQueueStats(): Promise<{
    pending: number;
    failed: number;
    total: number;
  }> {
    try {
      const [pendingResult, failedResult, totalResult] = await Promise.all([
        this.dbManager.select(TABLES.SYNC_QUEUE, 'COUNT(*) as count', 'retry_count < ?', [5]),
        this.dbManager.select(TABLES.SYNC_QUEUE, 'COUNT(*) as count', 'retry_count >= ?', [5]),
        this.dbManager.select(TABLES.SYNC_QUEUE, 'COUNT(*) as count'),
      ]);

      return {
        pending: pendingResult[0]?.count || 0,
        failed: failedResult[0]?.count || 0,
        total: totalResult[0]?.count || 0,
      };
    } catch {

      return { pending: 0, failed: 0, total: 0 };
    }
  }

  // Clear all queue items
  public async clearQueue(): Promise<void> {
    try {
      await this.dbManager.clearTable(TABLES.SYNC_QUEUE);

    } catch {

      throw error;
    }
  }

  // Process sync queue (to be called when online)
  public async processQueue(
    syncHandler: (item: SyncQueueItem) => Promise<boolean>
  ): Promise<{ processed: number; failed: number }> {
    const pendingItems = await this.getPendingItems();
    let processed = 0;
    let failed = 0;

    for (const item of pendingItems) {
      try {
        const success = await syncHandler(item);
        if (success) {
          await this.markAsSynced(item.id);
          processed++;
        } else {
          await this.markAsFailed(item.id, 'Sync handler returned false');
          failed++;
        }
      } catch {
        await this.markAsFailed(item.id, error instanceof Error ? error.message : 'Unknown error');
        failed++;
      }
    }


    return { processed, failed };
  }

  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
