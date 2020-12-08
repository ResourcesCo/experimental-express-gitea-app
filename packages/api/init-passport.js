const passport = require('passport');
const GitHubStrategy = require('passport-github');
const GiteaStrategy = require('@resources/passport-gitea');
const GitLabStrategy = require('passport-gitlab2');
const { authenticate } = require('passport');

const failureRedirect = `${process.env.APP_BASE}/login`;

const strategies = {
	github: GitHubStrategy,
	gitea: GiteaStrategy,
	gitlab: GitLabStrategy
};

function oauthEnv(name, varName, defaultValue = undefined) {
	const envVarName = `OAUTH_${name.toUpperCase()}_${varName.toUpperCase()}`;
	const val = process.env[envVarName];
	if (typeof val === 'string' && val.length) {
		return val;
	} else {
		if (defaultValue !== undefined) {
			return defaultValue;
		} else {
			throw new Error(`Missing environment variable: ${envVarName}`);
		}
	}
}

function giteaParams({name}) {
	const baseUrl = oauthEnv(name, 'base_url', null);
	if (baseUrl !== null) {
		return {
			authorizationURL: `${baseUrl}/login/oauth/authorize`,
      tokenURL: `${baseUrl}/login/oauth/access_token`,
      userProfileURL: `${baseUrl}/api/v1/user`,
		};
	} else {
		return {
			authorizationUrl: oauthEnv(name, 'authorization_url'),
			tokenUrl: oauthEnv(name, 'token_url'),
			userProfileUrl: oauthEnv(name, 'user_profile_url'),
		};
	}
}

function addProvider(
	name,
) {
	const strategyName = oauthEnv(name, 'strategy', name);
	const clientID = oauthEnv(name, 'client_id');
	const clientSecret = oauthEnv(name, 'client_secret');
	const Strategy = strategies[strategyName];
	passport.use(
		name,
		new Strategy(
			{
				name,
				clientID,
				clientSecret,
				callbackURL: `${process.env.API_BASE_OAUTH || process.env.API_BASE}/auth/${name}/callback`,
				...(strategyName === 'gitea' ?
					giteaParams({name}) :
					{})
			},
			(accessToken, refreshToken, profile, done) => {
				return done(undefined, {accessToken, refreshToken, profile});
			}
		)
	);
}

function addRoutes(app, users, {name}) {
	app.get(`/auth/${name}`, (req, res, next) => {
		const authenticator = passport.authenticate(name, {
			session: false,
			state: req.query.state
		});
		return authenticator(req, res, next);
	});
	app.get(
		`/auth/${name}/callback`,
		passport.authenticate(name, {failureRedirect, session: false}),
		({user, query: {state}}, res, next) => {
			const {accessToken, refreshToken, profile} = user;
			const hasEmail = Array.isArray(profile.emails) && profile.emails.length >= 1;
			const email = hasEmail ? profile.emails[0].value : null;
			const username = profile.username ? profile.username : null;
			users
				.findOrCreateUser({
					provider: name,
					providerUserId: profile.id,
					providerUsername: username || email,
					email,
					username,
					accessToken,
					refreshToken
				})
				.then(user => {
					return users.createLoginToken({userId: user.id});
				})
				.then(token => {
					res.redirect(
						`${process.env.APP_BASE}/login?token=${token.token}&state=${state}`
					);
				})
				.catch(error => {
					next(error);
				});
		}
	);
}

module.exports = function initPassport({app, users}) {
	const providers = (process.env.OAUTH_PROVIDERS || '').split(',').map(s => s.trim()).filter(s => s.length > 0);
	app.use(passport.initialize());
	for (const provider of providers) {
		addProvider(provider);
	}

	for (const provider of providers) {
		addRoutes(app, users, {name: provider});
	}
}
