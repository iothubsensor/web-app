import React, {useState} from 'react';
import SidebarComponent from "./components/shared/SidebarComponent";

import {ActiveTab} from "./utils/global";
import Login from "./components/screens/Login";

import {UserContext} from './context/UserContext';

import toast, {Toaster} from "react-hot-toast";
import {Role, UserDTO} from "./dtos/user";
import Plants from "./components/screens/Plants";
import {destroyUserLocally, loadUserLocally} from "./services/storage.service";

import fetchIntercept from 'fetch-intercept';
import Admin from "./components/screens/Admin";

function App() {

    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.SENSORS);
    const [user, setUser] = useState<UserDTO | null>(loadUserLocally);

    const unregister = fetchIntercept.register({
        request: function (url, config) {
            return [url, config];
        },

        requestError: function (error) {
            return Promise.reject(error);
        },

        response: function (response) {
            /*if(!response.ok && (response.status === 401)) {
                toast.dismiss();

                destroyUserLocally()
                setUser(null)
            }*/

            return response;
        },

        responseError: function (error) {
            return Promise.reject(error);
        },
    });

    return (
        <UserContext.Provider value={{user, setUser}}>
            <div className="App">
                <SidebarComponent activeTabState={{ activeTab, setActiveTab }} />

                <div className="h-screen w-screen">
                    <div className="h-screen w-full flex flex-col pl-64 pt-8">
                        {(user === null) ?
                            <Login activeTabState={{ activeTab, setActiveTab }} /> :
                            activeTab === ActiveTab.SENSORS ? <Plants/> : <Admin/>
                        }
                    </div>
                </div>

                <Toaster />
            </div>
        </UserContext.Provider>
    );
}

export default App;