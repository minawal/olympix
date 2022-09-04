import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import classes from './EventSubscribersExcerpt.module.css';


const EventSubscribersExcerpt = (props) => {

    return(
        <div className={classes.grid} onClick={props.onShowSubscribers}>
            {props.subscribers}
            {props.furtherAmount && <span>{props.furtherAmount}</span>}
            <FontAwesomeIcon className={classes.caret} icon={faCaretRight} />
        </div>
    );
};

export default EventSubscribersExcerpt;