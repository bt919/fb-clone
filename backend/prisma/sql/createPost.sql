-- @param {String} $1:userId
-- @param {String} $2:postText
-- create a post without an image
INSERT INTO posts (author_id, post_text) 
        SELECT id, $2
        FROM users 
        WHERE public_id = $1;