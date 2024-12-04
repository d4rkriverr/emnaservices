import { FormEvent, useRef, useState } from "react";
import { Invoice } from "../../datatype/invoice_datatype";

interface StateType {
    currentView: number,
    message: string,
    data: Invoice | null
}
interface PageState {
    onClose: () => void,
    onPrint: (e: Invoice) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCreate: (o: Invoice) => Promise<any>,
}

const NewInvoicePage = ({ onClose, onCreate, onPrint }: PageState) => {
    const [state, setState] = useState<StateType>({ currentView: 0, message: "", data: null });
    const formRef = useRef<HTMLFormElement>(null)

    const defaultDate = (new Date()).toLocaleDateString().split("/").reverse().join("-")

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setState({ currentView: 1, data: null, message: "" })
        e.preventDefault();
        const o = Object.fromEntries(new FormData(e.currentTarget));
        const issueDate = o.issue_date.toString()
        const obj: Invoice = {
            id: 0,
            fullname: o.fullname.toString(),
            phone_number: o.phone_number.toString(),
            product_name: o.product_name.toString(),
            product_price: Number(o.product_price),
            product_discount: Number(o.product_discount),
            advance_payment: Number(o.advance_payment),
            agent: o.agent.toString(),
            issue_date: issueDate.split("/").reverse().join("-"),
        }
        const r = await onCreate(obj);
        console.log(r);

        if (!r.success) {
            setState({ currentView: 0, message: r.message, data: null })
            return
        }
        obj.id = r.payload
        setState({ currentView: 2, data: obj, message: "" })
    }

    const onCloseAndPrint = () => {
        onCloseDiaLog()
        onPrint(state.data!)
    }

    const onCloseDiaLog = () => {
        formRef.current?.reset()
        setState({ currentView: 0, message: "", data: null })
        onClose()
    }

    return (
        <div className="relative bg-white rounded-lg flex justify-center items-center p-5">
            <div data-state={state.currentView} className="invisible data-[state=1]:visible z-10 absolute bg-white w-full h-full rounded-lg flex justify-center items-center">
                <div className="w-20 h-20 border-4 rounded-full border-t-teal-500 animate-spin"></div>
            </div>
            <div data-state={state.currentView} className="invisible data-[state=2]:visible z-10 absolute bg-white w-full h-full rounded-lg flex justify-center items-center">
                <div className="w-96 h-full flex flex-col gap-1 p-5" >
                    <h2 className="flex-1 py-10 text-3xl text-center">Invoice added <br /> successfully</h2>
                    <h2>invoice ID: #{state.data?.id}</h2>
                    <button onClick={onCloseAndPrint} className="text-center py-2 bg-blue-500 text-sm font-medium text-white rounded-sm">Print</button>
                    <button onClick={onCloseDiaLog} className="py-2 bg-gray-100 text-sm font-medium rounded-sm">Close</button>
                </div>
            </div>
            <form ref={formRef} onSubmit={onSubmit} className="flex-1 flex flex-col justify-center items-center gap-2 [&>*]:w-full">
                <h2 className="text-3xl font-bold text-center my-4">New Invoice</h2>
                <p className="text-center mb-3 text-red-500">{state.message}</p>
                <div className="flex gap-2">
                    <div className="flex-1 grid gap-1">
                        <label className="text-xs">Client Name:</label>
                        <input type="text" name="fullname" className="border px-2 py-2 rounded-md" id="" />
                    </div>
                    <div className="flex-1 grid gap-1">
                        <label className="text-xs">Client Phone:</label>
                        <input type="text" name="phone_number" className="border px-2 py-2 rounded-md" id="" />
                    </div>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="grid gap-1">
                    <label className="text-xs">Product / service:</label>
                    <select name="product_name" className="border px-2 py-2 rounded-md text-sm">
                        <option value="contract_to_romania">Work Contract To Romaina</option>
                        <option value="contract_to_poland">Work Contract To Poland</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 grid gap-1">
                        <label className="text-xs">Total Amount:</label>
                        <input type="text" name="product_price" className="border px-2 py-2 rounded-md" id="" />
                    </div>
                    <div className="flex-1 grid gap-1">
                        <label className="text-xs">Advance Payment:</label>
                        <input type="text" name="advance_payment" className="border px-2 py-2 rounded-md" id="" />
                    </div>
                </div>
                <div className="grid gap-1">
                    <label className="text-xs">Discount Amount:</label>
                    <select name="product_discount" className="border px-2 py-2 rounded-md">
                        <option value="10">0%</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="30">30%</option>
                        <option value="40">40%</option>
                        <option value="50">50%</option>
                    </select>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="grid gap-1">
                    <label className="text-xs">Agent:</label>
                    <input type="text" name="agent" className="border px-2 py-2 rounded-md" />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs">Issue Date:</label>
                    <input type="date" name="issue_date" defaultValue={defaultDate} className="border text-sm px-2 py-2 rounded-md font-bold text-gray-500 select-none" />
                </div>
                <br />
                <button className="bg-black hover:bg-black/80 text-white py-2.5 text-sm rounded-md font-medium border">Sumbit</button>
                <button type="reset" onClick={onCloseDiaLog} className="hover:bg-gray-100 bg-gray-50/50 py-2.5 text-sm rounded-md font-medium border">Cancel</button>
            </form>
        </div>
    )
}

export default NewInvoicePage;