'use strict';
const { google } = require('googleapis');
const { createUser } = require('./data')
const { User } = require('./entities')

// To ask for permissions from a user to retrieve an access token, you redirect them to a consent page. To create a consent page URL
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

module.exports.authorize = async event => {
  const { scopes } = JSON.parse(event.body);

  if(!scopes) {
    throw new Error(`Missing scopes! You must provide valid scopes.`)
  }
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    prompt: 'select_account'
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url
      },
      null,
      2
    ),
  };
};

module.exports.token = async event => {
  const accessCode = JSON.parse(event.body);

  if (!accessCode) {
    throw new Error(`Missing access code! You must provide a valid access code.`);
  }
  
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  // get user profile from geberated accessToken
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2'
  });

  oauth2.userinfo.get(
    function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
  });

  // create user from schema
  const user = new User({
    username: event.body.username,
    name: event.body.name,
    email: event.body.email
  });

  // set user in our DB
  const { error } = await createUser(user);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `token creation was successful`,
      },
      null,
      2
    ),
  };
};
