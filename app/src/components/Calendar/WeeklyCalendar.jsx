"use client";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useAppContext } from "@/context";
import { useMemo, useRef, useState, useEffect } from "react";

dayjs.extend(isoWeek);

const WeeklyCalendar = () => {
  const { date } = useAppContext();

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const days = useMemo(() => {
    const base = dayjs(date);
    const startOfWeek = base.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [date]);

  const [selection, setSelection] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const dragging = useRef(false);
  const startRef = useRef(null);
  const calendarRef = useRef(null);
  const [hourHeight, setHourHeight] = useState(0);

  useEffect(() => {
    // Measure height of one hour cell
    const el = document.querySelector(".hour");
    if (el) setHourHeight(el.getBoundingClientRect().height);
  }, []);

  const handleMouseDown = (dayIndex, hour) => {
    dragging.current = true;
    startRef.current = { dayIndex, hour };
    setSelection({ dayIndex, startHour: hour, endHour: hour });
  };

  const handleMouseEnter = (dayIndex, hour) => {
    if (!dragging.current || startRef.current.dayIndex !== dayIndex) return;
    setSelection((prev) => ({
      ...prev,
      endHour: hour,
    }));
  };

  const handleMouseUp = () => {
    if (selection) {
      const { dayIndex, startHour, endHour } = selection;
      const finalStart = Math.min(startHour, endHour);
      const finalEnd = Math.max(startHour, endHour) + 1;

      setBlocks((prev) => [
        ...prev,
        {
          dayIndex,
          startHour: finalStart,
          endHour: finalEnd,
        },
      ]);
    }

    dragging.current = false;
    startRef.current = null;
    setSelection(null);
  };

  return (
    <div className="weekly-calendar" onMouseUp={handleMouseUp} ref={calendarRef}>
      {days.map((day, dIndex) => (
        <div className="column" key={dIndex} style={{ position: "relative" }}>
          <header>
            <h2>{day.format("ddd D")}</h2>
          </header>

          {hours.map((hour) =>
            hour > 5 ? (
              <div
                key={hour}
                className="hour"
                onMouseDown={() => handleMouseDown(dIndex, hour)}
                onMouseEnter={() => handleMouseEnter(dIndex, hour)}
              >
                <p>{String(hour).padStart(2, "0")}:00</p>

                {selection &&
                  selection.dayIndex === dIndex &&
                  ((hour >= selection.startHour && hour <= selection.endHour) ||
                    (hour >= selection.endHour && hour <= selection.startHour)) && (
                    <div
                        className="task-selection"
                        style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                    />
                  )}
              </div>
            ) : null
          )}

          {blocks
            .filter((b) => b.dayIndex === dIndex)
            .map((b, idx) => (
              <div
                key={idx}
                className="task-block"
                style={{
                    position: "absolute",
                    top: `calc(${b.startHour - 5} * 7vh)`,
                    height: `calc(${b.endHour - b.startHour} * 7vh)`,
                    zIndex: 5,
                    pointerEvents: "none",
                }}
              >
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
