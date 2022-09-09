import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import useToken from "../../hooks/useToken";
import useInput from "../../hooks/useInput";

import BigButton from "../../components/BigButton/BigButton";

import Logo from '../../assets/logo/Logo.png';
import classes from './Register.module.css';


const Register = (props) => {

    const [pwFocus, setPwFocus] = useState(false);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const { isLoading, error, getToken } = useToken();

    const validateName = (value) => value.trim().match(/^[a-zA-ZäöüÄÖÜß '\s-]{2,}$/);
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validateEmail = (value) => value.trim().match(emailRegex);
    const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&§+*=]).{8,}$/;
    const validatePassword = (value) => value.trim().match(pwRegex);
    
    const {
        enteredValue: firstNameValue,
        valueIsValid: firstNameIsValid,
        inputHasError: firstNameHasError,
        changeValueHandler: changeFirstNameHandler,
        touchedHandler: firstNameTouchedHandler
    } = useInput(validateName);

    const {
        enteredValue: lastNameValue,
        valueIsValid: lastNameIsValid,
        inputHasError: lastNameHasError,
        changeValueHandler: changeLastNameHandler,
        touchedHandler: lastNameTouchedHandler
    } = useInput(validateName);

    const {
        enteredValue: emailValue,
        valueIsValid: emailIsValid,
        inputHasError: emailHasError,
        changeValueHandler: changeEmailHandler,
        touchedHandler: emailTouchedHandler
    } = useInput(validateEmail);

    const {
        enteredValue: passwordValue,
        valueIsValid: passwordIsValid,
        inputHasError: passwordHasError,
        changeValueHandler: changePasswordHandler,
        touchedHandler: passwordTouchedHandler
    } = useInput(validatePassword);

    let formIsValid = false;

    if(
        firstNameIsValid &&
        lastNameIsValid &&
        emailIsValid && 
        passwordIsValid
    ){
        formIsValid = true;
    };

    const submitHandler = (event) => {
        event.preventDefault();

        setPwFocus(false);

        firstNameTouchedHandler();
        lastNameTouchedHandler();
        emailTouchedHandler();
        passwordTouchedHandler();

        if(!formIsValid) {
            return;
        };

        const registerData = {
            firstName: firstNameValue, 
            lastName: lastNameValue, 
            email: emailValue, 
            password: passwordValue,
            img: "1.png"
        };

        getToken("register", registerData);
    };

    return(
        <div className={classes.grid}>
            <div className={classes.content}>
                <img src={Logo} alt="Olympix Logo" className={classes.logo}/>
                <form className={classes.registerForm} onSubmit={submitHandler}>
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="Vorname" 
                        onChange={
                            () => changeFirstNameHandler(
                                firstNameRef.current.value.charAt(0).toUpperCase() + 
                                firstNameRef.current.value.slice(1)
                            )
                        }
                        maxLength="30"
                        ref={firstNameRef}
                        onFocus={() => setPwFocus(false)}
                    />
                    {firstNameHasError && <p className={classes.errorText}>Vorname ist ungültig</p>}
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Nachname" 
                        onChange={
                            () => changeLastNameHandler(
                                lastNameRef.current.value.charAt(0).toUpperCase() + 
                                lastNameRef.current.value.slice(1)
                            )
                        }
                        maxLength="30"
                        ref={lastNameRef}
                        onFocus={() => setPwFocus(false)}
                    />
                    {lastNameHasError && <p className={classes.errorText}>Nachname ist ungültig</p>}
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-Mail" 
                        onChange={() => changeEmailHandler(emailRef.current.value)}
                        ref={emailRef}
                        onFocus={() => setPwFocus(false)}
                    />
                    {emailHasError && <p className={classes.errorText}>E-Mail ist ungültig</p>}
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Passwort" 
                        onChange={() => changePasswordHandler(passwordRef.current.value)}
                        ref={passwordRef}
                        onFocus={() => setPwFocus(true)}
                    />
                    {passwordHasError && 
                            <p className={classes.errorText}>Passwort ist ungültig</p>
                    }
                    {pwFocus && 
                        <div className={classes.pwNote}>
                            <p className={classes.pwRules}>• Klein- und Großbuchstaben</p>
                            <p className={classes.pwRules}>• Mind. 8 Zeichen</p>
                            <p className={classes.pwRules}>• Mind. 1 Zahl</p>
                            <p className={classes.pwRules}>• Mind. 1 Sonderzeichen</p>
                        </div>
                    }
                    {error && 
                        <div className={classes.error}>
                            <p>{error}</p>
                        </div>
                    }
                    <BigButton 
                        style={{width: "100%"}}
                        onClick={submitHandler}
                        >{isLoading ? "Lädt..." : "Registrieren"}
                    </BigButton>
                </form>
                <section className={classes.login}>
                    <p>Du hast bereits ein Konto?</p>
                    <Link to="/login">
                        <BigButton style={
                            {width: "100%", fontSize: "0.8em"}
                        }>Jetzt anmelden</BigButton>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Register;