import React, {useState} from 'react';
import SidebarComponent from "./components/shared/SidebarComponent";

import {ActiveTab} from "./utils/global";
import Login from "./components/screens/Login";

import {UserContext} from './context/UserContext';

import {Toaster} from "react-hot-toast";
import {UserDTO} from "./dtos/user";
import TOS from "./components/screens/TOS";

function App() {

    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Login);
    const [user, setUser] = useState<UserDTO | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <div className="App">
                <SidebarComponent activeTabState={{ activeTab, setActiveTab }} />

                <div className="h-screen w-screen">
                    <div className="h-screen w-full pl-64 flex flex-col pt-8">
                        {activeTab === ActiveTab.Login ? <Login/> : <TOS/>}
                    </div>
                </div>

                <Toaster />
            </div>
        </UserContext.Provider>
    );
}

export default App;
