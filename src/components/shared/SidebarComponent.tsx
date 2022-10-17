import React, {useContext} from "react";
import {ActiveTab} from "../../utils/global";
import {UserContext} from "../../context/UserContext";

const Sidebar: React.FC<any> = ({ activeTabState }) => {

    const { user, setUser } = useContext(UserContext);

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const changeActiveTab = (tab: ActiveTab) => {
        activeTabState.setActiveTab(tab);
    }

    return (
        <div className="h-screen fixed z-10 bg-slate-100 top-0 left-0 py-4 pl-8 pr-1 m-0 flex flex-col justify-between items-center shadow-sm border-y-2 w-64">
            <div className="w-full flex flex-col justify-center items-start mt-14">
                <h1 className="text-3xl font-gilroyExtraBold">sensorify</h1>
            </div>
            <div className="w-full flex flex-col justify-center items-start mb-10 mt-2 grow">

                {user === null ?
                    <>
                        <button onClick={() => { changeActiveTab(ActiveTab.Login) }} className={"transition ease-in-out font-gilroy hover:text-black hover:scale-105 " + (activeTabState.activeTab === ActiveTab.Login ? 'text-black scale-105' : 'text-slate-500')}>
                            <i className="fa-solid fa-lock mr-1"/> Login
                        </button>
                    </> :
                    <>
                        <button onClick={() => {}} className={"transition ease-in-out font-gilroy text-slate-500 hover:text-black hover:scale-105"}>
                            <i className="fa-solid fa-unlock mr-1"/> Logout
                        </button>
                    </>
                }

                <button onClick={() => { openInNewTab("https://github.com/iothubsensor") }} className={"transition ease-in-out font-gilroy text-slate-500 hover:text-black hover:scale-105"}>
                    <i className="fa-solid fa-file-code mr-1"/> Source Code
                </button>

                <button onClick={() => { changeActiveTab(ActiveTab.TOS) }} className={"transition ease-in-out font-gilroy hover:text-black hover:scale-105 " + (activeTabState.activeTab === ActiveTab.TOS ? 'text-black scale-105' : 'text-slate-500')}>
                    <i className="fa-solid fa-book mr-1"/> ToS
                </button>
            </div>

            {user !== null ?
                <div className="w-full flex flex-col justify-center items-start mb-14">
                    <h1 className="text-slate-400 text-xs mt-2">Jake El Mir</h1>
                </div>
                : <></> }

        </div>
    );
}

export default Sidebar;
