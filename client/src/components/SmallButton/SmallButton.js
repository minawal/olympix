import React from "react";

import classes from './SmallButton.module.css';


const SmallButton = (props) => {

    return(
        <button 
            className={`${classes.button} ${props.className}`}
            style={{backgroundColor: props.btnStyle, ...props.style}}
            type={props.type || "button"}
            onClick={props.onClick}
            disabled={props.disabled || false}
        >{props.children}
        </button>
    );
};

export default SmallButton;