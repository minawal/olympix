import React from "react";

import classes from './EventSubscribersList.module.css';


const EventSubscribersList = (props) => {

    const subscribersList = props.subscribers.length > 0 ? 

        props.subscribers.map(subscriber => {

            subscriber.img = subscriber.img ?? "1.png";

            let imgType = typeof(subscriber.img) === "string" ? "string" : "buffer";

            let imgData = imgType === "string" ? 
                subscriber.img : 
                btoa(new Uint8Array(subscriber.img.img.data.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), ''));

            return (
                <div key={subscriber._id}>
                    <div className={classes.imgWrapper}>
                        <img 
                            className={classes.img}
                            src={imgType === "string" ? 
                                require(`../../assets/members/${imgData}`) :
                                `data:image/png;base64,${imgData}`
                            } 
                            alt={`${subscriber.firstName} ${subscriber.lastName}`}
                        />
                    </div>
                    <span className={classes.subscriberName}>
                        {`${subscriber.firstName} ${subscriber.lastName}`}
                    </span>
                </div>
            )
        }) : 
        <span className={classes.subscriberName}>Noch keine Teilnehmer.</span>

    return(
        <section className={classes.grid}>
            {subscribersList}
        </section>
    );
};

export default EventSubscribersList;