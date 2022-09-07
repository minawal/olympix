import React, { useContext, useRef } from "react";

import DataContext from "../../context/DataContext/DataContext";

import useInput from "../../hooks/useInput";

import BigButton from "../BigButton/BigButton";
import CardsSelectFilter from "../CardsSelectFilter/CardsSelectFilter";

import classes from './CreateForm.module.css';


const CreateForm = (props) => {
    
    const categoryRef = useRef();
    const titleRef = useRef();
    const addressRef = useRef();
    const zipRef = useRef();
    const cityRef = useRef();
    const dateRef = useRef();
    const timeRef = useRef();
    const feeRef = useRef();
    const maxRef = useRef();
    const descriptionRef = useRef();


    const ctx =  useContext(DataContext);

    const sportCategories = ctx.sports.map(sport => {
        return {
            value: sport.link,
            title: sport.name
        }
    });


    const validateCategory = (value) => value !== "" && value !== "Select category";
    const validateTitle = (value) => value.trim().length > 1 && value.length <= 30;
    const validateAddress = (value) => value.trim().match(/[a-zA-ZäöüÄÖÜß .]+ [0-9]+[a-zA-Z]?/);
    const validateZip = (value) => value.trim().match(/\b\d{5}\b/g);
    const validateCity = (value) => value.trim().match(/^[a-zA-ZäöüÄÖÜß ',.\s-]{2,}$/);
    const validateDate = (value) => {
        return new Date((new Date().getUTCFullYear()) + "/" + 
        (new Date().getMonth() + 1)+ "/" + 
        (new Date().getUTCDate())) <= new Date(value)
    };
    const validateTime = (value) => value.trim() !== "";
    const validateFee = (value) => value !== "" && value >= 0;
    const validateMax = (value) => value > 1;
    const validateDescription = (value) => value.trim().length >= 0;


    const {
        enteredValue: categoryValue,
        valueIsValid: categoryIsValid,
        inputHasError: categoryHasError,
        changeValueHandler: changeCategoryHandler,
        touchedHandler: categoryTouchedHandler
    } = useInput(validateCategory);

    const {
        enteredValue: titleValue,
        valueIsValid: titleIsValid,
        inputHasError: titleHasError,
        changeValueHandler: changeTitleHandler,
        touchedHandler: titleTouchedHandler
    } = useInput(validateTitle);

    const {
        enteredValue: addressValue,
        valueIsValid: addressIsValid,
        inputHasError: addressHasError,
        changeValueHandler: changeAddressHandler,
        touchedHandler: addressTouchedHandler
    } = useInput(validateAddress);

    const {
        enteredValue: zipValue,
        valueIsValid: zipIsValid,
        inputHasError: zipHasError,
        changeValueHandler: changeZipHandler,
        touchedHandler: zipTouchedHandler
    } = useInput(validateZip);

    const {
        enteredValue: cityValue,
        valueIsValid: cityIsValid,
        inputHasError: cityHasError,
        changeValueHandler: changeCityHandler,
        touchedHandler: cityTouchedHandler
    } = useInput(validateCity);

    const {
        enteredValue: dateValue,
        valueIsValid: dateIsValid,
        inputHasError: dateHasError,
        changeValueHandler: changeDateHandler,
        touchedHandler: dateTouchedHandler
    } = useInput(validateDate);

    const {
        enteredValue: timeValue,
        valueIsValid: timeIsValid,
        inputHasError: timeHasError,
        changeValueHandler: changeTimeHandler,
        touchedHandler: timeTouchedHandler
    } = useInput(validateTime);

    const {
        enteredValue: feeValue,
        valueIsValid: feeIsValid,
        inputHasError: feeHasError,
        changeValueHandler: changeFeeHandler,
        touchedHandler: feeTouchedHandler
    } = useInput(validateFee);

    const {
        enteredValue: maxValue,
        valueIsValid: maxIsValid,
        inputHasError: maxHasError,
        changeValueHandler: changeMaxHandler,
        touchedHandler: maxTouchedHandler
    } = useInput(validateMax);

    const {
        enteredValue: descriptionValue,
        valueIsValid: descriptionIsValid,
        inputHasError: descriptionHasError,
        changeValueHandler: changeDescriptionHandler,
        touchedHandler: descriptionTouchedHandler
    } = useInput(validateDescription);


    let formIsValid = false;

    if( 
        categoryIsValid &&
        titleIsValid && 
        addressIsValid &&
        zipIsValid && 
        cityIsValid &&
        dateIsValid && 
        timeIsValid &&
        feeIsValid &&
        maxIsValid && 
        descriptionIsValid
      ) {
        formIsValid = true;
    };


    const submitHandler = (event) => {
        event.preventDefault();

        categoryTouchedHandler();
        titleTouchedHandler();
        addressTouchedHandler();
        zipTouchedHandler();
        cityTouchedHandler();
        dateTouchedHandler();
        timeTouchedHandler();
        feeTouchedHandler();
        maxTouchedHandler();
        descriptionTouchedHandler();

        if(!formIsValid) {
            return;
        };
        
        const splittedDate = dateValue.split("-");

        const eventData = {
            category: categoryValue.toLowerCase(),
            title: titleValue,
            date: `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`,
            time: timeValue,
            price: +(feeValue.replace(",",".")),
            address: addressValue.charAt(0).toUpperCase() + addressValue.slice(1),
            zip: zipValue,
            city: cityValue.charAt(0).toUpperCase() + cityValue.slice(1),
            limit: +maxValue,
            text: descriptionValue,
            img: `${categoryValue.toLowerCase()}/${categoryValue.toLowerCase()}1.jpg`
        };

        props.onCreateEvent(eventData);
    };
    
    const btnClickHandler = () => {
        if(formIsValid) {
            props.btnClick();
        };
    };

    const dateObj = new Date();
    const currentDate = 
    `${dateObj.getFullYear()}-${dateObj.getMonth() >= 9 ? dateObj.getMonth() + 1 : "0" + (dateObj.getMonth() + 1)}-${dateObj.getDate()}`;

    return(
        <div className={classes.grid}>
            <form onSubmit={submitHandler} onFocus={props.onFocus} className={classes.form}>
                <CardsSelectFilter 
                    className={`${classes.input} ${categoryHasError && classes.invalidInput}`}
                    onChange={changeCategoryHandler}
                    onBlur={categoryTouchedHandler}
                    name="selectSport"
                    defaultOption="Sportart auswählen"
                    options={sportCategories}
                    ref={categoryRef}
                />
                {categoryHasError && <p className={classes.error}>Wähle bitte eine Kategorie</p>}
                <input 
                    className={`${classes.input} ${titleHasError && classes.invalidInput}`} 
                    type="text" placeholder="Titel" 
                    onChange={() => changeTitleHandler(titleRef.current.value)}
                    onBlur={titleTouchedHandler}
                    value={titleValue}
                    ref={titleRef} 
                    maxLength="30"
                />
                {titleHasError && <p className={classes.error}>Gib bitte einen gültigen Titel ein (max 30 Zeichen)</p>}
                <input 
                    className={`${classes.input} ${addressHasError && classes.invalidInput}`} 
                    type="text" placeholder="Adresse" 
                    onChange={() => changeAddressHandler(addressRef.current.value)}
                    onBlur={addressTouchedHandler}
                    value={addressValue}
                    ref={addressRef}
                />
                {addressHasError && <p className={classes.error}>Gib bitte die Adresse ein</p>}
                <div>
                    <input 
                        className={`${classes.input} ${zipHasError && classes.invalidInput}`} 
                        type="number" placeholder="PLZ" 
                        onChange={() => changeZipHandler(zipRef.current.value)}
                        onBlur={zipTouchedHandler}
                        value={zipValue}
                        ref={zipRef}
                    />
                    <input 
                        className={`${classes.input} ${cityHasError && classes.invalidInput}`} 
                        type="text" placeholder="Stadt"
                        onChange={() => changeCityHandler(cityRef.current.value)}
                        onBlur={cityTouchedHandler}
                        value={cityValue} 
                        ref={cityRef}
                    />
                </div>
                {(zipHasError || cityHasError) && <div>
                    <p className={classes.error}>{zipHasError && "Gib bitte die PLZ ein"}</p>
                    <p className={classes.error}>{cityHasError && "Gib bitte die Stadt ein"}</p>
                </div>}
                <div>
                    <input 
                        className={`${classes.input} ${classes.timeInput} ${dateHasError && classes.invalidInput}`} 
                        type="date" placeholder="tt.mm.jjjj"
                        min={currentDate}
                        max="2022-12-31"
                        onChange={() => changeDateHandler(dateRef.current.value)}
                        onBlur={dateTouchedHandler}
                        value={dateValue}  
                        ref={dateRef}
                    />
                    <input 
                        className={`${classes.input} ${classes.timeInput} ${timeHasError && classes.invalidInput}`} 
                        type="time" 
                        onChange={() => changeTimeHandler(timeRef.current.value)}
                        onBlur={timeTouchedHandler}
                        value={timeValue} 
                        ref={timeRef}
                    />
                </div>
                {(dateHasError || timeHasError) && <div>
                    <p className={classes.error}>{dateHasError && "Gib bitte das Datum ein"}</p>
                    <p className={classes.error}>{timeHasError && "Gib bitte die Uhrzeit ein"}</p>
                </div>}
                <div>
                    <div className={classes.feeWrapper}>
                        <input 
                            className={`${classes.input} ${feeHasError && classes.invalidInput}`} 
                            type="number" 
                            min="0"
                            step="0.01"
                            placeholder="Beitrag p.P." 
                            onChange={() => changeFeeHandler(feeRef.current.value)}
                            onBlur={feeTouchedHandler}
                            value={feeValue} 
                            ref={feeRef}
                        />
                        <span className={classes.currency}>€</span>
                    </div>
                    <div>
                        <input 
                            className={`${classes.input} ${maxHasError && classes.invalidInput}`} 
                            type="number" 
                            min="1"
                            max="1000000"
                            step="1"
                            placeholder="Max Teilnehmer" 
                            onChange={() => changeMaxHandler(maxRef.current.value)}
                            onBlur={maxTouchedHandler}
                            value={maxValue} 
                            ref={maxRef}
                        />
                    </div>
                </div>
                {(feeHasError || maxHasError) && <div>
                    <p className={classes.error}>{feeHasError && "Gib 0 ein falls kostenlos"}</p>
                    <p className={classes.error}>{maxHasError && "Min 2 Teilnehmer"}</p>
                </div>}
                <textarea 
                    className={`${classes.input} ${classes.textarea} ${descriptionHasError && classes.invalidInput}`} 
                    rows="5" 
                    maxLength="300"
                    placeholder="Beschreibung"
                    onChange={() => changeDescriptionHandler(descriptionRef.current.value)}
                    onBlur={descriptionTouchedHandler}
                    value={descriptionValue}  
                    ref={descriptionRef}
                />
                {descriptionHasError && <p className={classes.error}>Gib bitte eine Beschreibung ein</p>}
                <BigButton type="submit" onClick={btnClickHandler}>Erstellen</BigButton>
            </form>
        </div>
    );
};

export default CreateForm;