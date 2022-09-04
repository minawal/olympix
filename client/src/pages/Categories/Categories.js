import React, { useEffect, useContext } from "react";

import DataContext from "../../context/DataContext/DataContext";
import AuthContext from "../../context/AuthContext/AuthContext";
import UserContext from "../../context/UserContext/UserContext";

import CategoryBox from "../../components/CategoryBox/CategoryBox";

import classes from './Categories.module.css';


const Categories = (props) => {

    const dataCtx = useContext(DataContext);
    const authCtx = useContext(AuthContext);
    const userCtx = useContext(UserContext);

    useEffect(() => {
        authCtx.checkAuth();
    }, [authCtx]);

    const categories = dataCtx.sports.map(sport => (
        <CategoryBox 
            key={sport.id}
            link={sport.link}
            src={sport.img}
            alt={sport.alt}
            sport={sport.name}
        />
    ));

    const name = userCtx.user.firstName;

    return(
        <div className={classes.grid}>
            <section className={classes.greeting}>
                <h1>Hi {name==="Gast" && "lieber"} {name}!</h1>
                <span>Auf welche Sportart hast du Lust?</span>
            </section>
            <section className={classes.boxes}>{categories}</section>
        </div>
    );
};

export default Categories;