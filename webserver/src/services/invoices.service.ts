import { Invoice } from "../datatype/invoice_datatype";
import { AuthToken, ENDPOINT_URI } from "./settings";

const CreateInvoice = async (obj: Invoice) => {
    try {
        const res = await fetch(ENDPOINT_URI + "/invoices/create",
            {
                method: "post",
                body: JSON.stringify(obj),
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in creating invoices." }
    }
}

const GetInvoicesByDates = async (from: string, to: string, schVal: string, agent: string) => {
    try {
        const res = await fetch(`${ENDPOINT_URI}/invoices/find?val=${schVal}&agent=${agent}&start=${from}&end=${to}`,
            {
                method: "GET",
                headers: { "Authorization": AuthToken.GetToken() },
            }
        )
        if (!res.ok) throw new Error("cannot connect to server");
        return await res.json()
    } catch {
        return { success: false, message: "error in creating invoices." }
    }
}

export default { GetInvoicesByDates, CreateInvoice }