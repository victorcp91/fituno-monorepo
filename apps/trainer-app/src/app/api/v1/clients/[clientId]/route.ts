import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

interface SoftDeleteRequest {
  soft_delete: boolean;
  deleted_by: string;
  reason?: string;
}

// GET: Get single client details
export async function GET(
  _request: NextRequest,
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

    // TODO: Replace with actual database call
    // Check if client exists and belongs to current trainer
    const mockClient = {
      id: clientId,
      current_trainer_id: trainerId,
      status: 'ACTIVE',
      full_name: 'Test Client',
      email: 'client@test.com',
      phone: '+5511999999999',
      date_of_birth: '1990-01-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      anamnesis_data: {
        health_conditions: ['Healthy'],
        fitness_goals: ['Weight Loss'],
        exercise_experience: 'Beginner',
        preferences: ['Cardio'],
        restrictions: [],
      },
      workout_plans: [
        {
          id: 'plan_1',
          name: 'Beginner Full Body',
          status: 'ACTIVE',
          progress: 75,
          frequency: '3x/week',
          start_date: '2024-01-01',
          sessions_completed: 15,
          total_sessions: 20,
        },
      ],
    };

    if (!mockClient || mockClient.current_trainer_id !== trainerId) {
      return NextResponse.json({ error: 'Client not found or not authorized' }, { status: 404 });
    }

    // Check if client is soft deleted
    if (mockClient.deleted_at) {
      return NextResponse.json(
        { error: 'Client has been archived' },
        { status: 410 } // Gone
      );
    }

    return NextResponse.json({
      success: true,
      client: mockClient,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Soft delete a client
export async function DELETE(
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
    const body: SoftDeleteRequest = await request.json();

    const { soft_delete, deleted_by, reason } = body;

    // Validate required fields
    if (!soft_delete || !deleted_by) {
      return NextResponse.json(
        { error: 'soft_delete and deleted_by are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database call
    // Check if client exists and belongs to current trainer
    const mockClient = {
      id: clientId,
      current_trainer_id: trainerId,
      status: 'ACTIVE',
      full_name: 'Test Client',
      email: 'client@test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    if (!mockClient || mockClient.current_trainer_id !== trainerId) {
      return NextResponse.json({ error: 'Client not found or not authorized' }, { status: 404 });
    }

    // Check if already deleted
    if (mockClient.deleted_at) {
      return NextResponse.json({ error: 'Client is already archived' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // TODO: Replace with actual database transaction
    // 1. Set deleted_at timestamp
    // 2. Update status to ARCHIVED
    // 3. Log the deletion
    // 4. Archive related data (workout plans, sessions, etc.)
    // 5. Send notification email

    // Mock database update
    const archivedClient = {
      ...mockClient,
      status: 'ARCHIVED',
      deleted_at: timestamp,
      updated_at: timestamp,
    };

    // Mock deletion log entry
    const deletionLog = {
      id: `deletion_${Date.now()}`,
      client_id: clientId,
      deleted_by,
      reason: reason || 'No reason provided',
      deleted_at: timestamp,
      type: 'SOFT_DELETE',
    };

    // Mock archival actions
    const archivalActions = {
      client_id: clientId,
      actions_performed: [
        'Set deleted_at timestamp',
        'Updated status to ARCHIVED',
        'Paused active workout plans',
        'Archived session history',
        'Updated access permissions',
        'Created deletion audit log',
        'Sent archival notification',
      ],
      reversible: true,
      retention_policy: '7 years for audit purposes',
    };

    console.log('Performing soft delete actions:', archivalActions);

    // Mock email notification
    console.log('Sending archival notification to client:', mockClient.email);

    return NextResponse.json({
      success: true,
      client: archivedClient,
      deletion_log: deletionLog,
      message: `Client ${mockClient.full_name} has been successfully archived`,
      note: 'This action can be reversed by updating the client status',
    });
  } catch (error) {
    console.error('Error archiving client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
