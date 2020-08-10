'use strict';
const { google } = require('googleapis');
const { createUser } = require('./data')
const { User } = require('./entities');

// To ask for permissions from a user to retrieve an access token, you redirect them to a consent page. To create a consent page URL
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

module.exports.authorize = async event => {
  const { scopes } = JSON.parse(event.body);

  if (!scopes) {
    throw new Error(`Missing scopes! You must provide valid scopes.`)
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    prompt: 'select_account'
  });

  console.log('URL', url);

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
  try {
    const { queryStringParameters } = event;
    const { code } = queryStringParameters;

    if (!queryStringParameters && !code ) {
      throw new Error('Invalid access code.');
    }

    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n:::TOKENS\n', JSON.stringify(tokens, null, 2));
    // first time
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token || ""; // THIS ONLY HAPPENS THE FIRST TIME ! store this in the DB
    const idToken = tokens.id_token;
    
    oauth2Client.setCredentials(tokens);

    // get user profile from generated accessToken
    const peopleClient = google.people({
      version: 'v1',
      auth: oauth2Client
    });

    const people = await peopleClient.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses',
      auth: oauth2Client,
    });

    const userProfile = people.data.emailAddresses[0];

    // create user from schema
    const user = new User({
      gaiaId: userProfile.metadata.source.id,
      email: userProfile.value,
      accessToken,
      refreshToken,
      idToken
    });

    // set user in our DB
    const { error } = await createUser(user);
    
    const statusCode = error ? 500 : 200;
    
    const body = error ? JSON.stringify({ error }) : JSON.stringify({ user })

    return {
      statusCode,
      body
    }
    
  } catch (error) {
    throw (`Server Error: ${error.message}`)
  }
};
