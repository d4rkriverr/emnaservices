import { ChangeEvent, useEffect, useState } from "react";
import { ExpenseInvoice } from "../../datatype/expenses_datatype";


interface Params {
    data: ExpenseInvoice[],
    onCheckAll: (e: ChangeEvent<HTMLInputElement>) => void,
    onCheckOne: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function ExpansesDataTable({ data, onCheckAll, onCheckOne }: Params) {
    const PAGE_SIZE = 10;
    const bgForStatus = (s: string) => s == "Paid" ? "#18a731" : "#7000ff";
    const [state, setState] = useState({ page_count: 0, current_page: 0, invoices: data })

    useEffect(() => {
        setState({ page_count: Math.ceil(data.length / PAGE_SIZE), current_page: 0, invoices: data })
    }, [data])

    const NextPage = () => {
        if (state.current_page == (state.page_count - 1)) return;
        setState((o) => ({ ...o, current_page: state.current_page + 1 }))
    }

    const PreviousPage = () => {
        if (state.current_page == 0) return;
        setState((o) => ({ ...o, current_page: state.current_page - 1 }))
    }

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        const r = [...data].filter((e) =>
            e.description.toLowerCase().includes(val) ||
            e.activity.toLowerCase().includes(val) ||
            e.agent.toLowerCase().includes(val) ||
            e.payment_method.toLowerCase().includes(val) ||
            e.id.toLowerCase().includes(val)
        )
        setState({ page_count: Math.ceil(r.length / PAGE_SIZE), current_page: 0, invoices: r })
    }

    const dataMapper = () => {
        const start_at = state.current_page * PAGE_SIZE;
        return state.invoices.slice(start_at, start_at + PAGE_SIZE)
    }

    return (
        <div className="grid gap-2 py-3">
            <div className="flex max-sm:flex-col justify-between items-center gap-0.5 [&>*]:flex-1">
                <input onChange={onSearch} type="text" className="border border-gray-400 rounded-md px-3 py-1.5 w-full lg:w-96" placeholder="search..." />
                <div className="w-full flex items-center max-sm:mt-2">
                    <p className="flex-1 text text-center select-none"> page <b>{state.current_page + 1}</b> of <b>{state.page_count}</b> </p>
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex gap-1">
                            <button onClick={PreviousPage} className="w-20 hover:bg-gray-200 bg-gray-100 border p-2 text-xs font-medium rounded-md">Previous</button>
                            <button onClick={NextPage} className="w-20 hover:bg-gray-200 bg-gray-100 border p-2 text-xs font-medium rounded-md">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overflow-auto">

                <table className="w-full [&>*]:border-y border">
                    <thead>
                        <tr className="[&>*]:py-2 bg-gray-100">
                            <th className="w-10 text-center"><input onChange={onCheckAll} type="checkbox" name="" id="" /></th>
                            <th className="w-28 text-start">ID</th>
                            <th className="text-start">Description</th>
                            <th className="w48 text-center">Activity</th>
                            <th className="w-48 text-center">Total</th>
                            <th className="w-48">Payment Method</th>
                            <th className="w-48">Agent</th>
                            <th className="w-48">Status</th>
                            <th className="w-48">Date</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.invoices.length == 0 && (
                            <tr>
                                <td colSpan={10}><p className="text-center py-3 font-bold text-gray-500 uppercase text-sm">no data yet</p></td>
                            </tr>
                        )}

                        {dataMapper().map((e, i) => (
                            <tr key={i} className="[&>*]:py-2 border-b">
                                <td className="text-center"><input data-id={e.id} onChange={onCheckOne} checked={e.selected} type="checkbox" name="" id="" /></td>
                                <td className="font-bold">{e.id}</td>
                                <td className="">{e.description}</td>
                                <td className="px-3 text-center">
                                    <button className="w-full border-2 hover:bg-gray-200 border-gray-300 py-2 px-5 font-medium rounded-lg text-sm">{e.activity}</button>
                                </td>
                                <td className="w-48 font-medium text-center">{e.total_cost} TND</td>
                                <td className="w-48 text-center font-bold">{e.payment_method}</td>
                                <td className="w-48 text-center">{e.agent}</td>
                                <td className="w-48 text-center p-3">
                                    <div style={{ background: bgForStatus(e.status) + "8a", borderColor: bgForStatus(e.status) }} className="border-2 px-3 py-2 rounded-full">
                                        <p className="text-xs text-white font-bold uppercase">{e.status}</p>
                                    </div>
                                </td>
                                <td className="w-48 text-center">{e.issue_date.split("T")[0]}</td>
                                <td className="text-center bg-gray-50 p-3">
                                    <button className="hover:bg-gray-200 px-3 py-2 rounded-md">
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                            <path d="M20 12.5C20.2761 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.2761 11.5 20 11.5C19.7239 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.7239 12.5 20 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M4 12.5C4.27614 12.5 4.5 12.2761 4.5 12C4.5 11.7239 4.27614 11.5 4 11.5C3.72386 11.5 3.5 11.7239 3.5 12C3.5 12.2761 3.72386 12.5 4 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="py-2 text-lg text-end font-bold">
                    total: {Intl.NumberFormat("en-US").format(dataMapper().map((e) => e.total_cost).reduce((a, b) => a + b))} tnd
                </div>
            </div>
        </div>
    )
}