import {UserDTO} from "../dtos/user";
import React from "react";

interface IUserContext {
    user: UserDTO | null;
    setUser?: (user: UserDTO | null) => void;
}

const defaultState = {
    user: null,
};

export const UserContext = React.createContext<IUserContext>(defaultState);