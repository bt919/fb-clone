CREATE TYPE gender_type AS ENUM('male', 'female', 'other');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL UNIQUE, -- short uuid
    email VARCHAR(320) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender gender_type NOT NULL,
    birthday DATE NOT NULL,
    profile_image_key TEXT
);

CREATE TABLE biography (
    user_id INT PRIMARY KEY REFERENCES users(id),
    current_city TEXT,
    hometown TEXT,
    cover_image_key TEXT
);

CREATE TABLE school (
    id TEXT PRIMARY KEY, -- short uuid
    name TEXT NOT NULL,
    level TEXT -- highschool, college, university, etc...
);

CREATE TABLE work (
    id TEXT PRIMARY KEY, -- short uuid
    name TEXT NOT NULL
);

CREATE TABLE studied_at (
    user_id INT REFERENCES users(id),
    school_id TEXT REFERENCES school(id),
    PRIMARY KEY (user_id, school_id)
);

CREATE TABLE friends_with ( -- when user a adds user b, insert a,b and b,a
    user_one_id INT REFERENCES users(id),
    user_two_id INT REFERENCES users(id),
    PRIMARY KEY (user_one_id, user_two_id)
);

CREATE TABLE friend_requests (
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    is_accepted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (sender_id, receiver_id)
);

CREATE TABLE block_list (
    blocker_id INT REFERENCES users(id),
    blocked_id INT REFERENCES users(id),
    PRIMARY KEY (blocker_id, blocked_id)
);

CREATE TYPE visibility_type AS ENUM('public', 'friends', 'private');

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL UNIQUE, -- short uuid
    user_id INT NOT NULL REFERENCES users(id),
    post_text TEXT, -- could be null (for ex when you post a video with no caption)
    posted_at TIMESTAMP DEFAULT NOW(),
    visibility visibility_type DEFAULT 'public'
);

CREATE TYPE reaction_type AS ENUM('like', 'heart', 'care', 'haha', 'wow', 'sad', 'angry');

CREATE TABLE reaction (
    post_id INT REFERENCES posts(id),
    user_id INT REFERENCES users(id),
    reaction reaction_type NOT NULL,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_media (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id),
    image_key TEXT NOT NULL,
    mime TEXT -- which ones are acceptable?
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL UNIQUE, -- short uuid
    parent_id INT REFERENCES comments(id), -- null means top-level comment
    post_id INT NOT NULL REFERENCES posts(id),
    user_id INT NOT NULL REFEReNCES users(id),
    comment_text TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comment_reactions (
    comment_id INT REFERENCES comments(id),
    user_id INT REFERENCES users(id),
    type reaction_type NOT NULL,
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE chat ( -- chat only supports two users for now
    id SERIAL PRIMARY KEY,
    public_id TEXT NOT NULL UNIQUE, -- short uuid
    user_one_id INT NOT NULL REFERENCES users(id),
    user_two_id INT NOT NULL REFERENCES users(id),
    theme TEXT,
    emoji TEXT,
    nickname_one TEXT,
    nickname_two TEXT,
    UNIQUE (user_one_id, user_two_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    chat_id INT NOT NULL REFERENCES chat(id),
    message_text TEXT, -- could be null (for example when you send a meme)
    posted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message_media (
    id SERIAL PRIMARY KEY,
    message_id INT NOT NULL REFERENCES messages(id),
    image_key TEXT NOT NULL,
    mime TEXT
);



/* Considerations:
a) Should the mime type (in tables post_media and comment_media) be restricted 
at the db level? (atm it is not restricted)

b) Should the parent_id attribute in comments always point to top-level comment, 
or to the comment right above it? The former would mean nesting can only ever be 
one-level deep whereas the latter means nesting can be arbtrarily deep.

c) How would expanding the db design to include groupchats look like?

d) How would expanding the db design to include different types of accounts look
like? (For example for celebrities or educational institutions)
*/