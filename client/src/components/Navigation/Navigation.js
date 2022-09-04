import React from "react";
import { useLocation } from "react-router";

import { NavigationLink } from "./NavigationLink";

import { faCompass as fasCompass, faCalendar as fasCalendar, faPlusSquare as fasPlusSquare, faUser as fasUser } 
from '@fortawesome/free-solid-svg-icons';
import { faCompass as farCompass, faCalendar as farCalendar, faPlusSquare as farPlusSquare, faUser as farUser } 
from '@fortawesome/free-regular-svg-icons';
import classes from './Navigation.module.css';


const Navigation = (props) => {
    
    const location = useLocation();

    let isActiveState = {
        startIsActive: false,
        eventsIsActive: false,
        createIsActive: false,
        profileIsActive: false
    };

    if(location.pathname.startsWith("/sports")) {
        isActiveState.startIsActive = true;
    } else if(location.pathname.startsWith("/events")) {
        isActiveState.eventsIsActive = true;
    }else if(location.pathname.startsWith("/create")) {
        isActiveState.createIsActive = true;
    } else if(location.pathname.startsWith("/profile")) {
        isActiveState.profileIsActive = true;
    }

    return(
        <nav className={classes.nav} onClick={props.onClick}>
           <NavigationLink
            link="/"
            icon={isActiveState.startIsActive ? fasCompass : farCompass}
            text="Start"
           />
           <NavigationLink
            link="/events"
            icon={isActiveState.eventsIsActive ? fasCalendar : farCalendar}
            text="Events"
           />
           <NavigationLink
            link="/create"
            icon={isActiveState.createIsActive ? fasPlusSquare : farPlusSquare}
            text="Create"
           />
           <NavigationLink
            link="/profile"
            icon={isActiveState.profileIsActive ? fasUser : farUser}
            text="Profil"
           />
        </nav>
    );
};

export default Navigation;