export class SensorService {

    public static fetchSensors = async (token: string | undefined): Promise<any> => {
        const resp = await fetch(`/sensor/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    }

    public static getSensor = async (token: string | undefined, sensorId: String, limitCount: number): Promise<any> => {
        const resp = await fetch(`/sensor/get/` + sensorId + "?limitAmount=" + limitCount, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    }

    public static createSensor = async(token: string | undefined, sensorName: String, sensorDescription: String) : Promise<any> => {
        const resp = await fetch(`/sensor/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({name: sensorName, description: sensorDescription})
        });

        if (!resp.ok) throw new Error(resp.statusText);

        return await resp.json();
    }

}