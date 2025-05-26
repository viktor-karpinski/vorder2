"use client"

import { useApi } from "@/api";
import CalendarNavigation from "@/components/CalendarNavigation";
import { useAppContext, useWorkspaceContext } from "@/context";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navigation from "@/components/Navigation";
import RoutineTracker from "@/components/Workspace/RoutineTracker";
import TableInput from "@/components/Nutrition/TableInput";
import MealInfo from "@/components/Nutrition/MealInfo";

const macrosConfig = [
    { label: "Energy (kcal)", name: "kcal" },
    { label: "Total Fat (g)", name: "fat" },
    { label: "Saturated Fat (g)", name: "saturated_fat" },
    { label: "Monounsaturated Fats (g)", name: "monounsaturated_fats" },
    { label: "Polyunsaturated Fats (g)", name: "polyunsaturated_fats" },
    { label: "Trans Fats (g)", name: "trans_fats" },
    { label: "Carbohydrates (g)", name: "carbs" },
    { label: "Complex Carbs (g)", name: "complex_carbs" },
    { label: "Simple Sugars (g)", name: "simple_sugars" },
    { label: "Protein (g)", name: "protein" },
    { label: "Fibre (g)", name: "fibre" },
    { label: "Salt (g)", name: "salt" }
];

const macrosDisplayConfig = [
    { label: "KCAL", name: "kcal" },
    { label: "Fat", name: "fat" },
    { label: "sat. Fat", name: "saturated_fat" },
    { label: "Carbs", name: "carbs" },
    { label: "Sugars", name: "simple_sugars" },
    { label: "Protein", name: "protein" },
    { label: "Fibre", name: "fibre" },
    { label: "Salt", name: "salt" }
];

const microsConfig = [
    { label: "Vitamin A (µg)", name: "vitamin_a" },
    { label: "Vitamin C (mg)", name: "vitamin_c" },
    { label: "Vitamin D (µg)", name: "vitamin_d" },
    { label: "Vitamin E (mg)", name: "vitamin_e" },
    { label: "Vitamin K (µg)", name: "vitamin_k" },
    { label: "Vitamin B1 Thiamin (mg)", name: "vitamin_b1_thiamin" },
    { label: "Vitamin B2 Riboflavin (mg)", name: "vitamin_b2_riboflavin" },
    { label: "Vitamin B3 Niacin (mg)", name: "vitamin_b3_niacin" },
    { label: "Vitamin B5 Pantothenic Acid (mg)", name: "vitamin_b5_pantothenic_acid" },
    { label: "Vitamin B6 Pyridoxine (mg)", name: "vitamin_b6_pyridoxine" },
    { label: "Vitamin B7 Biotin (µg)", name: "vitamin_b7_biotin" },
    { label: "Vitamin B9 Folate (µg)", name: "vitamin_b9_folate" },
    { label: "Vitamin B12 Cobalamine (µg)", name: "vitamin_b12_cobalamine" },
    { label: "Calcium (mg)", name: "calcium" },
    { label: "Iron (mg)", name: "iron" },
    { label: "Magnesium (mg)", name: "magnesium" },
    { label: "Zinc (mg)", name: "zinc" },
    { label: "Selenium (µg)", name: "selenium" },
    { label: "Potassium (mg)", name: "potassium" },
    { label: "Sodium (mg)", name: "sodium" },
    { label: "Phosphorus (mg)", name: "phosphorus" },
    { label: "Copper (mg)", name: "copper" },
    { label: "Iodine (µg)", name: "iodine" },
    { label: "Manganese (mg)", name: "manganese" },
    { label: "Chromium (µg)", name: "chromium" },
    { label: "Molybdenum (µg)", name: "molybdenum" }
];

const Layout = ({params, children}) => {
    const { get, post } = useApi();
    const { date, setMacros, setMicros, meals, setMeals } = useAppContext();
    const { workspaces, setWorkspaces, setActiveWorkspace, activeWorkspace } = useWorkspaceContext();

    const [sideBarTab, setSideBarTab] = useState('food')

    const [routines, setRoutines] = useState([])

    const [nutritionTotals, setNutritionTotals] = useState({});
    const [displayMacros, setDisplayMacros] = useState([]);

    const router = useRouter();

    const getWorkspaces = async () => {
        const response = await get('workspaces');

        if (response.ok) {
            const data = await response.json();
            console.log(data.workspaces);
            setWorkspaces(data.workspaces);

            if (activeWorkspace === null || activeWorkspace == {} || activeWorkspace === undefined) {
                const local = localStorage.getItem('workspace')
                if (local !== null || local !== undefined) {
                    setActiveWorkspace(JSON.parse(local))
                }
            }
        } else {
            console.error('Failed to fetch Workspaces:', response.status);
        }
    }

    const getRoutines = async () => {
        const response = await get(`routine?date=${date}`);

        if (response.ok) {
            const data = await response.json();
            console.log(data.routines);
            setRoutines(data.routines);

            
        } else {
            console.error('Failed to fetch Routines:', response);
        }
    }

    const getDayFoods = async () => {
        const response = await get('meals/' + date);
        if (!response.ok) return;

        const { meals } = await response.json();

        const allFields = [
            "kcal", "fat", "saturated_fat", "monounsaturated_fats", "polyunsaturated_fats", "trans_fats",
            "carbs", "complex_carbs", "simple_sugars", "protein", "fibre", "salt",
            
            "vitamin_a", "vitamin_c", "vitamin_d", "vitamin_e", "vitamin_k",
            "vitamin_b1_thiamin", "vitamin_b2_riboflavin", "vitamin_b3_niacin", "vitamin_b5_pantothenic_acid",
            "vitamin_b6_pyridoxine", "vitamin_b7_biotin", "vitamin_b9_folate", "vitamin_b12_cobalamine",
            "calcium", "iron", "magnesium", "zinc", "selenium", "potassium",
            "sodium", "phosphorus", "copper", "iodine", "manganese", "chromium", "molybdenum"
        ];

        const totals = Object.fromEntries(allFields.map(field => [field, 0]));

        meals.forEach(meal => {
            meal.meal_foods?.forEach(mealFood => {
            const { macros, micros, amount } = mealFood;
            const factor = amount / 100;

            if (macros) {
                Object.entries(macros).forEach(([key, value]) => {
                if (totals.hasOwnProperty(key)) {
                    totals[key] += parseFloat(value || 0) * factor;
                }
                });
            }

            if (micros) {
                Object.entries(micros).forEach(([key, value]) => {
                if (totals.hasOwnProperty(key)) {
                    totals[key] += parseFloat(value || 0) * factor;
                }
                });
            }
            });
        });

        setNutritionTotals(totals);

        const mealGroups = meals.map(meal => {
        const tracker = meal.time_tracker;

        return {
        label: meal.type,
        from: tracker?.from ?? null,
        till: tracker?.till ?? null,
        foods: meal.meal_foods?.map(mealFood => {
            const { macros, food, amount } = mealFood;
            return {
                label: macros?.label === "OVERALL" ? food?.label : macros?.label,
                amount: amount
            };
        }).filter(Boolean) || []
        };
    });

        setMeals(mealGroups);
    };

    useEffect(() => {
        setMacros(macrosConfig.map(({ label, name }) => ({
            label,
            name,
            placeholder: nutritionTotals[name]?.toFixed(2) ?? "0"
        })));

        setMicros(microsConfig.map(({ label, name }) => ({
            label,
            name,
            placeholder: nutritionTotals[name]?.toFixed(2) ?? "0"
        })));

        setDisplayMacros(macrosDisplayConfig.map(({ label, name }) => ({
            label,
            name,
            placeholder: nutritionTotals[name]?.toFixed(2) ?? "0"
        })))
    }, [nutritionTotals])

    useEffect(() => {
        switch (sideBarTab) {
            case 'routines':
                getRoutines()
                break;
            case 'food':
                getDayFoods()
                break;
        }
    }, [sideBarTab])

    useEffect(() => {
        getWorkspaces()
    }, [])

    const createWorkspace = async () => {
        const response = await post('workspace', {});

        if (response.ok) {
            const data = await response.json();
            console.log(data.workspace);
            setWorkspaces([...workspaces, data.workspace]);
        } else {
            console.error('Failed to fetch Workspace:', response.status);
        }
    }

    const setWorkspace = (workspace, folder = null) => {
        setActiveWorkspace(workspace);
        localStorage.setItem('workspace', JSON.stringify(workspace))

        let path = "/workspace/" + workspace.title.toLowerCase();

        if (folder !== null) {
            const fullPath = buildFolderPath(folder, workspace.folders || []);
            path += "/" + fullPath;
        }

        console.log(path);
        router.push(path);
    };


    function buildFolderPath(folder, allFolders) {
        const segments = [folder.title.toLowerCase()];
        let parentId = folder.workspace_folder_id;

        while (parentId) {
            const parent = allFolders.find(f => f.id === parentId);
            if (!parent) break;

            segments.unshift(parent.title.toLowerCase());
            parentId = parent.workspace_folder_id;
        }

        return segments.join("/");
    }

    const createFolder = async (workspace, type) => {
        let diff = 'folder'
        if (type === 1) diff = 'board'

        const response = await post(`workspace/${workspace.id}/${diff}`, {})
        
        if (response.ok) {
            const data = await response.json();
            const newFolder = data.folder;
    
            const updatedActiveWorkspace = {
                ...workspace,
                folders: [...(workspace.folders || []), newFolder]
            };
    
            const updatedWorkspaces = workspaces.map((ws) =>
                ws.id === workspace.id ? updatedActiveWorkspace : ws
            );
    
            if (workspace.id === activeWorkspace.id) 
                setActiveWorkspace(updatedActiveWorkspace);
            setWorkspaces(updatedWorkspaces);
        }
    }

    const renderFolders = (folders, workspace) => {
        return folders.map((folder) => (
            <div key={folder.id}>
                <div className="row" onClick={(ev) => {
                    ev.preventDefault();
                    setWorkspace(workspace, folder);
                }}>
                    <button className="sub">
                        {folder?.type === 0 ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        )}
                        {folder.title}
                    </button>

                    <aside>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                        </button>
                        <p>/</p>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </button>
                    </aside>
                </div>
                {folder.folders && folder.folders.length > 0 && (
                    <div className="subfolders">
                        {renderFolders(folder.folders, workspace)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div id="dashboard">
            <aside className="side-box">
                <CalendarNavigation  />

                {sideBarTab === 'workspace' && 
                    <div className="workspace-navigator">
                        <button id="add-workspace" onClick={() => {createWorkspace()}}>
                            Create Workspace
                        </button>

                        {workspaces.map((workspace) => (
                            <div className="workspace-row" key={workspace.id}>
                                <div className="row">
                                    <button className="main" onClick={() => setWorkspace(workspace)}>
                                        {workspace.title}
                                    </button>
                                    <aside>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                                        </button>
                                        <p>/</p>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                        </button>
                                    </aside>
                                </div>

                                {(workspace.folders && activeWorkspace?.id === workspace.id) && renderFolders(workspace.folders, workspace)}
                            </div>
                        ))}

                    </div>
                }

                {sideBarTab === 'routines' && 
                    <div className="routine-navigator">
                        <h3>
                            Habits
                        </h3>
                        {routines.map(routine => {return routine.type == 0 && <RoutineTracker key={routine.id} routine={routine} />})}
                        <h3>
                            Break Habits
                        </h3>
                        {routines.map(routine => {return routine.type == 1 && <RoutineTracker key={routine.id} routine={routine} />})}
                        <h3>
                            Counters
                        </h3>
                        {routines.map(routine => {return routine.type == 2 && <RoutineTracker key={routine.id} routine={routine} />})}
                    </div>
                }

                {sideBarTab === 'food' && 
                    <div className="food-navigator">
                        <h3>
                            My Macros
                        </h3>
                        <TableInput inputs={displayMacros} isDisplay={true} />
                        <h3>
                            My Meals
                        </h3>
                        {meals.map((meal) => <MealInfo meal={meal} key={meal.label} />)}
                    </div>
                }
            </aside>

            <main>
                <div id="workspace">
                    

                    { children}
                </div>
            </main>
        </div>
    )
}

export default Layout;