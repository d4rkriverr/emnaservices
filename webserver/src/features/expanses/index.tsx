import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import expansesService from "../../services/expanses.service";
import { ExpenseInvoice } from "../../datatype/expenses_datatype";

import ExpansesDataTable from "./invoices_table";
import CreateDialog from "./create_dialog";
import ActivitiesList from "./activities_list";
import { PrintDailyReport } from "./print_expenses";

interface StateType {
    preload: boolean,
    addDialog: boolean,
    activeCategory: string,
    invoices: ExpenseInvoice[],
    activities: string[],
    payMethod: string[]
}

const DateDataObject = {
    format: (a: number, b: number) => {
        const date = new Date();
        return (new Date(date.getFullYear(), date.getMonth() + a, b))
    },
    fromString: (e: string) => {
        return new Date(e)
    },
    toLocal: (date: Date) => {
        return date.toLocaleDateString('en-CA')
    },
    toString: (date: Date) => {
        const val = date.toLocaleDateString();
        const [d, m, y] = val.replace(/\//g, "-").split("-")
        return `${y}-${m}-${d}`
    }
}

const ExpansesPage = () => {
    const [expenseInvoices, setExpenseInvoices] = useState<ExpenseInvoice[]>([])
    const [dateFilter, setDateFilter] = useState({ dialog: false, dateFrom: new Date(), dateTo: new Date() })
    const [state, setState] = useState<StateType>({
        preload: true,
        addDialog: false,
        activeCategory: "",
        invoices: [],
        activities: [],
        payMethod: [],
    })

    useEffect(() => {
        const dateFrom = DateDataObject.format(0, 1)
        const dateTo = DateDataObject.format(1, 0)
        setDateFilter({ dialog: false, dateFrom, dateTo })
        GetExpensesAPI(true)
    }, []);

    const GetExpensesAPI = (init = false) => {
        let from = DateDataObject.toString(DateDataObject.format(0, 1))
        let to = DateDataObject.toString(DateDataObject.format(1, 0))
        if (!init) {
            from = DateDataObject.toString(dateFilter.dateFrom)
            to = DateDataObject.toString(dateFilter.dateTo)
        }
        expansesService.GetExpanses(from, to).then((e) => {
            if (typeof e == "string") return;
            setExpenseInvoices(e.invoices);
            setState((o) => ({ ...o, ...e, preload: false }));
        })
    }

    // **************************
    const onCreateInvoice = async (o: ExpenseInvoice) => {
        delete o.selected;
        const res = await expansesService.CreateExpanses(o);
        if (res.success) {
            GetExpensesAPI()
        }
        return res;
    }
    const onToggleCreateDialog = () => {
        setState((e) => ({ ...e, addDialog: !e.addDialog }))
    }

    // **************************
    const onChangeCategory = (e: string) => {
        const newCategory = (e == state.activeCategory) ? "" : e;
        const data = (newCategory == "") ? state.invoices : state.invoices.filter((v) => v.activity == e)
        setState((e) => ({ ...e, activeCategory: newCategory }))
        setExpenseInvoices(data)
    }

    // ***************************
    const onUpdateDate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const o = Object.fromEntries(new FormData(e.currentTarget))
        const dateFrom = DateDataObject.fromString(o.from.toString())
        const dateTo = DateDataObject.fromString(o.to.toString())

        setDateFilter({ dialog: false, dateFrom, dateTo })
        console.log({ dateFrom, dateTo });
    }

    const onToggleDateDialog = () => {
        setDateFilter((e) => ({ ...e, dialog: !e.dialog }))
    }

    // ***************************
    const onCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const r = [...expenseInvoices].map((x) => ({ ...x, selected: e.target.checked }));
        setExpenseInvoices(r)
    }

    const onCheckOne = (e: ChangeEvent<HTMLInputElement>) => {
        const id = e.target.attributes.getNamedItem("data-id")?.value;
        const r = [...expenseInvoices].map((x) => x.id == id ? { ...x, selected: e.target.checked } : x);
        setExpenseInvoices(r)
    }

    // ***************************
    const [openExport, setOpenExport] = useState(false)
    const toggleOpenExport = () => setOpenExport((e) => !e)

    // ***************************
    if (state.preload) return (
        <div className="flex-1 flex justify-center items-center">
            <div className="w-16 h-16 border-2 border-t-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <>
            <div className="w-full flex flex-col p-3">
                <div className="flex flex-col gap-4 lg:flex-row justify-between">
                    <div className="flex-1 flex gap-2 text-xs font-medium">
                        <button onClick={toggleOpenExport} className="w-full lg:w-28 py-3 rounded-md bg-black text-white">export</button>
                        <button onClick={onToggleCreateDialog} className="w-full lg:w-28 py-3 rounded-md bg-purple-800 text-white">New</button>
                    </div>
                    <div className="relative z-10 max-lg:w-full">
                        <button onClick={onToggleDateDialog} className="max-lg:w-full justify-center flex items-center gap-2 bg-gray-50 font-medium px-4 py-2 border border-gray-300 rounded-md">
                            <p>{DateDataObject.toLocal(dateFilter.dateFrom)}</p>
                            <svg className="w-5 h-5" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path d="M9 6L15 12L9 18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            <p>{DateDataObject.toLocal(dateFilter.dateTo)}</p>
                        </button>
                        <div data-state={dateFilter.dialog} className="data-[state=false]:hidden absolute w-full py-1">
                            <form onSubmit={onUpdateDate} className="w-full bg-white border rounded-md shadow-lg p-3">
                                <div className="grid mb-2">
                                    <label htmlFor="">From:</label>
                                    <input type="date" name="from" defaultValue={DateDataObject.toLocal(dateFilter.dateFrom)} className="border rounded-md p-1.5 text-sm" />
                                </div>
                                <div className="grid mb-2">
                                    <label className="text-sm">to:</label>
                                    <input type="date" name="to" defaultValue={DateDataObject.toLocal(dateFilter.dateTo)} className="border rounded-md p-1.5 text-sm" />
                                </div>
                                <button className="bg-purple-500 w-full py-2 text-white text-sm font-medium rounded-md">CONFIRM</button>
                            </form>
                        </div>
                    </div>
                </div>

                <ActivitiesList
                    active={state.activeCategory}
                    activities={state.activities}
                    data={state.invoices}
                    selectActivity={onChangeCategory} />

                <div className="w-full overflow-auto">
                    <ExpansesDataTable
                        data={expenseInvoices}
                        onCheckAll={onCheckAll}
                        onCheckOne={onCheckOne} />
                </div>
            </div>
            <CreateDialog
                shown={state.addDialog}
                activities={state.activities}
                payMethod={state.payMethod}
                toggleDialog={onToggleCreateDialog}
                onCreate={onCreateInvoice}
                onUpdate={GetExpensesAPI} />

            <PrintDailyReport shown={openExport} data={expenseInvoices} onClose={toggleOpenExport} />
        </>
    )
}
export default ExpansesPage;