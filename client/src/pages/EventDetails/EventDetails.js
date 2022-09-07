import React, { useEffect, useReducer, useState, useContext } from "react";
import { useParams } from "react-router";

import AuthContext from "../../context/AuthContext/AuthContext";
import UserContext from "../../context/UserContext/UserContext";
import DataContext from "../../context/DataContext/DataContext";

import useFetch from "../../hooks/useFetch";

import Modal from "../../components/Modal/Modal";
import EventSubscribersList from "../../components/EventSubscribersList";
import EventInfo from "../../components/EventInfo";
import EventSubscribers from "../../components/EventSubscribers/EventSubscribers";
import BigButton from "../../components/BigButton/BigButton";
import OrganizerCard from "../../components/OrganizerCard/OrganizerCard";
import EventImage from "../../components/EventImage/EventImage";
import ImageElement from "../../components/ImageElement/ImageElement";

import classes from './EventDetails.module.css';


const defaultState = {
    eventData: null,
    eventSubscribers: [],
    subscribedEvents: [],
    subscriberImages: [],
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
    const [disabledBtn, setDisabledBtn] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false);

    const authCtx = useContext(AuthContext);
    const userCtx = useContext(UserContext);
    const dataCtx = useContext(DataContext);

    const {category, eventId} = useParams();

    const { isLoading, error, sendRequest } = useFetch();

    
    useEffect(() => { 

        const asyncFetch = async() => {

            authCtx.checkAuth();

            await sendRequest({url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`},
            data => {dispatchAction({type: "INITILIZE_MEMBER", data, eventId})});

            await sendRequest({url:`https://olympixx.herokuapp.com/api/events/${category}/${eventId}`},
            data => {dispatchAction({type: "INITILIZE_EVENT", data})});

            setDataLoaded(true);
        }

        asyncFetch();
            
    }, [sendRequest, category, eventId, authCtx.user, authCtx.checkAuth]);

    useEffect(() => {
        dataCtx.activeInfo && closeModalHandler();
    }, [dataCtx.activeInfo]);
    
    const subscribeHandler = () => {

        setDisabledBtn(true);

        const data = {
            user: userCtx.user,
            eventSubscribers: eventState.eventSubscribers,
            subscribedEvents: eventState.subscribedEvents,
            subscribersExcerpt: eventState.subscribersExcerpt,
            eventId: eventId,
            limit: eventState.eventData.limit,
            type: "subscribe"
        };

        dispatchAction({type: "UPDATE_EVENT", data});
        dispatchAction({type: "ADD_SUBSCRIBER"});

        sendRequest({
            url:`https://olympixx.herokuapp.com/api/events/${eventId}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: eventState.eventSubscribers.concat(authCtx.user.id)
        },  data => {
                dispatchAction({type: "UPDATE_EVENTDATA", data});
                setDisabledBtn(false);
            }
        );
        sendRequest({
            url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: {
                subscribedEvents: eventState.subscribedEvents.concat(eventId)
            }
        },  data => null);
                
    };

    const unsubscribeHandler = () => {

        setDisabledBtn(true);

        const data = {
            user: userCtx.user,
            eventSubscribers: eventState.eventSubscribers,
            subscribedEvents: eventState.subscribedEvents,
            subscriberImages: eventState.subscriberImages,
            subscribersExcerpt: eventState.subscribersExcerpt,
            eventId: eventId,
            limit: eventState.eventData.limit,
            type: "unsubscribe"
        };

        dispatchAction({type: "UPDATE_EVENT", data});
        dispatchAction({type: "REMOVE_SUBSCRIBER"});
        
        sendRequest({
            url:`https://olympixx.herokuapp.com/api/events/${eventId}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: eventState.eventSubscribers
                    .filter(subscriber => subscriber !== authCtx.user.id)
        },  data => { 
                dispatchAction({type: "UPDATE_EVENTDATA", data});
                setDisabledBtn(false);
            }
        );
        
        sendRequest({
            url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`,
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: {
                subscribedEvents: eventState.subscribedEvents
                    .filter(event => event !== eventId)
            }
        },  (data) => null);
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
                (isLoading && !dataLoaded) && 
                <p>Event lädt...</p>
            }
            {dataLoaded && 
            <div className={classes.grid}>
                {(showSubscribers && !dataCtx.activeInfo) &&
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
                        subscribers={eventState.subscribersExcerpt
                            .map(subscriber => subscriber.element)
                        }
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
                            disabled={disabledBtn}
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
                            disabled={disabledBtn}
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
        case "INITILIZE_EVENT": {

            let eventSubscribers = eventData.subscribers.map(subscriber => (
                subscriber._id
            ));

            let subscriberImages;
            let subscribersExcerpt;
            if(eventData.subscribers.length > 0) {

                subscriberImages = eventData.subscribers.map(subscriber => {

                    subscriber.img = subscriber.img ?? "1.png";
        
                    let imgData = subscriber.img === "1.png" ? 
                        subscriber.img : 
                        btoa(new Uint8Array(subscriber.img.img.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), ''));

                    return(
                        {
                            id: subscriber._id,
                            element: (
                               <ImageElement 
                                    key={subscriber._id}
                                    imgData={imgData}
                                    firstName={subscriber.firstName}
                                    lastName={subscriber.lastName}
                                />
                            )
                        }
                    );
                });
                
                subscribersExcerpt = subscriberImages.length > 5 ? 
                    subscriberImages.slice(-5) : subscriberImages;
                
            } else {
                subscriberImages = [];
                subscribersExcerpt = [];
            };

            let furtherAmount;
            if(eventSubscribers.length > 5) {
                furtherAmount = `+${eventSubscribers.length - 5}`;
            } else {
                furtherAmount = null;
            };

            let leftPlacesAmount;
            if(typeof(eventData.limit) === "number"){
                leftPlacesAmount = eventData.limit - eventSubscribers.length;
            } else {
                leftPlacesAmount = null;
            };

            let subscriberStop;
            if(typeof(eventData.limit) === "string") {
                subscriberStop = false;
            } else if (eventSubscribers.length < eventData.limit){
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
                    eventSubscribers,
                    subscriberImages,
                    subscribersExcerpt,
                    furtherAmount,
                    leftPlacesAmount,
                    organizerName,
                    subscriberStop,
                    eventIsDeleted,
                    eventIsOutdated
                };
                
            };
            
            case "INITILIZE_MEMBER":
    
                return {
                    ...state,
                    subscribedEvents: eventData.subscribedEvents.map(event => event._id),
                    isSubscriber: (
                        eventData.subscribedEvents.some(event => 
                            event._id === action.eventId
                        ) ? true : false
                    )
                };

            case "UPDATE_EVENT": {

            let eventSubscribers;
            if(eventData.type === "subscribe") {
                eventSubscribers = eventData.eventSubscribers
                    .concat(eventData.user.id);
            } else if(eventData.type === "unsubscribe") {
                eventSubscribers = eventData.eventSubscribers
                    .filter(subscriber => subscriber !== eventData.user.id);
            };

            let subscribedEvents;
            if(eventData.type === "subscribe") {
                subscribedEvents = eventData.subscribedEvents
                    .concat(eventData.eventId);
            } else if(eventData.type === "unsubscribe") {
                subscribedEvents = eventData.subscribedEvents
                    .filter(event => event !== eventData.eventId);
            };

            let subscribersExcerpt;
            if(eventData.type === "subscribe") {
                const imgData = eventData.user.img;

                const currentUser = {
                    id: eventData.user.id,
                    element: (
                        <ImageElement 
                            key={eventData.user.id}
                            imgData={imgData}
                            firstName={eventData.user.firstName}
                            lastName={eventData.user.lastName}
                        />
                    )
                };

                subscribersExcerpt = [...eventData.subscribersExcerpt, currentUser];

            } else if(eventData.type === "unsubscribe" && 
            eventData.subscribersExcerpt.some(user => user.id === eventData.user.id)) {
                
                subscribersExcerpt = eventData.subscribersExcerpt
                    .filter(user => user.id !== eventData.user.id)
            };

            if(eventData.type === "subscribe" && eventSubscribers.length > 5) {
                subscribersExcerpt = subscribersExcerpt.slice(-5);
            };

            if(eventData.type === "unsubscribe" && eventSubscribers.length >= 5) {
                subscribersExcerpt = eventData.subscriberImages
                    .filter(subscriber => subscriber.id !== eventData.user.id)
                    .slice(-5);
            };

            let furtherAmount;
            if(eventSubscribers.length > 5) {
                furtherAmount = `+${eventSubscribers.length - 5}`;
            } else {
                furtherAmount = null;
            };

            let leftPlacesAmount;
            if(typeof(eventData.limit) === "number"){
                leftPlacesAmount = eventData.limit - eventSubscribers.length;
            } else {
                leftPlacesAmount = null;
            };

            let subscriberStop;
            if(typeof(eventData.limit) === "string") {
                subscriberStop = false;
            } else if (eventSubscribers.length < eventData.limit){
                subscriberStop = false;
            } else {
                subscriberStop = true;
            };

            return {
                ...state,
                eventSubscribers,
                subscribedEvents,
                subscribersExcerpt,
                furtherAmount,
                leftPlacesAmount,
                subscriberStop
            };

        }; 
            
        case "ADD_SUBSCRIBER":

            return {
                ...state,
                isSubscriber: true
            };
        
        case "REMOVE_SUBSCRIBER":

            return {
                ...state,
                isSubscriber: false
            };

        case "UPDATE_EVENTDATA":
            return {
                ...state,
                eventData
            };

        default:
            return defaultState;
    }
};

export default EventDetails;