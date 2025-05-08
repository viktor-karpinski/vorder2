'use client';

import { useAppContext } from '@/context';
import { useEffect, useState } from 'react';

export default function CalendarNavigation({ onLoad, onChanged }) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [dates, setDates] = useState(['', '', '', '', '', '', '']);
  const [week, setWeek] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const {date, setDate} = useAppContext()

  useEffect(() => {
    if (date) {
      const datesOfWeek = getWeekDates(date);
      const formattedDates = datesOfWeek.map(formatDate);
      setDates(formattedDates);
      setWeek(`${formattedDates[0].substring(8, 10)}. ${formattedDates[0].substring(5, 7)} - ${formattedDates[6].substring(8,10)}. ${formattedDates[6].substring(5, 7)}`);
      setCurrentDate(`${date.substring(8, 10)}. ${date.substring(5, 7)}. ${date.substring(0, 4)}`);
    }
  }, [date]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDates = (startDateString) => {
    const startDate = new Date(startDateString);
    const currentDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - currentDay);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getDateAWeekEarlier = (dateString, next) => {
    const givenDate = new Date(dateString);
    givenDate.setDate(givenDate.getDate() - (7 * (next ? -1 : 1)));
    return formatDate(givenDate);
  };

  const changeDate = (newDate) => {
    setDate(newDate);
    if (onLoad) onLoad();
    if (onChanged) onChanged(newDate);
  };

  const previous = () => {
    changeDate(getDateAWeekEarlier(active, false));
  };

  const next = () => {
    changeDate(getDateAWeekEarlier(active, true));
  };

  return (
    <article id="calendar-navigation">
      <div className="week-box">
        <aside>
          <button id="prev" onClick={previous}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <p>{week}</p>

          <button id="next" onClick={next}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </aside>

        <p>{currentDate}</p>
      </div>

      <div className="day-box">
        {days.map((day, i) => (
          <button
            key={i}
            className={dates[i] === date ? 'day active' : 'day'}
            onClick={() => changeDate(dates[i])}
          >
            {day.substring(0, 2)}
          </button>
        ))}
      </div>
    </article>
  );
}
