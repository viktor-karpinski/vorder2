import { useState } from "react"

const FoodSelection = ({food, added}) => {
    const [amount, setAmount] = useState(0)

    const add = () => {
        if (added && amount > 0) {
            added(food, amount)
            setAmount(0)
        }
    }

    return (
        <div className="food-selection">
            <p>
                {food?.variation_label}
            </p>

            <aside>
                <input 
                    type="number" 
                    step={10} 
                    min={0} 
                    value={amount} 
                    onChange={(ev) => {setAmount(ev.target.value)}}
                    onKeyPress={(ev) => {
                        if (ev.key === "Enter") {
                            ev.preventDefault()
                            add()
                        }
                    }}
                />
                <button onClick={add} type="button">
                    add
                </button>
            </aside>
        </div>
    )
}

export default FoodSelection