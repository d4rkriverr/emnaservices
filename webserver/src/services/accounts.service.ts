import { AuthToken, ENDPOINT_URI } from "./settings";


const UserLogin = async (username: string, password: string) => {
    try {
        const obj = { username, password }
        const res = await fetch(`${ENDPOINT_URI}/account/auth`, { method: "post", body: JSON.stringify(obj) })
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch (e: any) {
        alert(e.message)
        return { success: false, message: "error in retrive data." }
    }
}
const UserInfo = async () => {
    try {
        const res = await fetch(
            `${ENDPOINT_URI}/account/info`,
            {
                method: "POST",
                headers: new Headers({ "Authorization": AuthToken.GetToken(), 'Content-Type': 'application/json' }),
            })
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in retrive data." }
    }

}
export default { UserLogin, UserInfo }
