"use client"

import { useApi } from "@/api";
import FoodDetail from "@/components/FoodDetail";
import Navigation from "@/components/Navigation";
import { useEffect, useState, useRef } from "react";

const Food = () => {
    const { get } = useApi();
    const [food, setFood] = useState({});
    const hasFetched = useRef(false);

    const getFood = async () => {
        const response = await get('food');
        if (response.ok) {
            const data = await response.json();
            console.log(data.food);
            setFood(data.food);
        } else {
            console.error('Failed to fetch food:', response.status);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            getFood();
        }
    }, []);

    return (
        <>
            <Navigation>
                <button>
                    add food    
                </button>
            </Navigation>

            <article>
                {food.length > 0 ? (
                    food.map((item) => (
                        <FoodDetail key={item.id} food={item} />
                    ))
                ) : (
                    <p>No food items found.</p>
                )}
            </article>
        </>
    );
};

export default Food;
