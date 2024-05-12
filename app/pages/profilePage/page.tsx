"use client";
import { useState } from "react";
import { User } from "../../utils/models/types/user";
export default function ProfilePage() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerStop, setTimerStop] = useState<number | null>(null);

  //timer
  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStart(new Date());
  };
  const stopTimer = () => {
    //timer shoul not be null when calc
    if (timerStart) {
      const duration = new Date().getTime() - timerStart.getTime();
      setTimerStop(duration);
      setIsTimerRunning(false);
    }
  };
  //display timer
  function timer(duration: number) {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const second = Math.floor((duration / 1000) % 60);

    const hoursPad = hours < 10 ? "0" + hours : hours;
    const minutesPad = minutes < 10 ? "0" + minutes : minutes;
    const secondsPad = second < 10 ? "0" + second : second;

    return `${hoursPad}:${minutesPad}:${secondsPad}`;
  }

  return (
    <div>
      <h1>Hello</h1>
      <div className="overflow-auto h-[20vh] p-2 mb-5 bg-white rounded-lg shadow flex items-center justify-between">
        <h1> Going to sleep?</h1>
        {isTimerRunning ? (
          <button
            className="px-6 py-2 bg-white rounded-lg shadow"
            onClick={stopTimer}
          >
            Stop Dream
          </button>
        ) : (
          <button
            className="px-6 py-2 bg-white rounded-lg shadow"
            onClick={startTimer}
          >
            Start Dream
          </button>
        )}
        {!isTimerRunning && timerStop !== null && (
          <p>Your sleep session: {timer(timerStop)}</p>
        )}
      </div>
    </div>
  );
}
