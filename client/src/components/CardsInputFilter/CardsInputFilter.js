import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import classes from './CardsInputFilter.module.css';


const CardsInputFilter = (props) => {

    const changeHandler = e => {
        props.onFilter(e.target.value);
    };

    return(
        <section className={classes.inputWrapper}>
            <input 
                className={classes.input} 
                type="text" 
                placeholder="Städte filtern" 
                onChange={changeHandler}
            />
            <FontAwesomeIcon className={classes.searchIcon} icon={faSearch}/>
            <p className={classes.amount}>
                {props.length > 0 ? <span>{props.length} </span> : "Kein "}
                {`${props.length > 1 ? "Events" : "Event"} gefunden`}
            </p>
        </section>
    );
};

export default CardsInputFilter;