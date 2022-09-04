import React from "react";

import classes from './EventImage.module.css';


const EventImage = (props) => {

    return(
        <img 
            className={classes.image} src={require(`../../assets/images/${props.image}`)} 
            alt={`${props.alt} Bild`}
        />
    );
};

export default React.memo(EventImage);