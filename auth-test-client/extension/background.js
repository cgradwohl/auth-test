async function getAuthUrl(scopes) {
    try {
        const response = await fetch(
            'https://ozv3z23aoj.execute-api.us-east-1.amazonaws.com/dev/authorize',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ scopes })
            }
        );

        const data = await response.json();

        return data.url;
    } catch (error) {
        throw new Error(`The call to getAuthUrl failed. \n ${error}`);
    }
}

function getAccessCode(url) {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            {
                'url': url, 
                'interactive':true
            }, 
            function(redirectUrl) {
                if (chrome.runtime.lastError) {
                    reject(`The call to getAccessCode failed. \n ${chrome.runtime.lastError.message}`);
                } else {
                    // instead of redirecting to our server, we redirect back to the consent window
                    const accessCode = redirectUrl.split('?code=')[1].split('&')[0];
                    resolve(accessCode);
                }
            }
        );
    });
}

async function createToken(accessCode) {
    try {
        // makes this a POST with the accessCode in the post body
        const response = await fetch(
            `https://ozv3z23aoj.execute-api.us-east-1.amazonaws.com/dev/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({ accessCode })
            }
        );
        
        return response.json();
    } catch (error) {
        throw new Error(`The call to createToken() failed! \n ${error}`);
    }
}

async function authenticate(scopes) {
    const url = await getAuthUrl(scopes);
    const accessCode = await getAccessCode(url);
    const result = await createToken(accessCode);
    
    return result;
}


// main
var manifest = chrome.runtime.getManifest();
const scopes = manifest.oauth2.scopes;
console.log('scopes', scopes);

authenticate(scopes)
    .then(result => console.log('authenication result:', result))
    .catch(error => console.error(error));
