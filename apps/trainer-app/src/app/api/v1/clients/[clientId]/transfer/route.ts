import { AuthService } from '@fituno/services';
import { NextRequest, NextResponse } from 'next/server';

interface TransferRequest {
  new_trainer_id: string;
  reason?: string;
  transferred_by: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    // Get current user (trainer)
    const { data: authData, error: authError } = await AuthService.getCurrentUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentTrainerId = authData.user.id;
    const { clientId } = await params;
    const body: TransferRequest = await request.json();

    const { new_trainer_id, reason, transferred_by } = body;

    // Validate required fields
    if (!new_trainer_id || !transferred_by) {
      return NextResponse.json(
        { error: 'new_trainer_id and transferred_by are required' },
        { status: 400 }
      );
    }

    // Validate that new trainer is different from current
    if (new_trainer_id === currentTrainerId) {
      return NextResponse.json(
        { error: 'Cannot transfer client to the same trainer' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database calls
    // Check if client exists and belongs to current trainer
    const mockClient = {
      id: clientId,
      current_trainer_id: currentTrainerId,
      status: 'ACTIVE',
      full_name: 'Test Client',
      email: 'client@test.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!mockClient || mockClient.current_trainer_id !== currentTrainerId) {
      return NextResponse.json({ error: 'Client not found or not authorized' }, { status: 404 });
    }

    // Check if new trainer exists and is active
    const mockNewTrainer = {
      id: new_trainer_id,
      name: 'New Trainer',
      email: 'newtrainer@test.com',
      is_active: true,
    };

    if (!mockNewTrainer || !mockNewTrainer.is_active) {
      return NextResponse.json({ error: 'Target trainer not found or inactive' }, { status: 404 });
    }

    const timestamp = new Date().toISOString();

    // TODO: Replace with actual database transaction
    // 1. Update client's trainer_id
    // 2. Update client status to TRANSFERRED
    // 3. Log the transfer
    // 4. Create notification for new trainer
    // 5. Send email notifications

    // Mock database update
    const updatedClient = {
      ...mockClient,
      current_trainer_id: new_trainer_id,
      status: 'TRANSFERRED',
      updated_at: timestamp,
    };

    // Mock transfer log entry
    const transferLog = {
      id: `transfer_${Date.now()}`,
      client_id: clientId,
      from_trainer_id: currentTrainerId,
      to_trainer_id: new_trainer_id,
      reason: reason || null,
      transferred_by,
      transferred_at: timestamp,
    };

    // Mock notification creation
    const notification = {
      id: `notif_${Date.now()}`,
      recipient_id: new_trainer_id,
      type: 'CLIENT_TRANSFER',
      title: 'Novo Cliente Transferido',
      message: `Você recebeu um novo cliente: ${mockClient.full_name}`,
      data: {
        client_id: clientId,
        client_name: mockClient.full_name,
        from_trainer_id: currentTrainerId,
        transfer_reason: reason,
      },
      created_at: timestamp,
      read: false,
    };

    // Mock email sending
    console.log('Sending transfer notification emails...');
    console.log('To new trainer:', mockNewTrainer.email);
    console.log('To client:', mockClient.email);

    // Mock business logic for transfer
    console.log('Transfer actions:', {
      client_id: clientId,
      from_trainer: currentTrainerId,
      to_trainer: new_trainer_id,
      actions: [
        'Updating client record',
        'Creating transfer log',
        'Sending notifications',
        'Archiving current workout plans',
        'Notifying both trainers',
        'Updating access permissions',
      ],
    });

    return NextResponse.json({
      success: true,
      client: updatedClient,
      transfer_log: transferLog,
      notification,
      message: `Client successfully transferred to ${mockNewTrainer.name}`,
    });
  } catch (error) {
    console.error('Error transferring client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
