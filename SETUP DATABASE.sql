-- ═══════════════════════════════════════════════════════
-- SHREE SHARADA TMS — Database Setup v2
-- Run this in Supabase SQL Editor
-- Safe to run multiple times
-- ═══════════════════════════════════════════════════════

-- 1. STUDENTS TABLE
create table if not exists students (
  id           text primary key,
  name         text not null,
  dob          text,
  gender       text,
  grade        text not null,
  parent_name  text not null,
  mobile       text not null,
  email        text default '',
  city         text default '',
  fee          integer default 0,
  status       text default 'Active',
  adm_date     text,
  blood        text default '',
  created_at   timestamptz default now()
);

-- 2. FEES TABLE
create table if not exists fees (
  id           text primary key,
  student_id   text,
  name         text,
  grade        text,
  month        text,
  total_fee    integer default 0,
  paid         integer default 0,
  due          integer default 0,
  date         text default '',
  mode         text default '',
  status       text default 'Due',
  created_at   timestamptz default now()
);

-- 3. ATTENDANCE TABLE
create table if not exists attendance (
  id           bigint generated always as identity primary key,
  student_id   text not null,
  date         text not null,
  status       text not null,
  time         text default '',
  created_at   timestamptz default now(),
  unique(student_id, date)
);

-- 4. STAFF TABLE
create table if not exists staff (
  id           bigint generated always as identity primary key,
  name         text not null,
  username     text unique not null,
  password     text not null,
  mobile       text default '',
  role         text default 'staff',
  status       text default 'Active',
  created_at   timestamptz default now()
);

-- 5. SETTINGS TABLE
create table if not exists settings (
  key          text primary key,
  value        text default '',
  updated_at   timestamptz default now()
);

-- ═══════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════
alter table students   enable row level security;
alter table fees       enable row level security;
alter table attendance enable row level security;
alter table staff      enable row level security;
alter table settings   enable row level security;

-- Drop existing policies first (safe to re-run)
drop policy if exists "allow_all_students"   on students;
drop policy if exists "allow_all_fees"       on fees;
drop policy if exists "allow_all_attendance" on attendance;
drop policy if exists "allow_all_staff"      on staff;
drop policy if exists "allow_all_settings"   on settings;

-- Create new policies
create policy "allow_all_students"   on students   for all using (true) with check (true);
create policy "allow_all_fees"       on fees       for all using (true) with check (true);
create policy "allow_all_attendance" on attendance for all using (true) with check (true);
create policy "allow_all_staff"      on staff      for all using (true) with check (true);
create policy "allow_all_settings"   on settings   for all using (true) with check (true);

-- ═══════════════════════════════════════════════════════
-- SEED DEFAULT STUDENTS (safe - uses on conflict do nothing)
-- ═══════════════════════════════════════════════════════
insert into students (id,name,dob,gender,grade,parent_name,mobile,email,city,fee,status,adm_date,blood) values
('SSC-2026-001','Riya Sharma',   '2015-03-15','Female','Class 4','Rajesh Sharma',  '9876543210','','Pune',1100,'Active',  '2024-06-01','B+'),
('SSC-2026-002','Arjun Patil',   '2013-07-22','Male',  'Class 6','Suresh Patil',   '9876543211','','Pune',1300,'Active',  '2024-06-01','O+'),
('SSC-2026-003','Sneha Kulkarni','2016-11-08','Female','Class 2','Anil Kulkarni',  '9876543212','','Pune',900, 'Active',  '2024-07-15','A+'),
('SSC-2026-004','Mahesh Joshi',  '2014-05-30','Male',  'Class 7','Dinesh Joshi',   '9876543213','','Pune',1500,'Active',  '2024-06-01','AB+'),
('SSC-2026-005','Priya Desai',   '2015-09-14','Female','Class 3','Vijay Desai',    '9876543214','','Pune',1000,'Active',  '2024-08-01','B-'),
('SSC-2026-006','Kavya Nair',    '2013-01-20','Female','Class 6','Krishnan Nair',  '9876543215','','Pune',1300,'Active',  '2024-06-01','O-'),
('SSC-2026-007','Vikram Singh',  '2014-12-05','Male',  'Class 4','Harpreet Singh', '9876543216','','Pune',1100,'Active',  '2024-09-01','A-'),
('SSC-2026-008','Neha Rao',      '2015-06-18','Female','Class 3','Prasad Rao',     '9876543217','','Pune',1000,'Active',  '2024-06-01','B+'),
('SSC-2026-009','Dev Kumar',     '2014-04-25','Male',  'Class 5','Ramesh Kumar',   '9876543218','','Pune',1200,'Active',  '2024-07-01','O+'),
('SSC-2026-010','Tanvi Mehta',   '2016-08-12','Female','Class 2','Amit Mehta',     '9876543219','','Pune',900, 'Inactive','2024-06-01','A+'),
('SSC-2026-011','Rohan Verma',   '2014-02-28','Male',  'Class 4','Deepak Verma',   '9876543220','','Pune',1100,'Active',  '2025-01-01','AB-'),
('SSC-2026-012','Ananya Pillai', '2015-10-10','Female','Class 3','Suresh Pillai',  '9876543221','','Pune',1000,'Active',  '2025-01-15','B+')
on conflict (id) do nothing;

-- SEED DEFAULT FEES
insert into fees (id,student_id,name,grade,month,total_fee,paid,due,date,mode,status) values
('PAY-001','SSC-2026-001','Riya Sharma',   'Class 4','May 2026',1100,1100,0,   '2026-05-02','UPI', 'Paid'),
('PAY-002','SSC-2026-002','Arjun Patil',   'Class 6','May 2026',1300,1300,0,   '2026-05-03','Cash','Paid'),
('PAY-003','SSC-2026-003','Sneha Kulkarni','Class 2','May 2026',900, 600, 300, '2026-05-04','UPI', 'Partially Paid'),
('PAY-004','SSC-2026-004','Mahesh Joshi',  'Class 7','May 2026',1500,1500,0,   '2026-05-05','Bank','Paid'),
('PAY-005','SSC-2026-005','Priya Desai',   'Class 3','May 2026',1000,0,   1000,'',          '—',   'Due'),
('PAY-006','SSC-2026-006','Kavya Nair',    'Class 6','May 2026',1300,1300,0,   '2026-05-01','UPI', 'Paid'),
('PAY-007','SSC-2026-007','Vikram Singh',  'Class 4','May 2026',1100,0,   1100,'',          '—',   'Due'),
('PAY-008','SSC-2026-008','Neha Rao',      'Class 3','May 2026',1000,1000,0,   '2026-05-06','Cash','Paid')
on conflict (id) do nothing;

-- DEFAULT SETTINGS
insert into settings (key,value) values
('centreName',         'Shree Sharada Tuition Centre'),
('centrePhone',        '9876543200'),
('centreEmail',        'admin@shreesharada.edu.in'),
('centreAddr',         '123, Shivaji Nagar, Near Central Park, Pune - 411005, Maharashtra'),
('adminDisplayName',   'Admin'),
('adminLoginUsername', 'ssadmin'),
('adminPass',          'Sharada@2026')
on conflict (key) do nothing;

-- Confirm
select 'SUCCESS: Database setup complete!' as result;
