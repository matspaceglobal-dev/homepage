-- =========================================================
-- 맛스페이스 공고 테이블 설정
-- Supabase → SQL Editor 에 전체 복사 → 붙여넣기 → Run (한 번만 실행)
-- =========================================================

create table if not exists public.notices (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text,
  posted_at   date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 보안 규칙 켜기
alter table public.notices enable row level security;

-- 누구나 조회 가능
create policy "public read" on public.notices
  for select using (true);

-- 관리자 이메일로 로그인한 경우에만 작성/수정/삭제 가능
create policy "admin insert" on public.notices
  for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'matspaceglobal@gmail.com');

create policy "admin update" on public.notices
  for update to authenticated
  using ((auth.jwt() ->> 'email') = 'matspaceglobal@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'matspaceglobal@gmail.com');

create policy "admin delete" on public.notices
  for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'matspaceglobal@gmail.com');
