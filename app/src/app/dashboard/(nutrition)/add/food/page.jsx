"use client"

import { useApi } from "@/api";
import Input from "@/components/Input";
import Navigation from "@/components/Navigation";
import TableInput from "@/components/TableInput";

const AddFood = () => {

    const { post } = useApi()

    const  macros_ = [
        {label: "KCAL", name: "kcal", placeholder: "398"},
        {label: "Protein", name: "protein", placeholder: "33"},
        {label: "Fat", name: "fat", placeholder: "35"},
        {label: "sat. Fat", name: "saturated_fat", placeholder: "19"},
        {label: "Fat", name: "fat", placeholder: "35"},
        {label: "sat. Fat", name: "saturated_fat", placeholder: "19"},
        {label: "Carbs", name: "carbs", placeholder: "3"},
        {label: "Sugars", name: "sugars", placeholder: "0"},
        {label: "Fibre", name: "fibre", placeholder: "0"},
        {label: "Salt", name: "salt", placeholder: "4"},
    ]

    const macros = [
        { label: "Energy (kcal)", name: "kcal", placeholder: "2000" },
        { label: "Total Fat (g)", name: "fat", placeholder: "70" },
        { label: "Saturated Fat (g)", name: "saturated_fat", placeholder: "20" },
        { label: "Monounsaturated Fats (g)", name: "monounsaturated_fats", placeholder: "25" },
        { label: "Polyunsaturated Fats (g)", name: "polyunsaturated_fats", placeholder: "15" },
        { label: "Trans Fats (g)", name: "trans_fats", placeholder: "0" },
        { label: "Carbohydrates (g)", name: "carbs", placeholder: "300" },
        { label: "Complex Carbs (g)", name: "complex_carbs", placeholder: "200" },
        { label: "Simple Sugars (g)", name: "simple_sugars", placeholder: "50" },
        { label: "Protein (g)", name: "protein", placeholder: "50" },
        { label: "Fibre (g)", name: "fibre", placeholder: "30" },
        { label: "Salt (g)", name: "salt", placeholder: "6" }
      ];
      

    const micros = [
        { label: "Vitamin A (µg)", name: "vitamin_a", placeholder: "700" },
        { label: "Vitamin C (mg)", name: "vitamin_c", placeholder: "90" },
        { label: "Vitamin D (µg)", name: "vitamin_d", placeholder: "15" },
        { label: "Vitamin E (mg)", name: "vitamin_e", placeholder: "15" },
        { label: "Vitamin K (µg)", name: "vitamin_k", placeholder: "120" },
        { label: "Vitamin B1 Thiamin (mg)", name: "vitamin_b1_thiamin", placeholder: "1.2" },
        { label: "Vitamin B2 Riboflavin (mg)", name: "vitamin_b2_riboflavin", placeholder: "1.3" },
        { label: "Vitamin B3 Niacin (mg)", name: "vitamin_b3_niacin", placeholder: "16" },
        { label: "Vitamin B5 Pantothenic Acid (mg)", name: "vitamin_b5_pantothenic_acid", placeholder: "5" },
        { label: "Vitamin B6 Pyridoxine (mg)", name: "vitamin_b6_pyridoxine", placeholder: "1.3" },
        { label: "Vitamin B7 Biotin (µg)", name: "vitamin_b7_biotin", placeholder: "30" },
        { label: "Vitamin B9 Folate (µg)", name: "vitamin_b9_folate", placeholder: "400" },
        { label: "Vitamin B12 Cobalamine (µg)", name: "vitamin_b12_cobalamine", placeholder: "2.4" },
        { label: "Calcium (mg)", name: "calcium", placeholder: "1000" },
        { label: "Iron (mg)", name: "iron", placeholder: "18" },
        { label: "Magnesium (mg)", name: "magnesium", placeholder: "400" },
        { label: "Zinc (mg)", name: "zinc", placeholder: "11" },
        { label: "Selenium (µg)", name: "selenium", placeholder: "55" },
        { label: "Potassium (mg)", name: "potassium", placeholder: "4700" },
        { label: "Sodium (mg)", name: "sodium", placeholder: "2300" },
        { label: "Phosphorus (mg)", name: "phosphorus", placeholder: "700" },
        { label: "Copper (mg)", name: "copper", placeholder: "0.9" },
        { label: "Iodine (µg)", name: "iodine", placeholder: "150" },
        { label: "Manganese (mg)", name: "manganese", placeholder: "2.3" },
        { label: "Chromium (µg)", name: "chromium", placeholder: "35" },
        { label: "Molybdenum (µg)", name: "molybdenum", placeholder: "45" }
    ];
      

    const handleSave = async () => {
        post('food', {}).then((data) => {
            console.log(data)
        })
    }

    return (
        <>
            <Navigation>
                <button>
                    save food
                </button>
            </Navigation>

            <form onSubmit={handleSave}>
                <div>
                    <Input label="food label" type="text" name="label" placeholder="Beef Steak" error="" />
                    <Input label="producer / brand name" name="producer" type="text" placeholder="Pilos" />
                </div>

                <h2>
                    Macros
                </h2>
                
                <TableInput inputs={macros} />

                <h2>
                    Micros
                </h2>
                
                <TableInput inputs={micros} />
            </form>
        </>
    )
}

export default AddFood;