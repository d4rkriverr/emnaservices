import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const Layout = () => {
    const { account, logOut } = useAuth()
    const [openMenu, setOpenMenu] = useState(false)
    const toggleMenu = () => setOpenMenu((e) => !e)

    const [openProfile, setOpenProfile] = useState(false)
    const toggleOpenProfile = () => setOpenProfile((e) => !e)
    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="flex justify-between items-center p-3 gap-3 border-b">
                <div className="relative flex-1 block lg:hidden">
                    <button onClick={toggleMenu} className="border p-3">MENU</button>
                    <div data-state={openMenu} className="data-[state=false]:hidden flex z-20 fixed top-0 left-0 w-screen h-screen bg-black/70">
                        <div className="w-3/5 h-full bg-white">
                            <div className="text-2xl text- font-[Jua] p-5 border-b">EMNA VISA</div>
                            <ul className="p-5 flex-1 grid gap-1 [&>*>*]:w-full">
                                <li><NavLink to={""} onClick={toggleMenu} style={{ width: "100%", textAlign: "start", padding: "10px" }} className="navlink">Dashboard</NavLink></li>
                                <li><NavLink to={"invoices"} onClick={toggleMenu} style={{ width: "100%", textAlign: "start", padding: "10px" }} className="navlink">Invoices</NavLink></li>
                                <li><NavLink to={"expanses"} onClick={toggleMenu} style={{ width: "100%", textAlign: "start", padding: "10px" }} className="navlink">Expanses</NavLink></li>
                                <li><NavLink to={"employees"} onClick={toggleMenu} style={{ width: "100%", textAlign: "start", padding: "10px" }} className="navlink">Employees</NavLink></li>
                            </ul>
                        </div>
                        <div className="flex-1" onClick={toggleMenu}>

                        </div>
                    </div>
                </div>
                <div className="flex-1 hidden lg:flex items-center">
                    <div className="text-lg font-[Jua] px-10">EMNA VISA</div>
                    <ul className="flex-1 flex gap-1">
                        <li><NavLink to={""} className="navlink">Dashboard</NavLink></li>
                        <li><NavLink to={"invoices"} className="navlink">Invoices</NavLink></li>
                        <li><NavLink to={"expanses"} className="navlink">Expanses</NavLink></li>
                        <li><NavLink to={"employees"} className="navlink">Employees</NavLink></li>
                    </ul>
                </div>
                <div className="relative">
                    <div onClick={toggleOpenProfile} className="flex gap-1 items-center border-2 rounded-lg p-2 cursor-pointer">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-600">
                            <b className="text-[10px] text-white uppercase">{account?.username[0]}</b>
                        </div>
                        <p className="flex-1 text-center text-lg">{account?.username}</p>
                    </div>
                    <div data-state={openProfile} className="data-[state=false]:hidden absolute right-0 py-1 w-56">
                        <div className="bg-white shadow-lg border p-1 rounded-lg flex flex-col ">
                            <button onClick={logOut} className="hover:bg-gray-200 text-start p-2 rounded-md ">logout</button>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div >
    )
}

export default Layout;