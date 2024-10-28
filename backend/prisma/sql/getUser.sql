SELECT email, hashed_password AS "hashedPassword",
        public_id AS "userId", 
        first_name AS "firstName", 
        last_name AS "lastName", gender, birthday
FROM users
WHERE users.email = $1