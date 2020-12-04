const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const initPassport = require('./init-passport');
const {Pool} = require('pg');
const gitea = require('./app/services/gitea');
const initUsers = require('./app/models/users');
const tokens = require('./app/models/tokens');
const {sessionLoader, authenticate} = require('./app/controllers/auth');
const initSessionRoutes = require('./app/controllers/sessions');
const initTokenRoutes = require('./app/controllers/tokens');
const initUserRoutes = require('./app/controllers/users');

const db = new Pool({
	connectionString: process.env.NODE_DATABASE_URL
});

const users = initUsers({db, gitea});
gitea.configureAuth(users);

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
initUserRoutes({app, authenticate, users});

app.listen(process.env.PORT, () => {
	console.log(`Listening at http://localhost:${process.env.PORT}`);
});
