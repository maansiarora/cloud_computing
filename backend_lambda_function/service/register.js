//taken reference from youtube: https://www.youtube.com/watch?v=mgkgQtMplPY
//stackoverflow for doubts and errors and AWS for workflow and services.

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'login';

async function register(userInfo) {
  const email = userInfo.email;
  const user_name = userInfo.user_name;
  const password = userInfo.password;
  if (!user_name || !email || !password) {
    return util.buildResponse(401, {
      message: 'All fields are required'
    })
  }

  const dynamoUser = await getUser(email.trim());
  if (dynamoUser && dynamoUser.email) {
    return util.buildResponse(401, {
      message: 'The Email already exists.'
    })
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    email: email.trim(),
    user_name: user_name.trim(),
    password: encryptedPW
  }

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Try again later.'});
  }

  return util.buildResponse(200, { user_name: user_name });
}

async function getUser(email) {
  const params = {
    TableName: userTable,
    Key: {
      email: email
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  })
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user,
    ConditionExpression: 'attribute_not_exists(email)'
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    if (error.code === 'ConditionalCheckFailedException') {
      console.log('User already exists.');
      return false;
    }
    console.error('There is an error saving user: ', error)
  });
}

module.exports.register = register;