import React from "react";

import classes from './OrganizerCard.module.css';


const OrganizerCard = (props) => {

    const image = props.img ?? "1.png";

    let imgType = typeof(image) === "string" ? "string" : "buffer";

    let imgData = typeof(image) === "string" ? 
        image : 
        btoa(new Uint8Array(image.img.data.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), ''));

    return(
        <section className={classes.grid}>
            <div className={classes.hostImg}>
                <img   
                    src={imgType === "string" ? 
                    require(`../../assets/members/${imgData}`) :
                    `data:image/png;base64,${imgData}`
                    } alt={props.name}
                />
            </div>
            <div className={classes.hostName}>
                <h5>Veranstalter:</h5>
                <span>{props.name}</span>
            </div>
        </section>
    );
};

export default OrganizerCard;