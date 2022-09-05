import { createContext } from "react";

const DataContext = createContext({
    sports: [],
    activeInfo: false,
    guestID: "",
    guestPW: "",
    setActiveInfo: () => {}
});

export default DataContext;