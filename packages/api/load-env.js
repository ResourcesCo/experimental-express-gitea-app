const env = require('./env.json');

module.exports = () => {
	for (const key of Object.keys(env)) {
		process.env[key] = env[key];
	}
};
