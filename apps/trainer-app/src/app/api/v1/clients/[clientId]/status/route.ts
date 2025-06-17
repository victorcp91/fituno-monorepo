import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

type ClientStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'PAUSED' | 'TRANSFERRED' | 'ARCHIVED';

interface StatusChangeRequest {
  status: ClientStatus;
  reason?: string;
  changed_by: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    // Get current user (trainer)
    const { data: authData, error: authError } = await AuthService.getCurrentUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trainerId = authData.user.id;
    const { clientId } = await params;
    const body: StatusChangeRequest = await request.json();

    const { status, reason, changed_by } = body;

    // Validate required fields
    if (!status || !changed_by) {
      return NextResponse.json({ error: 'Status and changed_by are required' }, { status: 400 });
    }

    // Validate status value
    const validStatuses: ClientStatus[] = [
      'PENDING',
      'ACTIVE',
      'INACTIVE',
      'PAUSED',
      'TRANSFERRED',
      'ARCHIVED',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // TODO: Replace with actual database call
    // Check if client exists and belongs to current trainer
    const mockClient = {
      id: clientId,
      current_trainer_id: trainerId,
      status: 'ACTIVE' as ClientStatus,
      full_name: 'Test Client',
      email: 'client@test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!mockClient || mockClient.current_trainer_id !== trainerId) {
      return NextResponse.json({ error: 'Client not found or not authorized' }, { status: 404 });
    }

    // TODO: Replace with actual database transaction
    // 1. Update client status
    // 2. Log status change
    const previousStatus = mockClient.status;
    const timestamp = new Date().toISOString();

    // Mock database update
    const updatedClient = {
      ...mockClient,
      status,
      updated_at: timestamp,
    };

    // Mock status change log entry
    const statusChangeLog = {
      id: `log_${Date.now()}`,
      client_id: clientId,
      previous_status: previousStatus,
      new_status: status,
      reason: reason || null,
      changed_by,
      changed_at: timestamp,
    };

    // Mock additional business logic based on status
    const statusActions = {
      PAUSED: () => {
        // Pause active workout plans
        console.log('Pausing active workout plans for client:', clientId);
      },
      INACTIVE: () => {
        // Send reactivation email
        console.log('Sending reactivation email to client:', clientId);
      },
      ARCHIVED: () => {
        // Archive all related data
        console.log('Archiving all data for client:', clientId);
      },
      TRANSFERRED: () => {
        // Handle transfer logic (should use transfer endpoint instead)
        console.log('Status set to transferred for client:', clientId);
      },
      ACTIVE: () => {
        // Reactivate workout plans if needed
        console.log('Reactivating workout plans for client:', clientId);
      },
      PENDING: () => {
        // Send anamnesis reminder
        console.log('Sending anamnesis reminder to client:', clientId);
      },
    };

    // Execute status-specific actions
    if (statusActions[status]) {
      statusActions[status]();
    }

    return NextResponse.json({
      success: true,
      client: updatedClient,
      log: statusChangeLog,
      message: `Client status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating client status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
