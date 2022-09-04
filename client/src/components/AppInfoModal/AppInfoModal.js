import React from "react";

import Modal from "../Modal/Modal";

import classes from './AppInfoModal.module.css';


const AppInfoModal = (props) => {

    return(
        <Modal 
            title="App Info"
            onCloseModal={props.onCloseModal}
            tall={true}
        >
            <div className={classes.appInfoText}>
                <p className={classes.bigText}>Herzlich Willkommen bei Olympix!</p>
                <p>
                    Olympix bringt Menschen zusammen, die gemeinschaftlich Sport treiben möchten.
                    In einer Auswahl an verschiedenen Sportarten findet man das jeweilige Sportangebot.
                    Man kann sowohl an Events anderer Nutzer teilnehmen, als auch eigene Events erstellen.
                </p>
                <p>
                    Die Web App wurde von mir als Referenzprojekt mit Frontend und Backend entwickelt. 
                    Dazu habe ich den MERN-Techstack (MongoDB, Express, React, Node.js) verwendet. 
                    Die Nutzer-Authentifizierung erfolgt per JSON Web Token.
                    Die Darstellung der App wurde vorerst nur für mobile Endgeräte optimiert.
                </p>
                <p>
                    Den Code zum Projekt findet man in meinem <a 
                    href="https://github.com/minawal/olympix" target="_blank" rel="noreferrer"
                    >Github Repository</a>.
                </p>
                <p>
                    Ich wünsche dir viel Spaß mit Olympix!
                </p>
                <p className={classes.bigText}>Abdullah Minawal</p>
            </div>
        </Modal>
    );
};

export default AppInfoModal;