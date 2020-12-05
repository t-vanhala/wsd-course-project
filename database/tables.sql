CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);
CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE morning_reports (
    id SERIAL PRIMARY KEY,
    r_date DATE DEFAULT CURRENT_DATE,
    sleep_duration FLOAT,
    sleep_quality INTEGER CHECK(sleep_quality <= 5 AND sleep_quality >= 1),
    generic_mood INTEGER CHECK(generic_mood <= 5 AND generic_mood >= 1),
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE evening_reports (
    id SERIAL PRIMARY KEY,
    r_date DATE DEFAULT CURRENT_DATE,
    time_sports FLOAT,
    time_studying FLOAT,
    regularity INTEGER CHECK(regularity <= 5 AND regularity >= 1),
    eating_quality INTEGER CHECK(eating_quality <= 5 AND eating_quality >= 1),
    generic_mood INTEGER CHECK(generic_mood <= 5 AND generic_mood >= 1),
    user_id INTEGER REFERENCES users(id)
);