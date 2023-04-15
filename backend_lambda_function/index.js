const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const displayService = require('./service/tabledisplay');
const util = require('./utils/util');

//taken reference from youtube: https://www.youtube.com/watch?v=mgkgQtMplPY
//for deployment: https://www.youtube.com/watch?v=4dptGqB60y0
//stackoverflow for doubts and errors and AWS for workflow and services.

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const displayPath = '/tabledisplay'

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;
        case event.httpMethod === 'GET' && event.path === displayPath:
            response = await displayService.tabledisplay(event);
            break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};