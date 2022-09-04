import React, { useState, useEffect, useContext } from "react";

import { useHistory, useLocation } from "react-router";

import EventCard from '../EventCard'
import CardsSelectFilter from "../CardsSelectFilter";
import DataContext from "../../context/DataContext/DataContext";
import AuthContext from "../../context/AuthContext/AuthContext";

import useFetch from "../../hooks/useFetch";

import classes from './SubscribedEvents.module.css';


const SubscribedEvents = (props) => {

    const [subscribedEvents, setSubscribedEvents] = useState(null);
    const [filteredSport, setFilteredSport] = useState(null);
    const [noEvents, setNoEvents] = useState(false);
    
    const { error, sendRequest } = useFetch();

    const dataCtx = useContext(DataContext);
    const authCtx = useContext(AuthContext);

    const history = useHistory();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const sortingOrder = queryParams.get("sort"); 

    useEffect(() => {

        sendRequest({url: `http://localhost:4000/api/users/${authCtx.user.id}`},
        data => {
            setSubscribedEvents(data.subscribedEvents);
            data.subscribedEvents.length === 0 && setNoEvents(true);
        });

    }, [sendRequest, authCtx]);

    const sortByDateHandler = (value) => {
        if(value === "") {
            history.push(location.pathname);
            !filteredSport && (
                sendRequest({url: `http://localhost:4000/api/users/${authCtx.user.id}`},
                data => {
                    setSubscribedEvents(data.subscribedEvents);
                    data.subscribedEvents.length === 0 && setNoEvents(true);
                })
            );
        } else {
            history.push(`${location.pathname}?sort=${value}`);
        }
    };

    const filterSportHandler = (value) => {
        setFilteredSport(value);
    };

    const unsubscribeHandler = (e, eventPath) => {
        e.preventDefault();
        sendRequest({
            url:`http://localhost:4000/api/events/${eventPath.category}/${eventPath.eventId}`,
        },
            data => {
                sendRequest({
                    url:`http://localhost:4000/api/events/${eventPath.eventId}`,
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: data.subscribers
                            .map(subscriber => subscriber._id)
                            .filter(subscriber => subscriber !== authCtx.user.id)
                },
                    data => null
                );
            }
        );
        sendRequest({
            url: `http://localhost:4000/api/users/events/${authCtx.user.id}`
        },
            data => {
                sendRequest({
                    url:`http://localhost:4000/api/users/${authCtx.user.id}`,
                    method: "PATCH",
                    headers: { "Content-Type": "application/json"},
                    body: {
                        subscribedEvents: data.subscribedEvents
                            .filter(event => event !== eventPath.eventId),
                        createdEvents: data.createdEvents
                    }
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
                    deleted={event.deleted}
                    cardBtn={true}
                    onClick={unsubscribeHandler}
                    btn={"Austreten"}
                 />
            );
        };

        const dateTimestamp = (date) => {
            const splittedDate = date.split(".");
            const day = splittedDate[0];
            const month = splittedDate[1];
            const year = splittedDate[2];

            return new Date(year, month, day).getTime();
        };

        if(filteredEventsCount > 0 && !sortingOrder) {
            eventsList = filteredEvents.map(event => eventCards(event));
        } else if(filteredEventsCount > 0 && sortingOrder === "asc") {
            eventsList = filteredEvents.sort((eventA, eventB) => {

                if(dateTimestamp(eventA.date) > dateTimestamp(eventB.date)) {
                    return 1;
                } else if(dateTimestamp(eventA.date) < dateTimestamp(eventB.date)) {
                    return -1;
                } else {
                    return 0;
                }
            }).map(event => eventCards(event));
        } else if(filteredEventsCount > 0 && sortingOrder === "dsc") {
            eventsList = filteredEvents.sort((eventA, eventB) => {
                if(dateTimestamp(eventA.date) > dateTimestamp(eventB.date)) {
                    return -1;
                } else if(dateTimestamp(eventA.date) < dateTimestamp(eventB.date)) {
                    return 1;
                } else {
                    return 0;
                }
            }).map(event => eventCards(event));
        } else if(filteredEventsCount === 0) {
            eventsList = filteredSport && 
                <p>Keine {filteredSport.charAt(0).toUpperCase() + filteredSport.slice(1)}-Events</p>
        }
    };

    const sortOptions = [
        {
            title: "Chronologisch",
            value: "asc"
        },
        {
            title: "Antichronologisch",
            value: "dsc",
        }
    ];

    const filterOptions = dataCtx.sports.map(sport => {
        return {
            title: sport.name, 
            value: sport.link
        }
    });

    return(
        <div className={classes.grid}>
            {error && <p>{error}</p>}
            {subscribedEvents && !noEvents && !error && 
                <section className={classes.filters}>
                    <CardsSelectFilter 
                        onChange={sortByDateHandler}
                        name="SortByDate"
                        defaultOption="Sortieren"
                        defaultValue={sortingOrder ? sortingOrder : ""}
                        options={sortOptions}
                    />
                    <CardsSelectFilter 
                        onChange={filterSportHandler}
                        name="filterSport"
                        defaultOption="Filtern"
                        defaultValue={filteredSport}
                        options={filterOptions}
                    />
                    <div className={classes.eventsCounter}>
                        {filteredEventsCount === 1 ? 
                            <span><b>{filteredEventsCount}</b> Teilnahme</span> :
                        filteredEventsCount > 1 && 
                            <span><b>{filteredEventsCount}</b> Teilnahmen</span> 
                        }
                    </div>
                </section>
            }
            <section className={classes.eventsList}>
                {!noEvents && eventsList}
                {noEvents && <p>Keine Teilnahmen an Events</p>}
            </section>
        </div>
    );
};

export default SubscribedEvents;