const cheerio = require('cheerio')
const when = require('../steps/when')
const { init } = require('../steps/init')
console.log = jest.fn() // silence the funtions console logs

const mockRequestBody = {};

describe(`When user makes a POST request to the /login endpoint`, () => {
  beforeAll(async () => await init())

  it(`Should recieve proper API scopes from the request body`, () => {
    // note client side these scopes will come from the extensions manifest and email can come hopefully from InboxSDK

    // assert on mockRequestBody
  });

  it(`Should return redirect to the google login page`, async () => {
    const response = await when.weMakePostRequestTo('/login', mockRequestBody);

    // assert on response.redirectURL
  });
});

