const {v4: uuidv4} = require('uuid');
const {randomBytes} = require('crypto');

module.exports = function users({db}) {
	function formatUser(row, {includeCredentials} = {includeCredentials: false}) {
		return {
			id: row.id,
			email: row.email,
			username: row.username,
			active: row.active,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			firstName: row.first_name,
			lastName: row.last_name,
			signedUpAt: row.signed_up_at,
			acceptedTermsAt: row.accepted_terms_at,
			...(includeCredentials && {giteaToken: row.gitea_token}),
		};
	}

	return {
		async findOrCreateUser({provider, providerUserId, providerUsername, email, username, accessToken, refreshToken}) {
			const selectOauthSessionResult = await db.query(
				'select * from oauth_sessions where provider = $1 and provider_user_id = $2',
				[provider, providerUserId.toString()]
			);
			let userId;
			if (selectOauthSessionResult.rows.length > 0) {
				userId = selectOauthSessionResult.rows[0].user_id;
				await db.query(
					'update oauth_sessions set access_token = $1, refresh_token = $2, updated_at = $3, provider_username where id = $4',
					[accessToken, refreshToken, new Date(), providerUsername, selectOauthSessionResult.rows[0].id]
				);
			} else {
				userId = uuidv4();
				await db.query('insert into users (id, email, username, active, created_at, updated_at) values ($1, $2, $3, $4, $5, $6)', [
					userId, email, username, false, new Date(), new Date()
				]);
				await db.query(
					`insert into oauth_sessions
					(id, user_id, provider, provider_user_id, provider_username, access_token, refresh_token, created_at, updated_at)
					values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
					[uuidv4(), userId, provider, providerUserId, providerUsername, accessToken, refreshToken, new Date(), new Date()]
				);
			}
		
			const selectUserResult = await db.query('select * from users where id = $1', [userId]);
			return selectUserResult.rows[0];
		},
		async createLoginToken({userId}) {
			const token = randomBytes(64).toString('hex');
			const expiresAt = new Date(Date.now() + (1000 * 15));
			await db.query(
				`insert into login_tokens
				(id, user_id, token, active, expires_at, created_at, updated_at)
				values ($1, $2, $3, $4, $5, $6, $7)`,
				[uuidv4(), userId, token, true, expiresAt, new Date(), new Date()]
			);
			return {token};
		},
		async getLoginToken({token}) {
			const result = await db.query('select * from login_tokens where token = $1', [token]);
			const returnValue = (result && result.rows && result.rows.length === 1) ? result.rows[0] : undefined;
			return returnValue;
		},
		async createUserSession({userId}) {
			const expiresAt = new Date(Date.now() + (14 * 24 * 60 * 60 * 1000));
			const id = uuidv4();
			await db.query(
				`insert into user_sessions
				(id, user_id, active, expires_at, created_at, updated_at)
				values ($1, $2, $3, $4, $5, $6)`,
				[id, userId, true, expiresAt, new Date(), new Date()]
			);
			return {id};
		},
		async getUserSession({userId, sessionId}) {
			const result = await db.query(
				'select * from user_sessions where id = $1 and user_id = $2', [sessionId, userId]
			);
			if (result.rows.length === 1) {
				const {id, user_id, active, expires_at} = result.rows[0];
				if (active && new Date() < expires_at) {
					return { userId: user_id, sessionId: id, expiresAt: expires_at };
				}
			}
		},
		async getUser(id, {includeCredentials} = {includeCredentials: false}) {
			const result = await db.query('select * from users where id = $1', [id]);
			if (result.rows.length === 1) {
				const row = result.rows[0];
				return formatUser(row, {includeCredentials});
			} else {
				throw new Error('Error getting user profile');
			}
		},
		async getUserByEmail(email) {
			const result = await db.query('select * from users where email = $1', [email]);
			if (result.rows.length === 1) {
				const row = result.rows[0];
				return formatUser(row);
			} else {
				throw new Error('Error getting user profile');
			}
		},
		async getUserByUsername(username) {
			const result = await db.query('select * from users where username = $1', [username]);
			if (result.rows.length === 1) {
				const row = result.rows[0];
				return formatUser(row);
			} else {
				throw new Error('Error getting user profile');
			}
		},
		async updateUser(id, updates) {
			if (!id) {
				throw new Error('An ID is required to update a user record');
			}
			const sqlParams = [];
			const params = [];
			if ('email' in updates) {
				params.push(updates.email);
				sqlParams.push(`email = $${params.length}`);
			}
			if ('username' in updates) {
				params.push(updates.username);
				sqlParams.push(`username = $${params.length}`);
			}
			if ('active' in updates) {
				params.push(updates.active);
				sqlParams.push(`active = $${params.length}`);
			}
			if ('firstName' in updates) {
				params.push(updates.firstName);
				sqlParams.push(`first_name = $${params.length}`);
			}
			if ('lastName' in updates) {
				params.push(updates.lastName);
				sqlParams.push(`last_name = $${params.length}`);
			}
			if ('signedUpAt' in updates) {
				params.push(updates.signedUpAt);
				sqlParams.push(`signed_up_at = $${params.length}`);
			}
			if ('acceptedTermsAt' in updates) {
				params.push(updates.acceptedTermsAt);
				sqlParams.push(`accepted_terms_at = $${params.length}`);
			}
			if ('giteaToken' in updates) {
				params.push(updates.giteaToken);
				sqlParams.push(`gitea_token = $${params.length}`);
			}
			if (params.length > 0) {
				params.push(id);
				const result = await db.query(
					`update users set ${sqlParams.join(', ')} where id = $${params.length}`,
					params
				);
				if (result && result.rowCount !== 1) {
					throw new Error('Error updating user');
				}
			} else {
				throw new Error('At least one field must be given to update user');
			}
		},
		async getOauthSession({userId, provider}) {
			const result = await db.query(
				'select * from oauth_sessions where user_id = $1 and provider = $2',
				[userId, provider]
			);
			if (result.rowCount !== 1) {
				throw new Error('Error getting OAuth session', userId, provider);
			}
			return result.rows[0];
		}
	}
}
