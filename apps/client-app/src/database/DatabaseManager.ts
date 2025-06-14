import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, DATABASE_NAME, DATABASE_VERSION, TABLES } from './config';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.runMigrations();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Enable foreign keys
      await this.db.execAsync('PRAGMA foreign_keys = ON;');

      // Create all tables
      for (const [tableName, createSQL] of Object.entries(CREATE_TABLES)) {
        await this.db.execAsync(createSQL);
        console.log(`Created table: ${tableName}`);
      }

      // Set database version
      await this.db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  public async getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      await this.initialize();
    }
    return this.db!;
  }

  // Generic CRUD operations
  public async insert(table: string, data: Record<string, any>): Promise<string> {
    const db = await this.getDatabase();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data)
      .map(() => '?')
      .join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await db.runAsync(query, values);
    return result.lastInsertRowId.toString();
  }

  public async update(
    table: string,
    data: Record<string, any>,
    where: string,
    whereArgs: any[] = []
  ): Promise<number> {
    const db = await this.getDatabase();
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), ...whereArgs];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const result = await db.runAsync(query, values);
    return result.changes;
  }

  public async delete(table: string, where: string, whereArgs: any[] = []): Promise<number> {
    const db = await this.getDatabase();
    const query = `DELETE FROM ${table} WHERE ${where}`;
    const result = await db.runAsync(query, whereArgs);
    return result.changes;
  }

  public async select(
    table: string,
    columns: string = '*',
    where?: string,
    whereArgs: any[] = [],
    orderBy?: string,
    limit?: number
  ): Promise<any[]> {
    const db = await this.getDatabase();
    let query = `SELECT ${columns} FROM ${table}`;

    if (where) {
      query += ` WHERE ${where}`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    const result = await db.getAllAsync(query, whereArgs);
    return result;
  }

  public async selectOne(
    table: string,
    columns: string = '*',
    where?: string,
    whereArgs: any[] = []
  ): Promise<any | null> {
    const results = await this.select(table, columns, where, whereArgs, undefined, 1);
    return results.length > 0 ? results[0] : null;
  }

  // Utility methods
  public async clearTable(table: string): Promise<void> {
    const db = await this.getDatabase();
    await db.runAsync(`DELETE FROM ${table}`);
  }

  public async dropAllTables(): Promise<void> {
    const db = await this.getDatabase();
    for (const table of Object.values(TABLES)) {
      await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  // Transaction support
  public async transaction(callback: () => Promise<void>): Promise<void> {
    const db = await this.getDatabase();
    return await db.withTransactionAsync(callback);
  }
}
