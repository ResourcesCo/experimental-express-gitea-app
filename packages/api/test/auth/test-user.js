const test = require('ava');
const {before, after} = test;
const env = require('../../env.test.json');
const {Pool} = require('pg');
const users = require('../../users');

let db;

before(() => {
	db = new Pool({
		connectionString: env.NODE_DATABASE_URL
	});
});

after(async () => {
	await db.query('delete from users');
	await db.query('delete from oauth_sessions');
	await db.end();
});

test('create user', async t => {
	const result = await users.findOrCreateUser(db, {
		provider: 'github',
		providerUserId: '1341',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242'
	});
	t.true(typeof result.id === 'string');
});