"use client"

import { useApi } from "@/api";
import Input from "@/components/Input";

const AddFood = () => {

    const { post } = useApi()

    const handleSave = async () => {
        post('food', {}).then((data) => {
            console.log(data)
        })
    }

    return (
        <form onSubmit={handleSave}>
            <h2>
                Add/Food
            </h2>

            <Input label="food label" type="text" placeholder="Beef Steak" />
        </form>
    )
}

export default AddFood;