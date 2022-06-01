import { createContext } from "react";
import { UserBasics } from "../models/user-basics.data";

const UserContext = createContext({ user: new UserBasics(), changeUser: (user: UserBasics) => {}});
export default UserContext;
