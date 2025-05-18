"use client"

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";


const WeeklyCalendar = () => {
    dayjs.extend(isoWeek);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = Array.from({ length: 7 }, (_, i) => dayjs().startOf("week").add(i, "day"));

    return (
        <div className="weekly-calendar">
            {days.map((day, dIndex) => (
                <div className="column" key={dIndex}>
                    <header>
                        <h2>
                            {day.format("ddd D")}
                        </h2>
                    </header>

                    {hours.map((hour, hIndex) => (
                        <div className="hour" key={hIndex}>
                            <p>
                                {String(hour).padStart(2, "0")}:00
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default WeeklyCalendar