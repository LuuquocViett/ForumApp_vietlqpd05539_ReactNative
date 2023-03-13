import { createContext, useState } from "react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const {children} = props;
    // data su dung chung
    const [isLogin, setIsLogin] = useState(false);
    return (
        <AppContext.Provider value={{isLogin, setIsLogin}}>
            {children}
        </AppContext.Provider>
    )
}