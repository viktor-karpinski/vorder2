"use client"

import Input from "@/components/Input"
import Navigation from "@/components/Navigation"
import Switch from "@/components/Switch"
import { useState } from "react"

const MealStart = () => {
    const [isPlanned, setIsPlanned] = useState(false);

    return (
        <>
            <Navigation></Navigation>

            <form>
                <div className="row">
                    <Switch checked={isPlanned} onChange={setIsPlanned} labels={["Now", "Later"]} />
                    <Input placeholder="NOW" type="datetime-local" label="Meal starts at" disabled={!isPlanned} />
                </div>
            </form>
        </>
    )
}

export default MealStart