const loadEnv = require('./load-env');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const users = require('./users');
const tokens = require('./tokens');

loadEnv();

const db = new Pool({
	connectionString: process.env.NODE_DATABASE_URL
});

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());

initPassport(app, db);

app.get('/', (request, response) => {
	response.send('Hello World!');
});

app.post('/login', (request, response) => {
	let userId;
	users
		.getLoginToken(db, {token: request.body.token})
		.then(token => {
			if (token && token.active && new Date() < token.expires_at) {
				userId = token.user_id;
				return users.createUserSession(db, {userId});
			}

			throw new Error('Invalid token');
		})
		.then(({id: sessionId}) => {
			response.send(tokens.makeTokens({userId, sessionId}));
		})
		.catch(error => {
			console.error(error);
			response.status(422).send({error: 'Invalid token'});
		});
});

app.listen(process.env.PORT, () => {
	console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
