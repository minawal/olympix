import React, { useRef, useImperativeHandle } from "react";

import './CardsSelectFilter.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import classes from './CardsSelectFilter.module.css';


const CardsSelectFilter = React.forwardRef((props, ref) => {

    const defaultOptionRef = useRef();

    const showDefaultOption = () => {
        defaultOptionRef.current.selectedIndex = 0;
    };

    useImperativeHandle(ref, () => {
        return {
            defaultOption: showDefaultOption
        };
    });

    const changeHandler = (e) => {
        props.onChange(e.target.value);
    };

    return(
        <div className={classes.grid}>
            <select 
                className={`${classes.select} ${props.className}`}
                name={props.name} 
                defaultValue={props.defaultValue} 
                onChange={changeHandler}
                onBlur={props.onBlur}
                ref={defaultOptionRef}
            >
                <option value="">{props.defaultOption}</option>
                {props.options.map(option => (
                    <option 
                        key={option.value} 
                        value={option.value}
                    >
                        {option.title}
                    </option>
                ))}
            </select>
            <FontAwesomeIcon className={classes.caret} icon={faCaretDown} />
        </div>
    );
});

export default CardsSelectFilter;