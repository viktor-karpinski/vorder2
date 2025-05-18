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
  const startInfo = useRef(null);
  const calendarRef = useRef(null);
  const columnRefs = useRef([]);

  const hourHeight = 7; // in vh

  const getYRelativeToColumn = (e, dayIndex) => {
    const columnEl = columnRefs.current[dayIndex];
    const rect = columnEl?.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    return offsetY;
  };

  const snapTo5Min = (vhY) => {
    const pxPerMin = (hourHeight * window.innerHeight) / 100 / 60;
    const minutes = Math.floor(vhY / pxPerMin / 5) * 5;
    return minutes;
  };

  const handleMouseDown = (e, dayIndex) => {
    dragging.current = true;
    const offsetY = getYRelativeToColumn(e, dayIndex);
    const startHour = 6;
    const startMin = snapTo5Min(offsetY);
    startInfo.current = { dayIndex, hour: startHour, minutes: startMin };
    setSelection({
      dayIndex,
      fromMinutes: startMin,
      toMinutes: startMin,
    });
  };

  const handleMouseMove = (e, dayIndex) => {
    if (!dragging.current || startInfo.current.dayIndex !== dayIndex) return;

    const offsetY = getYRelativeToColumn(e, dayIndex);
    const currentMinutes = snapTo5Min(offsetY);

    setSelection((prev) => ({
      ...prev,
      toMinutes: currentMinutes,
    }));
  };

  const handleMouseUp = () => {
    if (selection) {
      const from = Math.min(selection.fromMinutes, selection.toMinutes);
      const to = Math.max(selection.fromMinutes, selection.toMinutes);

      if (from !== to) {
        setBlocks((prev) => [
          ...prev,
          {
            dayIndex: selection.dayIndex,
            fromMinutes: from,
            toMinutes: to,
          },
        ]);
      }
    }

    setSelection(null);
    startInfo.current = null;
    dragging.current = false;
  };

  const getBlockStyle = (from, to) => {
    const top = `calc(${from} * (${hourHeight}vh / 60))`;
    const height = `calc(${to - from} * (${hourHeight}vh / 60))`;
    return {
      position: "absolute",
      top,
      height,
      zIndex: 5,
      pointerEvents: "none",
    };
  };

  return (
    <div
      className="weekly-calendar"
      ref={calendarRef}
      onMouseUp={handleMouseUp}
    >
      {days.map((day, dIndex) => (
        <div
          className="column"
          key={dIndex}
          ref={(el) => (columnRefs.current[dIndex] = el)}
          onMouseMove={(e) => handleMouseMove(e, dIndex)}
        >
          <header>
            <h2>{day.format("ddd D")}</h2>
          </header>

          {hours.map((hour) =>
            hour > 5 ? (
              <div
                key={hour}
                className="hour"
                onMouseDown={(e) => handleMouseDown(e, dIndex)}
              >
                <p>{String(hour).padStart(2, "0")}:00</p>
              </div>
            ) : null
          )}

          {/* Scheduled blocks */}
          {blocks
            .filter((b) => b.dayIndex === dIndex)
            .map((b, i) => (
              <div key={i} className="task-block" style={getBlockStyle(b.fromMinutes, b.toMinutes)}>
                <p style={{ padding: "0.5rem" }}>Scheduled</p>
              </div>
            ))}

          {/* Live drag selection */}
          {selection && selection.dayIndex === dIndex && (
            <div
              className="task-selection"
              style={getBlockStyle(selection.fromMinutes, selection.toMinutes)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default WeeklyCalendar;
