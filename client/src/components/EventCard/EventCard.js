import React from "react";

import { Link } from "react-router-dom";

import classes from './EventCard.module.css';


const EventCard = (props) => {

    const clickHandler = (event) => {
        props.onClick(event, {category: props.category, eventId: props.id})
    };

    const split = props.date.split(".");
    const convertedEventDate = `${split[1]}/${split[0]}/${split[2]}`;
    const date = new Date();
    const convertedtDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    const outdatedCheck = new Date(convertedtDate) > new Date(convertedEventDate);
    const outdated = props.showOutdated && outdatedCheck;

    return(
        <Link to={`../sports/${props.category}/${props.id}`} className={classes.grid}>
            <div>
                <img 
                    src={require(`../../assets/images/${props.image}`)} 
                    alt={`${props.category}event-bild`}
                />
            </div>
            <div className={classes.content}>
                <h3>{props.title}</h3>
                <div>
                    {
                        !props.deleted && !outdated ?
                            <div>
                                <span>{props.city}</span>
                                <span>{props.date}</span>
                            </div> 
                            :
                        props.deleted ?
                            <span className={classes.deletedText}>Gelöscht</span> :
                        outdated &&
                            <span className={classes.deletedText}>Abgelaufen</span>
                    }
                    {props.cardBtn && 
                        <button 
                            style={{backgroundColor: props.btnStyle}} 
                            onClick={clickHandler}
                        >
                            {
                                props.btn === "Löschen" ?
                                props.btn :
                                props.deleted || outdated ? "Entfernen" : 
                                props.btn 
                            }
                        </button>
                    }
                </div>
            </div>
        </Link>
    );
};

export default EventCard;