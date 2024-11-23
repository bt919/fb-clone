const { faker } = require("@faker-js/faker");
const short = require("short-uuid");

function createRandomUser() {
  return {
    publicId: short.generate(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: Math.random() < 0.5 ? "male" : "female",
    birthday: "1940-02-02",
  };
}

function sanitize(s) {
  for (let i = 0; i < s.length; i += 1) {
    return `'${s.replaceAll("'", "''")}'`;
  }
}

const populateUsers = (numberOfusers) => {
  for (let i = 0; i < numberOfusers; i += 1) {
    const user = createRandomUser();
    console.log(
      `INSERT INTO users (public_id, email, hashed_password, first_name, last_name, gender, birthday)
        VALUES (${sanitize(user.publicId)}, ${sanitize(user.email)}, 
                ${sanitize(user.password)}, ${sanitize(user.firstName)}, 
                ${sanitize(user.lastName)}, ${sanitize(user.gender)}, 
                ${sanitize(user.birthday)});`,
    );
  }
};

const populateFriends = (numberOfCurrentUsers) => {
  for (let i = 2; i <= numberOfCurrentUsers; i += 1) {
    console.log(
      `INSERT INTO friends_with SELECT ${1}, ${i};\nINSERT INTO friends_with SELECT ${i}, ${1};`,
    );
  }
};

const populatePosts = (numberOfCurrentUsers) => {
  for (let i = 1; i <= numberOfCurrentUsers; i += 1) {
    console.log(
      `INSERT INTO posts (author_id, post_text) SELECT ${i}, 'This is a fake post used to populate the db.';`,
    );
    // add reactions to each post
    for (let j = 1; j < 10; j += 1) {
      console.log(
        `INSERT INTO reactions (post_id, user_id, reaction) VALUES (${i}, ${j}, 'like');`,
      );
    }
    // add comments to each post
    for (let j = 1; j < 5; j += 1) {
      console.log(
        `INSERT INTO comments (post_id, author_id, comment_text) VALUES (${i}, ${j}, 'This is a fake comment used to populate the db.');`,
      );
    }
  }
};

// run 'node seeding.js > populate.sql'
// now you can run 'sudo -u username psql db_name -f populate.sql'
// you need to supply your own username and db_name in the command above
const numberOfUsers = 100;
populateUsers(numberOfUsers);
populateFriends(numberOfUsers);
populatePosts(numberOfUsers);
