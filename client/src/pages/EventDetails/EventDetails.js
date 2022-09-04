import React, { useEffect, useReducer, useState, useContext } from "react";
import { useParams } from "react-router";

import AuthContext from "../../context/AuthContext/AuthContext";

import useFetch from "../../hooks/useFetch";

import Modal from "../../components/Modal/Modal";
import EventSubscribersList from "../../components/EventSubscribersList";
import EventInfo from "../../components/EventInfo";
import EventSubscribers from "../../components/EventSubscribers/EventSubscribers";
import BigButton from "../../components/BigButton/BigButton";
import OrganizerCard from "../../components/OrganizerCard/OrganizerCard";
import EventImage from "../../components/EventImage/EventImage";

import classes from './EventDetails.module.css';


const defaultState = {
    eventData: null,
    subscribersExcerpt: [],
    furtherAmount: null,
    leftPlacesAmount: null,
    subscriberStop: false,
    organizerName: "",
    isSubscriber: null,
    eventIsDeleted: false,
    eventIsOutdated: false
};

const EventDetails = (props) => {

    const [eventState, dispatchAction] = useReducer(eventReducer, defaultState);

    const [showSubscribers, setShowSubscribers] = useState(false);

    const authCtx = useContext(AuthContext);

    const {category, eventId} = useParams();

    const { isLoading, error, sendRequest } = useFetch();

    
    useEffect(() => { 
        sendRequest({url:`http://localhost:4000/api/events/${category}/${eventId}`},
        data => {dispatchAction({type: "UPDATE_EVENT", data})});

        sendRequest({url:`http://localhost:4000/api/users/${authCtx.user.id}`},
        data => {dispatchAction({type: "UPDATE_MEMBER", data, eventId})});
            
    }, [sendRequest, category, eventId, authCtx]);


    const subscribeHandler = () => {
        sendRequest({url:`http://localhost:4000/api/events/${category}/${eventId}`},
            latestEventData => {

                const underLimit = latestEventData.subscribers.length < latestEventData.limit;
                const notSubscriber = latestEventData.subscribers.every(subscriber => (
                    subscriber._id !== authCtx.user.id
                ));
                
                const eventBodyData = (underLimit && notSubscriber) ?
                    latestEventData.subscribers
                    .map(subscriber => subscriber._id)
                    .concat(authCtx.user.id) : 
                    latestEventData.subscribers.map(subscriber => subscriber._id);

                sendRequest({
                    url:`http://localhost:4000/api/events/${eventId}`,
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: eventBodyData
                },  
                    data => dispatchAction({type: "UPDATE_EVENT", data})
                );

                sendRequest({url:`http://localhost:4000/api/users/events/${authCtx.user.id}`},
                    latestUserData => {

                        const alreadySub = latestUserData.subscribedEvents.some(event => (
                            event === eventId
                        ));

                        const subscriberBodyData = (alreadySub || !underLimit) ?
                            latestUserData.subscribedEvents :
                            latestUserData.subscribedEvents.concat(eventId)

                        sendRequest({
                            url:`http://localhost:4000/api/users/${authCtx.user.id}`,
                            method: "PATCH",
                            headers: {"Content-Type": "application/json"},
                            body: {
                                subscribedEvents: subscriberBodyData
                            }
                        },
                            data => {
                                dispatchAction({type: "ADD_SUBSCRIBER", data, eventId});
                            }
                        );
                    }
                );
            }
        );
    };

    const unsubscribeHandler = () => {
        sendRequest({url:`http://localhost:4000/api/events/${category}/${eventId}`},
            latestEventData => {
                sendRequest({
                        url:`http://localhost:4000/api/events/${eventId}`,
                        method: "PATCH",
                        headers: {"Content-Type": "application/json"},
                        body: latestEventData.subscribers
                                .map(subscriber => subscriber._id)
                                .filter(subscriber => subscriber !== authCtx.user.id)
                    },
                        (data) => dispatchAction({type: "UPDATE_EVENT", data})
                );
            }
        );
        
        sendRequest({url:`http://localhost:4000/api/users/events/${authCtx.user.id}`},
            latestUserData => {
                sendRequest({
                    url:`http://localhost:4000/api/users/${authCtx.user.id}`,
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: {
                        subscribedEvents: latestUserData.subscribedEvents
                            .filter(event => event !== eventId)
                    }
                },
                    (data) => {
                        dispatchAction({type: "REMOVE_SUBSCRIBER", data, eventId});
                    }
                );
            }
        );
    };

    const showSubscribersHandler = () => {
        setShowSubscribers(true);
    };

    const closeModalHandler = () => {
        setShowSubscribers(false);
    };

    return(
        <>
            {
                (isLoading && !eventState.eventData) && 
                <p>Event loading...</p>
            }
            {eventState.eventData && 
            <div className={classes.grid}>
                {showSubscribers &&
                    <Modal 
                        title="Alle Teilnehmer"
                        onCloseModal={closeModalHandler}
                    >
                        <EventSubscribersList subscribers={eventState.eventData.subscribers}/>
                    </Modal>
                }
                <EventImage image={eventState.eventData.img} alt={eventState.eventData.title}/>
                <div className={classes.content}>
                    <EventInfo 
                        title={eventState.eventData.title}
                        address={eventState.eventData.address}
                        zip={eventState.eventData.zip}
                        city={eventState.eventData.city}
                        date={eventState.eventData.date}
                        time={eventState.eventData.time}
                        price={eventState.eventData.price}
                    />
                    <EventSubscribers 
                        subscribers={eventState.subscribersExcerpt}
                        furtherAmount={eventState.furtherAmount}
                        leftPlaces={!eventState.eventIsDeleted && eventState.leftPlacesAmount}
                        onShowSubscribers={showSubscribersHandler}
                    />
                    {error && 
                        <div className={classes.err}>
                            <span>{error}</span>
                        </div>
                    }
                    {
                        (!eventState.isSubscriber && 
                        !eventState.subscriberStop && 
                        !eventState.eventIsDeleted &&
                        !eventState.eventIsOutdated) &&
                        <BigButton 
                            onClick={subscribeHandler}
                            >Beitreten
                        </BigButton>
                    }
                    {
                        (eventState.isSubscriber &&
                        !eventState.eventIsDeleted &&
                        !eventState.eventIsOutdated) &&
                        <BigButton 
                            className={classes.redBtn}
                            onClick={unsubscribeHandler}
                            >Austreten
                        </BigButton>
                    }
                    {
                        (!eventState.isSubscriber && 
                        eventState.subscriberStop && 
                        !eventState.eventIsDeleted &&
                        !eventState.eventIsOutdated) &&
                        <BigButton 
                            className={classes.disabledBtn}
                            disabled={true}
                            >Event ist voll
                        </BigButton>
                    }
                    {
                        (!eventState.eventIsDeleted &&
                        eventState.eventIsOutdated) &&
                        <BigButton 
                            className={classes.redBtn}
                            >Abgelaufen
                        </BigButton>
                    }
                    {
                        eventState.eventIsDeleted &&
                        <BigButton 
                            className={classes.redBtn}
                            >Event wurde gelöscht
                        </BigButton>
                    }
                    <div className={classes.description}>
                        <h4>Beschreibung</h4>
                        <p className={classes.description}>{eventState.eventData.text}</p>
                    </div>
                    {
                        eventState.organizerName &&
                        <OrganizerCard 
                            img={eventState.eventData.host.img}
                            name={eventState.organizerName}
                        />
                    }
                </div>
            </div>}
        </>
    );
};

function eventReducer(state, action) {

    let eventData = action.data;

    switch (action.type) {
        case "UPDATE_EVENT": 

        let subscribersExcerpt;
        if(eventData.subscribers.length > 0) {
            const shortenData = eventData.subscribers.slice(-5);

            subscribersExcerpt = shortenData.map(subscriber => {

                subscriber.img = subscriber.img ?? "1.png";

                let imgType = typeof(subscriber.img) === "string" ? "string" : "buffer";
    
                let imgData = imgType === "string" ? 
                    subscriber.img : 
                    btoa(new Uint8Array(subscriber.img.img.data.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), ''));

                return(
                    <div key={subscriber._id} className={classes.subscriberImageWrapper}>
                        <img 
                            className={classes.subscriberImage} 
                            src={imgType === "string" ? 
                                require(`../../assets/members/${imgData}`) :
                                `data:image/png;base64,${imgData}`
                            } 
                            alt={`${subscriber.firstName} ${subscriber.lastName}`}
                        />
                    </div>
                );
            });   
            
        } else {
            subscribersExcerpt = [];
        };

        let furtherAmount;
        if(eventData.subscribers.length > 5) {
            furtherAmount = `+${eventData.subscribers.length - 5}`;
        } else {
            furtherAmount = null;
        };

        let leftPlacesAmount;
        if(typeof(eventData.limit) === "number"){
            leftPlacesAmount = eventData.limit - eventData.subscribers.length;
        } else {
            leftPlacesAmount = null;
        };

        let subscriberStop;
        if(typeof(eventData.limit) === "string") {
            subscriberStop = false;
        } else if (eventData.subscribers.length < eventData.limit){
            subscriberStop = false;
        } else {
            subscriberStop = true;
        };

        let eventIsDeleted;
        if(eventData.deleted || !eventData.host) {
            eventIsDeleted = true;
        } else {
            eventIsDeleted = false;
        };

        const split = eventData.date.split(".");
        const convertedEventDate = `${split[1]}/${split[0]}/${split[2]}`;
        const date = new Date();
        const convertedtDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
        const outdated = new Date(convertedtDate) > new Date(convertedEventDate);
        let eventIsOutdated;
        if(outdated) {
            eventIsOutdated = true;
        } else {
            eventIsOutdated = false;
        };

        let organizerName = eventData.host ? `${eventData.host.firstName} ${eventData.host.lastName}` : "";

            return {
                ...state,
                eventData,
                subscribersExcerpt,
                furtherAmount,
                leftPlacesAmount,
                organizerName,
                subscriberStop,
                eventIsDeleted,
                eventIsOutdated
            };
            
        case "UPDATE_MEMBER":

            return {
                ...state,
                isSubscriber: (
                    eventData.subscribedEvents.some(event => 
                        event._id === action.eventId
                    ) ? true : false
                )
            };

        case "ADD_SUBSCRIBER":

            return {
                ...state,
                isSubscriber: (
                    eventData.subscribedEvents.some(event => 
                        event._id === action.eventId
                    ) ? true : false
                )
            };
        
        case "REMOVE_SUBSCRIBER":

            return {
                ...state,
                isSubscriber: (
                    eventData.subscribedEvents.some(event => 
                        event._id === action.eventId
                    ) ? true : false
                )
            };

        default:
            return defaultState;
    }
};

export default EventDetails;