// hkxx26 Country Lookup app.js

// Imports dependencies.
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

// Imports dependency for Google sign in
const {OAuth2Client} = require('google-auth-library');

// Starts express app.
const app = express();

// Serves main page and initialises port.
app.use(express.static('client'));

// Object containing all the Users Favourite Countries in JSON format.
// (Key is the user, value is the Favourite country in JSON format)
const users = {};

// Object containing all the Users Favourite Countries names used to
// check if the country is already stored.
// (Key is the user, value is the Favourite country stored as a string)
const usersCheck = {};

// App uses body-parser to support POST requests.
app.use(bodyParser.json(), bodyParser.urlencoded({extended: true}));

// Google Login Verify function. Returns the Users Unique Google ID.
async function verify(token) {
  const CLIENT_ID = '1068304171505-cet97v9tejm03u4b78e108q1e4c7icmi.apps.googleusercontent.com';
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload.sub;
  return userid;
}

// Handles Google Initial Login POST Request.
app.post('/tokensignin', (req, res) => {
  const token = req.body.idtoken;
  verify(token)
    .then((userid) => {
      // Checks if already a user. If not creates a new user profile.
      if (!(userid in users)) {
        users[userid] = [];
        usersCheck[userid] = [];
        res.status(201).send(userid);
      } else {
        res.status(200).send(userid);
      }
    })
    .catch(() => res.status(401).send('We are sorry but we are not able to authenticate you. Check you gave proper credential in the login step'));
});

// Handles GET Request requesting a specific Region's countries. Returns that regions countries.
app.get('/regions/:id', (req, res) => {
  const url = `https://restcountries.eu/rest/v2/region/${req.params.id}`;
  fetch(url)
    .then(resp => resp.json())
    .then(data => res.status(200).send(data))
    .catch(() => res.status(400).send());
});

// Handles GET Request Searching for a specific countries.
// Returns all countries that contain the query.
app.get('/name/:id', (req, res) => {
  const url = `https://restcountries.eu/rest/v2/name/${req.params.id}`;
  fetch(url)
    .then(resp => resp.json())
    .then(data => res.status(200).send(data))
    .catch(() => res.status(404).send());
});

// Handles GET Request requesting the user's favourite countries.
// Also checks the authentication of the User.
// Returns the user's favourite countries.
app.get('/favourites/:token', (req, res) => {
  const {token} = req.params;
  verify(token)
    .then((userid) => {
      if (users[userid].length > 0) {
        res.status(200).send(users[userid]);
      } else {
        res.status(204).send([]);
      }
    })
    .catch(() => res.status(401).send('We are sorry but we are not able to authenticate you. Check you gave proper credential in the login step'));
});

// Handles POST Request requesting to add a country to the user's favourite countries.
// Also checks the user's authentication token.
// Adds the country requested to the user's favourite countries list.
app.post('/', (req, res) => {
  const token = req.body.idtoken;
  verify(token)
    .then((userid) => {
      if (!(usersCheck[userid].includes(req.body.data.name))) {
        users[userid].push(req.body.data);
        usersCheck[userid].push(req.body.data.name);
        res.status(201).send(users[userid]);
      } else {
        res.status(400).send(users[userid]);
      }
    })
    .catch(() => res.status(401).send('We are sorry but we are not able to authenticate you. Check you gave proper credential in the login step'));
});

// Handles DELETE Request requesting to delete a country from the user's favourite countries.
// Also checks the user's authentication token.
// Deletes the country requested from the user's favourite countries list.
app.delete('/', (req, res) => {
  const token = req.body.idtoken;
  verify(token)
    .then((userid) => {
      if ((usersCheck[userid].includes(req.body.data.name))) {
        users[userid].pop(req.body);
        usersCheck[userid].pop(req.body.data.name);
        res.status(200).send(users[userid]);
      } else {
        res.status(400).send(users[userid]);
      }
    })
    .catch(() => res.status(401).send('We are sorry but we are not able to authenticate you. Check you gave proper credential in the login step'));
});

module.exports = app;