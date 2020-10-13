const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const initUsers = require('./models/users');
const tokens = require('./models/tokens');
const initSessionRoutes = require('./routes/sessions');

const db = new Pool({
	connectionString: process.env.NODE_DATABASE_URL
});

const users = initUsers(db);

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());

initPassport({app, users});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/jwk/PrivateKeySet.json', (req, res) => {
	// TODO: validate username/password w/ basic auth and send keys
	res.send({});
});

app.get('/jwk/PublicKeySet.json', (req, res) => {
	// TODO: validate username/password w/ basic auth and send keys
	res.send({});
});

initSessionRoutes({app, db, users, tokens});

app.listen(process.env.PORT, () => {
	console.log(`Listening at http://localhost:${process.env.PORT}`);
});
