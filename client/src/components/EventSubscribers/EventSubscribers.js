import React from "react";

import EventSubscribersExcerpt from "../EventSubscribersExcerpt/EventSubscribersExcerpt";

import classes from './EventSubscribers.module.css';


const EventSubscribers = (props) => {

    let leftPlaces;

    if(props.leftPlaces === 0) {
        leftPlaces = <p>Keine Plätze mehr frei</p>;
    } else if(props.leftPlaces === 1) {
        leftPlaces = <p><b>{props.leftPlaces}</b> Platz frei</p>;
    } else if(props.leftPlaces > 1) {
        leftPlaces = <p><b>{props.leftPlaces}</b> Plätze frei</p>;
    };

    return(
        <section className={classes.grid}>
            <h3>Teilnehmer</h3>
            <EventSubscribersExcerpt 
                subscribers={props.subscribers}
                furtherAmount={props.furtherAmount}
                onShowSubscribers={props.onShowSubscribers}
            />
            {leftPlaces}
        </section>
    );
};

export default EventSubscribers;