import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ExpenseInvoice } from "../../datatype/expenses_datatype";

const PrintDailyReport = ({ shown, data, onClose }: { shown: boolean, data: ExpenseInvoice[], onClose: () => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef })
    return !shown ? <></> : (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 z-10 flex">
            <div className="flex-1">

            </div>
            <div className="bg-white w-2/5 p-5">
                <h2 className="text-2xl font-semibold flex justify-center items-center gap-2">
                    <hr className="flex-1 border-gray-400" /><p>PRINT INVOICE</p><hr className="flex-1 border-gray-400" />
                </h2>
                <div style={{ zoom: "0.6" }} className="border">
                    <div ref={contentRef} className="p-5">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <h2 className="text-yellow-700 font-bold text-2xl">BASIC EXPENSE REPORT</h2>
                                <h3 className="font-bold text-blue-900">GENERAL INFORMATION</h3>
                            </div>
                            <div>
                                <div className="border font-bold p-5 border-black">
                                    <p>For office use only</p>
                                </div>
                            </div>
                        </div>
                        <br />
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="[&>*]:border [&>*]:py-1 [&>*]:">
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Activity</th>
                                    <th>Pay.Method</th>
                                    <th>Agent</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.sort((a, b) => (new Date(b.issue_date).getTime()) - (new Date(a.issue_date).getTime())).map((e) => {
                                        return (
                                            <tr className="[&>*]:border [&>*]:p-2 [&>*]:text-center">
                                                <td className="w-24">{e.id}</td>
                                                <td className="w-max">{e.issue_date.split("T")[0]}</td>
                                                <td className="w-max">{e.description}</td>
                                                <td className="w-max">{e.activity}</td>
                                                <td className="w-max">{e.payment_method}</td>
                                                <td className="w-max">{e.agent}</td>
                                                <td className="w-max">{e.total_cost} tnd</td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="text-center">
                                    <td colSpan={5}></td>
                                    <td className="border font-bold py-2">TOTAL</td>
                                    <td className="border font-bold">
                                        {[...data.map((e) => e.total_cost), 0].reduce((a, b) => a + b)} TND
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full grid gap-1">
                    <button onClick={() => handlePrint()} className="bg-blue-400 px-6 py-2.5 text-white rounded-sm text-sm">Print</button>
                    <button onClick={onClose} className="px-6 py-2.5 border rounded-sm text-sm">Back</button>
                </div>
            </div>
        </div>
    )
}

export { PrintDailyReport }