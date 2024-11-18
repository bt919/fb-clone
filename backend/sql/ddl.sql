CREATE TYPE gender_type AS ENUM('male', 'female', 'other');
CREATE TYPE visibility_type AS ENUM('public', 'friends', 'private');
CREATE TYPE reaction_type AS ENUM('like', 'heart', 'care', 'haha', 'wow', 'sad', 'angry');
CREATE TYPE notification AS ENUM('birthday', 'post_tag', 'comment_tag', 'friend_request', 'fr_accepted');

CREATE EXTENSION pg_trgm; -- used for similarity searches (specifically on user's full names)

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
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_city TEXT,
    hometown TEXT,
    cover_image_key TEXT,
    webpage_link TEXT -- users can link up to one website in their bio
);

CREATE TABLE school (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT -- highschool, college, university, etc...
);

CREATE TABLE studied_at (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    school_id INT REFERENCES school(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, school_id)
);

CREATE TABLE workplace (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE worked_at (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    workplace_id INT REFERENCES workplace(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, workplace_id)
);

CREATE TABLE friends_with ( -- when user a adds user b, insert a,b and b,a
    user_one_id INT REFERENCES users(id) ON DELETE CASCADE,
    user_two_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (user_one_id, user_two_id)
);

CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_accepted BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT NOW(),
    is_seen BOOLEAN DEFAULT FALSE,
    UNIQUE (sender_id, receiver_id)
);

CREATE TABLE block_list (
    id SERIAL PRIMARY KEY,
    blocker_id INT REFERENCES users(id) ON DELETE CASCADE,
    blocked_id INT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_text TEXT, -- could be null (for ex when you post a video with no caption)
    posted_at TIMESTAMP DEFAULT NOW(),
    visibility visibility_type DEFAULT 'public'
);

CREATE TABLE post_tags (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tagged_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text_name TEXT NOT NULL, -- usually first_name or last_name or (first_name || last_name)
    UNIQUE (post_id, tagged_user_id)
);

CREATE TABLE reaction (
    post_id INT REFERENCES posts(id)ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    reaction reaction_type NOT NULL,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_media (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    image_key TEXT NOT NULL,
    mime TEXT -- which ones are acceptable?
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES comments(id) ON DELETE CASCADE, -- null means top-level comment
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comment_tags (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tagged_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text_name TEXT NOT NULL -- usually first_name or last_name or (first_name || last_name)
);

CREATE TABLE comment_reactions (
    comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type reaction_type NOT NULL,
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE chat ( -- chat only supports two users for now
    id SERIAL PRIMARY KEY,
    user_one_id INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    user_two_id INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    theme TEXT,
    emoji TEXT,
    nickname_one TEXT,
    nickname_two TEXT,
    UNIQUE (user_one_id, user_two_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    chat_id INT NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    message_text TEXT, -- could be null (for example when you send a meme)
    posted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message_media (
    id SERIAL PRIMARY KEY,
    message_id INT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    image_key TEXT NOT NULL,
    mime TEXT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY, -- short uuid
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification NOT NULL,
    link TEXT, -- for when theres a page/link associated with the notification (might be more appropriate for this to store some kind of id instead like post id or comment id)
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);


-- the following function and trigger is for when a user is created, a biography 
-- gets automatically created for them as well
CREATE OR REPLACE FUNCTION add_biography() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO biography (user_id) VALUES (NEW.id);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_biography
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION add_biography();


-- the following function and trigger is for when a user is created, a chat
-- is created between the user and themself.
CREATE OR REPLACE FUNCTION create_chat() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO chat (user_one_id, user_two_id) VALUES (NEW.id, NEW.id);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_chat
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_chat();


-- the following function and trigger is for when a user sends a friend request,
-- a notification is created for the user receiving the friend request.
CREATE OR REPLACE FUNCTION add_fr_notification() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO notifications (sender_id, receiver_id, notification_type)
            VALUES (NEW.sender_id, NEW.receiver_id, 'friend_request');
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_fr_notification
    AFTER INSERT ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION add_fr_notification();


-- the following function and trigger is for when a user accepts a friend request, 
-- user a and user b gets added to friends_with twice (once as a,b and 
-- once as b,a)
CREATE OR REPLACE FUNCTION add_friends() RETURNS TRIGGER AS $$
    BEGIN
        -- when a friend_request gets accepted, we need to add the two friends, 
        -- and then finally delete the row from friend_requests.
        IF OLD.is_accepted IS FALSE AND NEW.is_accepted IS TRUE THEN
            INSERT INTO friends_with SELECT NEW.sender_id, NEW.receiver_id;
            INSERT INTO friends_with SELECT NEW.receiver_id, NEW.sender_id;
            DELETE FROM friend_requests WHERE id = NEW.id;
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_friends
    AFTER UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION add_friends();


-- the following function and trigger is for when a user accepts a friend request,
-- a notification is created for the user who sent the friend request.
CREATE OR REPLACE FUNCTION add_fr_accepted_notification() RETURNS TRIGGER AS $$
    BEGIN
        IF OLD.is_accepted IS FALSE AND NEW.is_accepted IS TRUE THEN
            INSERT INTO notifications (sender_id, receiver_id, notification_type)
                VALUES (NEW.receiver_id, NEW.sender_id, 'fr_accepted');
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;
-- below a_ is appended to the start to cause this trigger to fire before the
-- add_friends trigger
CREATE TRIGGER a_add_fr_accepted_notification
    AFTER UPDATE ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION add_friends();


-- the following function and trigger is for when a user gets tagged in a post, 
-- a notification is created for them
CREATE OR REPLACE FUNCTION add_post_tag_notifications() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO notifications (sender_id, receiver_id, notification_type)
            VALUES (NEW.author_id, NEW.user_id, 'post_tag');
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_post_tag_notifications
    AFTER INSERT ON post_tags
    FOR EACH ROW
    EXECUTE FUNCTION add_post_tag_notifications();


-- the following function and trigger is for when a user gets tagged in a comment,
-- a notification is created for them
CREATE OR REPLACE FUNCTION add_comment_tag_notifications() RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO notifications (sender_id, receiver_id, notification_type)
            VALUES (NEW.author_id, NEW.user_id, 'comment_tag');
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_comment_tag_notifications
    AFTER INSERT ON comment_tags
    FOR EACH ROW
    EXECUTE FUNCTION add_comment_tag_notifications();
    

-- create a gist index to allow for fast searches on users full names
CREATE INDEX trgm_idx ON users USING GIST ((first_name || ' ' || last_name) gist_trgm_ops);


/* Considerations:
a) Should the mime type (in tables post_media and comment_media) be restricted 
    at the db level? (atm it is not restricted)

b) Should the parent_id attribute in comments always point to top-level comment, 
    or to the comment right above it? The former would mean nesting can only ever be 
    one-level deep whereas the latter means nesting can be arbtrarily deep.

c) How would expanding the db design to include groupchats look like?

d) How would expanding the db design to include different types of accounts look
    like? (For example for celebrities or educational institutions)

e) Comments and Chat messages are not deleted when the user who wrote them deletes
    their account, but those features can be implemented at the application level.

f) What types of indexes should be considered to improve performance?

g) How should letting users tag other users in posts/comments work? 
*/