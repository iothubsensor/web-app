import React, {Fragment, useContext, useState} from "react";
import {animated, useSpring} from "react-spring";
import {Dialog, Transition} from "@headlessui/react";
import {ActiveModal} from "../../utils/global";
import toast from "react-hot-toast";
import {PlantService} from "../../services/plant.service";
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

    const createPlant = async(e: any) => {
        e.preventDefault();

        toast.dismiss();
        setWaiting(true);

        if(sensorInfo.name === "") {
            toast.error("A plant name should be provided.")
        } else if (sensorInfo.description === "") {
            toast.error("A plant description should be provided.")
        } else {
            try {
                const registerSensor = await PlantService.createPlant(user!.token, sensorInfo.name, sensorInfo.description);

                toast.success("Successfully created the plant");

                setSensorInfo({
                    ...sensorInfo,
                    token: registerSensor.key
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
                const registerUser = await UserService.createUser(user!.token, userInfo.email, userInfo.password, 'Admin');
                toast.dismiss();
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

            <div className="flex flex-row w-11/12 h-5/6 items-center justify-center">
                <button className='bg-black rounded-full h-32 w-72  hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                    setSensorModal(true)
                }}>
                    <p className='text-white text-xl font-medium self-center font-gilroyBold'>Create a Plant 🌱</p>
                </button>
            </div>

            <div className="flex flex-row w-11/12 h-5/6 items-center justify-center">
                <button className='bg-black rounded-full h-32 w-72  hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                    setUserModal(true)
                }}>
                    <p className='text-white text-xl font-medium self-center font-gilroyBold'>Create a User 👦👧 </p>
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
                                       Create a User 
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
                                        Create a Plant 🌱
                                    </Dialog.Title>

                                    <div className="mt-7">
                                        <p className="text-sm font-gilroyLight text-gray-500">
                                            Fill out the details below in order to create a new plant, a plant token will be provided once the sensor is registered in order for you to provide it to the IOT device.
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
                                                        disabled={waiting || sensorInfo.token}
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
                                                        disabled={waiting || sensorInfo.token}
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
                                                        <button className='flex bg-black h-9 w-9 rounded-lg hover:bg-gray-900 hover:scale-105 transition ease-in-out duration-300 items-center justify-center' onClick={() => {

                                                            if(sensorInfo.token) {
                                                                navigator.clipboard.writeText(sensorInfo.token).then(() => toast.success("Copied the token to the clipboard!"))
                                                            }

                                                        }}>
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
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Reset Plant</p>
                                            </button>
                                            <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 hover:scale-110 transition ease-in-out duration-300 ${waiting ? 'disabled' : ''}`} onClick={createPlant}>
                                                <p className='text-white text-l font-small self-center font-gilroyBold'>Create Plant</p>
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
