-- @param {String} $1:userId
-- @param {String} $2:postText
-- @param {String} $3:imageKey
-- create a post with an image
WITH u AS (
        SELECT id
        FROM users
        WHERE public_id = $1
), new_post AS (
        INSERT INTO posts (author_id, post_text)
                SELECT id, $2 
                FROM u
                RETURNING id
)
INSERT INTO post_media (post_id, image_key) 
        SELECT id, $3 FROM new_post;