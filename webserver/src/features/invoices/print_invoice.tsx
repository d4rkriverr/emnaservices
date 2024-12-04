import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import companyLogo from "../../assets/company_logo.jpg"
import { Invoice } from "../../datatype/invoice_datatype";

const PrintInvoice = ({ invoice, onClose }: { invoice: Invoice | null, onClose: () => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const printInvoice = useReactToPrint({ contentRef })

    const total_amount = (invoice?.product_price ?? 0)

    return (
        <div className="w-2/5 bg-white h-full p-10 flex flex-col justify-between gap-5">
            <h2 className="text-2xl font-semibold flex justify-center items-center gap-2">
                <hr className="flex-1 border-gray-400" /><p>PRINT INVOICE</p><hr className="flex-1 border-gray-400" />
            </h2>
            <div style={{ "zoom": "0.6" }} className="">
                <div className="border-4">
                    <div ref={contentRef} className="w-full h-screen flex flex-col gap-4 p-8 text-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <img className="w-36 rounded-full border-2" src={companyLogo} />
                            </div>
                            <div>
                                <h2 className="text-5xl">INVOCIE</h2>
                                <h2 className="text-center text-3xl text-gray-400">No. {invoice?.id}</h2>
                            </div>
                        </div>
                        <div className="flex gap-5 text-xs mb-5">
                            <div>
                                <b>EMNA VISA SERVICES</b>
                                <h2>AV HABIB BOURGUIBA</h2>
                                <h2>Tunisia, Bardo, 2000</h2>
                            </div>
                            <div>
                                <h2><b>Phone:</b> +216 71 507 669</h2>
                                <h2><b>Email:</b> info@emnavisaservices.com </h2>
                                <h2><b>Website:</b> www.emnavisaservices.com</h2>
                            </div>
                        </div>
                        <div className="flex justify-between bg-gray-100 gap-4 py-4 px-10 mb-5">
                            <div>
                                <b className="text-gray-600 underline">CLIENT</b>
                                <table>
                                    <tbody>
                                        <tr><td className="w-12">Name:</td><td>{invoice?.fullname}</td></tr>
                                        <tr><td className="w-12">Phone:</td><td>{invoice?.phone_number}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="">
                                <b className="text-gray-600 underline">Invoice</b>
                                <table>
                                    <tbody>
                                        <tr><td className="w-20">Invoice ID:</td><td>{invoice?.id}</td></tr>
                                        <tr><td className="w-20">Issue Date:</td><td>{(new Date(invoice?.issue_date ?? "")).toLocaleDateString('en-CA')}</td></tr>
                                        <tr><td className="w-20">Agent:</td><td>{invoice?.agent}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex-1">
                            <table className="text-sm mb-5 border">
                                <thead>
                                    <tr className="border-b border--500 bg-blue-50">
                                        <th className="text-start w-4/6 p-2">Product/service</th>
                                        <th className="w-1/4">QTY</th>
                                        <th className="w-1/4">Method</th>
                                        <th className="w-1/4">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2">{(invoice?.product_name ?? "").split("_").join(" ")}</td>
                                        <td className="w-max text-center">1</td>
                                        <td className="w-[100px] text-center">{invoice?.product_payment}</td>
                                        <td className="flex text-center p-2">{invoice?.product_price ?? 0} <span className="font-medium pl-1">TND</span></td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex flex-col text-xs items-end p-2 font-medium mb-10">
                                <div className="w-2/6">
                                    <div className="flex justify-between pb-2">
                                        <p>Subtotal</p>
                                        <p>{total_amount} TND</p>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <p>Paid</p>
                                        <p>{invoice?.advance_payment ?? 0} TND</p>
                                    </div>
                                    <hr className="border-black font-bold" />
                                    <div className="flex justify-between pt-2 text-sm">
                                        <b>total</b>
                                        <b>{total_amount - (invoice?.advance_payment ?? 0)} TND</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between uppercase font-bold px-20 h-32">
                            <div>
                                Client Signuture
                                <hr className="border-black" />
                            </div>
                            <div>
                                Agent Signuture
                                <hr className="border-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full grid gap-1">
                <button onClick={() => printInvoice()} className="bg-blue-400 px-6 py-2.5 text-white rounded-sm text-sm">Print</button>
                <button onClick={onClose} className="px-6 py-2.5 border rounded-sm text-sm">Back</button>
            </div>
        </div>
    )
}

const PrintDailyReport = ({ invoices, onClose }: { invoices: Invoice[], onClose: () => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef })

    const group = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = invoices.reduce((rv: any, x) => {
            (rv[x.product_payment] = rv[x.product_payment] || []).push(x.advance_payment);
            return rv;
        }, {});
        const obj = [];
        for (const key in r) {
            const amount = [...(r[key] as []), 0].reduce((a, b) => a + b)
            obj.push({ name: key, amount: (amount) })
        }
        return (obj);
    }
    group()

    return (
        <div className="w-2/5 bg-white h-full p-10 flex flex-col justify-between gap-5">
            <h2 className="text-2xl font-semibold flex justify-center items-center gap-2">
                <hr className="flex-1 border-gray-400" /><p>PRINT INVOICE</p><hr className="flex-1 border-gray-400" />
            </h2>
            <div style={{ "zoom": "0.6" }} className="">
                <div className="border-4">
                    <div ref={contentRef} className="overflow-auto p-10 ">
                        <h2 className="text-3xl text-center mb-5 font-bold">REPORT</h2>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="[&>*]:border [&>*]:border-gray-500 [&>*]:px-4 [&>*]:py-2">
                                    <th>FullName</th>
                                    <th>Country</th>
                                    <th>Contract Price</th>
                                    <th>Advance</th>
                                    <th>Agent</th>
                                    <th>Payment</th>
                                    <th>Issue Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((e) => {
                                    return (
                                        <tr className="[&>*]:border [&>*]:border-gray-500 [&>*]:px-4 [&>*]:py-2 [&>*]:text-center">
                                            <td>{e.fullname}</td>
                                            <td>{e.product_name}</td>
                                            <td>{Intl.NumberFormat("en-US").format(e.product_price)}</td>
                                            <td>{Intl.NumberFormat("en-US").format(e.advance_payment)}</td>
                                            <td>{e.agent}</td>
                                            <td>{e.product_payment}</td>
                                            <td>{(new Date(e.issue_date)).toLocaleDateString('en-CA')}</td>
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
                            <div className="text-lg text-start">
                                {
                                    group().map((e) => {
                                        return <h2 className="flex">
                                            <p className="w-20">{e.name}</p>
                                            <p>{Intl.NumberFormat("en-US").format(e.amount)} TND</p>
                                        </h2>
                                    })
                                }
                                <h2 className="font-bold flex">
                                    <p className="w-20"> Total: </p>
                                    <p> {Intl.NumberFormat("en-US").format([...group().map((e) => e.amount), 0].reduce((a, b) => a + b))} TND</p>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full grid gap-1">
                <button onClick={() => handlePrint()} className="bg-blue-400 px-6 py-2.5 text-white rounded-sm text-sm">Print</button>
                <button onClick={onClose} className="px-6 py-2.5 border rounded-sm text-sm">Back</button>
            </div>
        </div>
    )
}

export { PrintInvoice, PrintDailyReport };