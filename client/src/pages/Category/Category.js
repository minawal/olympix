import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import useFetch from "../../hooks/useFetch";

import CardsInputFilter from "../../components/CardsInputFilter/CardsInputFilter";
import EventCard from "../../components/EventCard/EventCard";

import classes from './Category.module.css';


const Category = (props) => {

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [noEvents, setNoEvents] = useState(null);

    const { category } = useParams();

    const { isLoading, error, sendRequest } = useFetch();

    useEffect(() => {
        const requestConfig = {
            url: `http://localhost:4000/api/events/${category}`,
        };

        const dataHandler = (data) => {
            let eventsData = [];
            if (data.length > 0) {
                for(let key in data){
                    const eventData = {
                        category,
                        id: data[key]._id,
                        img: data[key].img,
                        title: data[key].title,
                        city: data[key].city,
                        date: data[key].date,
                        deleted: data[key].deleted
                    };
                    eventsData.push(eventData);
                };
            } else {
                const catCap = category.charAt(0).toUpperCase() + category.slice(1);
                setNoEvents(`Aktuell keine ${catCap}-Events`);
            }

            setEvents(eventsData);
            setFilteredEvents(eventsData);
        };

        sendRequest(requestConfig, dataHandler);

    }, [category, sendRequest]);

    const eventsList = filteredEvents.map(event => (
        <EventCard 
            key={event.id}
            id={event.id}
            category={event.category}
            image={event.img}
            title={event.title}
            city={event.city}
            date={event.date}
            deleted={event.deleted}
        />
    ))

    const filterHandler = (input) => {
        const filteredCities = events.filter(event => {
            const value = input.trim().toLowerCase();
            return value === event.city.toLowerCase().slice(0, value.length);
        });
        setFilteredEvents(filteredCities);
    };

    return(
        <div className={classes.grid}>
            {events.length > 0 && <CardsInputFilter onFilter={filterHandler} length={filteredEvents.length}/>}
            <section>
                {isLoading && <p>Events laden...</p>}
                {noEvents && <p className={classes.error}>{noEvents}</p>}
                {error && <p className={classes.error}>{error}</p>}
            </section>
            <section className={classes.cards}>
                {eventsList}
            </section>
        </div>
    );
};

export default Category;