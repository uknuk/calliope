drop table plays;

create table plays (
id          serial primary key,
name        varchar(128),
capacity    smallint,
price       numeric(4, 2),
discount    real
);

drop table events;

create table events (
id          serial primary key,
play_id     smallint references plays(id),
time        timestamptz,
free        smallint,
normal      smallint,
reduced     smallint,
revenue     numeric(7, 2),
active      boolean
);

drop table bookings;

create table bookings (
id       serial primary key,
event_id smallint references events(id),
name     varchar(40),
email    varchar(40),
phone    varchar(20),
normal   smallint,
reduced  smallint,
created_at timestamptz,
updated_at timestamptz
);

