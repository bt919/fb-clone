--------------------------- queries for different features -------------------------



--------------------------- profile customization ----------------------------------
-- profile picture
-- given a user's public_id, and an image_key, update their profile picture
UPDATE users
SET profile_image_key = $1
WHERE public_id = $2;

-- update bio
-- given a user's public id, and a current_city, update their bio's current city
UPDATE biography
SET current_city = $1
WHERE user_id IN (SELECT id
                    FROM users
                    WHERE public_id = $2);
-- given a user's public id, and a hometown, update their bio's hometown
UPDATE biography
SET hometown = $1
WHERE user_id IN (SELECT id
                    FROM users
                    WHERE public_id = $2);
-- given a user's public id, and a webpage link, update their bio's webpage link
UPDATE biography
SET webpage_link = $1
WHERE user_id IN (SELECT id
                    FROM users
                    WHERE public_id = $2);
-- given a user's public id, and a school's name and level, first add the school,
-- and then add that the user studied at that school
INSERT INTO school VALUES ($1, $2, $3);
INSERT INTO studied_at VALUES (SELECT id FROM users WHERE public_id = $1, $2);
-- given a user's public id, and a workplace's name, first add the workplace,
-- and then add that the user worked at that workplace
INSERT INTO workplace VALUES ($1, $2);
INSERT INTO worked_at VALUES (SELECT id FROM users WHERE public_id = $1, $2);

-- cover photo
-- given a user's public_id, and an image key, update their cover photo
UPDATE biography 
SET cover_image_key = $1
WHERE user_id IN (SELECT id
                    FROM users
                    WHERE public_id = $2);



--------------------------- friends ------------------------------------------------
-- send/receive friend requests
INSERT INTO friend_requests (id, sender_id, receiver_id) 
                VALUE ($1, SELECT id FROM users WHERE public_id = $2, 
                        SELECT id FROM users WHERE public_id = $3);

-- view friend request
-- given a friend request id, set the request as seen
UPDATE friend_requests
SET is_seen = TRUE
WHERE id = $1;

-- accept a friend request
-- given a friend request id, accept the request, thus setting a trigger which adds 
-- both users as friends (shown in ddl.sql)
UPDATE friend_requests
SET is_accepted = TRUE
WHERE id = $1;