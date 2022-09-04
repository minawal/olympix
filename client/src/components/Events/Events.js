import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";

import DataContext from "../../context/DataContext/DataContext";

import useFetch from "../../hooks/useFetch";

import EventCard from '../EventCard'
import CardsSelectFilter from "../CardsSelectFilter";

import classes from './Events.module.css';


const Events = (props) => {

    const [subscribedEvents, setSubscribedEvents] = useState(null);
    const [filteredSport, setFilteredSport] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [noEvents, setNoEvents] = useState(false);
    
    const { isLoading, error, sendRequest } = useFetch();

    const ctx = useContext(DataContext);
    const history = useHistory();
    const location = useLocation();
    const match = useRouteMatch();

    const queryParams = new URLSearchParams(location.search);

    const sortingOrder = queryParams.get("sort"); 

    useEffect(() => {

        sendRequest({url: `http://localhost:3500/members/1`},
        data => {
            setSubscribedEvents(data.subscribedEvents);
            setCurrentUser({id: data.id});
            data.subscribedEvents.length === 0 && setNoEvents(true);
        });
            
    }, [sendRequest, filteredSport]);

    const sortByDateHandler = (value) => {
        if(value === "") {
            history.push(match.path);
        } else {
            history.push(`${match.path}/quotes?sort=${value}`);
        }
    };

    const filterSportHandler = (value) => {
        setFilteredSport(value);
    };

    const unsubscribeHandler = (e, eventPath) => {
        e.preventDefault();
        sendRequest({
            url:`http://localhost:3500/${eventPath.category}/${eventPath.eventId}`,
        },
            (data) => {
                sendRequest({
                    url:`http://localhost:3500/${eventPath.category}/${eventPath.eventId}`,
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: {subscribers: data.subscribers.filter(
                        subscriber => subscriber.id !== currentUser.id
                    )}
                },
                    data => null
                );
            }
        );
        sendRequest({
            url: `http://localhost:3500/members/1`
        },
            data => {
                sendRequest({
                    url:`http://localhost:3500/members/1`,
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: {subscribedEvents: data.subscribedEvents.filter(
                        event => event.id !== `${eventPath.category}+${eventPath.eventId}`
                    )}
                },
                    data => {
                        setSubscribedEvents(data.subscribedEvents);
                        data.subscribedEvents.length === 0 && setNoEvents(true);
                    }
            );
        });
    };

    let eventsList;
    let filteredEventsCount;

    if (subscribedEvents) {

        const filteredEvents = filteredSport ? 
        subscribedEvents.filter(event => event.category === filteredSport) : 
        subscribedEvents;

        filteredEventsCount = filteredEvents.length;

        const eventCards = event => {

            const eventId = +(event.id.split("+")[1]);
            
            return (
                <EventCard 
                    key={event.id}
                    id={eventId}
                    category={event.category}
                    image={event.img}
                    title={event.title}
                    city={event.city}
                    date={event.date}
                    cardBtn={true}
                    onUnsubscribe={unsubscribeHandler}
                 />)
        };

        const dateTimestamp = (date) => {
            const splittedDate = date.split(".");
            const day = splittedDate[0];
            const month = splittedDate[1];
            const year = splittedDate[2];

            return new Date(year, month, day).getTime();
        };

        if(filteredEvents.length > 0 && !sortingOrder) {
            eventsList = filteredEvents.map(event => eventCards(event));
        } else if(filteredEvents.length > 0 && sortingOrder === "asc") {
            eventsList = filteredEvents.sort((eventA, eventB) => {

                if(dateTimestamp(eventA.date) > dateTimestamp(eventB.date)) {
                    return 1;
                } else if(dateTimestamp(eventA.date) < dateTimestamp(eventB.date)) {
                    return -1;
                } else {
                    return 0;
                }
            }).map(event => eventCards(event));
        } else if(filteredEvents.length > 0 && sortingOrder === "dsc") {
            eventsList = filteredEvents.sort((eventA, eventB) => {
                if(dateTimestamp(eventA.date) > dateTimestamp(eventB.date)) {
                    return -1;
                } else if(dateTimestamp(eventA.date) < dateTimestamp(eventB.date)) {
                    return 1;
                } else {
                    return 0;
                }
            }).map(event => eventCards(event));
        } else if(filteredEvents.length === 0) {
            eventsList = <p>No subscribed {filteredSport} event.</p>
        }
    };

    const sortOptions = [
        {
            title: "Ascending Date",
            value: "asc"
        },
        {
            title: "Descending Date",
            value: "dsc",
        }
    ];

    const filterOptions = ctx.sports.map(sport => {
        return {
            title: sport.name, 
            value: sport.link
        }
    });

    return(
        <div className={classes.grid}>
            {isLoading && <p>Events Loading...</p>}
            {error && <p>{error}</p>}
            {!noEvents && !isLoading && 
            <section className={classes.filters}>
                <CardsSelectFilter 
                    onChange={sortByDateHandler}
                    name="SortByDate"
                    defaultOption="Sort by"
                    defaultValue={sortingOrder ? sortingOrder : ""}
                    options={sortOptions}
                />
                <CardsSelectFilter 
                    onChange={filterSportHandler}
                    name="filterSport"
                    defaultOption="Filter sport"
                    defaultValue={filteredSport}
                    options={filterOptions}
                />
                <div className={classes.eventsCounter}>
                    {filteredEventsCount === 1 ? 
                        <span><b>{filteredEventsCount}</b> subscribed event</span> :
                    filteredEventsCount > 1 && 
                        <span><b>{filteredEventsCount}</b> subscribed events</span> 
                    }
                </div>
            </section>}
            <section className={classes.eventsList}>
                {!noEvents && eventsList}
                {noEvents && <p>No subscribed events yet.</p>}
            </section>
        </div>
    );
};

export default Events;