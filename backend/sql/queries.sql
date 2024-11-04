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

-- use search bar to look for users to add
-- given some search query, return top 10 most similar searches
-- note: the following query weighs a friend and non-friend equally
SELECT first_name || ' ' || last_name AS full_name, 
                word_similarity($1, first_name || ' ' || last_name) as sml
FROM users
WHERE (first_name || ' ' || last_name) % ($1)
        AND public_id <> $2
ORDER BY sml DESC, full_name;
-- this version of the query weighs a friend higher than a non-friend.
-- word_similarity outputs a score between 0 and 1, but we will add 1 to the score
-- if the user is a friend. we will add 2 instead if the user is themself.
SELECT u.public_id, (u.first_name || ' ' || u.last_name) AS full_name,
        u.profile_image_key, fw.user_one_id::BOOLEAN AS is_friends,
        CASE WHEN fw.user_one_id::boolean IS TRUE THEN word_similarity($2, u.first_name || ' ' || last_name) + 1
             WHEN u.id <> $1 THEN word_similarity($2, u.first_name || ' ' || last_name)
             ELSE word_similarity($2, u.first_name || ' ' || last_name) + 2
        END AS sml
FROM users u LEFT OUTER JOIN friends_with fw
        ON u.id <> $1 AND u.id = fw.user_two_id
WHERE (first_name || ' ' || last_name) % ($2)
LIMIT $3
OFFSET $4;

-- get friend suggestions
-- given a user's public id, send back the top 5 friend suggestions
-- TBD (can maybe base it off of the user's friends whom they've chatted
-- most with)