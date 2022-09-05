import { useContext } from "react";

import useFetch from "./useFetch";

import AuthContext from "../context/AuthContext/AuthContext";


const useToken = () => {

    const authCtx = useContext(AuthContext);

    const { isLoading, error, sendRequest } = useFetch();

    const getToken = (entry, inputData) => {

        const requestConfig = {
            url: `https://olympixx.herokuapp.com/api/users/${entry}`,
            method: "POST",
            body: inputData,
            headers: {"Content-Type": "application/json"}
        };

        const login = async(data) => {
            await localStorage.setItem("user", JSON.stringify(
                    {
                        _id: data._id, 
                        token: data.token,
                        pwLength: inputData.password.length,
                        firstName: data.firstName
                    }
                )
            );
            authCtx.loginUser(data._id, data.token, data.firstName, inputData.password.length);
        };

        sendRequest(requestConfig, login, false);
    };

    return { isLoading, error, getToken };

};

export default useToken;