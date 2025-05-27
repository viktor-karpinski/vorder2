"use client";

import { useApi } from "@/api";
import { useAppContext } from "@/context";
import { useState, useRef, useEffect } from "react";

const RoutineTracker = ({ routine }) => {
  const { post } = useApi();
  const { date } = useAppContext()

  const [counter, setCounter] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [componentWidth, setComponentWidth] = useState(0);
  const componentRef = useRef(null);

  const trackerRef = useRef(null);
  const [trackerWidth, setTrackerWidth] = useState(0);

  const counterRef = useRef(counter);

  const [showStreak, setShowStreak] = useState(false);
  const [streakCounter, setStrakCounter] = useState(routine.streak);

  useEffect(() => {
    let compWidth = componentRef.current.offsetWidth;
    setComponentWidth(compWidth);
    if (routine?.routine_trackers.length > 0) {
        setCounter(routine.routine_trackers[0].counter)
        setTrackerWidth((routine.routine_trackers[0].counter / routine.amount) * compWidth);

        const formattedroutineDate = new Date(routine.routine_trackers[0].date).toDateString();
        const now = new Date().toDateString();

        if (routine.routine_trackers[0].counter >= routine.amount && formattedroutineDate === now) {
          setShowStreak(true);
        } else {
          setShowStreak(false);
        }
    } else {
        setCounter(0)
        setTrackerWidth((0 / routine.amount) * compWidth);
        setShowStreak(false)
    }
  }, [routine]);

  useEffect(() => {
    counterRef.current = counter;
  }, [counter])

  const handleMouseDown = (ev) => {
    let currentWidth = trackerRef.current.offsetWidth;
    if (routine.type !== 2) {
      setIsDragging(true);

      setDragStartPosition(ev.clientX - currentWidth);
    
      setTimeout(() => {
        if (currentWidth === trackerRef.current.offsetWidth) {
          console.log("TODO HOLDING");
        }
      }, 500);
    }
  };

  const handleMouseMove = (ev) => {
    if (isDragging) {
      const newWidth = ev.clientX - dragStartPosition;
      setTrackerWidth(Math.max(0, Math.min(newWidth, componentWidth)));
      setCounterByWidth(false);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setCounterByWidth(true);
      saveTracker(counterRef.current);
    }
  };

  const setCounterByWidth = (done) => {
    let newCounter;
    newCounter = Math.round(
      (trackerRef.current.offsetWidth / componentWidth) * routine.amount
    );

    setCounter(newCounter);

    if (done) setTrackerWidth((newCounter / routine.amount) * componentWidth);
  };

  const resetCounter = () => {
      setCounter(0);
      setTrackerWidth(0);
      saveTracker(0);
  };

  const saveTracker = async (counter) => {
    console.log(routine.id)

    const response = await post(`routine/track/${routine.id}`, {
      amount: counter,
      date: date
    });

    if (response.ok) {
        const data = await response.json()
        routine.routine_trackers = [data.tracker]

        if (routine.routine_trackers[0].complete) {
          setShowStreak(true)
        } else {
          setShowStreak(false)
        }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const startTracking = async () => {
    const data = await post(
      `track/habit/start/${routine.id}`,
      "HabitTracker.js",
      {}
    );

    setTimeTracker({
      title: routine.title,
      start: data.time_tracker.start,
      end: data.time_tracker.end,
      id: data.time_tracker.id,
      path: `track/habit/stop/${routine.id}`,
    });
  };

  const counterSub = () => {
    if (counter >= 1) {
      let local = counter - 1;
      setCounter(local)
      saveTracker(local)
    }
  }

  const counterAdd = () => {
    let local = counter + 1;
    setCounter(local)
    saveTracker(local)
  }

  return (
    <div className="container" ref={componentRef}>
      <div
        className="overlay"
        onMouseDown={handleMouseDown}
        onDoubleClick={resetCounter}
      ></div>

      <div
        className="trackerState"
        style={{ width: `${trackerWidth}px`, backgroundColor: routine.color }}
        ref={trackerRef}
      ></div>

      <div className="left">
        {((routine.type == 0 || routine.type == 1) && !showStreak) && 
          <button className="startTracking" onClick={startTracking}>
            <span className="play"></span>
          </button>
        }
        {((routine.type == 0 || routine.type == 1) && showStreak === true) &&
          <p className="black">
            {streakCounter}x <span>🔥</span>
          </p>
        }
        <p>{routine.title}</p>
      </div>

      {routine.type !== 2 && 
        <span>
          {counter} / {routine.amount}
        </span>
      }

      {routine.type === 2 && 
        <div className="counter-wrapper">
          <button disabled={counter <= 0} onClick={counterSub}>
            -
          </button>
          <span>
            {counter}
          </span>
          <button onClick={counterAdd}>
            +
          </button>
        </div>
      }
    </div>
  );
};

export default RoutineTracker;