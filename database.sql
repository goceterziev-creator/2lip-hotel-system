-- 🗄️ database.sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    rating DECIMAL(3,2)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(id),
    guest_name VARCHAR(100),
    check_in DATE,
    check_out DATE
);