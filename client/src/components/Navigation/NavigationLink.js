import React from "react";

import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './NavigationLink.module.css';


export const NavigationLink = (props) => {

    return(
        <NavLink onClick={props.onClick} className={classes.navlink} to={props.link}>
            <FontAwesomeIcon icon={props.icon} className={classes.icon}/>
            <p className={classes['nav-text']}>{props.text}</p>
        </NavLink>
    );
};