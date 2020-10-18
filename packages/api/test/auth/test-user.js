const test = require('ava');
const {Pool} = require('pg');
const initUsers = require('../../app/models/users');

let db;
let users;

test.before(() => {
	db = new Pool({
		connectionString: process.env.NODE_TEST_DATABASE_URL
	});
	users = initUsers(db);
});

test.afterEach(async () => {
	await db.query('delete from users');
	await db.query('delete from oauth_sessions');
});

test.after(async () => {
	await db.end();
});

test.serial('create user', async t => {
	const result = await users.findOrCreateUser({
		provider: 'github',
		providerUserId: '1341',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242'
	});
	t.true(typeof result.id === 'string');
});

test.serial('sign up user', async t => {
	const result1 = await users.findOrCreateUser({
		provider: 'github',
		providerUserId: '1500',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242'
	});
	const result2 = await users.updateUser(result1.id, {
		active: true,
		firstName: 'J',
		lastName: 'Test',
		signedUpAt: new Date(),
		acceptedTermsAt: new Date(),
	});
	const result3 = await users.getUser(result1.id);
	t.is(result3.firstName, 'J');
	t.is(result3.lastName, 'Test');
	t.truthy(result3.acceptedTermsAt);
});