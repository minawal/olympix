import { useState, useCallback } from "react";


const useInput = (validateInput) => {

    const [enteredValue, setEnteredValue] = useState("");
    const [inputIsTouched, setInputIsTouched] = useState(false);

    const valueIsValid = validateInput(enteredValue);
    const inputHasError = !valueIsValid && inputIsTouched;

    const changeValueHandler = useCallback((value) => {
        setEnteredValue(value);
    }, []);

    const touchedHandler = () => {
        setInputIsTouched(true);
    };

    const resetInputHandler = () => {
        setEnteredValue("");
        setInputIsTouched(false);
    };

    return {
        enteredValue,
        valueIsValid,
        inputHasError,
        changeValueHandler,
        touchedHandler,
        resetInputHandler
    };

};

export default useInput;