import {UserDTO} from "../dtos/user";

export const saveUserLocally = (user: UserDTO) => {
    localStorage.setItem("sensorifyUser", JSON.stringify(user))
}

export const destroyUserLocally = () => {
    localStorage.removeItem("sensorifyUser")
}

export const loadUserLocally = () : UserDTO | null => {
    const state = localStorage.getItem("sensorifyUser")
    return state ? (JSON.parse(state) as UserDTO) : null;
}