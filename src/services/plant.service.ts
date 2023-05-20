import useWebSocket from 'react-use-websocket';
import ReadyState from 'react-use-websocket';
const  {REACT_APP_DEV_SENSORIFY_API_URL} = process.env


export class PlantService {

    ///////////
    public static fetchPlantsData = async (token: string | undefined = '',  plantId: string | null | undefined = ''): Promise<any> => {
        const url = REACT_APP_DEV_SENSORIFY_API_URL + '/plants/listen/${plantId}';
        const {
          sendMessage,
          lastMessage,
          readyState,
        } = useWebSocket(url, {
          queryParams: {
            // Add any necessary query parameters here
            token: token,
          },
          shouldReconnect: () => true, // Adjust as per your requirement
        });
      
        const dataArr: any[] = []; // Array to store the received data
      
        await new Promise((resolve) => {
          const listener = () => {
            if (lastMessage && lastMessage.data) {
              // Handle the received WebSocket message here
              const data = JSON.parse(lastMessage.data);
              console.log(data);
              dataArr.push(data); // Store the data in the array
            }
          };
          const cleanup = () => {
            if (lastMessage) {
              listener();
            }
          };
          lastMessage ? listener() : cleanup();
          cleanup();
          Promise.resolve(); // Resolve the promise when done
        });
      
        return dataArr; // Return the collected data array
      };
      
    ///////////

    

    public static fetchPlants = async (token: string | undefined): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + '/plants/', {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
          },
        });
        console.log(resp.status);
        console.log(token);
        if (!resp.ok) throw new Error(resp.statusText);
        //const res = await resp.json()
        //console.log(res);
        return await resp;
      };
    
      public static getPlant = async (
        token: string | undefined,
        plantId: string,
      ): Promise<any> => {
        const resp = await fetch(
          REACT_APP_DEV_SENSORIFY_API_URL + '/plants/${plantId}',
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          },
        );
    
        if (!resp.ok) throw new Error(resp.statusText);
    
        return await resp.json();
      };
    
      public static createPlant = async (
        token: string | undefined,
        plantName: string,
        plantDescription: string,
      ): Promise<any> => {
        const resp = await fetch(REACT_APP_DEV_SENSORIFY_API_URL + '/plants/', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ name: plantName, description: plantDescription }),
        });
    
        if (!resp.ok) throw new Error(resp.statusText);
    
        return await resp.json();
      };

}