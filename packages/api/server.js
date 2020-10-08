const loadEnv = require('./load-env');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const login = require('./auth/routes/login');
const users = require('./auth/models/users');
const tokens = require('./auth/models/tokens');

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

app.post('/login', login({users, tokens}));

app.listen(process.env.PORT, () => {
	console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
