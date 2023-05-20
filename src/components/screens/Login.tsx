import React, {useContext, useState} from "react";
import toast from "react-hot-toast";
import {LoginState, UserDTO, UserLoginRequestDto} from "../../dtos/user";
import {animated, useSpring} from "react-spring";
import {UserService} from "../../services/user.service";
import {useCookies} from "react-cookie";
import {destroyUserLocally, saveUserLocally} from "../../services/storage.service";
import {UserContext} from "../../context/UserContext";
import {ActiveTab} from "../../utils/global";

const Login: React.FC<any> = ({ activeTabState }) => {

    const [loginUser, setLoginUser] = useState<UserLoginRequestDto>(new UserLoginRequestDto());
    const [currentState, setCurrentState] = useState<LoginState>(LoginState.INPUT_EMAIL);
    const [isWaiting, setIsWaiting] = useState(false);

    const appUser = useContext(UserContext);

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const switchToState = (state: LoginState) => {
        api({ reset: true });
        setCurrentState(state);
        api({ reset: false });
    };

    const handleStep = async(e: any) => {
        e.preventDefault();
        toast.dismiss();

        setIsWaiting(true)

        switch(currentState) {
            case LoginState.INPUT_EMAIL:

                if(loginUser.email == null || loginUser.email === "") {
                    toast.error("An email is required to authenticate.", {
                        duration: 3000,
                        className: 'font-gilroyLight'
                    });

                    setIsWaiting(false)

                    return;
                }

                if(!validateEmail(loginUser.email)) {
                    toast.error("The given email is not a valid email.", {
                        duration: 3000,
                        className: 'font-gilroyLight'
                    });

                    setIsWaiting(false)

                    return;
                }

                switchToState(LoginState.INPUT_PASSWORD)

                break;
            case LoginState.INPUT_PASSWORD:
                if(loginUser.password == null || loginUser.password === "") {
                    toast.error("A password is required to authenticate.");
                    setIsWaiting(false)
                    return;
                }

                try {
                    toast.dismiss();
                    toast.loading("Attempting to log you in...");

                    const loginDetails = await UserService.login(loginUser);

                    const userDTO: UserDTO = (loginDetails.user) as UserDTO;
                    userDTO.token = loginDetails.access_token;

                    login(userDTO);
                    setIsWaiting(false);

                    toast.dismiss();
                    toast.success("Successfully authenticated.");

                    console.log(userDTO);

                    activeTabState.setActiveTab(ActiveTab.SENSORS);

                } catch (e) {

                    console.log(e)

                    toast.error("The email/password combination is incorrect.");
                    setIsWaiting(false)
                    return;
                }

                break;
            case LoginState.SETUP:
                if(loginUser.firstName == null || loginUser.firstName === "") {
                    toast.error("A first name is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                if(loginUser.lastName == null || loginUser.lastName === "") {
                    toast.error("A last name is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                if(loginUser.address == null || loginUser.address === "") {
                    toast.error("An address is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                if(loginUser.jobDescription == null || loginUser.jobDescription === "") {
                    toast.error("A job description is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                if(loginUser.phoneExtension == null || loginUser.phoneExtension === "") {
                    toast.error("A phone extension is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                if(loginUser.phoneNumber == null || loginUser.phoneNumber === "") {
                    toast.error("A phone number is required to setup.");
                    setIsWaiting(false)
                    return;
                }

                try {
                    let currentToken = appUser.user?.token;
                    const registerRequest = await UserService.register(loginUser, currentToken);

                    const userDTO: UserDTO = (registerRequest) as UserDTO;
                    userDTO.token = currentToken;

                    login(userDTO);
                    setIsWaiting(false);

                    toast.success("Successfully registered your account.");
                    activeTabState.setActiveTab(ActiveTab.SENSORS);
                } catch (e) {

                    console.log(e)

                    toast.error("The token seems to have expired, login again.");
                    setIsWaiting(false)
                    return;
                }

                break;
        }
    };

    const goBack = () => {
        switch(currentState) {
            case LoginState.INPUT_PASSWORD:
                switchToState(LoginState.INPUT_EMAIL)
                break;
        }
    };

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const login = (user: UserDTO) => {
        appUser.setUser?.(user);
        saveUserLocally(user);
    }


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

    return (
        <div>
            <div className="flex w-11/12 h-32 flex-row items-center justify-between mx-16 mt-2">
                <animated.svg style={initialLoad} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="10%"
                     height="100%"
                     viewBox="0 0 512 512" xmlSpace="preserve">
                    <g>
                        <path d="M406,254c-0.9,24-6.2,44.1-22.5,59.3c-23.2,21.5-57.1,23.4-84.2,5.3c-6.3-4.2-12.1-9.3-17.9-14.3
                            c-5.5-4.8-6.1-12.4-1.8-17.4c4.6-5.3,11.9-5.3,17.8-0.5c5.8,4.7,11.4,9.9,17.8,13.5c29.1,16.3,61,0.2,65.8-32.8
                            c1.6-11.2,1-22.2-2.8-32.9c-8.5-24-33.7-35-57.2-24.9c-13.5,5.8-24,15.6-33.2,26.7c-14,16.9-27.4,34.4-41.4,51.3
                            c-13.7,16.5-28.8,31.5-49.5,39.3c-39.6,15-82.3-10.2-89.1-52c-3.6-22.1-1.7-43.1,9.7-62.6c13.4-23,39-33,63.8-30.3
                            c20.6,2.3,36,13.7,50.4,27.2c4.7,4.4,4.4,12.3,0.1,16.7c-4.5,4.6-11.6,4.8-16.7,0.5c-4.7-3.9-9.2-8.3-14.2-11.7
                            c-17.7-12-39.2-11.6-54.3,0.7c-7.5,6.1-12,14.3-14.3,23.5c-3.3,12.8-3.1,25.7,1.2,38.3c8.9,25.9,35.6,36.7,60.3,24.3
                            c14.8-7.4,25.7-19.4,36-31.9c13.8-16.7,26.8-34,40.8-50.5c12.1-14.4,26.2-26.6,44.1-33.4c40.2-15.1,82.5,9.6,89.3,52.2
                            C404.9,243.8,405.5,250,406,254z"/>
                        <path d="M253.6,56c43.6,1.2,78,17.2,106.1,47.3c5.1,5.5,4.8,13.8-0.4,18.9c-5.1,4.9-12.8,4.8-18.3-0.7c-12-12-25.3-22.1-41.1-28.5
                            c-40.4-16.3-78.1-10.5-113,14.8c-5.4,3.9-10.1,8.6-15,13.1c-6.2,5.9-13.7,6.5-19.1,1.2c-5.5-5.3-5.3-13.5,0.3-19.6
                            c21.8-23.3,48.2-38.4,79.7-44.2C240.3,56.8,248.2,56.5,253.6,56z"/>
                        <path d="M258.1,455.8c-43.6-1.3-77.8-17.3-105.8-47.2c-5.2-5.6-4.9-13.8,0.4-18.8c5.3-5.1,12.9-4.8,18.7,1
                            c16.9,17,36.6,29.1,60.2,34.3c34.5,7.6,65.6-0.4,93.6-21.1c5.2-3.8,10-8.3,14.7-12.8c6.5-6.2,14-6.8,19.4-1.4
                            c5.4,5.4,5.1,13.4-0.7,19.6c-21.7,23.1-48,38.1-79.3,44C271.6,455,263.5,455.3,258.1,455.8z"/>
                        <path d="M265,112.6c16.2,0.1,37.4,9.4,55.4,26.5c6.7,6.4,7.2,13.8,1.7,19.8c-5.1,5.5-12.9,5.5-19.6-0.4
                            c-13.2-11.7-28.5-18.3-46.2-18.4c-16.7-0.1-31.6,5.6-44.4,16.3c-1.5,1.3-3,2.6-4.7,3.7c-6.3,4.3-13.5,3.5-17.9-1.9
                            c-4.5-5.6-4.1-12.6,1.1-18C206.9,122.8,231.4,112.6,265,112.6z"/>
                        <path d="M255.9,399.5c-25.3-0.3-46.7-9.7-64.7-27c-6.2-6-6.7-13.2-1.6-19c4.9-5.7,12.5-6.1,19.1-0.5c9.8,8.4,20.5,14.6,33.2,17.3
                            c21.9,4.6,41.1-1.1,58.3-14.9c1.8-1.5,3.6-3.1,5.5-4.3c5.7-3.5,12.5-2.4,16.7,2.5c4.5,5.3,4.8,12.3-0.1,17.2
                            c-13.7,14.1-30.2,23.3-49.6,26.9C267.2,398.8,261.5,399,255.9,399.5z"/>
                    </g>
                </animated.svg>

                <animated.button style={initialLoad} className='bg-black rounded-full h-8 w-36 hover:bg-gray-900 flex items-center justify-center' onClick={() => {
                    openInNewTab("https://web.whatsapp.com/send/?phone=15551234567&text&type=phone_number&app_absent=0");
                }}>
                    <i className="fa-solid fa-comment text-white mr-2 "></i>
                    <p className='text-white text-xs font-medium self-center font-gilroyBold'>Chat with us</p>
                </animated.button>
            </div>

            {currentState !== LoginState.INPUT_EMAIL &&
                <animated.div style={styles} className="flex w-11/12 h-4 flex-row items-start justify-start mx-16 my-2">
                    <button
                        className='bg-black rounded-full h-8 w-24 hover:bg-gray-900 flex items-center justify-center'
                        onClick={goBack}>
                        <i className="fa-solid fa-circle-chevron-left text-white mr-2 "></i>
                        <p className='text-white text-xs font-medium self-center font-gilroyBold'>Back</p>
                    </button>
                </animated.div>
            }

            <div className={`flex flex-col w-3/5 items-start justify-start mx-80 ${currentState === LoginState.INPUT_EMAIL ? 'my-44' : 'my-40'}`}>

                {currentState === LoginState.INPUT_EMAIL ?
                    <animated.div style={styles} className={`flex flex-col h-80 w-full items-start justify-between`}>
                        <div className="flex flex-col h-20 w-full items-start justify-between">
                            <p className="text-4xl font-gilroyBold">Welcome to Plantify 👋</p>
                            <p className="text-xl text-gray-500 font-gilroyLight">Please enter your email.</p>
                        </div>

                        <form onSubmit={handleStep} className={"flex flex-col h-24 w-full items-start justify-between"}>
                            <p className="font-gilroy">Email</p>
                            <input
                                type="email"
                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                required
                                value={loginUser.email}
                                onChange={(e) => {
                                    setLoginUser({
                                        ...loginUser,
                                        email: e.target.value
                                    });
                                }}
                            />
                        </form>

                        <button className='bg-black rounded-full h-14 w-44 hover:bg-gray-900' onClick={handleStep}>
                            <p className='text-white text-l font-small self-center font-gilroyBold'>Continue</p>
                        </button>

                    </animated.div>

                    :currentState === LoginState.INPUT_PASSWORD ?

                        <animated.div style={styles} className="flex flex-col h-80 w-full items-start justify-between">
                            <div className="flex flex-col h-20 w-full items-start justify-between">
                                <p className="text-4xl font-gilroyBold">Enter your password 🔒</p>
                                <p className="text-xl text-gray-500 font-gilroyLight">Please enter your password.</p>
                            </div>

                            <form className={"flex flex-col h-24 w-full items-start justify-between"} onSubmit={handleStep}>
                                <p className="font-gilroy">Password</p>
                                <input
                                    type="password"
                                    className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                    required
                                    value={loginUser.password}
                                    onChange={(e) => {
                                        setLoginUser({
                                            ...loginUser,
                                            password: e.target.value
                                        });
                                    }
                                    }
                                />
                            </form>

                            <button className='bg-black rounded-full h-14 w-44 hover:bg-gray-900' onClick={handleStep}>
                                <p className='text-white text-l font-small self-center font-gilroyBold'>Continue</p>
                            </button>
                        </animated.div>

                        :currentState === LoginState.SETUP ?

                            <animated.div style={styles} className="flex flex-col h-128 w-full items-start justify-between">
                                <div className="flex flex-col h-20 w-full items-start justify-between">
                                    <p className="text-4xl font-gilroyBold">Please fill your details 👤</p>
                                    <p className="text-xl text-gray-500 font-gilroyLight">It seems you're setting up your account. Input your details!</p>
                                </div>

                                <form className={"flex flex-col h-72 w-full items-start justify-between"} onSubmit={handleStep}>

                                    <div className={"flex flex-row w-10/12 justify-between items-start"}>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">First Name</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                required
                                                value={loginUser.firstName}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        firstName: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">Last Name</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                required
                                                value={loginUser.lastName}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        lastName: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                    </div>


                                    <div className={"flex flex-row w-10/12 justify-between items-start"}>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">Address</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                required
                                                value={loginUser.address}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        address: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">Job Description</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                required
                                                value={loginUser.jobDescription}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        jobDescription: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className={"flex flex-row w-10/12 justify-between items-start"}>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">Phone Extension</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-11 mb-5 pl-1'
                                                required
                                                value={loginUser.phoneExtension}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        phoneExtension: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                        <div className={"flex flex-col"}>
                                            <p className="font-gilroy">Phone Number</p>
                                            <input
                                                type="text"
                                                className='border-solid border-2 border-gray-100 rounded-md h-9 w-80 mb-5 pl-1'
                                                required
                                                value={loginUser.phoneNumber}
                                                onChange={(e) => {
                                                    setLoginUser({
                                                        ...loginUser,
                                                        phoneNumber: e.target.value
                                                    });
                                                }
                                                }
                                            />
                                        </div>
                                    </div>

                                </form>

                                <button className={`bg-black rounded-full h-14 w-44 hover:bg-gray-900 ${isWaiting ? 'disabled cursor-disabled' : ''}`} onClick={handleStep}>
                                    <p className='text-white text-l font-small self-center font-gilroyBold'>Continue</p>
                                </button>
                            </animated.div>

                            : <></>
                }

            </div>
        </div>
    )
}

export default Login;