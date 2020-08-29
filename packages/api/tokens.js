function makeToken({userId, sessionId, tokenType, expiresAfter}) {
	return {
		aud: 'https://api.resources.co:9000/',
		iss: 'https://api.resources.co/',
		sub: `u:${userId},${sessionId},${tokenType}`,
		roles: ['user'],
		exp: Math.floor(new Date().valueOf() / 1000) * expiresAfter
	};
}

function makeTokens({userId, sessionId}) {
	return {
		accessToken: makeToken({userId, sessionId, tokenType: 'access', expiresAfter: 30 * 60}),
		refreshToken: makeToken({userId, sessionId, tokenType: 'refresh', expiresAfter: 14 * 24 * 60 * 60})
	};
}

module.exports = {
	makeTokens
};
