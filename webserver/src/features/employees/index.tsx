import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const EmployeesPage = () => {
    const arr = Array.from(Array(35).keys());
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef })
    return (
        <>
            <div ref={contentRef} className="p-3">
                {[1, 2].map(() => (<div className="border-2 p-10 w-[745px] mb-5">
                    <div className="flex justify-between items-center text-lg">
                        <p className="font-bold">........./........./.........</p>
                        <p className="font-bold">....... : .......</p>
                    </div>
                    <h2 className="text-2xl text-center font-bold uppercase my-5">dépenses personnelles</h2>
                    <p className="text-lg text-justify mb-5">
                        Ceci est pour certifier que {arr.map(() => "..")}, reconnais avoir reçu la somme de
                        {arr.map(() => "..")} de <b>EMNA VISA SERVICE</b>, en tant que dépense personnelle.
                        <br />
                        Je, {arr.map(() => "..")}, reconnais avoir reçu la somme mentionnée ci-dessus et
                        confirme qu’elle a été reçue pour le motif indiqué.
                        {/* <br />
                        Cette somme est considérée comme payée en totalité et il n'y a aucune réclamation en suspens concernant cette transaction. */}
                    </p>

                    <div className="flex justify-center items-center text-end">
                        <div className="flex-1"></div>
                        <div className="text-center py-10">
                            <p>signature</p>
                            <p>{arr.map(() => "..")}</p>
                        </div>
                    </div>
                </div>))}

            </div>
            <button onClick={() => handlePrint()}>print</button>
        </>
    )
}

export default EmployeesPage;