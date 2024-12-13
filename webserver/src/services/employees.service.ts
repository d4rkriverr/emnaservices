import { EmployeeWithMonthlyMetrics } from "../datatype/employee_datatype";
import { AuthToken, ENDPOINT_URI } from "./settings";


const GetEmployees = async (d: string) => {
    try {
        const res = await fetch(
            `${ENDPOINT_URI}/employees/find?d=${d}`,
            {
                headers: {
                    "Authorization": AuthToken.GetToken(),
                }
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        const data = await res.json()
        return data.payload as EmployeeWithMonthlyMetrics[];
    } catch {
        return "error in retrive invoices."
    }
}

const CreateEmployee = async (obj: object) => {
    try {
        const res = await fetch(ENDPOINT_URI + "/employees/create",
            {
                method: "post",
                body: JSON.stringify(obj),
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in creating employee." }
    }
}

const UpdateMonthlyMatric = async (date: string, obj: object) => {
    try {
        const res = await fetch(ENDPOINT_URI + "/employees/monthly_metric/cu?d=" + date,
            {
                method: "post",
                body: JSON.stringify(obj),
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in creating monthly metrics." }
    }
}
const UpdateMatricData = async (obj: object) => {
    try {
        const res = await fetch(ENDPOINT_URI + "/employees/monthly_metric/ud",
            {
                method: "post",
                body: JSON.stringify(obj),
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in updating metric." }
    }
}
export default { GetEmployees, CreateEmployee, UpdateMonthlyMatric, UpdateMatricData }