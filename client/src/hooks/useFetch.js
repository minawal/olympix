import { useState, useCallback, useContext } from "react";

import AuthContext from "../context/AuthContext/AuthContext";

const useFetch = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const authCtx = useContext(AuthContext);

    const sendRequest = useCallback(async (requestConfig, dataHandler, authCheck = true) => {

      setIsLoading(true);
      setError(null);

      try {

        if((authCtx.user.token && authCtx.user.id) || authCheck === false) {
  
          try {
            const response = await fetch(requestConfig.url, {
  
              method: requestConfig.method ? requestConfig.method : 'GET',
              headers: requestConfig.headers && authCheck ? {...requestConfig.headers, "Authorization": `Bearer ${authCtx.user.token}`} : 
                      authCheck ? {"Authorization": `Bearer ${authCtx.user.token}`} : 
                      requestConfig.headers ? requestConfig.headers : {},
              body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
  
            });
      
            if (!response.ok) {
              throw new Error(await response.json());
            };
      
            const data = await response.json();
  
            dataHandler(data);
  
          } catch (err) {
            authCtx.logoutUser();
            setError(err.message || 'Etwas ist schief gelaufen.');
  
          } 
  
        } else {
          authCtx.logoutUser();
          throw new Error ("Nicht berechtigt");
        }

      } catch(err) {
          setError(err.message);

      } finally {
        setIsLoading(false);
      };

    }, [authCtx]);
  
    return {
      isLoading,
      error,
      sendRequest
    };
  };
  
  export default useFetch;



// import { useState, useCallback, useContext } from "react";

// import AuthContext from "../context/AuthContext/AuthContext";

// const useFetch = () => {

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const authCtx = useContext(AuthContext);

//     const sendRequest = useCallback(async (requestConfig, dataHandler, authCheck = true) => {

//       setIsLoading(true);
//       setError(null);

//       try {

//         const localUser = JSON.parse(localStorage.getItem("user")) ?? "";

//         if((
//             (authCtx.user.token === localUser.token) &&
//             (authCtx.user.id === localUser._id)
//           ) || authCheck === false) {
  
//           try {
//             const response = await fetch(requestConfig.url, {
  
//               method: requestConfig.method ? requestConfig.method : 'GET',
//               headers: requestConfig.headers && authCheck ? {...requestConfig.headers, "Authorization": `Bearer ${authCtx.user.token}`} : 
//                       authCheck ? {"Authorization": `Bearer ${authCtx.user.token}`} : 
//                       requestConfig.headers ? requestConfig.headers : {},
//               body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
  
//             });
      
//             if (!response.ok) {
//               throw new Error(await response.json());
//             };
      
//             const data = await response.json();
  
//             dataHandler(data);

//             setIsLoading(false);
  
//           } catch (err) {
//             authCtx.logoutUser();
//             setError(err.message || 'Etwas ist schief gelaufen.');
  
//           } 
  
//         } else {
//           authCtx.logoutUser();
//           throw new Error ("Nicht berechtigt");
//         }

//       } catch(err) {
//           setError(err.message);

//       } finally {
//         setIsLoading(false);
//       };

//     }, [authCtx]);
  
//     return {
//       isLoading,
//       error,
//       sendRequest
//     };
//   };
  
//   export default useFetch;