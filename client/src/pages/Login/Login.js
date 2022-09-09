import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import DataContext from "../../context/DataContext/DataContext";

import useToken from "../../hooks/useToken";

import BigButton from "../../components/BigButton/BigButton";

import Logo from '../../assets/logo/Logo.png';
import classes from './Login.module.css';


const Login = (props) => {

    const dataCtx = useContext(DataContext);

    const [loginData, setLoginData] = useState({email:"gast@olympix.de", password:dataCtx.guestPW});

    const { isLoading, error, getToken } = useToken();

    const updateData = (event) => {
        setLoginData(prevState => ({
            ...prevState, 
            [event.target.name]: event.target.value
        }));
    };

    const submitHandler = (event) => {
        event.preventDefault();
        getToken("login", loginData);
    };

    return(
        <div className={classes.grid}>
            <div className={classes.content}>
                <img src={Logo} alt="Olympix Logo" className={classes.logo}/>
                <form className={classes.loginForm} onSubmit={submitHandler}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-Mail" 
                        onChange={updateData}
                        value={loginData.email}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Passwort" 
                        onChange={updateData} 
                        value={loginData.password}
                    />
                    {error && <p className={classes.error}>{error}</p>}
                    <BigButton 
                        style={{width: "100%"}}
                        onClick={submitHandler}
                        >{isLoading ? "Lädt..." : "Anmelden"}
                    </BigButton>
                </form>
                <section className={classes.register}>
                    <p>Noch nicht registriert?</p>
                    <Link to="/register">
                        <BigButton 
                            style={{width: "100%", fontSize: "0.8em"}}
                        >Neues Konto erstellen</BigButton>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Login;