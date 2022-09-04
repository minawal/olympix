import React, { useEffect } from "react";

import useInput from "../../hooks/useInput";

import SmallButton from "../SmallButton/SmallButton";

import classes from './EditUserProp.module.css';


const EditUserProp = (props) => {

    const {
        enteredValue,
        valueIsValid,
        inputHasError,
        changeValueHandler,
        touchedHandler,
        resetInputHandler
    } = useInput(props.validateInput);

    useEffect(() => {
        !props.type && changeValueHandler(props.initialValue);
    }, [changeValueHandler, props.initialValue, props.type]);

    const submitHandler = (e) => {
        e.preventDefault();

        touchedHandler();

        if(valueIsValid && props.type) {
            props.onUpdateProp(enteredValue);
            return;
        };

        valueIsValid && props.onUpdateProp({[props.prop]: enteredValue});
    };

    const quitEditHandler = () => {
        resetInputHandler();
        props.onQuitEdit();
    };

    return(
        <form onSubmit={submitHandler} className={classes.grid}>
            {!props.type && 
                <div className={classes.input}>
                    <input
                        className={`${classes.editTextInput} 
                                    ${inputHasError && classes.errorInput}`
                        }
                        value={enteredValue}
                        onChange={(e) => changeValueHandler(e.target.value)}
                        maxLength={props.maxLength}
                    />
                    {inputHasError && props.inputErrorText}
                </div>
            }
            {props.type &&
                <div className={classes.input}>
                    <input
                        type={props.type}
                        onChange={(e) => changeValueHandler(e.target.files)}
                        accept= ".png, .jpg, .jpeg"
                    />
                    {props.inputErrorText}
                </div>
            }
            <div className={classes.btn}>
                <SmallButton
                    btnStyle="red"
                    onClick={quitEditHandler}
                    type="reset"
                >Abbrechen
                </SmallButton>
                <SmallButton
                    onClick={props.onSave}
                    type="submit"
                >Speichern
                </SmallButton>
            </div>
        </form>
    );
};

export default EditUserProp;