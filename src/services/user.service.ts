import {UserLoginRequestDto} from "../dtos/user";
const  {REACT_APP_DEV_SENSORIFY_API_URL} = process.env

export class UserService {

    public static login = async (loginRequest: UserLoginRequestDto): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + `/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: loginRequest.email, password: loginRequest.password})
        });

        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();

        console.log(data)

        return data;
    }

    public static register = async (registerRequest: UserLoginRequestDto, token: string | undefined): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + `/user/setup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({phone_ext: registerRequest.phoneExtension, phone_number: registerRequest.phoneNumber, address: registerRequest.address, job_description: registerRequest.jobDescription})
        });

        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();

        console.log(data)

        return data;

    }

    public static toggleSensor = async (token: string | undefined, sensorId: string): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + `/user/sensor/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(sensorId)
        });

        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    }

    public static createUser = async (token: string | undefined, email: string, password: string, role: string): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + `/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({email: email, password: password, role: role})
        });

        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();

        console.log(data)

        return data;

    }

}