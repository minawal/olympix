import React, { useState } from "react";
import DataContext from "./DataContext";

import fussballIcon from '../../assets/icons/fussballIcon.svg'
import laufenIcon from '../../assets/icons/laufenIcon.svg'
import basketballIcon from '../../assets/icons/basketballIcon.svg'
import fitnessIcon from '../../assets/icons/fitnessIcon.svg'
import turnenIcon from '../../assets/icons/turnenIcon.svg'
import footballIcon from '../../assets/icons/footballIcon.svg'
import hockeyIcon from '../../assets/icons/hockeyIcon.svg'
import kampfsportIcon from '../../assets/icons/kampfsportIcon.svg'
import tennisIcon from '../../assets/icons/tennisIcon.svg'
import volleyballIcon from '../../assets/icons/volleyballIcon.svg'


const DataContextProvider = (props) => {

    const [activeInfo, setActiveInfo] = useState(false);
    const guestID = "631001e497865c8727d53cff";
    const guestPW = "g1B%WqxE6S8E";

    const sports = [
        {
            id: 1,
            name: "Fußball",
            img: fussballIcon,
            alt: "Fußball Icon",
            link: "fussball"
        },
        {
            id: 2,
            name: "Basketball",
            img: basketballIcon,
            alt: "BasketBall Icon",
            link: "basketball"
        },
        {
            id: 3,
            name: "Laufen",
            img: laufenIcon,
            alt: "Laufen Icon",
            link: "laufen"
        },
        {
            id: 4,
            name: "Fitness",
            img: fitnessIcon,
            alt: "Fitness Icon",
            link: "fitness"
        },
        {
            id: 5,
            name: "Tennis",
            img: tennisIcon,
            alt: "Tennis Icon",
            link: "tennis"
        },
        {
            id: 6,
            name: "Football",
            img: footballIcon,
            alt: "Football Icon",
            link: "football"
        },
        {
            id: 7,
            name: "Kampfsport",
            img: kampfsportIcon,
            alt: "Kampfsport Icon",
            link: "kampfsport"
        },
        {
            id: 8,
            name: "Volleyball",
            img: volleyballIcon,
            alt: "Volleyball Icon",
            link: "volleyball"
        },
        {
            id: 9,
            name: "Hockey",
            img: hockeyIcon,
            alt: "Hockey Icon",
            link: "hockey"
        },
        {
            id: 10,
            name: "Turnen",
            img: turnenIcon,
            alt: "Turnen Icon",
            link: "turnen"
        }
    ];

    return(
        <DataContext.Provider value={{sports, activeInfo, guestID, guestPW, setActiveInfo}}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;