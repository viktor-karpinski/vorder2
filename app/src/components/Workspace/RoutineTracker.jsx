"use client";

import { useApi } from "@/api";
import { useState, useRef, useEffect } from "react";

const RoutineTracker = ({ routine, onParent }) => {
    const { post } = useApi();

  const [counter, setCounter] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [componentWidth, setComponentWidth] = useState(0);
  const componentRef = useRef(null);
  const trackerRef = useRef(null);
  const [trackerWidth, setTrackerWidth] = useState(0);
  const counterRef = useRef(counter);
  const [showStreak, setShowStrak] = useState(false);
  const [streakCounter, setStrakCounter] = useState(routine.streak);

  useEffect(() => {
     let compWidth = componentRef.current.offsetWidth;
    setComponentWidth(compWidth);
    if (routine?.routine_trackers.length > 0) {
        console.log(routine?.routine_trackers[0])

        setCounter(routine.routine_trackers[0].counter)
        setTrackerWidth((routine.routine_trackers[0].counter / routine.amount) * compWidth);
    } else {
        setCounter(0)
        setTrackerWidth((0 / routine.amount) * compWidth);
    }
  }, []);

  useEffect(() => {
    counterRef.current = counter;
    const formattedroutineDate = new Date(routine.date).toDateString();
    const now = new Date().toDateString();

    if (counter >= routine.amount && formattedroutineDate === now) {
      setShowStrak(true);
      if (!routine.complete) {
        setStrakCounter(streakCounter + 1);
      }
    } else {
      setShowStrak(false);
    }
  }, [counter]);

  const handleMouseDown = (ev) => {
    let currentWidth = trackerRef.current.offsetWidth;
      setDragStartPosition(ev.clientX - currentWidth);
      setIsDragging(true);

      setTimeout(() => {
        if (currentWidth === trackerRef.current.offsetWidth) {
          console.log("TODO HOLDING");
        }
      }, 500);
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
    const response = await post(`routine/track/${routine.id}`, {
      amount: counter,
    });

    if (response.ok) {
        const data = await response.json()
        console.log(data)
    }

    /*setCounter(data.tracker.counter);
    setStrakCounter(data.tracker.streak);
    routine.complete = data.tracker.complete;*/
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

  return (
    <div className="container" ref={componentRef}>
      <div
        className="overlay"
        onMouseDown={handleMouseDown}
        onDoubleClick={resetCounter}
      ></div>

      <div
        className="trackerState"
        style={{ width: `${trackerWidth}px` }}
        ref={trackerRef}
      ></div>

      <div className="left">
        <button className="startTracking" onClick={startTracking}>
          <span className="play"></span>
        </button>
        <p>{routine.title}</p>
      </div>

      {showStreak ? (
        <p>
          {streakCounter} <span>🔥</span>
        </p>
      ) : (
        <span>
          {counter} / {routine.amount}
        </span>
      )}
    </div>
  );
};

export default RoutineTracker;