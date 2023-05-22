import React, {Fragment, useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {animated, useSpring} from "react-spring";

import {Dialog, Listbox, Transition} from '@headlessui/react'
import {PlantDataDTO, PlantDTO} from "../../dtos/plant";
import toast from "react-hot-toast";
import {PlantService} from "../../services/plant.service";
import useWebSocket from 'react-use-websocket';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/20/solid";
import {WebSocketHook} from "react-use-websocket/src/lib/types";
import moment from "moment";

const  {REACT_APP_DEV_SENSORIFY_API_URL} = process.env

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

var cloneDeep = require('lodash.clonedeep');
/*const usePlantWebSocket = () => {
    const url = 'ws://34.165.1.243:8000/plants/listen/${plantId}?token=${token}';

    const [plantData, setPlantData] = useState([]);

    const { lastJsonMessage } = useWebSocket(url);

    useEffect(() => {
        if (lastJsonMessage) {
          const dataArray: unknown[] = [];
          if (Array.isArray(lastJsonMessage)) {
            lastJsonMessage.forEach((jsonValue) => {
              if (typeof jsonValue === 'object' && jsonValue !== null && 'data' in jsonValue) {
                dataArray.push((jsonValue as { data: unknown }).data);
              }
            });
          } else if (typeof lastJsonMessage === 'object' && lastJsonMessage !== null && 'data' in lastJsonMessage) {
            dataArray.push((lastJsonMessage as { data: unknown }).data);
          }
          setPlantData(dataArray as never[]);
        }
      }, [lastJsonMessage]);




    return plantData;
  };*/

interface SocketData {
    temperature: number,
    light: number,
    moisture: number,
    humidity: number
}

interface SocketState {
    id: string,
    online: boolean,
    state: boolean,
}


const Plants: React.FC = () => {
    //const plantData = usePlantWebSocket();

    const {user, setUser} = useContext(UserContext);

    const [isLoading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [plantsOptions, setPlantsOptions] = useState<PlantDTO[]>([]);
    const [activePlant, setActivePlant] = useState<PlantDTO>();
    const prevActivePlantId = useRef<string | null>(null);

    let webSocket: WebSocketHook | null = null;

    const {sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket} = useWebSocket(activePlant ?
        `ws://34.165.1.243:8000/plants/listen/${activePlant.id}?token=${user?.token}` : null, {
        onOpen: () => console.log(`Opened a connection to 34.165.1.243:8000/plants/listen/${activePlant?.id}?token=${user?.token}`),
        onClose: () => console.log("Closed the connection"),
        shouldReconnect: (closeEvent) => true,
    });

    const limitList = [10, 15, 20, 25, 30];

    const [dataLimit, setDataLimit] = useState<number>(10);

    const [getChart, setChart] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Plant Data',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    });

    const [styles, api] = useSpring(() => ({
        loop: false,
        reset: false,
        from: { opacity: 0 },
        to: { opacity: 1 }
    }))

    const [initialLoad] = useSpring(() => ({
        loop: false,
        reset: false,
        from: { opacity: 0 },
        to: { opacity: 1 }
    }))

    useEffect(() => {
        if(isModalOpen)
            api({ reset: true });
        else
            api({ reset: false });
    }, [api, isModalOpen])

    const oldGraphData = useRef<PlantDTO>();

    const fetchPlants = async () => {
        try {
          const response = await PlantService.fetchPlants(user?.token);
          const plantsArray = await response.json(); // Modify this line based on the actual response structure
          console.log("plants array",plantsArray)
          setPlantsOptions(plantsArray);
          setActivePlant(plantsArray[0])
          setLoading(false);
        } catch (err: any) {
         console.log(err);
          toast.dismiss();
          toast.error("Couldn't fetch plants");
        }
    };

    const fetchPlantData = async () => {
        try {
            const response: PlantDTO = await PlantService.getPlant(user?.token, activePlant!.id, dataLimit);
            setActivePlant(response)

            const labels = response.temperatures.map((tempData: PlantDataDTO) => {
                const utcDate = moment.utc(tempData.timestamp);
                const localDate = utcDate.local();

                return localDate.format('DD/MM/YYYY HH:mm:ss');
            });

            setChart({
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature Data',
                        data: response.temperatures.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: 'Humidity Data',
                        data: response.humidities.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(144, 25, 103)',
                        backgroundColor: 'rgba(144, 25, 103, 0.5)',
                    },
                    {
                        label: 'Moisture Data',
                        data: response.moistures.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(31, 22, 193)',
                        backgroundColor: 'rgba(31, 22, 193, 0.5)',
                    },
                    {
                        label: 'Light Data',
                        data: response.light_values.map((tempData: PlantDataDTO) => tempData.value),
                        borderColor: 'rgb(31, 199, 21)',
                        backgroundColor: 'rgba(31, 199, 21, 0.5)',
                    },
                ]
            })

            setLoading(false);
        } catch (err: any) {
            console.log(err);
            toast.dismiss();
            toast.error("Couldn't fetch plants");
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: plantsOptions.find(s => s.id === activePlant?.id)?.name + " Plant" ?? activePlant + " Plant"
            }
        },
    };

    useEffect(() => {
        fetchPlants().then(() => {
            console.log("Successfully fetched plants")
        });

        return () => {
            if (webSocket) {
                webSocket.getWebSocket()?.close();
            }
        };
    }, [])

    useEffect(() => {
        if(activePlant && activePlant.id !== prevActivePlantId.current) {
            console.log("fetching " + activePlant.id);

            if(webSocket) {
                webSocket.getWebSocket()?.close();
            }

            fetchPlantData().then(() => {
                console.log("Successfully fetched plant data")
                prevActivePlantId.current = activePlant.id;
            })
        }
    }, [activePlant])

    useEffect(() => {
        if(activePlant) {
            console.log("fetching " + activePlant.id + " with updated limit " + dataLimit);

            fetchPlantData().then(() => {
                console.log("Successfully fetched plant data")
                prevActivePlantId.current = activePlant.id;
            })
        }
    }, [dataLimit])

    useEffect(() => {
        if(lastJsonMessage) {
            let data = lastJsonMessage as any;

            console.log(data)

            if(data.type == "state") {
                data = (data.payload) as SocketState;

                console.log("State Value")

                if(data.id == activePlant?.id)
                    setActivePlant({
                        ...activePlant as PlantDTO,
                        online: data.online,
                        state: data.state
                    })

                console.log("Setting plan options to updated array")

                console.log(plantsOptions.map((plant) => {

                        if(plant.id == data.id) {
                            console.log("EQ")
                            plant.online = data.online
                            plant.state = data.state
                        }

                        return plant
                    })
                )
                setPlantsOptions(plantsOptions.map((plant) => {

                    if(plant.id == data.id) {
                        plant.online = data.online
                        plant.state = data.state
                    }

                    return plant
                }))

                return;
            }

            data = (data.payload) as SocketData;

            let newLabels = getChart.labels as Array<string>

            if(newLabels.length > dataLimit)
                newLabels.shift();

            newLabels.push(new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }));

            let newDataSets = getChart.datasets as Array<any>

            newDataSets.forEach(set => {

                if(set.data.length > dataLimit)
                    set.data.shift()

                if(set.label == "Temperature Data")
                    set.data.push(data.temperature)
                else if (set.label == "Humidity Data")
                    set.data.push(data.humidity)
                else if (set.label == "Moisture Data")
                    set.data.push(data.moisture)
                else set.data.push(data.light)
            })

            setChart({
                labels: newLabels,
                datasets: newDataSets
            })
        }
    }, [lastJsonMessage]);

    return (

        <div className="w-full h-full">

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative -right-32 w-9/12 h-144 transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                 <Dialog.Title as="h3" className="text-lg font-gilroyBold leading-6 text-gray-900">
                                    All Plants 🌱
                                </Dialog.Title>

                                    <div className="mt-5">
                                        <p className="text-sm font-gilroyLight text-gray-500">
                                            The following is a list of plants created within the environment
                                        </p>
                                    </div>

                                    <table className="min-w-full leading-normal mt-5">
                                        <thead className={"relative z-20"}>
                                            <tr>
                                            {["Id", "Name", "Description", "Token", "State"].map((tableHeader: string) => (
                                            <th
                                                key={tableHeader}
                                                className="sticky bg-white -top-6 pl-2 h-16 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                {tableHeader}
                                            </th>
                                            ))}
                                            </tr>
                                        </thead>
                                        <tbody className="h-full overflow-y-auto z-10">
                                            {plantsOptions.map((plant: PlantDTO) => (
                                                <tr key={plant.id} className="cursor-pointer">
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {plant.id}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {plant.name}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {plant.description}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {plant.key}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {plant.online ? plant.state ? "WATERING" : "IDLE" : "OFFLINE"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className="w-full h-full flex flex-row items-center justify-center">

                {plantsOptions.length === 0 &&
                    <animated.div style={initialLoad} className="flex flex-col items-center justify-between w-4/6 h-20">
                        <p className="text-xl font-gilroyBold">There isn't any plant created!</p>

                        <button className='bg-black rounded-full h-10 w-36 hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                            setModalOpen(true)
                        }}>
                            <i className="fa-solid fa-wrench text-white mr-2 "></i>
                            <p className='text-white text-xs font-medium self-center font-gilroyBold'>View all plants</p>
                        </button>
                    </animated.div>
                }

                {plantsOptions.length !== 0 &&
                    <div className="flex flex-row w-full h-full gap-20 items-center justify-center">

                        <div className={"w-1/2 h-1/2"}>
                            <Line options={options} data={getChart} />
                        </div>

                        <div className={"flex flex-col w-1/4 h-80 justify-between items-center"}>

                            <div className={"flex flex-row w-full justify-between items-center"}>
                                <div className={"flex flex-col"}>
                                    <p className={"font-gilroyBold text-lg"}>Active Plant</p>
                                    <Listbox value={activePlant?.id} onChange={(value) => setActivePlant(plantsOptions.find(s => s.id == value))}>
                                        <div className="relative mt-1 z-10">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                <span className="block truncate">{activePlant?.id}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                  <ChevronUpDownIcon
                                                                      className="h-5 w-5 text-gray-400"
                                                                      aria-hidden="true"
                                                                  />
                                                                </span>
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {user && plantsOptions.length > 0 ? (
                                              plantsOptions.map((plant) => (
                                                <Listbox.Option
                                                  className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                    }`
                                                  }
                                                  value={plant.id}
                                                  key={plant.id}
                                                >
                                                  {({ selected }) => (
                                                    <>
                                                      <span
                                                        className={`block truncate ${
                                                          selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                      >
                                                        {plant.name} {/* Assuming the plant object has a 'name' property */}
                                                      </span>
                                                      {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                      ) : null}
                                                    </>
                                                  )}
                                                </Listbox.Option>
                                              ))
                                            ) : (
                                              // Handle the case when plantsOptions is empty or not available
                                              <p>No plants available</p>
                                            )}

                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>

                                <button className='bg-black rounded-full h-16 w-40 hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                                    setModalOpen(true)
                                }}>
                                    <i className="text-sm fa-solid fa-wrench text-white mr-2 "></i>
                                    <p className='text-white text-sm font-medium self-center font-gilroyBold'>View all plants</p>
                                </button>
                            </div>

                            <div className="flex flex-col h-18 justify-between items-center">
                                <p className={"font-gilroyBold text-lg"}>Data Limit</p>
                                <Listbox value={dataLimit} onChange={setDataLimit}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                            <span className="block truncate">{dataLimit}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                  <ChevronUpDownIcon
                                                                      className="h-5 w-5 text-gray-400"
                                                                      aria-hidden="true"
                                                                  />
                                                                </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {limitList.map((dataLimitNum, dataLimitIdx) => (
                                                    <Listbox.Option
                                                        key={dataLimitIdx}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-9 pr-4 ${
                                                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={dataLimitNum}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                                  <span
                                                                                      className={`block truncate ${
                                                                                          selected ? 'font-medium' : 'font-normal'
                                                                                      }`}
                                                                                  >
                                                                                    {dataLimitNum}
                                                                                  </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                        </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            {activePlant &&
                                <div className="flex flex-col h-14 justify-between items-center">
                                    <p className={"font-gilroyBold text-lg"}>Current State: {activePlant.online ? activePlant.state ? "WATERING" : "IDLE" : "OFFLINE"}</p>
                                </div>
                            }
                        </div>

                    </div>

                }

            </div>

        </div>
    )
}

export default Plants;
