import { AuthService, EmailService } from '@fituno/services';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: {
    token: string;
  };
}

// GET: Verify invitation token and return invitation details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
    }

    // Find invitation by token
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .select(
        `
        id,
        email,
        token,
        status,
        client_data,
        expires_at,
        created_at,
        profiles!client_invitations_trainer_id_fkey(full_name)
      `
      )
      .eq('token', token)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation token' }, { status: 404 });
    }

    // Check if invitation has expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);

    if (now > expiresAt && invitation.status === 'PENDING') {
      // Auto-expire the invitation
      await supabase
        .from('client_invitations')
        .update({ status: 'EXPIRED' })
        .eq('id', invitation.id);

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Check invitation status
    if (invitation.status !== 'PENDING') {
      const statusMessages = {
        ACCEPTED: 'This invitation has already been accepted',
        EXPIRED: 'This invitation has expired',
        REVOKED: 'This invitation has been revoked',
      };

      return NextResponse.json(
        {
          error:
            statusMessages[invitation.status as keyof typeof statusMessages] ||
            'Invalid invitation status',
        },
        { status: 410 }
      );
    }

    // Return invitation details for display
    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        trainer_name: (invitation.profiles as any)?.full_name || 'Seu treinador',
        client_data: invitation.client_data || {},
        expires_at: invitation.expires_at,
        status: invitation.status,
      },
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Accept invitation and create client profile
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;
    const body = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invitation token is required' }, { status: 400 });
    }

    // Validate required fields for client signup
    const { email, password, full_name } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        {
          error: 'Email, password, and full name are required',
        },
        { status: 400 }
      );
    }

    // Find and validate invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'PENDING')
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    // Check if invitation has expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);

    if (now > expiresAt) {
      await supabase
        .from('client_invitations')
        .update({ status: 'EXPIRED' })
        .eq('id', invitation.id);

      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Verify email matches invitation
    if (email !== invitation.email) {
      return NextResponse.json(
        {
          error: 'Email must match the invitation email',
        },
        { status: 400 }
      );
    }

    // Create user account via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name,
        user_type: 'client',
        ...invitation.client_data,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating user:', authError);
      return NextResponse.json(
        {
          error: 'Failed to create user account',
        },
        { status: 500 }
      );
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      type: 'client',
      full_name,
      email,
      timezone: invitation.client_data?.timezone || 'America/Sao_Paulo',
      language: 'pt-BR',
      measurement_system: 'metric',
    });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: 'Failed to create user profile',
        },
        { status: 500 }
      );
    }

    // Create client record
    const { error: clientError } = await supabase.from('clients').insert({
      id: authData.user.id,
      current_trainer_id: invitation.trainer_id,
      status: 'active',
    });

    if (clientError) {
      console.error('Error creating client record:', clientError);
      // Clean up created records
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: 'Failed to create client record',
        },
        { status: 500 }
      );
    }

    // Mark invitation as accepted
    await supabase
      .from('client_invitations')
      .update({
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, full_name);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
      },
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Revoke invitation (only trainer can do this)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;

    // Get current user (trainer)
    const { data: authData, error: authError } = await AuthService.getCurrentUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trainerId = authData.user.id;

    // Find invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .select('id, trainer_id, status')
      .eq('token', token)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Check if trainer owns this invitation
    if (invitation.trainer_id !== trainerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if invitation can be revoked
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        {
          error: 'Only pending invitations can be revoked',
        },
        { status: 400 }
      );
    }

    // Revoke invitation
    const { error: updateError } = await supabase
      .from('client_invitations')
      .update({
        status: 'REVOKED',
        revoked_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error revoking invitation:', updateError);
      return NextResponse.json({ error: 'Failed to revoke invitation' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Invitation revoked successfully' });
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
