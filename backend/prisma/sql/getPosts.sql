-- @param {String} $1:userId
-- @param {Int} $2:limit
-- @param {Int} $3:offset
-- retrieve only a user's posts by recency
SELECT u.public_id AS "userId", 
        u.first_name || ' ' || u.last_name AS "fullName",
        u.profile_image_key AS "profileImageKey",
        p.id AS "postId",
        p.posted_at AS "postedAt",
        COUNT(r.user_id = u.id) > 0 AS "isLikedByUser",
        COUNT(DISTINCT r.id) AS "numberOfLikes",
        COUNT(DISTINCT c.id) AS "numberOfComments",
        (SELECT COUNT(*) 
        FROM users u, posts p 
        WHERE u.public_id = $1 AND u.id = p.author_id) AS "numberOfPosts"
FROM users u 
JOIN posts p ON u.id = p.author_id AND u.public_id = $1
LEFT OUTER JOIN reactions r ON p.id = r.post_id
LEFT OUTER JOIN comments c ON p.id = c.post_id
WHERE u.public_id = $1
GROUP BY p.id, u.id
ORDER BY p.posted_at DESC
LIMIT $2
OFFSET $3;