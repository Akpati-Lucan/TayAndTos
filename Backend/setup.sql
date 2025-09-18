CREATE DATABASE IF NOT EXISTS `tay-tos-db`;
USE `tay-tos-db`;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  admin BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255) NULL,
  reset_token_expiry TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room VARCHAR(255) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  special_requests TEXT,
  confirmation_code VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS guest_bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  guest_first_name VARCHAR(255),
  guest_last_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone_number VARCHAR(255),
  room VARCHAR(255) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  special_requests TEXT,
  confirmation_code VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
