"use client"

import { useApi } from "@/api";
import Input from "@/components/Input";
import Navigation from "@/components/Navigation";
import TableInput from "@/components/Nutrition/TableInput";
import { useRef, useState } from "react";
import { redirect } from 'next/navigation';

const AddFood = () => {

    const { post } = useApi()

    const [jsonData, setJsonData] = useState("");

    const formRef = useRef(null);

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

    const handleSave = async (ev) => {
        ev.preventDefault()

        post('food', {
            label: ev.target.label.value,
            visibility: 1,
            producer: ev.target.producer.value || "",
            macros: {
                kcal:                   Number(ev.target.kcal.value) || 0,
                fat:                    Number(ev.target.fat.value) || 0,
                saturated_fat:          Number(ev.target.saturated_fat.value) || 0,
                monounsaturated_fats:   Number(ev.target.monounsaturated_fats.value) || 0,
                polyunsaturated_fats:   Number(ev.target.polyunsaturated_fats.value) || 0,
                trans_fats:             Number(ev.target.trans_fats.value) || 0,
                carbs:                  Number(ev.target.carbs.value) || 0,
                complex_carbs:          Number(ev.target.complex_carbs.value) || 0,
                simple_sugars:          Number(ev.target.simple_sugars.value) || 0,
                protein:                Number(ev.target.protein.value) || 0,
                fibre:                  Number(ev.target.fibre.value) || 0,
                salt:                   Number(ev.target.salt.value) || 0,
            },
            micros: {
                variation: "1",
                vitamin_a:              Number(ev.target.vitamin_a.value) || 0,
                vitamin_c:              Number(ev.target.vitamin_c.value) || 0,
                vitamin_d:              Number(ev.target.vitamin_d.value) || 0,
                vitamin_e:              Number(ev.target.vitamin_e.value) || 0,
                vitamin_k:              Number(ev.target.vitamin_k.value) || 0,
                vitamin_b1_thiamin:     Number(ev.target.vitamin_b1_thiamin.value) || 0,
                vitamin_b2_riboflavin:  Number(ev.target.vitamin_b2_riboflavin.value) || 0,
                vitamin_b3_niacin:      Number(ev.target.vitamin_b3_niacin.value) || 0,
                vitamin_b5_pantothenic_acid: Number(ev.target.vitamin_b5_pantothenic_acid.value) || 0,
                vitamin_b6_pyridoxine:  Number(ev.target.vitamin_b6_pyridoxine.value) || 0,
                vitamin_b7_biotin:      Number(ev.target.vitamin_b7_biotin.value) || 0,
                vitamin_b9_folate:      Number(ev.target.vitamin_b9_folate.value) || 0,
                vitamin_b12_cobalamine: Number(ev.target.vitamin_b12_cobalamine.value) || 0,
                calcium:                Number(ev.target.calcium.value) || 0,
                iron:                   Number(ev.target.iron.value) || 0,
                magnesium:              Number(ev.target.magnesium.value) || 0,
                zinc:                   Number(ev.target.zinc.value) || 0,
                selenium:               Number(ev.target.selenium.value) || 0,
                potassium:              Number(ev.target.potassium.value) || 0,
                sodium:                 Number(ev.target.sodium.value) || 0,
                phosphorus:             Number(ev.target.phosphorus.value) || 0,
                copper:                 Number(ev.target.copper.value) || 0,
                iodine:                 Number(ev.target.iodine.value) || 0,
                manganese:              Number(ev.target.manganese.value) || 0,
                chromium:               Number(ev.target.chromium.value) || 0,
                molybdenum:             Number(ev.target.molybdenum.value) || 0,
            }            
        }).then(async (response) => {
            console.log(response.status)
            if (response.ok) {
                redirect('/dashboard/food');
            }
        })
    }

    const loadJsonIntoForm = () => {
        try {
            const data = JSON.parse(jsonData);
            if (!formRef.current) return;

            Object.entries(data.macros || {}).forEach(([key, value]) => {
                const input = formRef.current.querySelector(`[name="${key}"]`);
                if (input) input.value = value ?? "";
            });

            Object.entries(data.micros || {}).forEach(([key, value]) => {
                const input = formRef.current.querySelector(`[name="${key}"]`);
                if (input) input.value = value ?? "";
            });

            alert('Form filled from JSON!');
        } catch (err) {
            alert('Invalid JSON!');
        }
    };

    return (
        <>
            <Navigation>
                <button onClick={() => formRef.current?.requestSubmit()}>
                    save food
                </button>
            </Navigation>

            <form ref={formRef} onSubmit={handleSave}>
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

                <div className="jsonarea">
                    <textarea
                        placeholder="Paste JSON here"
                        value={jsonData}
                        onChange={(e) => setJsonData(e.target.value)}
                        rows={6}
                        style={{ width: '100%' }}
                    />
                    <button type="button" onClick={loadJsonIntoForm}>
                        Load from JSON
                    </button>
            </div>
            </form>
        </>
    )
}

export default AddFood;