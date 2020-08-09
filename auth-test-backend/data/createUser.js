const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()

const createUser = async (user) => {
    try {
        await dynamodb.putItem({
            TableName: process.env.TABLE_NAME,
            Item: user.toItem(),
            ConditionExpression: 'attribute_not_exists(PK)'
        }).promise()
        return {
            user
        }
    } catch(error) {
        console.log('Error creating user')
        console.log(error)
        let errorMessage = 'Could not create user'
        // If it's a condition check violation, we'll try to indicate which condition failed.
        if (error.code === 'ConditionalCheckFailedException') {
            errorMessage = 'Account with this name already exists.'
        }
        return {
            error: errorMessage
        }
    }
}

module.exports = {
    createUser
}