-- Napulita RPC Functions
-- Copyright (c) 2024 Napulita

-- 1. Create report with validation and points
create or replace function rpc_create_report(
  p_lat double precision,
  p_lon double precision,
  p_category report_category,
  p_note text default null,
  p_photo_url text default null
)
returns bigint
language plpgsql
security definer
as $$
declare
  v_report_id bigint;
  v_user_id uuid;
  v_daily_count int;
begin
  -- Get current user
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Check daily limit (max 10 reports per day)
  select count(*) into v_daily_count
  from reports
  where user_id = v_user_id
    and created_at >= date_trunc('day', now());
  
  if v_daily_count >= 10 then
    raise exception 'Daily report limit exceeded (10 reports per day)';
  end if;

  -- Insert report
  insert into reports (user_id, category, note, geom)
  values (v_user_id, p_category, p_note, ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326))
  returning id into v_report_id;

  -- Insert before photo if provided
  if p_photo_url is not null then
    insert into report_photos (report_id, user_id, kind, url, lat, lon)
    values (v_report_id, v_user_id, 'before', p_photo_url, p_lat, p_lon);
  end if;

  -- Award points for creating report
  insert into point_events (user_id, event, points_delta)
  values (v_user_id, 'report_created', 2);

  -- Update user points
  update profiles set points = points + 2 where id = v_user_id;

  return v_report_id;
end;
$$;

-- 2. Claim report
create or replace function rpc_claim_report(p_report_id bigint)
returns boolean
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_report_status report_status;
  v_existing_claim bigint;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Check if report exists and is open
  select status into v_report_status
  from reports
  where id = p_report_id;

  if v_report_status is null then
    raise exception 'Report not found';
  end if;

  if v_report_status != 'open' then
    raise exception 'Report is not available for claiming';
  end if;

  -- Check if already claimed by this user
  select id into v_existing_claim
  from claims
  where report_id = p_report_id and user_id = v_user_id and status = 'active';

  if v_existing_claim is not null then
    raise exception 'You have already claimed this report';
  end if;

  -- Create claim and update report status
  insert into claims (report_id, user_id, status)
  values (p_report_id, v_user_id, 'active');

  update reports set status = 'claimed' where id = p_report_id;

  return true;
end;
$$;

-- 3. Submit cleanup with validation
create or replace function rpc_submit_cleanup(
  p_report_id bigint,
  p_after_photo_url text,
  p_after_lat double precision,
  p_after_lon double precision
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_report_created_at timestamptz;
  v_report_geom geography;
  v_claim_exists boolean;
  v_distance_meters double precision;
  v_time_diff interval;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Check if user has an active claim for this report
  select exists(
    select 1 from claims
    where report_id = p_report_id
      and user_id = v_user_id
      and status = 'active'
  ) into v_claim_exists;

  if not v_claim_exists then
    raise exception 'You must claim this report before submitting cleanup';
  end if;

  -- Get report details
  select created_at, geom
  into v_report_created_at, v_report_geom
  from reports
  where id = p_report_id;

  -- Check time constraint (3 hours)
  v_time_diff := now() - v_report_created_at;
  if v_time_diff > interval '3 hours' then
    raise exception 'Cleanup must be submitted within 3 hours of report creation';
  end if;

  -- Check distance constraint (40 meters)
  v_distance_meters := ST_Distance(
    v_report_geom,
    ST_SetSRID(ST_MakePoint(p_after_lon, p_after_lat), 4326)
  );
  
  if v_distance_meters > 40 then
    raise exception 'Cleanup must be within 40 meters of the original report location';
  end if;

  -- Insert after photo
  insert into report_photos (report_id, user_id, kind, url, lat, lon)
  values (p_report_id, v_user_id, 'after', p_after_photo_url, p_after_lat, p_after_lon);

  -- Update report status and claim
  update reports set status = 'cleaned' where id = p_report_id;
  update claims set status = 'completed' where report_id = p_report_id and user_id = v_user_id;

  -- Award points for verified cleanup
  insert into point_events (user_id, event, points_delta)
  values (v_user_id, 'cleanup_verified', 20);

  -- Update user points
  update profiles set points = points + 20 where id = v_user_id;

  return true;
end;
$$;

-- 4. Get reports with filters
create or replace function rpc_get_reports(
  p_min_lon double precision,
  p_min_lat double precision,
  p_max_lon double precision,
  p_max_lat double precision,
  p_status report_status default null,
  p_days int default 21
)
returns table (
  id bigint,
  user_id uuid,
  category report_category,
  status report_status,
  note text,
  lat double precision,
  lon double precision,
  created_at timestamptz,
  before_photo_url text,
  after_photo_url text,
  claim_count bigint,
  comment_count bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    r.id,
    r.user_id,
    r.category,
    r.status,
    r.note,
    ST_Y(r.geom::geometry) as lat,
    ST_X(r.geom::geometry) as lon,
    r.created_at,
    bp.url as before_photo_url,
    ap.url as after_photo_url,
    (select count(*) from claims c where c.report_id = r.id) as claim_count,
    (select count(*) from comments c where c.report_id = r.id) as comment_count
  from reports r
  left join report_photos bp on r.id = bp.report_id and bp.kind = 'before'
  left join report_photos ap on r.id = ap.report_id and ap.kind = 'after'
  where r.geom && ST_MakeEnvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326)
    and r.created_at >= now() - (p_days || ' days')::interval
    and (p_status is null or r.status = p_status)
  order by r.created_at desc;
end;
$$;

-- 5. Post comment
create or replace function rpc_post_comment(
  p_report_id bigint,
  p_body text,
  p_parent_id bigint default null
)
returns bigint
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_comment_id bigint;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Validate body length
  if char_length(p_body) < 1 or char_length(p_body) > 2000 then
    raise exception 'Comment must be between 1 and 2000 characters';
  end if;

  -- Insert comment
  insert into comments (report_id, author_id, parent_id, body)
  values (p_report_id, v_user_id, p_parent_id, p_body)
  returning id into v_comment_id;

  return v_comment_id;
end;
$$;

-- 6. Recompute weekly leaderboard
create or replace function rpc_recompute_weekly_leaderboard()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view leaderboard_weekly;
end;
$$;

-- 7. Get leaderboard data
create or replace function rpc_get_leaderboard(p_weekly boolean default true)
returns table (
  user_id uuid,
  handle text,
  display_name text,
  avatar_url text,
  points bigint,
  rank bigint
)
language plpgsql
security definer
as $$
begin
  if p_weekly then
    return query
    select 
      lw.user_id,
      p.handle,
      p.display_name,
      p.avatar_url,
      lw.points,
      row_number() over (order by lw.points desc) as rank
    from leaderboard_weekly lw
    join profiles p on p.id = lw.user_id
    order by lw.points desc
    limit 100;
  else
    return query
    select 
      p.id as user_id,
      p.handle,
      p.display_name,
      p.avatar_url,
      p.points,
      row_number() over (order by p.points desc) as rank
    from profiles p
    order by p.points desc
    limit 100;
  end if;
end;
$$;
