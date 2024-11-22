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
WITH student AS (
        INSERT INTO school (name, level) VALUES ($1, $2) RETURNING id
)
INSERT INTO studied_at VALUES (SELECT id FROM users WHERE public_id = $3, id);
-- given a user's public id, and a workplace's name, first add the workplace,
-- and then add that the user worked at that workplace
WITH employee AS (
        INSERT INTO workplace (name) VALUES ($1) RETURNING id
)
INSERT INTO worked_at VALUES (SELECT id FROM users WHERE public_id = $2, id);

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
                VALUES ($1, SELECT id FROM users WHERE public_id = $2, 
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



--------------------------- posts --------------------------------------------------
-- create a post
-- without an image
INSERT INTO posts (user_id, post_text) 
        SELECT id, $2
        FROM users 
        WHERE public_id = $1;
-- with an image
WITH u AS (
        SELECT id
        FROM users
        WHERE public_id = $1
), new_post AS (
        INSERT INTO posts (user_id, post_text)
                SELECT id, $2 
                FROM u
                RETURNING id
)
INSERT INTO post_media (post_id, image_key, mime) 
        SELECT id, $3, $4 FROM new_post;

-- retrieve only your posts by recency (for profile page)

-- retrieve your posts as well as your friends' posts (for home page)


-- 9gHdLdKjnTSoa81H3fMYic


-- modify visibility of a post
UPDATE posts 
SET visibility = $1 
WHERE user_id IN (SELECT id
                FROM users
                WHERE public_id = $2);

-- leave a like or reaction on a post
INSERT INTO reactions (post_id, user_id, reaction)
                SELECT $1, id, $3
                FROM users
                WHERE public_id = $2;

-- remove a like or reaction on a post
DELETE FROM reactions
WHERE post_id = $1 
        AND user_id IN (SELECT id
                        FROM users
                        WHERE public_id = $2)

-- leave a top-level comment
INSERT INTO comments (post_id, user_id, comment_text)
        SELECT $1, id, $3
        FROM users
        WHERE public_id = $2;

-- leave a comment under another comment (nesting is always only one level deep)
INSERT INTO comments (parent_id, post_id, user_id, comment_text)
        SELECT $1, $2, id, $4
        FROM users
        WHERE public_id = $5;

-- leave a like or reaction on a post
INSERT INTO comment_reactions (comment_id, user_id, reaction)
        SELECT $1, id, $3
        FROM users
        WHERE public_id = $2;

-- remove a like or reaction on a comment
DELETE FROM comment_reactions
WHERE post_id = $1
        AND user_id IN (SELECT id
                        FROM users
                        WHERE public_id = $2)


--------------------------- notifications ------------------------------------------
-- return the latest notifications for a user
SELECT *
FROM notifications
WHERE receiver_id IN (SELECT id
                      FROM users
                      WHERE public_id = $1)
ORDER BY created_at DESC
LIMIT $2
OFFSET $3;

-- mark a notification as seen
UPDATE notifications
SET is_seen = TRUE
WHERE id = $1;


--------------------------- settings -----------------------------------------------
-- allow a user to block another user
INSERT INTO block_list (blocker_id, blocked_id)
SELECT $1, id FROM users WHERE public_id = $2;

-- allow a user to unblock another user
DELETE FROM block_list
WHERE id = $1;

-- allow a user to delete their account
DELETE FROM users WHERE public_id = $1;


--------------------------- chat ---------------------------------------------------
-- create a chat between two users
INSERT INTO chat (user_one_id, user_two_id)
        SELECT uo.id, ut.id
        FROM (SELECT id FROM users WHERE public_id = $1) AS uo
        CROSS JOIN (SELECT id FROM users WHERE public_id = $2) AS ut;

-- return metadata of recent chats for a user (WIP)
WITH u AS (
        SELECT id FROM users WHERE public_id = $1
), recent_chats AS (
        SELECT c.id AS chat_id, NOW() - c.message_last_sent AS last_spoken_to,
                CASE WHEN user_one_id = u.id THEN user_two_id
                        ELSE user_one_id
                END AS friend_id
        FROM chat c, u
        WHERE c.user_one_id = u.id OR c.user_two_id = u.id
        ORDER BY c.message_last_sent DESC
)
SELECT rc.chat_id, rc.last_spoken_to, u.public_id, u.profile_image_key
FROM recent_chats rc, users u, messages m
WHERE rc.friend_id = u.id AND rc.chat_id = m.chat_id
ORDER BY m.posted_at DESC;

-- send a message to a chat
INSERT INTO messages (sender_id, chat_id, message_text)
        SELECT id, $2, $3
        FROM users
        WHERE public_id = $1;

-- send an image or gif to a chat
WITH msg AS (
        INSERT INTO messages (sender_id, chat_id)
        SELECT id, $2
        FROM users
        WHERE public_id = $1
        RETURNING id -- messages.id
)
INSERT INTO message_media (message_id, image_key)
        SELECT id, $3 FROM msg;

-- be able to search through a chat (TBD)