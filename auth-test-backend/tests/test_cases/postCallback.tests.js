describe(`When GoogleOauth calls our redirectURI /callback endpoint`, () => {
  it(`Should receive a scoped accessCode from the request url`, () => {});

  it(`Should generate the accessToken from the scoped accessCode`, () => {});

  it(`Should use npm googleapis to get the user email from their accessToken`, () => {});

  it(`Should store the accessToken and user email to the User column in the DynamoDB wide table`, () => {});

  it(`Should return 200 to GoogleOauth`, () => {});
});