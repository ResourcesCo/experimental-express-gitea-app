const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const initUsers = require('./app/models/users');
const tokens = require('./app/models/tokens');
const gitea = require('./app/services/gitea');
const {sessionLoader, authenticate} = require('./app/controllers/auth');
const initSessionRoutes = require('./app/controllers/sessions');
const initTokenRoutes = require('./app/controllers/tokens');
const initUsersController = require('./app/controllers/users');

const db = new Pool({
	connectionString: process.env.NODE_DATABASE_URL
});

const users = initUsers({db});
const usersController = initUsersController({users, gitea});
const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(cookieParser());

initPassport({app, users});

app.get('/', (req, res) => {
	res.send({});
});

app.use(sessionLoader({users, tokens}));

initSessionRoutes({app, authenticate, db, users, tokens});
initTokenRoutes({app, authenticate, tokens});
usersController.initRoutes({app, authenticate});

async function run() {
	app.listen(process.env.PORT, () => {
		console.info(`Listening at http://localhost:${process.env.PORT}`);
	});
}

run().then(() => undefined).catch(err => {
	console.error('Error in app', err);
});