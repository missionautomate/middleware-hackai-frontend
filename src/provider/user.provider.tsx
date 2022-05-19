import { useState } from "react";
import { UserBasics } from "../models/user-basics.data";
import  UserContext from "../context/User.context";

export const UserProvider = ({children}: any) => {
    const [user, setUser] = useState(new UserBasics());

    const changeUser = (newUser: UserBasics) => {
        setUser(newUser);
    };

    return (
        <UserContext.Provider value={{user, changeUser}}>
        {children}
        </UserContext.Provider>
    
    )
}
