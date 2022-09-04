import React, { useEffect, useContext } from "react";
import { Route, Switch, Redirect } from "react-router";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/AuthContext/AuthContext";

import SubscribedEvents from "../../components/SubscribedEvents/SubscribedEvents";
import CreatedEvents from "../../components/CreatedEvents/CreatedEvents";

import classes from './Events.module.css';


const Events = (props) => {

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        authCtx.checkAuth();
    }, [authCtx]);

    return(
        <div className={classes.grid}>
            <nav className={classes.nav}>
                <NavLink to="/events/subscribed" activeClassName={classes.active}>Beigetreten</NavLink>
                <span>|</span>
                <NavLink to="/events/created" activeClassName={classes.active}>Veranstaltet</NavLink>
            </nav>
            <Switch>
                <Route path="/events" exact>
                    <Redirect to="/events/subscribed"/>
                </Route>
                <Route path="/events/subscribed">
                    <SubscribedEvents />
                </Route>
                <Route path="/events/created">
                    <CreatedEvents />
                </Route>
            </Switch>
        </div>
    );
};

export default Events;