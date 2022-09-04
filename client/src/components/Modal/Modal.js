import React from "react";

import Overlay from "./Overlay";

import classes from './Modal.module.css';


const Modal = (props) => {

    return(
        <section className={classes.grid}>
            <Overlay 
                onCloseModal={props.onCloseModal} 
                title={props.title}
                children={props.children}
                tall={props.tall}
            />
        </section>
    );
};

export default Modal;