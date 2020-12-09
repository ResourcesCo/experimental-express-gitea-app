const test = require('ava');
const {Pool} = require('pg');
const sinon = require('sinon');
const initUsers = require('../../app/models/users');
const initUsersController = require('../../app/controllers/users');
const gitea = require('../../app/services/gitea');

let db;
let users;
let usersController;
let sandbox;

test.before(() => {
	db = new Pool({
		connectionString: process.env.NODE_TEST_DATABASE_URL,
	});
});

test.after(async () => {
	await db.end();
});

test.beforeEach(async () => {
	users = initUsers({db});
	usersController = initUsersController({users, gitea});
	sandbox = sinon.createSandbox();
});

test.afterEach(async () => {
	await db.query('delete from users');
	await db.query('delete from oauth_sessions');
	sandbox.restore();
});

test.serial('create user', async t => {
	const result = await users.findOrCreateUser({
		provider: 'github',
		providerUserId: '1341',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242',
	});
	t.true(typeof result.id === 'string');
});

test.serial('sign up user and create gitea user', async t => {
	const result1 = await users.findOrCreateUser({
		provider: 'github',
		providerUserId: '1500',
		email: 'x@example.com',
		accessToken: 'abf3343112',
		refreshToken: 'abf2332343242',
	});
	sandbox.stub(gitea, 'createUser').callsFake(async ({username}) => {
		return {
			ok: true,
			user: {
				login: username,
				username,
			},
			token: {
				sha1: '835260928dd1378c2bbfa11193e9adb911f74407',
				token: '835260928dd1378c2bbfa11193e9adb911f74407',
			},
		};
	});
	const result2 = await usersController.updateUser(result1.id, {
		active: true,
		firstName: 'J',
		lastName: 'Test',
		username: 'jtest',
		signedUpAt: new Date(),
		acceptedTermsAt: new Date(),
	});
	const result3 = await users.getUser(result1.id);
	t.is(result3.username, 'jtest');
	t.is(result3.firstName, 'J');
	t.is(result3.lastName, 'Test');
	t.truthy(result3.acceptedTermsAt);
});
