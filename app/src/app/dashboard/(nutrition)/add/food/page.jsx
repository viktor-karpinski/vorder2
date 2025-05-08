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

            <div>
                <Input label="food label" type="text" name="label" placeholder="Beef Steak" error="" />
                <Input label="producer / brand name" name="producer" type="text" placeholder="Pilos" />
            </div>
        </form>
    )
}

export default AddFood;