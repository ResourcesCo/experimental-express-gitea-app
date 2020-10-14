const test = require('ava');
const {before, after} = test;
const {Pool} = require('pg');
const initUsers = require('../../app/models/users');

let db;
let users;

before(() => {
	db = new Pool({
		connectionString: process.env.NODE_TEST_DATABASE_URL
	});
	users = initUsers(db);
});

after(async () => {
	await db.query('delete from users');
	await db.query('delete from oauth_sessions');
	await db.end();
});

test('create user', async t => {
	const result = await users.findOrCreateUser({
		provider: 'github',
		providerUserId: '1341',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242'
	});
	t.true(typeof result.id === 'string');
});
