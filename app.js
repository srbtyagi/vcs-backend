const compression = require('compression');
const express = require('express');
const app = express();
app.use(compression());
const jwt = require('./services/jwt');
const upload = require('express-fileupload');
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(upload());
const cors = require('cors');
var session = require('express-session');
const passport = require('passport');
const stuff = require('./services/jwt.js');
const employee_api = require('./controllers/employee_api.js');
const web_api = require('./controllers/web_api');
const recruitee_api = require('./controllers/recruitee_api.js');
const mobile_api = require('./controllers/mobile_api.js');

app.use(
  express.json({
    limit: '10mb',
    extended: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

////using cors
app.use(cors());
app.use(
  cors({
    origin: true, // "true" will copy the domain of the request back
    // to the reply. If you need more control than this
    // use a function.

    credentials: true, // This MUST be "true" if your endpoint is
    // authenticated via either a session cookie
    // or Authorization header. Otherwise the
    // browser will block the response.

    methods: 'POST,GET,PUT,OPTIONS,DELETE', // Make sure you're not blocking
    // pre-flight OPTIONS requests
  })
);
////////add api
jwt(app);

app.listen(8000, function () {
  console.log('connected ' + 'localhost:8000');
});

const port = 3000;

const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'em-db.cluster-cs0ol7nhc7nb.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'america2020',
});

app.get('/status', (req, res) => res.send({ status: "I'm up and running" }));
app.listen(port, () => console.log(`Dockerized Nodejs Applications is listening on port ${port}!`));

app.use(employee_api);
app.use(recruitee_api);
app.use(web_api);
app.use(mobile_api);
module.exports = app;
