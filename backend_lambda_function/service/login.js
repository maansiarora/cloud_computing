//taken reference from youtube: https://www.youtube.com/watch?v=mgkgQtMplPY
//stackoverflow for doubts and errors and AWS for workflow and services.

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'login';

async function login(user) {
  const email = user.email;
  const password = user.password;
  
  if (!user || !email || !password) {
    return util.buildResponse(401, {
      message: 'Both Email and Password are required.'
    });
  }

  const dynamoUser = await getUser(email.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.email) {
    return util.buildResponse(403, { message: 'Invalid Email.'});
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, { message: 'Invalid Password.'});
  }

  const userInfo = {
    email: dynamoUser.email,
    user_name: dynamoUser.user_name
  }
  const token = auth.generateToken(userInfo)
  const response = {
    user: userInfo,
    token: token
  }
  return util.buildResponse(200, response);
}

async function getUser(email) {
  const params = {
    TableName: userTable,
    Key: {
      email: email
    }
  }
  
  console.log(`Querying DynamoDB with params: ${JSON.stringify(params)}`);
  
  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  })
}

module.exports.login = login;