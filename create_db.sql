# Create the database
CREATE DATABASE IF NOT EXISTS big_boulder;
USE big_boulder;

# Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Create the climbs table
CREATE TABLE IF NOT EXISTS climbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    climb_name VARCHAR(100) NULL,
    difficulty VARCHAR(10) NOT NULL,
    date_climbed DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(username) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    created DATETIME NOT NULL,
    parentpost INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (parentpost) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit(
	id INT AUTO_INCREMENT PRIMARY KEY,
	datetime DATETIME NOT NULL,
	username VARCHAR(50) NOT NULL,
	success BOOLEAN NOT NULL,
    eventType VARCHAR(50) NOT NULL
);


# Create the application user
CREATE USER IF NOT EXISTS 'big_boulder_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON big_boulder.* TO 'big_boulder_app'@'localhost';
