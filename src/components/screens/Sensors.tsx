import React, {Fragment, useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserContext";
import {animated, useSpring} from "react-spring";

import { Dialog, Switch, Transition } from '@headlessui/react'
import {LoginState, UserDTO} from "../../dtos/user";
import {ToggleSwitch} from "flowbite-react";
import {SensorDTO} from "../../dtos/sensor";
import toast from "react-hot-toast";
import {SensorService} from "../../services/sensor.service";
import {UserService} from "../../services/user.service";
import {saveUserLocally} from "../../services/storage.service";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

const Sensors: React.FC = () => {

    const {user, setUser} = useContext(UserContext);

    const [isLoading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [sensorsData, setSensorsData] = useState<SensorDTO[]>([]);


    const [activeSensor, setActiveSensor] = useState<String | null>((user!.sensors!.length !== 0) ? user!.sensors![0] : null);

    const [getChart, setChart] = useState<any>({
        labels: [],
        datasets: [
            {
                label: 'Sensor Data',
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

    useEffect(() => {
        fetchSensors();

        setInterval(async () => {
            setActiveSensor( activeSensorId => {
                if (activeSensorId == null)
                    return null;

                SensorService.getSensor(user!.token, activeSensorId).then(response => {
                    const sensorDTO: SensorDTO = response.data;

                    const labels = sensorDTO.datas.map(sens => sens.date);

                    setChart({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Sensor Data',
                                data: sensorDTO.datas.map(sens => sens.data),
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            }
                        ]
                    })
                });

                return activeSensorId
            })
        }, 2000);

    }, []);

    const fetchSensors = async () => {
        try {
            const getSensors = await SensorService.fetchSensors(user?.token)

            setSensorsData(getSensors.data)
            setLoading(false);
        } catch (err: any) {
            toast.dismiss();
            toast.error("Couldn't fetch sensors");
        }
    }

    const toggleSensor = async (sensor: SensorDTO) => {

        toast.dismiss();

        try {
            const toggleSensor = await UserService.toggleSensor(user?.token, sensor.sensorId)
            toast.success(toggleSensor.message);

            let updatedSensors = [...sensorsData]
            let updatedUser: UserDTO = cloneDeep(user!)

            let indexOf = updatedSensors.indexOf(sensor);

            if(sensor.users.includes(user!.userId)) {
                updatedSensors[indexOf].users = updatedSensors[indexOf].users.filter(uId => uId !== user!.userId);
                updatedUser.sensors = updatedUser.sensors!.filter(sensorId => sensorId !== sensor.sensorId);
            } else {
                updatedSensors[indexOf].users.push(user!.userId)
                updatedUser.sensors!.push(sensor.sensorId)
            }

            if(user!.sensors!.length === 0)
                setActiveSensor(sensor.sensorId)

            setUser!(updatedUser)
            setSensorsData(updatedSensors)
            saveUserLocally(updatedUser)

        } catch (err: any) {
            toast.error("Couldn't toggle sensor " + sensor.sensorId);
            console.log(err);
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
                text: 'Chart.js Line Chart',
            },
        },
    };

    console.log(user!);

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
                                <Dialog.Panel className="relative -right-32 w-[50rem] h-144 transform overflow-y-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-gilroyBold leading-6 text-gray-900"
                                    >
                                        Attach a sensor 📡
                                    </Dialog.Title>

                                    <div className="mt-5">
                                        <p className="text-sm font-gilroyLight text-gray-500">
                                            Pick a sensor from the list below to attach to your account
                                        </p>
                                    </div>

                                    <table className="min-w-full leading-normal mt-5">
                                        <thead className={"relative z-20"}>
                                            <tr>
                                                {["Id", "Name", "Description", "Attached"].map((tableHeader: string) =>
                                                    <th key={tableHeader} className="sticky bg-white -top-6 pl-2 h-16 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        {tableHeader}
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="h-full overflow-y-auto z-10">
                                            {sensorsData.map((sensor: SensorDTO) => (
                                                <tr key={sensor.sensorId} className="cursor-pointer">
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {sensor.sensorId}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {sensor.name}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        {sensor.description}
                                                    </td>
                                                    <td className="h-20 px-2 py-5 border-b border-gray-200 bg-white text-base">
                                                        <Switch
                                                            checked={sensor.users.includes(user!.userId)}
                                                            onChange={() => toggleSensor(sensor)}
                                                            className={`${sensor.users.includes(user!.userId) ? 'bg-teal-900' : 'bg-teal-700'}
              relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                                        >
                                                            <span className="sr-only">Use setting</span>
                                                            <span
                                                                aria-hidden="true"
                                                                className={`${sensor.users.includes(user!.userId) ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                                            />
                                                        </Switch>
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

                {user?.sensors?.length === 0 &&
                    <animated.div style={initialLoad} className="flex flex-col items-center justify-between w-4/6 h-20">
                        <p className="text-xl font-gilroyBold">You currently don't have any sensors active!</p>

                        <button className='bg-black rounded-full h-10 w-36 hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                            setModalOpen(true)
                        }}>
                            <i className="fa-solid fa-wrench text-white mr-2 "></i>
                            <p className='text-white text-xs font-medium self-center font-gilroyBold'>Attach a sensor</p>
                        </button>
                    </animated.div>
                }

                {user?.sensors?.length !== 0 &&
                    <Line options={options} data={getChart} />
                }

            </div>

        </div>
    )
}

export default Sensors;