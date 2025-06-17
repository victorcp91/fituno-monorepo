-- Create Test Trainer User for Fituno
-- Run this script in your Supabase SQL editor

-- Insert test trainer into auth.users (this will be managed by Supabase Auth during registration)
-- The actual user will be created through the registration flow, but we need the profile and trainer record

-- Test trainer credentials:
-- Email: trainer@fituno.test
-- Password: FitunoTest123!
-- Full Name: Test Trainer
-- Timezone: America/Sao_Paulo

-- Note: You need to register this user through the registration form first,
-- then run this script to complete the trainer setup

-- After registering through the UI, get the user ID and replace the UUID below
-- You can find the user ID in: Supabase Dashboard > Authentication > Users

-- Example user ID (replace with actual ID from Supabase Auth after registration):
-- SET user_id = 'YOUR_USER_ID_HERE';

-- For now, we'll create a placeholder. Replace the ID with the actual one after registration.

DO $$ 
DECLARE
    test_user_id uuid;
BEGIN
    -- Check if a test trainer already exists
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'trainer@fituno.test'
    LIMIT 1;
    
    -- If user exists, create/update the profile and trainer records
    IF test_user_id IS NOT NULL THEN
        -- Insert or update profile
        INSERT INTO profiles (
            id,
            type,
            full_name,
            timezone,
            language,
            measurement_system,
            terms_accepted_at,
            terms_version
        ) VALUES (
            test_user_id,
            'trainer',
            'Test Trainer',
            'America/Sao_Paulo',
            'pt-BR',
            'metric',
            now(),
            '1.0'
        ) ON CONFLICT (id) DO UPDATE SET
            type = EXCLUDED.type,
            full_name = EXCLUDED.full_name,
            timezone = EXCLUDED.timezone,
            language = EXCLUDED.language,
            measurement_system = EXCLUDED.measurement_system,
            terms_accepted_at = EXCLUDED.terms_accepted_at,
            terms_version = EXCLUDED.terms_version,
            updated_at = now();

        -- Insert or update trainer record
        INSERT INTO trainers (
            id,
            subscription_status,
            max_clients
        ) VALUES (
            test_user_id,
            'free',
            2
        ) ON CONFLICT (id) DO UPDATE SET
            subscription_status = EXCLUDED.subscription_status,
            max_clients = EXCLUDED.max_clients,
            updated_at = now();

        -- Create a default anamnesis template for the test trainer
        INSERT INTO anamnesis_templates (
            trainer_id,
            name,
            is_default,
            questions
        ) VALUES (
            test_user_id,
            'Anamnese Padrão',
            true,
            '[
                {
                    "id": "1",
                    "type": "text",
                    "text": "Qual é o seu objetivo principal com o treinamento?",
                    "required": true
                },
                {
                    "id": "2", 
                    "type": "text",
                    "text": "Você possui alguma lesão ou limitação física?",
                    "required": true
                },
                {
                    "id": "3",
                    "type": "select",
                    "text": "Qual seu nível de experiência com exercícios?",
                    "options": ["Iniciante", "Intermediário", "Avançado"],
                    "required": true
                },
                {
                    "id": "4",
                    "type": "text",
                    "text": "Quantos dias por semana você pode treinar?",
                    "required": true
                },
                {
                    "id": "5",
                    "type": "textarea",
                    "text": "Informações adicionais ou observações:",
                    "required": false
                }
            ]'::jsonb
        ) ON CONFLICT DO NOTHING;

        RAISE NOTICE 'Test trainer profile and records created/updated successfully for user ID: %', test_user_id;
    ELSE
        RAISE NOTICE 'User with email trainer@fituno.test not found. Please register first through the registration form.';
    END IF;
END $$;

-- Grant necessary permissions for the test trainer
-- (This is usually handled by RLS policies, but we can verify the user exists)

-- Instructions:
-- 1. First, register a new trainer account through the web interface at /auth/register with:
--    - Email: trainer@fituno.test
--    - Password: FitunoTest123!
--    - Full Name: Test Trainer
-- 2. Verify the email (check for email in Supabase Auth or bypass verification if needed)
-- 3. Run this script in Supabase SQL editor to complete the trainer setup
-- 4. The test trainer will be ready to use with 2 client slots (free plan)

-- Verification query to check if everything was created correctly:
/*
SELECT 
    u.email,
    p.full_name,
    p.type,
    t.subscription_status,
    t.max_clients,
    COUNT(at.id) as template_count
FROM auth.users u
JOIN profiles p ON u.id = p.id
JOIN trainers t ON u.id = t.id
LEFT JOIN anamnesis_templates at ON t.id = at.trainer_id
WHERE u.email = 'trainer@fituno.test'
GROUP BY u.email, p.full_name, p.type, t.subscription_status, t.max_clients;
*/ 