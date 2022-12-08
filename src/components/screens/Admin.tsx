import React, {Fragment, useContext, useState} from "react";
import {animated, useSpring} from "react-spring";
import {Dialog, Transition} from "@headlessui/react";
import {ActiveModal} from "../../utils/global";
import toast from "react-hot-toast";
import {SensorService} from "../../services/sensor.service";
import {UserContext} from "../../context/UserContext";
import { Listbox } from '@headlessui/react'
import {Role} from "../../dtos/user";
import {UserService} from "../../services/user.service";
import {ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/20/solid";

const Admin: React.FC = () => {

    const {user, setUser} = useContext(UserContext);
    const [userModal, setUserModal] = useState<boolean>(false);
    const [sensorModal, setSensorModal] = useState<boolean>(false);
    const [waiting, setWaiting] = useState<boolean>(false);

    const [sensorInfo, setSensorInfo] = useState<any>({
        name: "",
        description: "",
        token: ""
    });

    const [userInfo, setUserInfo] = useState<any>({
        email: "",
        password: "",
        role: "Customer"
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

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const createSensor = async(e: any) => {
        e.preventDefault();

        toast.dismiss();
        setWaiting(true);

        if(sensorInfo.name === "") {
            toast.error("A sensor name should be provided.")
        } else if (sensorInfo.description === "") {
            toast.error("A sensor description should be provided.")
        } else {
            try {
                const registerSensor = await SensorService.createSensor(user!.token, sensorInfo.name, sensorInfo.description);

                toast.success("Successfully created the sensor");

                setSensorInfo({
                    ...sensorInfo,
                    token: registerSensor.token
                })

            } catch (e) {
                toast.error("An error occured whilst creating the sensor.")
            }
        }

        setWaiting(false)
    };

    const createUser = async(e: any) => {
        e.preventDefault();

        toast.dismiss();
        toast.loading("Creating the user...");

        setWaiting(true);

        if(!validateEmail(userInfo.email)) {
            toast.error("A valid email should be provided.")
        } else if (userInfo.password === "") {
            toast.error("A valid password should be provided.")
        } else {
            try {
                const registerUser = await UserService.createUser(user!.token, userInfo.email, userInfo.password, userInfo.role);
                toast.success("Successfully created the user");
                setUserModal(false)
            } catch (e) {
                toast.error("An error occured whilst creating the sensor.")
            }
        }

        setWaiting(false)
    };

    console.log(userInfo)

    return (
        <animated.div style={initialLoad} className="flex flex-col w-11/12 h-full items-start justify-start mx-16 mt-12">

            <p className="text-4xl font-gilroyBold">Choose one of the following options ⚙️</p>

            <div className="flex flex-row w-11/12 h-5/6 items-center justify-center gap-20">
                <button className='bg-black rounded-full h-32 w-72 hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                    setUserModal(true)
                }}>
                    <i className="fa-solid text-xl fa-user text-white mr-2 "></i>
                    <p className='text-white text-xl font-medium self-center font-gilroyBold'>Create a User</p>
                </button>

                <button className='bg-black rounded-full h-32 w-72  hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                    setSensorModal(true)
                }}>
                    <i className="fa-solid text-xl fa-signal text-white mr-2 "></i>
                    <p className='text-white text-xl font-medium self-center font-gilroyBold'>Create a Sensor</p>
                </button>
            </div>

            <Transition appear show={userModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setUserModal(false)}>
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
                                        as="h1"
                                        className="text-2xl font-gilroyBold leading-6 text-gray-900"
                                    >
                                       Create a User 🛀
                                    </Dialog.Title>

                                    <div className="mt-5">
                                        <p className="text-sm font-gilroyLight text-gray-500">
                                            Input the details below in order to create a new user.
                                        </p>
                                    </div>

                                    <div className={"flex flex-col h-80 w-full items-start justify-between mt-8"}>
                                        <div className="flex flex-col w-full h-44 justify-between items-start">
                                            <div className={"flex flex-row w-full justify-between items-start"}>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Email</p>
                                                    <input
                                                        type="email"
                                                        className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                        required
                                                        value={userInfo.email}
                                                        onChange={(e) => {
                                                            setUserInfo({
                                                                ...userInfo,
                                                                email: e.target.value
                                                            });
                                                        }
                                                        }
                                                        disabled={waiting}
                                                    />
                                                </div>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Password</p>
                                                    <input
                                                        type="text"
                                                        className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                        required
                                                        value={userInfo.password}
                                                        onChange={(e) => {
                                                            setUserInfo({
                                                                ...userInfo,
                                                                password: e.target.value
                                                            });
                                                        }
                                                        }
                                                        disabled={waiting}
                                                    />
                                                </div>
                                            </div>

                                            <div className={"flex flex-row w-full justify-center items-start"}>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Role</p>

                                                    <Listbox value={userInfo.role} onChange={(e) => {
                                                        setUserInfo({
                                                            ...userInfo,
                                                            role: e
                                                        })
                                                    }}>
                                                        <div className="relative mt-1">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                                <span className="block truncate">{userInfo.role}</span>
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
                                                                    {Object.keys(Role).filter((v) => isNaN(Number(v))).map((role, roleIdx) => (
                                                                        <Listbox.Option
                                                                            key={roleIdx}
                                                                            className={({ active }) =>
                                                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                                                }`
                                                                            }
                                                                            value={role}
                                                                        >
                                                                            {({ selected }) => (
                                                                                <>
                                                                                  <span
                                                                                      className={`block truncate ${
                                                                                          selected ? 'font-medium' : 'font-normal'
                                                                                      }`}
                                                                                  >
                                                                                    {role}
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
                                            </div>
                                        </div>


                                        <div className={"flex flex-row w-full justify-center items-start gap-8"}>
                                            <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 hover:scale-110 transition ease-in-out duration-300 ${(waiting || (userInfo.email === '' && userInfo.password === '')) ? 'cursor-not-allowed disabled' : ''}`} onClick={() => {
                                                setUserInfo({
                                                    email: "",
                                                    password: "",
                                                    role: "Customer"
                                                });
                                            }}>
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Reset User</p>
                                            </button>
                                            <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 hover:scale-110 transition ease-in-out duration-300 ${waiting ? 'disabled' : ''}`} onClick={createUser}>
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Create User</p>
                                            </button>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={sensorModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setSensorModal(false)}>
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
                                        as="h1"
                                        className="text-2xl font-gilroyBold leading-6 text-gray-900"
                                    >
                                        Create a Sensor 🔧
                                    </Dialog.Title>

                                    <div className="mt-7">
                                        <p className="text-sm font-gilroyLight text-gray-500">
                                            Fill out the details below in order to create a new sensor, a sensor key will be provided once the sensor is registered.
                                        </p>
                                    </div>

                                    <div className={"flex flex-col h-80 w-full items-start justify-between mt-8"}>

                                        <div className="flex flex-col w-full h-44 justify-between items-start">
                                            <div className={"flex flex-row w-full justify-between items-start"}>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Name</p>
                                                    <input
                                                        type="text"
                                                        className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                        required
                                                        value={sensorInfo.name}
                                                        onChange={(e) => {
                                                            setSensorInfo({
                                                                ...sensorInfo,
                                                                name: e.target.value
                                                            });
                                                        }
                                                        }
                                                        disabled={waiting}
                                                    />
                                                </div>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Description</p>
                                                    <input
                                                        type="text"
                                                        className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                        required
                                                        value={sensorInfo.description}
                                                        onChange={(e) => {
                                                            setSensorInfo({
                                                                ...sensorInfo,
                                                                description: e.target.value
                                                            });
                                                        }
                                                        }
                                                        disabled={waiting}
                                                    />
                                                </div>
                                            </div>

                                            <div className={"flex flex-row w-full justify-center items-start"}>
                                                <div className={"flex flex-col"}>
                                                    <p className="font-gilroy">Secret Token</p>

                                                    <div className={"flex flex-row gap-1"}>
                                                        <input
                                                            type="text"
                                                            className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1 cursor-not-allowed'
                                                            required
                                                            value={sensorInfo.token}
                                                            disabled={true}
                                                        />
                                                        <button className='flex bg-black h-9 w-9 rounded-lg hover:bg-gray-900 hover:scale-105 transition ease-in-out duration-300 items-center justify-center' onClick={() => {}}>
                                                            <i className="text-white fa-solid fa-copy"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className={"flex flex-row w-full justify-center items-start gap-8"}>
                                            <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 hover:scale-110 transition ease-in-out duration-300 ${(waiting || (sensorInfo.name === '' && sensorInfo.description === '')) ? 'cursor-not-allowed disabled' : ''}`} onClick={() => {
                                                setSensorInfo({
                                                    name: "",
                                                    description: "",
                                                    token: ""
                                                });
                                            }}>
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Reset Sensor</p>
                                            </button>
                                            <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 hover:scale-110 transition ease-in-out duration-300 ${waiting ? 'disabled' : ''}`} onClick={createSensor}>
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Create Sensor</p>
                                            </button>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </animated.div>
    )
}

export default Admin;