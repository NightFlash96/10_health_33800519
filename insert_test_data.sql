# Insert test data into the tables

# Select database
USE health;

# Insert test users
INSERT INTO users (username, email, password_hash, created) VALUES
("gold", "gold@smiths.com", "$2b$10$CdDe0ch6GpdS8SUHWXLjbeFaST..LraCrVjgGhWgsYJW.GrKYLUx2", NOW());
INSERT INTO users (username, email, password_hash, created) VALUES
("BrianBoulder", "brian@boulder.com", "$2b$10$ezwM2PaLKCho2mTf2fbhseycmSS6.tZBDSqzASOYXvQvYdhYttYqq", NOW());
    
# Insert test climbs
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Hard Hang", "V2", "2025-12-11 23:25:30");
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Cliff Edge", "V4", "2025-12-11 23:44:33");
INSERT INTO climbs (user_id, climb_name, difficulty, date_climbed) VALUES
("gold", "Midnight Climb", "V3", "2025-12-12 00:02:51");

# Insert test posts
INSERT INTO posts (user_id, title, content, created, parentpost) VALUES
("gold", "Welcome to Big Boulder" , "This is the first post in the Big Boulder forum!", NOW(), NULL);
INSERT INTO posts (user_id, title, content, created, parentpost) VALUES
("BrianBoulder", "I love bouldering!" , "My name is Brian and my favourite hobby is bouldering,", NOW(), NULL);
INSERT INTO posts (user_id, title, content, created, parentpost) VALUES
("gold", "Re: I love bouldering!" , "Hi Brian! Welcome to the forum. What's your favourite climbing spot?", NOW(), 2);