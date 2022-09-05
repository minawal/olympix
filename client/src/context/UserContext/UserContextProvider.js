import React, { useState, useEffect, useContext, useCallback } from "react";

import UserContext from "./UserContext";
import AuthContext from "../AuthContext/AuthContext";

import useFetch from "../../hooks/useFetch";


const UserContextProvider = (props) => {
    
    const [user, setUser] = useState({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        img: ""
    });
    
    const { sendRequest } = useFetch();

    const authCtx = useContext(AuthContext);

    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    useEffect(() => {

        if(authCtx.user.id) {
            sendRequest({url:`https://olympixx.herokuapp.com/api/users/${authCtx.user.id}`},
                data => {

                    data.img = data.img ?? "1.png";

                    setUser(
                        {
                            id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            img: typeof(data.img) === "string" ? 
                                data.img : 
                                btoa(new Uint8Array(data.img.img.data.data)
                                .reduce((data, byte) => data + String.fromCharCode(byte), '')
                            )
                        }
                    );
                }
            );
        }; 

    }, [sendRequest, authCtx]);

    return(
        <UserContext.Provider value={{user, updateUser}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;