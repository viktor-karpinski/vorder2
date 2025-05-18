"use client"

import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import CalendarNavigation from "@/components/CalendarNavigation";

const CalendarPage = () => {
    return (
        <div id="dashboard">
            <aside className="side-box">
                <CalendarNavigation  />
            </aside>

             <main>
                <WeeklyCalendar />
            </main>
        </div>
    )
}

export default CalendarPage;