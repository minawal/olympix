import React, { useState, useEffect, useContext } from "react";

import AuthContext from "../../context/AuthContext/AuthContext";

import useFetch from "../../hooks/useFetch";

import EventCard from '../EventCard'
import CreateNewEventButton from "../CreateNewEventButton";

import classes from './CreatedEvents.module.css';


const CreatedEvents = (props) => {

    const [createdEvents, setCreatedEvents] = useState(null);
    const [subscribedEvents, setSubscribedEvents] = useState(null);
    const [noEvents, setNoEvents] = useState(false);

    const authCtx = useContext(AuthContext);
    
    const { isLoading, error, sendRequest } = useFetch();

    useEffect(() => {
        sendRequest({url: `https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`},
            data => {
                setCreatedEvents(data.createdEvents);
                setSubscribedEvents(data.subscribedEvents);
                data.createdEvents.length === 0 && setNoEvents(true);
            });
    }, [sendRequest, authCtx]);

    const deleteHandler = (e, eventPath) => {
        e.preventDefault();

        const updatedCreatedEvents = createdEvents.filter(event => event._id !== eventPath.eventId);
        setCreatedEvents(updatedCreatedEvents);
        const updatedSubscribedEvents = subscribedEvents.filter(event => event._id !== eventPath.eventId);
        setSubscribedEvents(updatedSubscribedEvents);
        updatedCreatedEvents.length === 0 && setNoEvents(true);

        sendRequest({
            url:`https://olympixx.herokuapp.com/api/events/${eventPath.eventId}`,
            method: "DELETE"
        },  data => null);
        sendRequest({
            url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`,
            method: "PATCH",
            headers: { "Content-Type": "application/json"},
            body: {
                createdEvents: updatedCreatedEvents
                    .map(event => event._id),
                subscribedEvents: updatedSubscribedEvents
                    .map(event => event._id)
            }
        },  data => null);
    };

    let eventsList;

    if (createdEvents) {
        const eventCards = event => {
            return (
                <EventCard 
                    key={event._id}
                    id={event._id}
                    category={event.category}
                    image={event.img}
                    title={event.title}
                    city={event.city}
                    date={event.date}
                    showOutdated={true}
                    cardBtn={true}
                    onClick={deleteHandler}
                    btn="L??schen"
                    btnStyle="red"
                 />
            );
        };

        if(createdEvents.length > 0) {
            eventsList = createdEvents.map(event => eventCards(event));
        }; 
    };

    return(
        <div className={classes.grid}>
            {error && <p>{error}</p>}
            {!error && 
                <section className={classes.filters}>
                    <CreateNewEventButton link="/create"/>
                </section>
            }
            {(isLoading && !createdEvents) && <p>Events laden...</p>}
            <section className={classes.eventsList}>
                {!noEvents && eventsList}
                {noEvents && <p>Keine eigenen Events</p>}
            </section>
        </div>
    );
};

export default CreatedEvents;