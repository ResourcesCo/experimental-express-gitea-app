const passport = require('passport');
const GitHubStrategy = require('passport-github');
const GiteaStrategy = require('passport-gitea');
const GitLabStrategy = require('passport-gitlab2');
const auth = require('./auth');
const users = require('./auth/models/users');
const { authenticate } = require('passport');

const failureRedirect = `${process.env.APP_BASE}/login`;

const strategies = {
	github: GitHubStrategy,
	gitea: GiteaStrategy,
	gitlab: GitLabStrategy
};

function addProvider(
	app,
	{name, strategy: strategyArg, authorizationUrl, tokenUrl, userProfileUrl}
) {
	const strategyName = strategyArg || name;
	const Strategy = strategies[strategyName];
	passport.use(
		name,
		new Strategy(
			{
				clientID: process.env[`${name.toUpperCase()}_CLIENT_ID`],
				clientSecret: process.env[`${name.toUpperCase()}_CLIENT_SECRET`],
				callbackURL: `${process.env.API_BASE_OAUTH || process.env.API_BASE}/auth/${name}/callback`,
				...(strategyName === 'gitea' ?
					{name, authorizationUrl, tokenUrl, userProfileUrl} :
					{})
			},
			(accessToken, refreshToken, profile, done) => {
				return done(undefined, {accessToken, refreshToken, profile});
			}
		)
	);
}

function addRoutes(app, db, {name}) {
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
			const email = profile.emails[0].value;
			users
				.findOrCreateUser(db, {
					provider: name,
					providerUserId: profile.id,
					email,
					accessToken,
					refreshToken
				})
				.then(user => {
					return users.createLoginToken(db, {userId: user.id});
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

function initPassport(app, db) {
	const providers = auth.providers.filter(({enabled}) => enabled !== false);
	app.use(passport.initialize());
	for (const provider of providers) {
		addProvider(app, provider);
	}

	for (const provider of providers) {
		addRoutes(app, db, provider);
	}
}

module.exports = initPassport;
