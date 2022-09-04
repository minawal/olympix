import { createContext} from "react";

const UserContext = createContext({
    user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        img: ""
    },
    updateUser: (updatedUser) => {}
});

export default UserContext;