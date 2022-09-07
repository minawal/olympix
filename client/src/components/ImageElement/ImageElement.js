import React from "react";

import classes from './ImageElement.module.css';


const ImageElement = (props) => {

    return(
        <div className={classes.grid}>
            <img 
                src={props.imgData === "1.png" ? 
                    require(`../../assets/members/${props.imgData}`) :
                    `data:image/png;base64,${props.imgData}`
                } 
                alt={`${props.firstName} ${props.lastName}`}
            />
        </div>
    );
};

export default ImageElement;