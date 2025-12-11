# Insert test data into the tables

# Select database
USE big_boulder;

# Insert test users
INSERT INTO users (id, username, email, password_hash, created) VALUES
(0, "gold", "gold@smiths.com", "", NOW());
    
# Insert test climbs
INSERT INTO climbs (id, user_id, climb_name, difficulty, date_climbed) VALUES
(0, 1, "Cliff Edge", "V2", NOW());

# Insert test posts
INSERT INTO posts (id, user_id, title, content, created, parentpost) VALUES
(0, 1, "Welcome to Big Boulder" , "This is the first post in the Big Boulder forum!", NOW(), NULL);
