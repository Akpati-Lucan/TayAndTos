-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tayandtos;

-- Use the database
USE tayandtos;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);