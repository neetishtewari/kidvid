-- Create questions table
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["A", "B", "C"]
  correct_answer_index int2 not null,
  category text,
  difficulty text default 'easy',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.questions enable row level security;

-- Policy: Everyone can read questions
create policy "Public questions are viewable by everyone"
  on public.questions for select
  using ( true );

-- Policy: Only authenticated users (parents) can insert (for now)
create policy "Authenticated users can insert questions"
  on public.questions for insert
  with check ( auth.role() = 'authenticated' );

-- Seed Data
insert into public.questions (question_text, options, correct_answer_index, category)
values
  ('What is the fastest animal on land?', '["Elephant", "Cheetah", "Lion", "Sloth"]', 1, 'Animals'),
  ('Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 1, 'Space'),
  ('How many legs does a spider have?', '["Six", "Eight", "Ten", "Four"]', 1, 'Animals'),
  ('What color do you get if you mix Red and Blue?', '["Green", "Purple", "Orange", "Yellow"]', 1, 'Art'),
  ('What is 5 + 3?', '["6", "7", "8", "9"]', 2, 'Math');
