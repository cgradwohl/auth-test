class User {

    constructor({
      gaiaId,
      email,
      createdAt = new Date(),
      accessToken,
      refreshToken
    }) {
        if (!gaiaId) {
            throw new Error('User requires a gaiaId.')
        }
        this.gaiaId = gaiaId;
        this.email = email;

        this.createdAt = createdAt;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    key() {
        return {
            'PK': { 'S': `USER#${this.gaiaId}` },
            'SK': { 'S': `USER#${this.email.toLowerCase()}` }
        }
    }


    toItem() {
        return {
            ...this.key(),
            'Type': { 'S': 'User' },
            'UserId': { 'S': this.gaiaId },
            'Email': { 'S': this.email },
            'CreatedAt': { 'S': this.createdAt.toISOString() },
            'AccessToken': { 'S': this.accessToken },
            'RefreshToken': { 'S': this.refreshToken },
        }
    }
}

const userFromItem = (item) => {
    // It's possible we could retrieve an Organization by accident due to similar key structure.
    // This will prevent us from returning an Organization as a User
    if (item.Type.S !== 'User') {
        throw new Error('Not a user.')
    }

    return new User({
        userId: item.UserId.S,
        email: item.Email.S,
        createdAt: new Date(item.CreatedAt.S),
        accessToken: item.AccessToken.S, 
        refreshToken: itme.RefreshToken.S 
    });
}

module.exports = {
    User,
    userFromItem
}