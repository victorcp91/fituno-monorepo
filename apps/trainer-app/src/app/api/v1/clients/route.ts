import { AuthService, EmailService } from '@fituno/services';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get current user (trainer)
    const { data: authData, error: authError } = await AuthService.getCurrentUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trainerId = authData.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query for clients assigned to this trainer
    let query = supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        full_name,
        avatar_url,
        timezone,
        language,
        created_at,
        updated_at,
        clients!inner(
          current_trainer_id,
          status,
          latest_anamnesis_id
        )
      `
      )
      .eq('clients.current_trainer_id', trainerId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('clients.status', status);
    }

    // Add search filter if provided
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: clients, error: clientsError } = await query;

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('clients.current_trainer_id', trainerId);

    if (status) {
      countQuery = countQuery.eq('clients.status', status);
    }

    if (search) {
      countQuery = countQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting clients:', countError);
    }

    // Transform data to match our Client type
    const transformedClients =
      clients?.map((client: any) => ({
        id: client.id,
        email: client.email,
        full_name: client.full_name,
        avatar_url: client.avatar_url,
        timezone: client.timezone,
        language: client.language,
        current_trainer_id: client.clients?.[0]?.current_trainer_id,
        status: client.clients?.[0]?.status,
        latest_anamnesis_id: client.clients?.[0]?.latest_anamnesis_id,
        measurement_system: 'METRIC', // Default value
        created_at: client.created_at,
        updated_at: client.updated_at,
      })) || [];

    return NextResponse.json({
      clients: transformedClients,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user (trainer)
    const { data: authData, error: authError } = await AuthService.getCurrentUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trainerId = authData.user.id;
    const body = await request.json();

    // Validate required fields
    const { email, full_name, age, city, timezone = 'America/Sao_Paulo' } = body;

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    // Check if client with this email already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, clients(current_trainer_id)')
      .eq('email', email)
      .single();

    if (existingProfile) {
      // Check if they're already assigned to this trainer
      if ((existingProfile.clients as any)?.[0]?.current_trainer_id === trainerId) {
        return NextResponse.json({ error: 'Client is already assigned to you' }, { status: 409 });
      }
      // Check if they're assigned to another trainer
      if ((existingProfile.clients as any)?.[0]?.current_trainer_id) {
        return NextResponse.json(
          { error: 'Client is already assigned to another trainer' },
          { status: 409 }
        );
      }
    }

    // Get trainer name for email
    const { data: trainerProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', trainerId)
      .single();

    const trainerName = trainerProfile?.full_name || 'Seu treinador';

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store client data for later use
    const clientData = {
      full_name,
      age: age ? parseInt(age) : null,
      city,
      timezone,
    };

    // Create client invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('client_invitations')
      .insert({
        trainer_id: trainerId,
        email,
        token: invitationToken,
        client_data: clientData,
        expires_at: expiresAt.toISOString(),
        status: 'PENDING',
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      return NextResponse.json({ error: 'Failed to create client invitation' }, { status: 500 });
    }

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/accept-invitation?token=${invitationToken}`;

    const emailResult = await EmailService.sendClientInvitation({
      trainerName,
      clientEmail: email,
      invitationUrl,
      expirationDate: expiresAt.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    if (!emailResult.success) {
      // Log the error but don't fail the invitation creation
      console.error('Failed to send invitation email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.token,
        status: invitation.status,
        expires_at: invitation.expires_at,
        invitation_url: invitationUrl,
        email_sent: emailResult.success,
      },
    });
  } catch (error) {
    console.error('Unexpected error in POST /api/v1/clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
