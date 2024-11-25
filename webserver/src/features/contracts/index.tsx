import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import mock_data from "./mock-data";

interface Contract {
    id: number;
    fullname: string;
    phone_number: string;
    target_country: string;
    required_job: string;
    advenced_payment: number;
    total_amount: number;
    discount: number;
    status: string;
    agent: string;
    issue_date: string;
}

function ContractsPage() {
    const PAGE_SIZE = 12;

    const [currentView, setCurrentView] = useState(0)

    const [showAddModel, setShowAddModel] = useState(false)
    const toggleAddModel = () => setShowAddModel((v) => !v)

    // const [openMenu, setOpenMenu] = useState(false)
    // const toggleOpenMenu = () => setOpenMenu((v) => !v)

    // const [activeOption, setActiveOption] = useState(0)
    // const [opt, setOpt] = useState([{ name: "employees", active: true }, { name: "invoices", active: false }, { name: "expanses", active: false }])
    // const selectOption = (i: number) => {
    //     setOpt(opt.map((v, e) => ({ ...v, active: i == e })))
    //     setActiveOption(i)
    //     toggleOpenMenu()
    // }

    return (
        <div className="grid gap-2">
            <div className="flex">
                <div className="fixed w-64 h-full border-r flex flex-col">
                    <div className="flex-1 p-4 flex flex-col gap-3 justify-between">
                        <div className="grid gap-1">
                            <button
                                onClick={toggleAddModel}
                                className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:opacity-50 bg-blue-600 shadow hover:bg-blue-600/70 h-9 px-4 py-2">
                                <p className="text-sm font-medium text-white">new</p>
                            </button>
                            <button
                                onClick={() => setCurrentView(1)}
                                className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:opacity-50 bg-black shadow hover:bg-black/90 h-9 px-4 py-2">
                                <p className="text-sm font-medium text-white">Export</p>
                            </button>
                        </div>
                        <hr />
                        <div className="flex-1 flex flex-col gap-2">
                            <input type="date" className="border rounded-lg p-2" />
                            <input type="date" className="border rounded-lg p-2" />
                            <button className="bg-gray-100 py-2 border rounded-lg  font-medium text-sm">load</button>
                        </div>
                        <hr />
                        {/* EXPORT */}

                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1  ml-72 overflow-auto">
                    <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
                        {currentView == -1 && <p className="w-20 h-20 border-4 border-t-4 rounded-full border-gray-100 border-t-teal-400 animate-spin"></p>}
                        {currentView == 0 && <DefaultView pageSize={PAGE_SIZE} initalData={mock_data} />}
                        {currentView == 1 && <PrintView onClose={() => setCurrentView(0)} data={mock_data} />}
                    </div>
                </div>
            </div>
            <CreateModel shown={showAddModel} exit={toggleAddModel} />
        </div>

    )
}
// SUB
const DefaultView = ({ pageSize, initalData }: { pageSize: number, initalData: Contract[] }) => {
    const paginate = (arr: Contract[], size: number) => {
        return arr.reduce((acc: Contract[][], val, i) => {
            const idx = Math.floor(i / size)
            const page = acc[idx] || (acc[idx] = [])
            page.push(val)
            return acc
        }, [])
    }

    const [data, setData] = useState(paginate(initalData, pageSize))
    const [currentPage, setCurrentPage] = useState(0)

    const nextPage = () => setCurrentPage((v) => (currentPage == (data.length - 1)) ? v : v + 1)
    const previousPage = () => setCurrentPage((v) => (currentPage == 0) ? v : v - 1)
    const getHexColor = (id: number) => ["#a46307", "#d8098b", "#891513", "#53313c", "#8a22a1", "#ce5a3d"][id % 6]


    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        const result = initalData.filter((e) => (e.fullname).includes(val))
        setData(paginate(result, pageSize))
    }

    return (
        <>
            <div className="w-full flex items-center justify-center">
                <h2 className="py-3 font-bold text-3xl"></h2>
                <input
                    onChange={onSearch}
                    type="text"
                    placeholder="search ..."
                    className="border border-gray-400 px-3 py-2 rounded-md outline-none w-96"
                />
            </div>
            <div className="w-full overflow-auto">
                <div className="flex-1 flex flex-col w-auto gap-2">
                    <div className="grid grid-cols-[70px_repeat(10_,1fr)] bg-gray-100 text-gray-700 text-xs uppercase border font-bold rounded-lg py-2.5">
                        <div className="text-center">ID</div>
                        <div className="col-span-2">Full Name</div>
                        <div >Phone Number</div>
                        <div >Country</div>
                        <div >Job Title</div>
                        <div className="text-center">Contract Price</div>
                        <div >Advance</div>
                        <div >Status</div>
                        <div className="text-center">Agent</div>
                        <div className="text-center">Issue Date</div>
                    </div>
                    {data[currentPage] && data[currentPage].map((e, i) => {
                        return (
                            <div key={e.id} className="grid grid-cols-[70px_repeat(10_,1fr)] items-center bg-white border text-gray-600 text-sm rounded-lg py-2 shadow">
                                <h2 className="text-center font-bold">#{i}</h2>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div style={{ background: getHexColor(i) }} className={`w-7 h-7 flex justify-center items-center rounded-full`}>
                                        <p className="uppercase text-white text-[10px] font-bold">{e.fullname.slice(0, 2)}</p>
                                    </div>
                                    <div>
                                        <h2 className="font-bold">{e.fullname}</h2>
                                    </div>
                                </div>
                                <h2 className="">{e.phone_number}</h2>
                                <div>
                                    <div className="inline-block font-semibold py-1.5 px-4 border-2 rounded-md uppercase">
                                        {e.target_country}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block font-semibold py-1.5 px-4 border-2 rounded-md">
                                        {e.required_job}
                                    </div>
                                </div>
                                <h2 className="text-center">
                                    <div className="inline-block relative">
                                        <p>{Intl.NumberFormat("en-US").format(e.total_amount)}</p>
                                        <p className="top-0 -right-7 font-bold text-[11px] absolute">TND</p>
                                    </div>
                                </h2>
                                <div>
                                    <div className="inline-block relative">
                                        <p>{Intl.NumberFormat("en-US").format(e.advenced_payment)}</p>
                                        <p className="top-0 -right-7 font-bold text-[11px] absolute">TND</p>
                                    </div>
                                </div>
                                <h2 className="uppercase font-semibold text-orange-300">{e.status}</h2>
                                <h2 className="text-center underline">{e.agent}</h2>
                                <h2 className="font-bold text-center">{e.issue_date}</h2>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex justify-between">
                <button onClick={previousPage} className="w-32 py-2 rounded-md bg-gray-50/50 border-2">Previous</button>
                <p className="font-bold">{currentPage + 1} / {data.length}</p>
                <button onClick={nextPage} className="w-32 py-2 rounded-md bg-gray-50/50 border-2">next</button>
            </div>
        </>
    )
}

const PrintView = ({ onClose, data }: { onClose: () => void, data: Contract[] }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef })
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex justify-between h-10">
                <button onClick={onClose} className="py-2 px-4 border rounded-md text-sm">back</button>
                <button onClick={() => handlePrint()} className="py-2 px-10 border rounded-md bg-blue-500">
                    <p className="text-white text-sm font-medium">print</p>
                </button>
            </div>
            <div className="flex-1 p-2 border-2">
                <div ref={contentRef} className="overflow-auto p-10 ">
                    <h2 className="text-3xl text-center mb-5 font-bold">REPORT</h2>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="[&>*]:border [&>*]:border-gray-500 [&>*]:px-4 [&>*]:py-2">
                                <th>FullName</th>
                                <th>Phone Number</th>
                                <th>Country</th>
                                <th>Contract Price</th>
                                <th>Advance</th>
                                <th>Agent</th>
                                <th>Issue Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((e) => {
                                return (
                                    <tr className="[&>*]:border [&>*]:border-gray-500 [&>*]:px-4 [&>*]:py-2 [&>*]:text-center">
                                        <td>{e.fullname}</td>
                                        <td>{e.phone_number}</td>
                                        <td>{e.target_country}</td>
                                        <td>{Intl.NumberFormat("en-US").format(e.total_amount)}</td>
                                        <td>{Intl.NumberFormat("en-US").format(e.advenced_payment)}</td>
                                        <td>{e.agent}</td>
                                        <td>{e.issue_date}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div className="p-5 flex justify-between">
                        <div>
                            <h2 className="mb-5">signature</h2>
                            <hr className="border-black" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg">total</h2>
                            <b>{data.map((e) => e.advenced_payment).reduce((a, b) => a + b)}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CreateModel = ({ shown, exit }: { shown: boolean, exit: () => void }) => {
    const [view] = useState(3)

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    if (!shown) return <></>;

    if (view == 1) return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex justify-center items-center gap-1">
            <div className="mx-auto bg-white p-6 rounded-lg shadow-md w-[650px]">
                <h2 className="text-2xl font-semibold mb-6">Contract Form</h2>
                <form onSubmit={onSubmit} method="POST" className="space-y-4">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="fullname" name="fullname" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="text" id="phone_number" name="phone_number" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex gap-2 w-full [&>*]:flex-1">
                        <div>
                            <label htmlFor="target_country" className="block text-sm font-medium text-gray-700">Contract Country</label>
                            <input type="text" id="target_country" name="target_country" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="required_job" className="block text-sm font-medium text-gray-700">Contract Job</label>
                            <input type="text" id="required_job" name="required_job" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="flex gap-2 w-full [&>*]:flex-1">
                        <div>
                            <label htmlFor="advenced_payment" className="block text-sm font-medium text-gray-700">Advanced Payment</label>
                            <input type="number" id="advenced_payment" name="advenced_payment" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">Total Amount</label>
                            <input type="number" id="total_amount" name="total_amount" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
                        <input type="number" id="discount" name="discount" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Agent</label>
                        <input type="text" id="agent" name="agent" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">Issue Date</label>
                        <input type="date" id="issue_date" name="issue_date" className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600">
                            create
                        </button>
                        <button onClick={exit} className="w-full bg-gray-100 font-semibold py-2 rounded-md hover:bg-gray-200">Close</button>
                    </div>
                </form>
            </div>
        </div>
    )
    if (view == 2) return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex justify-center items-center gap-1">
            <div className="mx-auto bg-white p-6 rounded-lg shadow-md w-[650px]">
                <div>LOADING ...</div>
            </div>
        </div>
    )

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex justify-center items-center gap-1">
            <div className="mx-auto bg-white p-6 rounded-lg shadow-md w-[650px]">
                <div className="text-xl text-green-600 text-center font-bold">Invoice created successfully</div>
                <br />
                <p className="text-center text-lg">....</p>
                <br />
                <div className="grid gap-2">
                    <button onClick={() => null} className="w-full bg-blue-600 font-semibold py-2 rounded-md hover:bg-blue-500">
                        <p className="text-white">print</p>
                    </button>
                    <button onClick={exit} className="w-full bg-gray-100 font-semibold py-2 rounded-md hover:bg-gray-200">
                        <p className="text-gray-600">close</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContractsPage;