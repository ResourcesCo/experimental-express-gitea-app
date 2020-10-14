const decode = require('base64url').decode;

function makeToken({userId, sessionId, tokenType, expiresAfter}) {
	return {
		aud: 'https://api.resources.co:9000/',
		iss: 'https://api.resources.co/',
		sub: `u:${userId},${sessionId},${tokenType}`,
		roles: ['user'],
		exp: Math.floor(new Date().valueOf() / 1000) + expiresAfter
	};
}

function makeTokens({userId, sessionId}) {
	const accessExpiresIn = 30 * 60;
	return {
		accessToken: makeToken({userId, sessionId, tokenType: 'access', expiresAfter: accessExpiresIn}),
		accessTokenExpiresAt: (new Date()).valueOf() + (accessExpiresIn * 1000),
		refreshToken: makeToken({userId, sessionId, tokenType: 'refresh', expiresAfter: 14 * 24 * 60 * 60}),
	};
}

// This will parse a header without validating it. It should already be validated by the middleware.
function parseHeader(header) {
	try {
		const match = /^Bearer (\S+)$/.exec(header);
		if (match) {
			const base64Payload = match[1].split('.')[1];
			const payload = JSON.parse(decode(base64Payload));
			const splitSub = payload.sub.split(':');
			if (splitSub.length === 2 && splitSub[0] === 'u') {
				const splitFields = splitSub[1].split(',');
				if (splitFields.length === 3) {
					const [userId, sessionId, tokenType] = splitFields;
					return {userId, sessionId, tokenType};
				}
			}
		}
	} catch (err) {
		// do nothing
	}
}

module.exports = {
	makeTokens,
	parseHeader
};
