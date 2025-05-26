const FoodSelected = ({food}) => {
    return (
        <div className="food-selected">
            <p>
                - {food?.amount}g, {food?.variation_label}
            </p>
        </div>
    )
}

export default FoodSelected