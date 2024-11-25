import { useAuth } from "../hooks/auth";

export default function AuthManager({ element, prIndex }: { element: JSX.Element, prIndex: number }) {
    const { account } = useAuth();
    if (account == undefined || account.role[prIndex] == "0") return (
        <div className="flex-1 flex justify-center p-4 items-center">
            <h2 className="font-bold text-3xl text-center font-NunitoSans">UNAUTHORIZED ACCESS</h2>
        </div>
    )
    return element;
}