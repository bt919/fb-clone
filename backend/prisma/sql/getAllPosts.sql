-- @param {String} $1:userId
-- @param {Int} $2:limit
-- @param {Int} $3:offset
-- retrieve your posts as well as your friends' posts (for home page)
SELECT u1.public_id AS "userId",
        u1.first_name || ' ' || u1.last_name AS "fullName",
        u1.profile_image_key AS "profileImageKey",
        p.id AS "postId",
        p.posted_at AS "postedAt",
        COUNT(r.user_id = u.id) > 0 AS "isLikedByUser",
        COUNT(DISTINCT r.id)::int AS "numberOfLikes",
        COUNT(DISTINCT c.id)::int AS "numberOfComments",
        (SELECT COUNT(*)::int 
        FROM users u, posts p 
        WHERE u.public_id = $1 AND u.id = p.author_id) AS "numberOfPosts"
FROM users u
LEFT OUTER JOIN friends_with f ON u.id = f.user_one_id AND u.public_id = $1
JOIN posts p ON u.id = p.author_id OR f.user_two_id = p.author_id
JOIN users u1 ON u1.id = p.author_id
LEFT OUTER JOIN reactions r ON p.id = r.post_id
LEFT OUTER JOIN comments c ON p.id = c.post_id
GROUP BY p.id, u.id, u1.id
ORDER BY p.posted_at DESC
LIMIT $2
OFFSET $3;