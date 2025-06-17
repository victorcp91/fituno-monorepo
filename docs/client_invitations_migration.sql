-- Migration: Add client_invitations table
-- This table is needed for the client invitation system functionality

CREATE TABLE IF NOT EXISTS client_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  token text UNIQUE NOT NULL,
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
  client_data jsonb DEFAULT '{}', -- Additional client data like full_name, age, city
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_invitations_trainer ON client_invitations(trainer_id);
CREATE INDEX IF NOT EXISTS idx_client_invitations_email ON client_invitations(email);
CREATE INDEX IF NOT EXISTS idx_client_invitations_token ON client_invitations(token);
CREATE INDEX IF NOT EXISTS idx_client_invitations_status ON client_invitations(status);
CREATE INDEX IF NOT EXISTS idx_client_invitations_expires ON client_invitations(expires_at);

-- RLS Policies
ALTER TABLE client_invitations ENABLE ROW LEVEL SECURITY;

-- Trainers can only see their own invitations
CREATE POLICY "Trainers can view their own invitations" ON client_invitations
  FOR SELECT USING (auth.uid() = trainer_id);

-- Trainers can only create invitations for themselves
CREATE POLICY "Trainers can create invitations" ON client_invitations
  FOR INSERT WITH CHECK (auth.uid() = trainer_id);

-- Trainers can update their own invitations
CREATE POLICY "Trainers can update their own invitations" ON client_invitations
  FOR UPDATE USING (auth.uid() = trainer_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on client_invitations
CREATE TRIGGER update_client_invitations_updated_at
  BEFORE UPDATE ON client_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire old invitations
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE client_invitations
  SET status = 'EXPIRED'
  WHERE status = 'PENDING'
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- You can run this function periodically or via a cron job
-- SELECT expire_old_invitations(); 