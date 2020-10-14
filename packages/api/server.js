const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const initUsers = require('./app/models/users');
const tokens = require('./app/models/tokens');
const auth = require('./app/controllers/auth');
const initSessionRoutes = require('./app/controllers/sessions');

const db = new Pool({
	connectionString: process.env.NODE_DATABASE_URL
});

const users = initUsers(db);

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(cookieParser());

initPassport({app, users});

app.get('/', (req, res) => {
	res.send({});
});

app.use(auth.sessionLoader({users, tokens}));

initSessionRoutes({app, db, users, tokens});

app.listen(process.env.PORT, () => {
	console.log(`Listening at http://localhost:${process.env.PORT}`);
});
