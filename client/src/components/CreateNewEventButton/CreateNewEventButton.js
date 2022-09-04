import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import classes from './CreateNewEventButton.module.css';


const CreateNewEventButton = (props) => {

    return(
        <section className={classes.grid}>
            <Link className={classes.link} to={props.link}>
                <FontAwesomeIcon className={classes.icon} icon={faPlusCircle}/>
            </Link>
            <span>Neues Event erstellen</span>
        </section>
    );
};

export default CreateNewEventButton;