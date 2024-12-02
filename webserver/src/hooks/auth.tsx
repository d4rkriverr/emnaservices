import { createContext, useContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { Account } from "../datatype/account_datatype";
import accountsService from "../services/accounts.service";
import { AuthToken } from "../services/settings";

interface IAuthContext {
    isLoad: boolean;
    isAuthed: boolean;
    account?: Account;
    signIn: (username: string, password: string) => Promise<unknown>;
    logOut: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<IAuthContext>({} as any);

const useAuth = () => useContext(AuthContext);

const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
    const [isLoad, setIsLoad] = useState(true);
    const [isAuthed, setIsAuthed] = useState(true);
    const [account, setAccount] = useState<Account>();

    useEffect(() => { init() }, []);

    const init = async () => {
        const res = await accountsService.UserInfo()
        if (!res.success) {
            setIsLoad(false);
            setIsAuthed(false);
            return
        }
        // account info back 
        setIsLoad(false)
        setIsAuthed(true)
        const { username, role } = (res.payload);
        setAccount({ username, role });
    };

    const signIn = async (username: string, password: string) => {
        if (username == "" || password == "") {
            return "username and password required!"
        }
        const res = await accountsService.UserLogin(username, password);
        if (!res.success) {
            setIsAuthed(false);
            
            return res.message;
        }
        AuthToken.SetToken(res.payload);
        location.replace("/")
        return;
    };

    const logOut = () => {
        AuthToken.DelToken()
        setIsAuthed(false)
        redirect("/auth")
    }

    return (
        <AuthContext.Provider
            value={{
                isLoad,
                isAuthed,
                account,
                signIn,
                logOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider, useAuth };