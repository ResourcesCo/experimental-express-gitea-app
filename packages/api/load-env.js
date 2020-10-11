const env = require('./config/env.json');

module.exports = () => {
	for (const key of Object.keys(env)) {
		process.env[key] = env[key];
	}
};
