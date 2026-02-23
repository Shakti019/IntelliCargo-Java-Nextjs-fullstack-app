-- Fix NULL values in is_active column
-- This fixes the error: Can not set boolean field UserModel.isActive to null value

-- Update all users with NULL is_active to TRUE
UPDATE users SET is_active = true WHERE is_active IS NULL;

-- Set default value for future inserts
ALTER TABLE users ALTER COLUMN is_active SET DEFAULT true;
ALTER TABLE users ALTER COLUMN is_active SET NOT NULL;

SELECT 'SUCCESS: Fixed is_active column for all users!' as result;
