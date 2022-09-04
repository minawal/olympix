import React, { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";


const AuthContextProvider = (props) => {

    const [user, setUser] = useState({id: "", token: "", firstName: "", pwLength: null});

    const loginUser = useCallback((id, token, firstName, pwLength) => {
        setUser({id, token, firstName, pwLength});
    }, []);

    const logoutUser = useCallback(() => {
        setUser({id: "", token: "", firstName: "", pwLength: null});
        localStorage.removeItem("user");
    }, []);

    const checkAuth = useCallback(async() => {

        const localUser = await JSON.parse(localStorage.getItem("user")) ?? "";

        if((
            (user.token !== localUser.token) ||
            (user.id !== localUser._id)
          )) {
            logoutUser();
          }
    }, [user, logoutUser]);

    const updatePwLength = (length) => {
        setUser((prevState) => ({...prevState, pwLength: length}));
    };

    useEffect(() => {

        const authUser = JSON.parse(localStorage.getItem("user"));

        if(authUser) {
            setUser(
                {
                    id: authUser._id, 
                    token: authUser.token, 
                    firstName: authUser.firstName, 
                    pwLength: authUser.pwLength});
        } else {
            logoutUser();
        };

    }, [logoutUser]);
    
    return(
        <AuthContext.Provider value={{user, loginUser, logoutUser, checkAuth, updatePwLength}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;