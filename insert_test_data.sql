# Insert test data into the tables

# Select database
USE big_boulder;

# Insert test users
INSERT INTO users (id, username, email, password_hash, created) VALUES
(0, "gold", "gold@smiths.com", "$2b$10$CdDe0ch6GpdS8SUHWXLjbeFaST..LraCrVjgGhWgsYJW.GrKYLUx2", NOW());
    
# Insert test climbs
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Hard Hang", "V2", "2025-12-11 23:25:30");
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Cliff Edge", "V4", "2025-12-11 23:44:33");
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Midnight Climb", "V3", "2025-12-12 00:02:51");

# Insert test posts
INSERT INTO posts (id, user_id, title, content, created, parentpost) VALUES
(0, "gold", "Welcome to Big Boulder" , "This is the first post in the Big Boulder forum!", NOW(), NULL);