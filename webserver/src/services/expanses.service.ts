import { ExpenseInvoice } from "../datatype/expenses_datatype";
import { AuthToken, ENDPOINT_URI } from "./settings";

const GetExpanses = async (from: string, to: string) => {
    try {
        const res = await fetch(
            `${ENDPOINT_URI}/expenses/find?from=${from}&to=${to}`,
            {
                headers: {
                    "Authorization": AuthToken.GetToken(),
                }
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        const data = await res.json()
        return {
            invoices: data.payload.invoices as ExpenseInvoice[],
            activities: data.payload.activities as string[],
            payMethod: data.payload.payMethod as string[],
        }
    } catch {
        return "error in retrive invoices."
    }
}

const CreateExpanses = async (obj: ExpenseInvoice) => {
    try {
        const res = await fetch(
            ENDPOINT_URI + "/expenses/create",
            {
                method: "post",
                body: JSON.stringify(obj),
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in retrive invoices." }
    }
}


export default { GetExpanses, CreateExpanses }