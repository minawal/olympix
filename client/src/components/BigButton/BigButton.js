import React from "react";

import classes from './BigButton.module.css';


const BigButton = (props) => {

    return(
        <button 
            className={`${classes.button} ${props.className}`}
            style={{...props.style}}
            type={props.type || "button"}
            onClick={props.onClick}
            disabled={props.disabled || false}
        >
            {props.children}
        </button>
    );
};

export default BigButton;