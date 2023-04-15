import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setUserSession } from './service/AuthService'

const registerUrl = 'https://4m2tcg1vr0.execute-api.us-east-1.amazonaws.com/prod/register';

// taken reference from youtube: https://www.youtube.com/watch?v=ReNkQ0Xkccw&t=1913s

const Register = () => {
    const [email, setEmail] = useState('');
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const navigate = useNavigate(); 
    const submitHandler = (event) => {
        event.preventDefault();
        if (user_name.trim() === '' || email.trim() === '' || password.trim() === '') {
            setMessage('All the fields are required.');
            return;
        }
        setMessage(null);
        
        const requestConfig = {
            headers: {
                'x-api-key': '1NbgWVwiRG7GJKfbLEMAF5yzXQLJF17774cnDkAc'
            }
        }
        const requestBody = {
            email: email,
            user_name: user_name,
            password: password
          }
          axios.post(registerUrl, requestBody, requestConfig).then(response => {
            setUserSession(response.data.user, response.data.token);
            navigate('/login');
          }).catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
              setMessage(error.response.data.message);
            } else {
              setMessage('The backend server is currently down.');
            }
          })
    }

    return (
        <div>
          <div className='form'>
            <form onSubmit={submitHandler}>
                <h5>Register</h5>
                Email: <input type="text" value={email} onChange={event => setEmail(event.target.value)} /> <br/>
                Username: <input type="text" value={user_name} onChange={event => setUsername(event.target.value)} /> <br/>
                Password: <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br/>
                <div className='button'><input type="submit" value="Register" /></div>
            </form>
            {message && <p className="message">{message}</p>}
            </div>
      </div>
    )
} 

export default Register;