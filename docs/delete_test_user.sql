-- ============================================
-- DELETE TEST USER ACCOUNT SCRIPT
-- ============================================
-- This script safely removes victor.correapereira@gmail.com
-- from all Fituno tables in the correct order to respect FK constraints
-- 
-- ⚠️  IMPORTANT: Run this in your Supabase SQL Editor
-- ⚠️  WARNING: This permanently deletes ALL data for this user
-- ============================================

-- Step 1: Get the user ID first (for reference)
DO $$
DECLARE
    target_email TEXT := 'victor.correapereira@gmail.com';
    user_uuid UUID;
BEGIN
    -- Find the user ID
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = target_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found', target_email;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user ID: %', user_uuid;
    RAISE NOTICE 'Starting deletion process for %', target_email;
    
    -- Step 2: Delete from dependent tables first (respecting foreign key constraints)
    
    -- Delete workout-related data
    RAISE NOTICE 'Deleting workout exercises...';
    DELETE FROM workout_exercises 
    WHERE session_id IN (
        SELECT ws.id FROM workout_sessions ws
        JOIN workout_plans wp ON ws.plan_id = wp.id
        WHERE wp.trainer_id = user_uuid OR wp.client_id = user_uuid
    );
    
    RAISE NOTICE 'Deleting workout sessions...';
    DELETE FROM workout_sessions 
    WHERE plan_id IN (
        SELECT id FROM workout_plans 
        WHERE trainer_id = user_uuid OR client_id = user_uuid
    );
    
    RAISE NOTICE 'Deleting workout plans...';
    DELETE FROM workout_plans 
    WHERE trainer_id = user_uuid OR client_id = user_uuid;
    
    -- Delete anamnesis data
    RAISE NOTICE 'Deleting anamnesis responses...';
    DELETE FROM anamnesis_responses 
    WHERE client_id = user_uuid OR trainer_id = user_uuid;
    
    RAISE NOTICE 'Deleting anamnesis templates...';
    DELETE FROM anamnesis_templates 
    WHERE trainer_id = user_uuid;
    
    -- Delete client-trainer relationships
    RAISE NOTICE 'Deleting client-trainer history...';
    DELETE FROM client_trainer_history 
    WHERE client_id = user_uuid OR trainer_id = user_uuid;
    
    -- Update clients who had this trainer (set current_trainer_id to NULL)
    RAISE NOTICE 'Updating clients with this trainer...';
    UPDATE clients 
    SET current_trainer_id = NULL, updated_at = now()
    WHERE current_trainer_id = user_uuid;
    
    -- Delete profile-related records
    RAISE NOTICE 'Deleting from clients table...';
    DELETE FROM clients WHERE id = user_uuid;
    
    RAISE NOTICE 'Deleting from trainers table...';
    DELETE FROM trainers WHERE id = user_uuid;
    
    RAISE NOTICE 'Deleting from profiles table...';
    DELETE FROM profiles WHERE id = user_uuid;
    
    -- Step 3: Delete from auth.users (this is the main Supabase Auth record)
    RAISE NOTICE 'Deleting from auth.users...';
    DELETE FROM auth.users WHERE id = user_uuid;
    
    RAISE NOTICE '✅ Successfully deleted user % (ID: %)', target_email, user_uuid;
    RAISE NOTICE 'The user can now register again with a fresh account';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error occurred: %', SQLERRM;
        RAISE NOTICE 'Deletion may have been partially completed';
        RAISE NOTICE 'You may need to run this script again or check manually';
END $$;

-- ============================================
-- VERIFICATION QUERIES (Optional - Run after deletion)
-- ============================================

-- Uncomment these to verify the deletion was successful:

-- SELECT 'auth.users' as table_name, COUNT(*) as remaining_records 
-- FROM auth.users WHERE email = 'victor.correapereira@gmail.com'
-- UNION ALL
-- SELECT 'profiles', COUNT(*) 
-- FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'victor.correapereira@gmail.com')
-- UNION ALL  
-- SELECT 'trainers', COUNT(*) 
-- FROM trainers WHERE id IN (SELECT id FROM auth.users WHERE email = 'victor.correapereira@gmail.com')
-- UNION ALL
-- SELECT 'clients', COUNT(*) 
-- FROM clients WHERE id IN (SELECT id FROM auth.users WHERE email = 'victor.correapereira@gmail.com');

-- ============================================
-- NOTES:
-- ============================================
-- 1. This script uses a DO block for better error handling
-- 2. It respects foreign key constraints by deleting in the correct order
-- 3. It provides progress updates via RAISE NOTICE
-- 4. If any step fails, you'll see an error message
-- 5. After running this, victor.correapereira@gmail.com can register as a completely new user
-- 6. All associated data (workouts, clients, anamnesis, etc.) will be permanently deleted
-- ============================================ 