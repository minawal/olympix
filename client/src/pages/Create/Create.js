import React, { useState, useEffect, useContext } from "react";
import { Prompt, useHistory } from "react-router";

import AuthContext from "../../context/AuthContext/AuthContext";

import useFetch from "../../hooks/useFetch";

import CreateForm from "../../components/CreateForm/CreateForm";

import classes from './Create.module.css';


const Create = (props) => {

    const [formIsFocused, setFormIsFocused] = useState(false);

    const authCtx = useContext(AuthContext);

    const history = useHistory();

    const { error, sendRequest } = useFetch();

    useEffect(() => {
        authCtx.checkAuth();
    }, [authCtx]);

    const focusHandler = () => {
        setFormIsFocused(true);
    };

    const blurHandler = () => {
        setFormIsFocused(false);
    };

    const creatEventHandler = (eventData) => {

        blurHandler();

        const newEventData = {
            ...eventData,
            host: authCtx.user.id,
            subscribers: [authCtx.user.id]
        };

        sendRequest({
            url:`https://olympixx.herokuapp.com/api/events`,
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: newEventData
        },
            newEvent => {
                sendRequest({url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`},
                    data => {
                        sendRequest({
                            url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`,
                            method: "PATCH",
                            headers: { "Content-Type": "application/json"},
                            body: {
                                subscribedEvents: data.subscribedEvents.concat(newEvent._id),
                                createdEvents: data.createdEvents.concat(newEvent._id)
                            }
                        },
                            async (data) => {
                                history.push("/events/created")
                            }
                        );
                    }
                );
            }
        );

    };


    return(
        <div className={classes.grid}>
            <Prompt when={formIsFocused} message={() => 
                "Bist du dir sicher? Bei Verlassen des Formulars gehen deine Eingaben verloren."
            }/>
            <h1>Erstelle ein neues Event</h1>
            {error && <p>Event kann grade nicht erstellt werden</p>}
            <CreateForm 
                onCreateEvent={creatEventHandler}
                onFocus={focusHandler}
                btnClick={blurHandler}
            />
        </div>
    );
};

export default Create;