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
CREATE INDEX idx_mr_r_date ON morning_reports(r_date);

CREATE TABLE evening_reports (
    id SERIAL PRIMARY KEY,
    r_date DATE DEFAULT CURRENT_DATE,
    time_sports FLOAT,
    time_studying FLOAT,
    reg_and_eating INTEGER CHECK(reg_and_eating <= 5 AND reg_and_eating >= 1),
    generic_mood INTEGER CHECK(generic_mood <= 5 AND generic_mood >= 1),
    user_id INTEGER REFERENCES users(id)
);
CREATE INDEX idx_er_r_date ON evening_reports(r_date);