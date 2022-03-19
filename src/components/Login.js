import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const backend = "http://localhost:5000";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", password: "" });

    const inputHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const login = async (e) => {
        e.preventDefault();
        let url = backend + "/auth/login";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            localStorage.removeItem("token");
        } else if (data.errors) {
            console.error(data.errors[0].msg);
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            navigate('/');
        }
    }


    return (
        <LoginContainer>
            <LoginCard>
                <LoginCardHeader>
                    <h1>Login</h1>
                    <p>Enter your login details below.</p>
                </LoginCardHeader>
                <LoginCardForm>
                    <input autoComplete="new-password" type="text" name="username" value={user.username} onChange={inputHandler} placeholder='Username' />
                    <input autoComplete="new-password" type="password" name="password" value={user.password} onChange={inputHandler} placeholder='password' />
                    <button onClick={login}>Login</button>
                </LoginCardForm>
            </LoginCard>
        </LoginContainer>
    )
}

export default Login;

const LoginContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: grid;
    place-content: center;
    background: var(--page-background);
`

const LoginCard = styled.div`
    padding: 2rem;
    border-radius: 1rem;
    background-color: var(--bg-dark);
`

const LoginCardHeader = styled.div`
    text-align: center;
    color: var(--text-bright);
    >h1  {
        font-size: 2rem;
        font-weight: 600;
    }

    >p {
        font-size: 0.8rem;
        color: var(--text-mute);
    }
`

const LoginCardForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;

    >input {
        width: 40ch;
        color: var(--text-bright);
        padding: 0.8rem;
        border-radius: 0.25rem;
        border: none;
        background-color: var(--bg-light);
        margin-bottom: 1.25rem;


        @media screen and (max-width : 500px) {
            width: 30ch;
        }
    }

    >input:focus {
        box-shadow: 0 0 .25rem #8f8f8f;
        outline: none;
    }

    >input::placeholder{
        color: var(--text-mute);
    }

    >button {
        color: var(--text-bright);
        background-color: var(--primary);
        padding: 0.8rem;
        border: none;
        outline: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    >button:hover {
        background: var(--page-background);
        color: var(--text-bright);
    }
`