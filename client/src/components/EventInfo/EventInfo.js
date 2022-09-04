import React from "react";

import InfoIcon from "../InfoIcon/InfoIcon";

import { faDotCircle, faCalendar, faCoins } from '@fortawesome/free-solid-svg-icons';
import classes from './EventInfo.module.css';


const EventInfo = (props) => {

    return(
        <section className={classes.grid}>
            <h2>{props.title}</h2>
            <InfoIcon
                icon={faDotCircle}
                info={`${props.address}, ${props.zip} ${props.city}`}
             />
             <InfoIcon
                icon={faCalendar}
                info={`${props.date}, ${props.time} Uhr`}
             />
             <InfoIcon
                icon={faCoins}
                info={props.price === 0 ? "Kostenlos" : `${props.price.toFixed(2)} €`}
             />
        </section>
    );
};

export default EventInfo;