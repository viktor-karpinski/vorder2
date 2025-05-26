const MealInfo = ({meal}) => {

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="meal-info">
            <div>
                <p className="type">
                    - {meal.label}
                </p>
                <p>
                    {formatTime(meal.from)} - {formatTime(meal.till)}
                </p>
            </div>
            <div className="meal-foods">
                {meal.foods.map((food, index) => 
                    <p key={index + food}>
                        - {food.label}, {food.amount}g
                    </p>
                )}
            </div>
        </div>
    )
}

export default MealInfo;