import { ExpenseInvoice } from "../../datatype/expenses_datatype";


interface Params {
    activities: string[],
    data: ExpenseInvoice[],
    active: string,
    selectActivity: (e: string) => void,
}

const ActivitiesList = ({ activities, data, active, selectActivity }: Params) => {

    const mapper = (acts: typeof activities, arr: typeof data) => {
        return acts.map((name, i) => {
            const count = arr.filter((v) => v.activity == name)
            const value = [0, ...count.map((v) => v.total_cost)].reduce((a, b) => a + b)
            return {
                id: i,
                name: name,
                isActive: active == name,
                value: value,
                count: count.length,
            }
        })
    }

    return (
        <div className="my-4 border-2 rounded-lg">
            <div className="flex justify-center items-center py-8 bg-gray-50">
                <p className="relative text-amber-950 font-bold">
                    <span className="text-3xl">
                        {Intl.NumberFormat("en-US").format([...((data).map((e) => e.total_cost)), 0].reduce((a, b) => a + b))}
                    </span>
                    <span className="absolute text-[10px]">TND</span>
                </p>
            </div>
            <hr className="border-2" />
            <div className="overflow-auto">
                <div className="flex justify-between items-center bg-gray-50 p-2">
                    {
                        mapper(activities, data).map((item, i) => (
                            <div key={item.id} className="flex-1 flex items-center" >
                                <button data-active={item.isActive} onClick={() => selectActivity(item.name)}
                                    className="w-52 text-center py-3 hover:bg-gray-100 data-[active=true]:bg-gray-200 rounded-md">
                                    <p className="relative text-amber-950 font-bold">
                                        <span className="text-3xl">{Intl.NumberFormat("en-US").format(item.value)}</span>
                                        <span className="absolute text-[10px]">TND</span>
                                    </p>
                                    <p className="flex gap-1 justify-center items-center font-medium">
                                        <span>{item.name}</span>
                                        <span className="text-gray-600 font-bold">({item.count})</span>
                                    </p>
                                </button>
                                <div key={"sep" + item.id}>
                                    {activities.length - 1 != i &&
                                        <svg key={i} className="w-8 h-8 mx-3" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                            <path d="M9 6L15 12L9 18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default ActivitiesList;