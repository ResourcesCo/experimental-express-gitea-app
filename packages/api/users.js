const { v4: uuidv4 } = require('uuid');
const { randomBytes } = require('crypto');

exports.findOrCreateUser = async (db, {provider, providerUserId, email, accessToken, refreshToken}) => {
  const selectOauthSessionResult = await db.query(
    'select * from oauth_sessions where provider = $1 and provider_user_id = $2',
    [provider, providerUserId.toString()]
  )
  let userId
  if (selectOauthSessionResult.rows.length > 0) {
    userId = selectOauthSessionResult.rows[0].user_id
    await db.query(
      'update oauth_sessions set access_token = $1, refresh_token = $2, updated_at = $3 where id = $4',
      [accessToken, refreshToken, new Date(), selectOauthSessionResult.rows[0].id]
    )
  } else {
    userId = uuidv4()
    await db.query('insert into users (id, email, active, created_at, updated_at) values ($1, $2, $3, $4, $5)', [
      userId, email, false, new Date(), new Date()
    ])
    await db.query(
      `insert into oauth_sessions
      (id, user_id, provider, provider_user_id, access_token, refresh_token, created_at, updated_at)
      values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [uuidv4(), userId, provider, providerUserId, accessToken, refreshToken, new Date(), new Date()]
    )
  }
  const selectUserResult = await db.query('select * from users where id = $1', [userId])
  return selectUserResult.rows[0]
}

exports.createLoginToken = async (db, {userId}) => {
  const token = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 15)
  const result = await db.query(
    `insert into login_tokens
    (id, user_id, token, active, expires_at, created_at, updated_at)
    values ($1, $2, $3, $4, $5, $6, $7)`,
    [uuidv4(), userId, token, true, expiresAt, new Date(), new Date()]
  )
  return {token}
}

exports.getLoginToken = async (db, {token}) => {
  const result = await db.query('select * from login_tokens where token = $1', [token])
  const returnValue = (result && result.rows && result.rows.length) ? result.rows[0] : undefined
  console.log('returning', returnValue)
  return returnValue
}

exports.createUserSession = async (db, {userId}) => {
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  const id = uuidv4()
  await db.query(
    `insert into user_sessions
    (id, user_id, active, expires_at, created_at, updated_at)
    values ($1, $2, $3, $4, $5, $6)`,
    [id, userId, true, expiresAt, new Date(), new Date()]
  )
  return {id}
}
