import React from "react";
import {Link } from "react-router-dom";
import { getUser} from './service/AuthService';


const Main = () => {
    
    const user = getUser();
    console.log(user)
    const user_name = user !== 'undefined' && user ? user.user_name : '';
    
    return (
        <div className="text">
        <h5>Hey! <br/>
        Welcome {user_name} <br/></h5>
        This is the main page for the AWS web application deployed on EC2 and build with React JS and Node JS with the use of AWS Lambda and API Gateway.<br/>
        <br/>
        <center><img src={require('./architecture_diagram.jpg')} alt = ""/></center><br/>
        We would love if you could register with us!
        <div><Link to="/register"><button>Register</button></Link></div>
        <div className="smalltext">Already have an account? <span className = "link"><Link to = "/login">Login</Link></span></div>
        </div>
    )
} 

export default Main;