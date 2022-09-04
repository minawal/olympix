import { createContext} from "react";

const AuthContext = createContext({
    user: {
        id: "",
        token: "",
        firstName: "",
        pwLength: null
    },
    loginUser: (id, token, firstName, pwLength) => {},
    logoutUser: () => {},
    checkAuth: () => {},
    updatePwLength: (length) => {}
});

export default AuthContext;