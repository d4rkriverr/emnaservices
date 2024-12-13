import { FormEvent, useEffect, useRef, useState } from "react"
import employeesService from "../../services/employees.service"
import { EmployeeWithMonthlyMetrics } from "../../datatype/employee_datatype"
import { useReactToPrint } from "react-to-print"


const empSalary = (e: EmployeeWithMonthlyMetrics) => (e.monthly_record?.salary ?? 0)
const absenceCost = (e: EmployeeWithMonthlyMetrics) => empSalary(e) == 0 ? 0 : ((empSalary(e) / 26) * (e.monthly_record?.total_absences ?? 0))
const restToPay = (e: EmployeeWithMonthlyMetrics) => ((e.monthly_record?.salary ?? 0) - ((e.monthly_record?.total_advance ?? 0) + absenceCost(e)))

const EmployeesPage = () => {
    const [state, setState] = useState({ isLoad: true, message: "" })
    const [data, setData] = useState<EmployeeWithMonthlyMetrics[]>([])
    const [filter, setFilter] = useState({ year: "", month: "" })
    // 
    const [openAddModel, setOpenAddModel] = useState(false)
    const toggleAddModel = () => setOpenAddModel((e) => !e)
    // 
    const [openMonthlyMetrics, setOpenMonthlyMetrics] = useState(false)
    const toggleOpenMonthlyMetrics = () => setOpenMonthlyMetrics((e) => !e)

    // 
    const [advAbsModel, setAdvAbsModel] = useState({ shown: false, emp: Object() })

    //
    const [printModel, setPrintModel] = useState(false)
    const togglePrintModel = () => setPrintModel((e) => !e)

    useEffect(() => {
        const year = (new Date()).getFullYear()
        const month = ((new Date())).getMonth() + 1
        setFilter({ year: `${year}`, month: `${month}` });
        loadDataFor(`${year}-${month}`)
    }, [])

    const onChangeFilter = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { year, month } = Object.fromEntries(new FormData(e.currentTarget))
        setFilter({ year: `${year}`, month: `${month}` });
        loadDataFor(`${year}-${month}`)
    }

    const loadDataFor = async (date: string) => {
        setState({ isLoad: true, message: "" })
        const r = await employeesService.GetEmployees(date);
        if (typeof r != "string") {
            setData(r)
            setState({ isLoad: false, message: "" })
            return
        }
        setState({ isLoad: false, message: r })
    }



    if (state.isLoad) return (
        <div className="flex-1 flex justify-center items-center"> <div className="w-20 h-20 border-4 border-t-teal-500 rounded-full animate-spin"></div> </div>
    )
    return (
        <>
            <div className="p-5">
                <div className="mb-2 flex gap-2">
                    <form onSubmit={onChangeFilter} className="flex gap-1 border p-2 rounded-md">
                        <select name="month" defaultValue={filter.month} className="bg-gray-50 border border-gray-300 p-1 rounded-md outline-none">
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <select name="year" defaultValue={filter.year} className="bg-gray-50 border border-gray-300 p-1 rounded-md outline-none">
                            {[24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map((e) => {
                                return (<option key={e} value={"20" + e}>20{e}</option>)
                            })}
                        </select>
                        <p className="border-l-2 mx-2"></p>
                        <button className="bg-orange-500 px-5 py-2 text-white text-sm rounded-md">search</button>
                    </form>
                    <div className="flex-1"></div>
                    <div className="flex gap-1 p-2">
                        <button onClick={toggleOpenMonthlyMetrics} className="bg-purple-500 px-3 py-2 text-white text-sm rounded-md">monthly metrics</button>
                        <button onClick={toggleAddModel} className="bg-blue-500 px-3 py-2 text-white text-sm rounded-md">new employees</button>
                        <button onClick={togglePrintModel} className="bg-black px-3 py-2 text-white text-sm rounded-md">export report</button>
                        <button onClick={() => loadDataFor(`${filter.year}-${filter.month}`)} className="bg-gray-100 px-3 py-2 text-white text-sm rounded-md">
                            <svg className="w-4 h-4" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M21.1679 8C19.6247 4.46819 16.1006 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M2.88146 16C4.42458 19.5318 7.94874 22 12.0494 22C17.2347 22 21.4983 18.0533 22 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M7.04932 16H2.64932C2.31795 16 2.04932 16.2686 2.04932 16.6V21" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 [&>*]:p-2 [&>*]:text-center border text-sm">
                        <tr>
                            <th className="w-20">ID</th>
                            <th>Fullname</th>
                            <th>Phone Number</th>
                            <th className="w-32">Post</th>
                            <th className="w-32">payment method</th>
                            <th className="w-32">Started At</th>
                            <th>Absence</th>
                            <th>Advance </th>
                            <th>Salary</th>
                            <th>Rest To Pay</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((e) => {
                                return (
                                    <tr key={e.id} className="[&>*]:py-2 border">
                                        <td className="text-xs text-center">EMP-{e.id}</td>
                                        <td className="text-sm text-center">{e.full_name}</td>
                                        <td className="text-sm text-center">{e.phone}</td>
                                        <td className="text-xs text-center">{e.position}</td>
                                        <td className="text-xs text-center font-bold">{e.payment_method}</td>
                                        <td className="text-sm text-center">{e.date_of_hire.split("T")[0]}</td>
                                        <td className="text-sm text-center">
                                            <p>{e.monthly_record?.total_absences ?? 0} days</p>
                                            <p className="text-red-500 font-medium">(-{absenceCost(e).toFixed(2)} TND) </p> </td>
                                        <td className="text-sm text-center">{e.monthly_record?.total_advance ?? 0} TND</td>
                                        <td className="text-sm text-center">{e.monthly_record?.salary ?? 0} TND</td>
                                        <td className="text-sm text-center font-bold text-purple-500 ">{restToPay(e).toFixed(2)} TND</td>
                                        <td className="text-sm text-center font-medium">
                                            <div className="relative group">
                                                <button className="hover:bg-slate-100 py-2 px-4 text-xs">
                                                    <svg width="24px" height="24px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                                        <path d="M20 12.5C20.2761 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.2761 11.5 20 11.5C19.7239 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.7239 12.5 20 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M4 12.5C4.27614 12.5 4.5 12.2761 4.5 12C4.5 11.7239 4.27614 11.5 4 11.5C3.72386 11.5 3.5 11.7239 3.5 12C3.5 12.2761 3.72386 12.5 4 12.5Z" fill="#000000" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </svg>
                                                </button>
                                                <div className="hidden z-20 absolute group-hover:block bg-white shadow-lg border-2 right-5">
                                                    <button onClick={() => setAdvAbsModel({ shown: true, emp: e })} className="py-2 px-4 w-max hover:bg-gray-100">update metric</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr className="[&>*]:py-3 font-bold text-sm">
                            <td colSpan={5}></td>
                            <td className="bg-gray-100 text-center font-bold">Total</td>
                            <td className="bg-gray-100 text-sm text-center text-red-500">-{[...data.map((e) => absenceCost(e)), 0].reduce((a, b) => a + b).toFixed(2)} TND</td>
                            <td className="bg-gray-100 text-sm text-center">{[...data.map((e) => e.monthly_record?.total_advance ?? 0), 0].reduce((a, b) => a + b)} TND</td>
                            <td className="bg-gray-100 text-sm text-center">{[...data.map((e) => e.monthly_record?.salary ?? 0), 0].reduce((a, b) => a + b)} TND</td>
                            <td className="bg-gray-100 text-sm text-center text-purple-500">{[...data.map((e) => restToPay(e)), 0].reduce((a, b) => a + b).toFixed(2)} TND</td>
                            <td className="bg-gray-100"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <AddEmployeeForm shown={openAddModel} onClose={toggleAddModel} />
            {advAbsModel.shown && <UpdateAdvAbsDialog data={advAbsModel} onClose={() => setAdvAbsModel({ shown: false, emp: {} })} />}
            {openMonthlyMetrics && <MonthlyMetrics data={data} date={`${filter.year}-${filter.month}`} onClose={toggleOpenMonthlyMetrics} />}
            {printModel && <MonthlyPayroll data={data} onClose={togglePrintModel} />}
        </>
    )
}
const AddEmployeeForm = ({ shown, onClose }: { shown: boolean, onClose: () => void }) => {
    const [state, setState] = useState({ isLoad: false, message: "" })
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const o = Object.fromEntries(new FormData(e.currentTarget))
        const employee = {
            full_name: o.full_name.toString(),
            phone: o.phone.toString(),
            position: o.position.toString(),
            salary: Number(o.salary),
            date_of_hire: o.date_of_hire.toString(),
            payment_method: o.payment_method.toString(),
        };
        setState({ isLoad: true, message: "" })
        const r = await employeesService.CreateEmployee(employee)
        if (!r.success) {
            setState({ isLoad: false, message: r.message })
            return;
        }
        setState({ isLoad: false, message: "" })
        onClose()
    }
    return (!shown) ? (<></>) : (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center">
            <div className="relative bg-white rounded-lg">
                <div data-state={state.isLoad} className="data-[state=false]:hidden absolute w-full h-full flex justify-center items-center bg-red-100">
                    <div className="w-20 h-20 border-4 border-t-teal-500 rounded-full animate-spin"></div>
                </div>
                <form onSubmit={onSubmit} className="grid gap-3 p-10">
                    <h2 className="text-2xl mb-5 text-center">New Employee</h2>
                    <hr className="py-2" />
                    <p className="text-center text-red-500">{state.message}</p>
                    <div className="flex gap-2">
                        <div className="grid gap-1">
                            <label className="text-xs">Fullname:</label>
                            <input name="full_name" placeholder="fullname" className="bg-gray-50 border p-2 outline-none" />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-xs">Phone Number:</label>
                            <input name="phone" placeholder="phone number" className="bg-gray-50 border p-2 outline-none" />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Position:</label>
                        <input name="position" placeholder="position" className="bg-gray-50 border p-2 outline-none" />
                    </div>
                    <div className="flex gap-2 w-full">
                        <div className="grid gap-1 flex-1">
                            <label className="text-xs">Payment method:</label>
                            <select name="payment_method" className="bg-gray-50 border p-2 outline-none">
                                <option value="Cash">Cash</option>
                                <option value="Bank">Bank</option>
                            </select>
                        </div>
                        <div className="grid gap-1 flex-1">
                            <label className="text-xs">Salary:</label>
                            <input type="number" name="salary" placeholder="1000" className="bg-gray-50 border p-2 outline-none w-full" />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Start At:</label>
                        <input type="date" name="date_of_hire" className="bg-gray-50 border p-2 outline-none" />
                    </div>
                    <hr className="py-2" />
                    <div className="grid gap-1">
                        <button className="bg-blue-500 hover:bg-blue-700 py-2 text-white">save</button>
                        <button type="reset" onClick={onClose} className="bg-gray-100 hover:bg-gray-200 py-2">cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UpdateAdvAbsDialog = ({ data, onClose }: { data: any, onClose: () => void; }) => {
    const [state, setState] = useState({ isLoad: false, message: "" })

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const o = Object.fromEntries(new FormData(e.currentTarget))
        const obj = { metric_id: data.emp.monthly_record.id, total_advances: Number(o.total_advance), total_absences: Number(o.total_absences) }
        setState({ isLoad: true, message: "" })
        const r = await employeesService.UpdateMatricData(obj)
        if (!r.success) {
            setState({ isLoad: false, message: r.message })
            return;
        }
        setState({ isLoad: false, message: "" })
        onClose()
    }
    return (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center p-10">
            <div className="relative bg-white rounded-lg p-10 w-[550px] h-max">
                <div data-state={state.isLoad} className="data-[state=false]:hidden absolute w-full h-full flex justify-center items-center top-0 left-0 bg-white">
                    <div className="w-20 h-20 border-4 border-t-teal-500 rounded-full animate-spin"></div>
                </div>
                <div className="grid">
                    <p className="text-lg">[ ! ] - Update  for <b> {data.emp.full_name} </b></p>
                    <br />
                    <p className="text-red-500 text-center">{state.message}</p>
                    <br />
                    <form onSubmit={onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="w-max">Advance:</td>
                                    <td className="w-full"><input name="total_advance" type="text" defaultValue={0} className="bg-gray-50 border border-gray-500 p-2 w-full" /></td>
                                    <td className="bg-gray-100 w-max px-2">
                                        <div className="flex justify-center items-center gap-1">
                                            <p>{data.emp.monthly_record?.total_advance}</p>
                                            <p className="text-xs">TND</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr><td></td></tr>
                                <tr>
                                    <td>Absance:</td>
                                    <td className="w-full"><input name="total_absences" type="text" defaultValue={0} className="bg-gray-50 border border-gray-500 p-2 w-full" /></td>
                                    <td className="bg-gray-100 w-max mt-1">
                                        <div className="flex justify-center items-center gap-1">
                                            <p>{data.emp.monthly_record?.total_absences}</p>
                                            <p className="text-xs">days</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <div className="flex justify-end gap-2">
                            <button type="reset" onClick={onClose} className="bg-gray-100 px-5 py-2 rounded-md">cancel</button>
                            <button className="bg-purple-500 px-5 text-white rounded-md">save</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}

const MonthlyMetrics = ({ data, date, onClose }: { data: EmployeeWithMonthlyMetrics[], date: string, onClose: () => void }) => {
    const [state, setState] = useState({ isLoad: false, message: "" })
    const [payload, setPayload] = useState(data.map((e) => ({
        id: e.id,
        fullname: e.full_name,
        salary: e.monthly_record == undefined ? e.salary : e.monthly_record.salary,
        monthly_record: e.monthly_record == undefined ? "NO" : "YES",
        selected: false
    })))

    const onCreate = async () => {
        const obj = (payload.map((e) => ({ id: e.id, salary: e.salary })));

        setState({ isLoad: true, message: "" })
        const r = await employeesService.UpdateMonthlyMatric(date, obj)
        if (!r.success) {
            setState({ isLoad: false, message: r.message })
            return;
        }
        setState({ isLoad: false, message: "" })
        onClose()
    }
    const updateSalary = (i: number, s: string) => {
        const temp = [...payload]
        temp[i].salary = Number(s)
        setPayload(temp)
    }
    return (
        <div className="fixed w-screen h-screen bg-black/60 flex justify-center items-center">
            <div className="relative bg-white rounded-lg p-10 w-[550px]">
                <div data-state={state.isLoad} className="data-[state=false]:hidden absolute w-full h-full flex justify-center items-center top-0 left-0 bg-white">
                    <div className="w-20 h-20 border-4 border-t-teal-500 rounded-full animate-spin"></div>
                </div>
                <div className=" grid gap-2">
                    <h2 className="text-center text-lg">Monthly metrics for <b>{date}</b></h2>
                    <br />
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 [&>*]:p-2 border text-center">
                                <td>#</td>
                                {/* <td>ID</td> */}
                                <td>fullname</td>
                                <td>salary</td>
                                <td>{date}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                payload.map((e, i) => {
                                    return (
                                        <tr key={e.id} className="[&>*]:p-2 border text-center">
                                            <td><input name="selected" defaultChecked={e.selected} type="checkbox" /></td>
                                            {/* <td><input name="id" defaultValue={e.id} type="text" disabled className="w-10" /></td> */}
                                            <td>{e.fullname}</td>
                                            <td>
                                                <input
                                                    onChange={(e) => updateSalary(i, e.currentTarget.value)}
                                                    defaultValue={e.salary}
                                                    className="bg-gray-50 border p-2 w-20" />
                                            </td>
                                            <td>{e.monthly_record}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <button onClick={onCreate} className="bg-blue-500 hover:bg-blue-600 w-full py-2 text-white rounded-md">save</button>
                    <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 w-full py-2 rounded-md">cancel</button>
                </div>
            </div>
        </div>
    )
}

const MonthlyPayroll = ({ data, onClose }: { data: EmployeeWithMonthlyMetrics[], onClose: () => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const printInvoice = useReactToPrint({ contentRef })

    return (
        <div className="fixed w-screen h-screen bg-black/60 flex">
            <div onClick={onClose} className="flex-1"></div>
            <div className="bg-white h-full p-5 flex flex-col">
                <p className="text-center py-5 font-bold">Print report</p>
                <div style={{ "zoom": "0.6" }} className="border flex-1">
                    <div ref={contentRef} className="p-5">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center my-5">Monthly Payroll</h1>
                        <div className="bg-white rounded overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 text-sm border border-black [&>*]:font-medium">
                                        {/* <th className="text-left py-3 px-4 font-medium">ID</th> */}
                                        <th className="text-left py-3 px-4">Name</th>
                                        <th className="text-left py-3 px-4">Position</th>
                                        <th className="text-right py-3 px-4">Salary</th>
                                        <th className=" ">pay.Method</th>
                                        <th>OffDays</th>
                                        <th>Absence</th>
                                        <th>Advance</th>
                                        <th>Salary</th>
                                        <th>Net Pay</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map((e, i) => {
                                            return (
                                                <tr data-color={i % 2 == 1} className="border border-black data-[color=true]:bg-gray-50 text-sm">
                                                    {/* <td className="py-3 px-4 text-gray-600">EMP-{e.id}</td> */}
                                                    <td className="py-3 px-4 text-gray-600 w-max">{e.full_name}</td>
                                                    <td className="py-3 px-4 text-gray-600 w-max">{e.position}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-right">{empSalary(e)}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-center">{e.payment_method}</td>
                                                    <td className="text-xs text-center">{e.monthly_record?.totalOffDays ?? 0}</td>
                                                    <td className="text-xs text-center">
                                                        <p>{e.monthly_record?.total_absences ?? 0} days</p>
                                                        <p className="text-red-500 font-medium">(-{absenceCost(e).toFixed(2)} TND) </p> </td>
                                                    <td className="text-xs text-center">{e.monthly_record?.total_advance ?? 0} TND</td>
                                                    <td className="text-xs text-center">{e.monthly_record?.salary ?? 0} TND</td>
                                                    <td className="text-xs text-center font-bold text-purple-500 w-max">{restToPay(e).toFixed(2)} TND</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr className="[&>*]:py-3 font-bold border-black text-xs">
                                        <td colSpan={4}></td>
                                        <td className="bg-gray-100 text-center font-bold">Total</td>
                                        <td className="bg-gray-100 text-xs text-center text-red-500">-{[...data.map((e) => absenceCost(e)), 0].reduce((a, b) => a + b).toFixed(2)} TND</td>
                                        <td className="bg-gray-100 text-xs text-center">{[...data.map((e) => e.monthly_record?.total_advance ?? 0), 0].reduce((a, b) => a + b)} TND</td>
                                        <td className="bg-gray-100 text-xs text-center">{[...data.map((e) => e.monthly_record?.salary ?? 0), 0].reduce((a, b) => a + b)} TND</td>
                                        <td className="bg-gray-100 text-xs text-center text-purple-500">{[...data.map((e) => restToPay(e)), 0].reduce((a, b) => a + b).toFixed(2)} TND</td>
                                        <td className="bg-gray-100"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex-1"></div>
                <button onClick={() => printInvoice()} className="bg-blue-500 w-full text-white text-sm py-3">PRINT</button>
            </div>
        </div>
    )
}
export default EmployeesPage;