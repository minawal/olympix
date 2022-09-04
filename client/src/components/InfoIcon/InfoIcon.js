import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './InfoIcon.module.css';


const InfoIcon = (props) => {

    return(
        <div className={classes.grid}>
            <FontAwesomeIcon icon={props.icon} />
            <span>{props.info}</span>
        </div>
    );
};

export default InfoIcon;