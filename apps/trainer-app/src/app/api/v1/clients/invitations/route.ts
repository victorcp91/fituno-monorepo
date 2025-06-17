import { AuthService } from '@fituno/services';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: List all invitations for the authenticated trainer
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build query for invitations
    let query = supabase
      .from('client_invitations')
      .select(
        `
        id,
        email,
        token,
        status,
        client_data,
        expires_at,
        accepted_at,
        revoked_at,
        created_at,
        updated_at
      `
      )
      .eq('trainer_id', trainerId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: invitations, error: invitationsError } = await query;

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('client_invitations')
      .select('id', { count: 'exact', head: true })
      .eq('trainer_id', trainerId);

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting invitations:', countError);
    }

    // Transform data to include additional computed fields
    const transformedInvitations =
      invitations?.map(invitation => {
        const now = new Date();
        const expiresAt = new Date(invitation.expires_at);
        const isExpired = now > expiresAt && invitation.status === 'PENDING';

        return {
          id: invitation.id,
          email: invitation.email,
          status: isExpired ? 'EXPIRED' : invitation.status,
          client_data: invitation.client_data || {},
          expires_at: invitation.expires_at,
          accepted_at: invitation.accepted_at,
          revoked_at: invitation.revoked_at,
          created_at: invitation.created_at,
          updated_at: invitation.updated_at,
          is_expired: isExpired,
          days_remaining: isExpired
            ? 0
            : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        };
      }) || [];

    return NextResponse.json({
      invitations: transformedInvitations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/v1/clients/invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
