import Link from "next/link";

const FoodDetail = ({food}) => {
    return (
        <div className="food-detail">
            <div>
                <p>
                    {food.label}, {food.producer}
                </p>
                <aside>
                    <Link href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                </aside>
            </div>

            <div className="macros">
                <div>
                    <p>
                        kcal: <span>{food.macros.kcal}</span>
                    </p>
                    <p>
                        protein: <span>{food.macros.protein}g</span>
                    </p>
                    <p>
                        fat: <span>{food.macros.fat}g</span>
                    </p>
                    <p>
                        sat. fat: <span>{food.macros.saturated_fat}g</span>
                    </p>
                </div>
                <div>
                    <p>
                        carbs: <span>{food.macros.carbs}g</span>
                    </p>
                    <p>
                        sugar: <span>{food.macros.simple_sugars}g</span>
                    </p>
                    <p>
                        fibre: <span>{food.macros.fibre}g</span>
                    </p>
                    <p>
                        salt: <span>{food.macros.salt}g</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FoodDetail;