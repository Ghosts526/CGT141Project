-- Create the database
CREATE DATABASE IF NOT EXISTS bugReports;
USE bugReports;

-- Create the bug report table
CREATE TABLE IF NOT EXISTS bugReport (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    bugType VARCHAR(100) NOT NULL, 
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'open',
    gameVersion VARCHAR(50) NOT NULL
);