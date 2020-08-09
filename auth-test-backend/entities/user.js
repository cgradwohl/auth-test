const { PaymentPlan, paymentPlanFromString } = require('./paymentPlans')

class User {

    constructor({ username, name, email, createdAt = new Date(), organizations = {}, paymentPlan = new PaymentPlan({}) }) {
        if (!username) {
            throw new Error('User requires a username')
        }
        this.username = username
        this.name = name
        this.email = email
        this.createdAt = createdAt
        this.organizations = organizations
        this.paymentPlan = paymentPlan
    }

    key() {
        return {
            'PK': { 'S': `ACCOUNT#${this.username.toLowerCase()}` },
            'SK': { 'S': `ACCOUNT#${this.username.toLowerCase()}` }
        }
    }

    gsi3pk() {
        return { 'S': `ACCOUNT#${this.username.toLowerCase()}` }

    }

    gsi3() {
        return {
            'GSI3PK': this.gsi3pk(),
            'GSI3SK': { 'S': `ACCOUNT#${this.username.toLowerCase()}` }
        }
    }


    toItem() {
        return {
            ...this.key(),
            ...this.gsi3(),
            'Type': { 'S': 'User' },
            'Username': { 'S': this.username },
            'Name': { 'S': this.name },
            'Email': { 'S': this.email },
            'CreatedAt': { 'S': this.createdAt.toISOString() },
            'Organizations': { 'M': this.formatOrganizations() },
            'PaymentPlan': { 'S': this.paymentPlan.toString() }
        }
    }

    formatOrganizations() {
        const organizations = {}
        for (let [name, role] of Object.entries(this.organizations)) {
            organizations[name] = { 'S': role }
        }
        return organizations
    }
}

const parseOrganizations = organizations => {
    const parsed = {}
    for (let [name, role] of Object.entries(organizations)) {
        parsed[name] = role.S
    }
    return parsed
}


const userFromItem = (item) => {
    // It's possible we could retrieve an Organization by accident due to similar key structure.
    // This will prevent us from returning an Organization as a User
    if (item.Type.S !== 'User') {
        throw new Error('Not a user.')
    }
    return new User({
        username: item.Username.S,
        name: item.Name.S,
        email: item.Email.S,
        createdAt: new Date(item.CreatedAt.S),
        organizations: parseOrganizations(item.Organizations.M),
        paymentPlan: item.PaymentPlan ? paymentPlanFromString(item.PaymentPlan.S) : {}
    })
}

module.exports = {
    User,
    userFromItem
}