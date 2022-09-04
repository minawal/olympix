import React, { useContext } from "react";
import { useLocation } from "react-router";

import DataContext from "../../context/DataContext/DataContext";

import Header from "../Header/Header";
import AppInfoModal from "../AppInfoModal/AppInfoModal";
import Navigation from "../Navigation/Navigation";

import classes from './Grid.module.css';


const Grid = (props) => {

    const dataCtx = useContext(DataContext);

    const location = useLocation()
    const noNav = location.pathname === "/login" || location.pathname === "/register";

    const showModalHandler = () => {
        dataCtx.setActiveInfo(prevState => !prevState);
    };

    const closeModalHandler = () => {
        dataCtx.setActiveInfo(false);
    };

    return(
        <div className={classes.grid}>
            {!noNav ? 
                <Header loggedIn={true} onClick={showModalHandler}/> : 
                <Header onClick={showModalHandler}/>
            }
            <main className={classes.main} style={noNav ? {backgroundColor: "#eee"} : null}>
                {dataCtx.activeInfo && <AppInfoModal onCloseModal={closeModalHandler}/>}
                {props.children}
            </main>
            {!noNav ? <Navigation onClick={closeModalHandler}/> : <div className={classes.notloggedIn}/>}
        </div>
    );
};

export default Grid;