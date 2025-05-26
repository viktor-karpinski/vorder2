"use client"

import TableInput from "@/components/Nutrition/TableInput";
import { useAppContext } from "@/context";

const Nutrition = () => {

    const {macros, micros} = useAppContext()

    return (
        <div>
            <h3>
                Macros
            </h3>
            <TableInput inputs={macros} isDisplay={true} />
            <h3>
                Micros
            </h3>
            <TableInput inputs={micros} isDisplay={true} />
        </div>
    )
}

export default Nutrition;