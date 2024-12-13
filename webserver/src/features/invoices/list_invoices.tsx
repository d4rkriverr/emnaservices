import { FormEvent, useEffect, useState } from "react"
import NewInvoicePage from "./new_invoice"
import { Invoice } from "../../datatype/invoice_datatype";
import invoicesService from "../../services/invoices.service";
import { PrintDailyReport, PrintInvoice } from "./print_invoice";

const InvoiceListPage = () => {

    useEffect(() => { loadInvoiceFor((new Date()), (new Date()), "", "") }, [])
    /* -- */
    const [state, setState] = useState<{ ready: boolean, data: Invoice[], agents: string[] }>({ ready: false, data: [], agents: [] })
    const loadInvoiceFor = async (from: Date, to: Date, val: string, agent: string) => {
        setState({ ready: false, data: [], agents: [] })
        const r = await invoicesService.GetInvoicesByDates(from.toLocaleDateString('en-CA'), to.toLocaleDateString('en-CA'), val, agent)
        if (r.success) {
            setState({ ready: true, data: r.payload.invoices, agents: r.payload.agents })
            return;
        }
        setState({ ready: true, data: [], agents: [] })
    }

    /* -- */
    const [printState, setPrintState] = useState({ shown: false, data: {} as Invoice | null })
    const onOpenPrint = (e: Invoice) => { setPrintState({ shown: true, data: e }) }
    const onClosePrint = () => setPrintState({ shown: false, data: null })

    /* -- */
    const [openAddModel, setOpenAddModel] = useState(false)
    const toggleAddModel = () => setOpenAddModel((e) => !e)
    const onCreateInvoice = async (obj: Invoice) => {
        const r = await invoicesService.CreateInvoice(obj)
        return (r)
    }

    /* -- */
    const [filterState, setFilterState] = useState(true)
    const toggleFilter = () => setFilterState((e) => !e)
    /* -- */
    const [printDaily, setPrintDaily] = useState(false)
    return (
        <>
            <div className="flex-1 flex items-start gap-3 p-3">
                <GetDataFilter shown={filterState} agents={state.agents} onUpdate={loadInvoiceFor} />
                <div className="relative flex-1 flex flex-col gap-3">
                    {
                        !state.ready &&
                        <div className="h-96 flex justify-center items-center">
                            <div className="loader w-10"></div>
                        </div>
                    }
                    {
                        state.ready &&
                        <>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2">
                                    <div onClick={toggleFilter}>
                                        <button className="border rounded-md p-2 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)]">
                                            <svg className="w-4" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                                <path stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"></path>
                                                <path stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <h2 className="text-2xl">Invoices List</h2>
                                </div>
                                <div className="flex gap-1 items-stretch">
                                    <button onClick={toggleAddModel} className="text-sm border px-4 py-2 bg-[linear-gradient(#54b3ff,#0078d9)] hover:bg-[linear-gradient(#389beb,#0078d9)] rounded-md border-[#2480c2]">
                                        <p className="font-medium text-white">Add new invoice</p>
                                    </button>
                                    <button onClick={() => setPrintDaily(true)} className="text-sm border px-4 py-2 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fbfbfb_0%,#f0f0f0_100%)] rounded-md">
                                        <p className="font-medium">Export</p>
                                    </button>
                                </div>
                            </div>
                            <hr />
                            <div className="w-full flex gap-1 justify-between items-center text-sm font-medium">
                                <div className="">
                                    <p className="flex text-lg gap-2">
                                        <span>Total Amount: </span>
                                        <span>
                                            {Intl.NumberFormat("en-US").format([...state.data.map((e) => e.advance_payment), 0].reduce((a, b) => a + b))}
                                            TND
                                        </span>
                                    </p>
                                </div>
                                <div className="font-bold">
                                    ({state.data.length}) invoice(s)
                                    {/* <p> page <b>1</b> of <b>5</b></p>
                                    <button className="border px-5 py-1.5 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fbfbfb_0%,#f0f0f0_100%)] rounded-md">Prev</button>
                                    <button className="border px-5 py-1.5 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fbfbfb_0%,#f0f0f0_100%)] rounded-md">Next</button> */}
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full overflow-auto border-collapse border text-[#212529] text-sm">
                                    <thead>
                                        <tr className="[&>*]:p-3 [&>*]:text-start border-b bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] select-none">
                                            <th className="w-7">
                                                <label className="control control--checkbox">
                                                    <input type="checkbox" className="js-check-all" />
                                                    <div className="control__indicator"></div>
                                                </label>
                                            </th>
                                            <th className="w-16">NO.</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Contact</th>

                                            <th scope="col">Product / Service</th>
                                            <th><p className="text-center">Gross price</p></th>
                                            <th><p className="text-center">Paid amount</p></th>
                                            <th className="w-40"><p className="text-center">status</p></th>
                                            <th className="w-36"><p className="text-center">Issue date</p></th>
                                            <th className="w-7"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.data.length == 0 && <tr><td colSpan={11} className="text-center py-4 font-medium text-gray-500">No data Yet</td></tr>}
                                        {state.data.map((e) => {
                                            return (
                                                <tr className="[&>*]:p-3 border-b border-[#dee2e6] hover:bg-gray-50 text-[#777]">
                                                    <th className="text-start">
                                                        <label className="control control--checkbox">
                                                            <input type="checkbox" />
                                                            <div className="control__indicator"></div>
                                                        </label>
                                                    </th>
                                                    <td>{e.id}</td>
                                                    <td>{e.fullname}</td>
                                                    <td>{e.phone_number}</td>
                                                    <td>{e.product_name}</td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center items-center gap-1">
                                                            <p>{Intl.NumberFormat("en-US").format(e.product_price)}</p>
                                                            <p className="font-medium">TND</p>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex justify-center items-center gap-1">
                                                            <p>{Intl.NumberFormat("en-US").format(e.advance_payment)}</p>
                                                            <p className="font-medium">TND</p>
                                                        </div>
                                                    </td>
                                                    <td className="flex justify-center">
                                                        <p className="w-max py-1.5 px-4 rounded-full select-none bg-orange-100 text-[10px] font-bold uppercase">
                                                            Partially paid
                                                        </p>
                                                    </td>
                                                    <td className="text-center">
                                                        {(new Date(e.issue_date)).toLocaleDateString('en-CA')}
                                                    </td>
                                                    <td>
                                                        <button onClick={() => onOpenPrint(e)} className="border rounded-md py-1.5 px-2 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)]">
                                                            <svg className="w-3.5" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                                                <path stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"></path>
                                                                <path stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"></path>
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    }


                </div>
            </div>
            {/*  */}
            <div data-state={openAddModel} className="data-[state=false]:hidden fixed bg-black/60 w-screen h-screen flex justify-center items-center">
                <NewInvoicePage onClose={toggleAddModel} onCreate={onCreateInvoice} onPrint={onOpenPrint} />
            </div>
            {/*  */}
            <div data-state={printState.shown} className="data-[state=false]:hidden fixed bg-black/60 w-screen h-screen flex justify-center items-center">
                <div className="flex-1"></div>
                <PrintInvoice invoice={printState.data} onClose={onClosePrint} />
            </div>
            <div data-state={printDaily} className="data-[state=false]:hidden fixed bg-black/60 w-screen h-screen flex justify-center items-center">
                <div className="flex-1"></div>
                <PrintDailyReport invoices={state.data} onClose={() => setPrintDaily(false)} />
            </div>
        </>
    )
}

const GetDataFilter = ({ shown, agents, onUpdate }: { shown: boolean, agents: string[], onUpdate: (from: Date, to: Date, val: string, agent: string) => void }) => {
    const [load, setLoad] = useState(false);

    const onSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true);
        const o = Object.fromEntries(new FormData(e.currentTarget))
        const dateFrom = (new Date(o.dateFrom.toString()))
        const dateTo = (new Date(o.dateTo.toString()))
        await onUpdate(dateFrom, dateTo, o.searchValue.toString(), o.agent.toString())
        setLoad(false)

    }


    return (
        <fieldset disabled={load} data-state={shown} className="relative w-[300px] bg-gray-50/20 border p-3 data-[state=false]:hidden">
            <form onSubmit={onSearch} className="grid items-center gap-2">
                <div className="grid gap-1">
                    <label className="text-xs">search</label>
                    <input type="text" name="searchValue" className="border p-2 text-sm" placeholder="search..." />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs">Agent</label>
                    <select name="agent" className="border p-2 text-sm">
                        <option value="">All Agent</option>
                        {agents.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
                <div className="grid gap-1">
                    <label className="text-xs">date from</label>
                    <input type="date" defaultValue={(new Date()).toLocaleDateString('en-CA')} name="dateFrom" className="border p-2 text-sm" />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs">date to</label>
                    <input type="date" defaultValue={(new Date()).toLocaleDateString('en-CA')} name="dateTo" className="border p-2 text-sm" />
                </div>
                <button disabled={load} className="flex items-center justify-center gap-2 w-full text-sm border px-4 py-2 bg-[linear-gradient(to_bottom,#fefefe_0%,#f7f7f7_100%)] hover:bg-[linear-gradient(to_bottom,#fbfbfb_0%,#f0f0f0_100%)] disabled:bg-[linear-gradient(to_bottom,#fbfbfb_0%,#f0f0f0_100%)] rounded-md">
                    <p className="font-medium">search</p>
                    <svg className="w-4 max-sm:hidden" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
            </form>
        </fieldset>
    )
}

export default InvoiceListPage;