import React from "react";

import { Link } from "react-router-dom";

import Logo from '../../assets/logo/Logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import classes from './Header.module.css';


const Header = (props) => {
    return(
        <header className={classes.header}>
            <div className={classes.logo}>
                {props.loggedIn && 
                    <Link to="/">
                        <img 
                            src={Logo} 
                            alt="Olympix Logo" 
                        />
                    </Link>
                }
            </div>
            <FontAwesomeIcon 
                    icon={faInfoCircle} 
                    className={classes.icon}
                    onClick={() => props.onClick()}
            />
        </header>
    );
};

export default Header;