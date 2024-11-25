import { FormEvent, useState } from "react";
import { ExpenseInvoice } from "../../datatype/expenses_datatype";

interface Params {
    shown: boolean,
    activities: string[],
    payMethod: string[],
    toggleDialog: () => void,
    onUpdate: () => void,
    onCreate: (o: ExpenseInvoice) => Promise<{ success: boolean }>
}
const CreateDialog = ({ shown, activities, payMethod, toggleDialog, onUpdate, onCreate }: Params) => {
    const [state, setState] = useState({ currentView: 0, message: "" })

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({ currentView: 1, message: "" })
        const o = Object.fromEntries(new FormData(e.currentTarget))
        const obj: ExpenseInvoice = {
            description: o.description.toString(),
            activity: o.category.toString(),
            total_cost: Number(o.totalCost),
            payment_method: o.paymentMethod.toString(),
            agent: o.agent.toString(),
            issue_date: o.date.toString(),
            status: o.status.toString(),
            id: "",
            selected: false
        }
        const r = await onCreate(obj)
        if (!r.success) {
            setState({ currentView: 0, message: "cannot create invoice" })
            return
        }
        setState({ currentView: 2, message: "" })
    }

    const exit = () => {
        if (state.currentView == 2) {
            onUpdate()
        }
        setState({ currentView: 0, message: "" })
        toggleDialog()
    }
    return (
        <div data-state={shown} className="data-[state=false]:hidden z-20 fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/70">
            <div className="flex flex-col bg-white w-[450px] p-5 rounded-lg border-2">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Add New Expense Invoice</h2>
                <p className="text-center text-red-400">{state.message}</p>
                <form data-state={state.currentView} onSubmit={onSubmit} className="hidden data-[state=0]:block space-y-4">
                    <div className="grid">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <input type="text" id="description" name="description" className="border p-2 border-gray-300 rounded-md shadow-sm" required />
                    </div>

                    <div className="grid">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
                        <select id="category" name="category" className="border p-2 border-gray-300 rounded-md shadow-sm" required>
                            {activities.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <div className="grid">
                        <label htmlFor="totalCost" className="text-sm font-medium text-gray-700">Total Cost</label>
                        <input type="number" id="totalCost" name="totalCost" className="border p-2 border-gray-300 rounded-md shadow-sm" required />
                    </div>

                    <div className="grid">
                        <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">Payment Method</label>
                        <select id="paymentMethod" name="paymentMethod" className="border p-2 border-gray-300 rounded-md shadow-sm" required>
                            {payMethod.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <div className="grid">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                        <select id="status" name="status" className="border p-2 border-gray-300 rounded-md shadow-sm" required>
                            <option value="Paid">Paid</option>
                            <option value="Reimbursed">Reimbursed</option>
                        </select>
                    </div>

                    <div className="grid">
                        <label htmlFor="agent" className="text-sm font-medium text-gray-700">Agent</label>
                        <input type="text" id="agent" name="agent" className="border p-2 border-gray-300 rounded-md shadow-sm" required />
                    </div>


                    <div className="grid">
                        <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
                        <input type="date" id="date" name="date" className="border p-2 border-gray-300 rounded-md shadow-sm" required />
                    </div>


                    <div className="flex justify-end gap-2">
                        <button type="reset" onClick={toggleDialog} className="px-8 py-2 bg-gray-100 rounded-md">cancel</button>
                        <button className="px-8 py-2 text-white bg-purple-500 rounded-md">save</button>
                    </div>
                </form>
                <div data-state={state.currentView} className="hidden data-[state=1]:flex justify-center items-center py-3">
                    <div className="w-16 h-16 border-2 border-gray-300 border-t-teal-300 rounded-full animate-spin"></div>
                </div>
                <div data-state={state.currentView} className="hidden data-[state=2]:flex flex-col gap-10 justify-center items-center py-3">
                    <div className="py-3 text-center">
                        <p className="text-xl font-bold text-green-500">invoice added successfully</p>
                        <p className="text-xl font-bold text-gray-500 underline">inv-0001</p>
                    </div>
                    <button onClick={exit} className="text-sm font-semibold bg-gray-100 w-full py-3 uppercase">exit</button>
                </div>
            </div>
        </div>
    )
}

export default CreateDialog;