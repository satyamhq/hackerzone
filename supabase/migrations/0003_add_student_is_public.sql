-- 0003_add_student_is_public.sql: Add is_public column to students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
