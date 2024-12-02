// const ENDPOINT_URI = "http://emnaservices.online/api"
const ENDPOINT_URI = import.meta.env.VITE_API_BASE_URL;
const TOKEN_NAME = "sdhex"
const AuthToken = {
    GetToken: () => {
        const token = localStorage.getItem(TOKEN_NAME)
        if (token == null || token == "") return "Bearer ";
        return `Bearer ${token}`;
    },
    SetToken: (value: string) => {
        localStorage.setItem(TOKEN_NAME, value)
    },
    DelToken: () => {
        localStorage.removeItem(TOKEN_NAME)
    }
}
export { ENDPOINT_URI, AuthToken }