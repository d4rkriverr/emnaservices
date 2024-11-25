import React, { useState } from "react";
import { useAuth } from "../../hooks/auth";

function AuthPage() {
    const AccountHook = useAuth();
    const [state, setState] = useState({ load: false, message: "" })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({ load: true, message: "" })
        const { username, password } = Object.fromEntries(new FormData(e.currentTarget));

        const res = await AccountHook.signIn(username.toString(), password.toString())
        if (typeof res == "string") {
            setState({ load: false, message: res })
            return
        }
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="font-NunitoSans border rounded-lg shadow-lg w-11/12 text-sm max-w-[380px]">
                <div className="p-6 select-none text-center">
                    <h2 className="text-2xl font-bold">Login to your account</h2>
                    <p className="text-xs font-medium text-gray-500">See what is going on with your business.</p>
                </div>
                <div className="mx-6 border"></div>
                <div data-state={state.load} className="h-[350px] data-[state=true]:block hidden">
                    <div className="h-full flex justify-center items-center">
                        <div className="w-16 h-16 border-2 border-t-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
                    </div>
                </div>
                <form data-state={state.load} onSubmit={onSubmit} className="h-[350px] data-[state=true]:hidden grid p-6 gap-4">
                    <p className="text-red-500 text-center font-medium">{state.message}</p>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold">Username</label>
                        <input required name="username" type="text" className="border rounded-lg border-[#DED2D9] outline-none p-3 text-sm font-bold" placeholder="username" />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-semibold">Password</label>
                        <input required name="password" type="password" className="border rounded-lg border-[#DED2D9] outline-none p-3 text-sm" placeholder="•••••••" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <input id="rembme" type="checkbox" />
                        <label htmlFor="rembme" className="select-none">Remember Me</label>
                    </div>
                    <button className="bg-black hover:bg-black/70 py-3 text-white rounded-lg">login</button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage;