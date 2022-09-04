import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import classes from './EditIcon.module.css';


const EditIcon = (props) => {

    return(
        <div className={classes.grid}>
            <label htmlFor={props.htmlFor}>{props.title}</label>
            {!props.editable && !props.isGuest && 
                <FontAwesomeIcon 
                    icon={faEdit} 
                    className={classes.icon}
                    onClick={() => props.onClick()}
                />
            }
        </div>
    );
};

export default EditIcon;