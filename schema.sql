
drop table bookings;
drop table events;
drop table plays;

create table plays (
id          serial primary key,
name        varchar(128),
capacity    smallint,
price       numeric(4, 2),
discount    real
);

create table events (
id          serial primary key,
play_id     smallint references plays(id),
time        timestamptz,
free        smallint,
normal      smallint default 0,
reduced     smallint default 0,
troop       smallint default 0,
active      boolean
);

create table bookings (
id       serial primary key,
event_id smallint references events(id),
name     varchar(40),
email    varchar(40),
phone    varchar(20),
normal   smallint,
reduced  smallint,
troop    smallint,
message  text,
created_at timestamptz,
updated_at timestamptz
);






