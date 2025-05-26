"use client"

import { useApi } from "@/api"
import Input from "@/components/Input"
import Navigation from "@/components/Navigation"
import FoodSelection from "@/components/Nutrition/FoodSelection"
import FoodSelected from "@/components/Nutrition/FoodSelected"
import Switch from "@/components/Switch"
import { useEffect, useState } from "react"

const MealStart = () => {
    const {post, get} = useApi();

    const [isPlanned, setIsPlanned] = useState(false);
    const [mealType, setMealType] = useState('breakfast');
    const [meal, setMeal] = useState(null);
    const [foods, setFoods] = useState([]);
    const [foodList, setFoodList] = useState([]);

    const startMeal = async () => {
        const response = await post('meals/start', {
            planned: isPlanned,
            type: mealType,
        })

        if (response.ok) {
            const data = await response.json()
            setMeal(data.data)
            console.log(data)
        }
    }

    const getFoods = async () => {
        const response = await get('food')

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setFoods(data.food)
        }
    }

    useEffect(() => {
        getFoods()
    }, [])

    const addFoodToList = (food, amount) => {
        food = {... food, amount: amount}
        setFoodList([... foodList, food])

        post(`meals/${meal.id}/foods`, {
            food_id: food.food_id,
            macro_id: food.macro_id,
            micro_id: food.micro_id,
            amount: amount
        })
    }

    return (
        <>
            <Navigation>
                 {meal?.time_tracker?.till === null ? 
                    <button onClick={() => {startMeal()}}>
                        stop meal
                        <span></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </button> :
                    <button onClick={() => {startMeal()}}>
                        start meal
                        <span></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </button>
                }
            </Navigation>

            <form className="food">
                <div className="row">
                    <Switch checked={isPlanned} onChange={setIsPlanned} labels={["Now", "Later"]} />
                    <Input placeholder="NOW" type="datetime-local" label="Meal starts at" disabled={!isPlanned} />
                </div>
                <h2>
                    Type: 
                </h2>
                <div style={{display: "flex", gap: "1rem"}}>
                    <label htmlFor="breakfast">
                        <input type="radio" name="type" value="breakfast" id="breakfast" checked={mealType === 'breakfast'} onChange={(e) => setMealType(e.target.value)} />
                        Breakfast
                    </label>
                    <label htmlFor="brunch">
                        <input type="radio" name="type" value="brunch" id="brunch" checked={mealType === 'brunch'} onChange={(e) => setMealType(e.target.value)} />
                        Brunch
                    </label>
                    <label htmlFor="lunch">
                        <input type="radio" name="type" value="lunch" id="lunch" checked={mealType === 'lunch'} onChange={(e) => setMealType(e.target.value)} />
                        Lunch
                    </label>
                    <label htmlFor="dinner">
                        <input type="radio" name="type" value="dinner" id="dinner" checked={mealType === 'dinner'} onChange={(e) => setMealType(e.target.value)} />
                        Dinner
                    </label>
                    <label htmlFor="Supper">
                        <input type="radio" name="type" value="supper" id="supper" checked={mealType === 'supper'} onChange={(e) => setMealType(e.target.value)} />
                        Supper
                    </label>
                    <label htmlFor="snack">
                        <input type="radio" name="type" value="snack" id="snack" checked={mealType === 'snack'} onChange={(e) => setMealType(e.target.value)} />
                        Snack
                    </label>
                </div>

                <div className="food-selection-wrapper">
                    {foods.map((food, index) => (
                        <FoodSelection key={index} food={food} added={addFoodToList} />
                    ))}
                </div>

                <div className="food-selected-list">
                    {foodList.map((food, index) => (
                        <FoodSelected key={index} food={food} />
                    ))}
                </div>
            </form>
        </>
    )
}

export default MealStart