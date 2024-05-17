"use client";
import Calendar from "react-calendar";
import { Sleep } from "../../utils/models/types/user";
import { useEffect, useState } from "react";
type View = "month" | "year" | "decade" | "century";

interface TileContentProps {
  date: Date;
  view: View;
}
export default function CalendarPage() {
  const [sleepPattern, setSleepPattern] = useState<Sleep[]>([]);

  const fetchSleepData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch("/api/getSleep", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Full API response data:", data);
      if (response.ok) {
        setSleepPattern(data.sleepPatterns || []);
        console.log("Received sleep data:", data.sleepPatterns);
      } else {
        console.error("Failed to fetch sleep data:", data.message);
      }
    }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  const tileContent = ({ date, view }: TileContentProps) => {
    if (view === "month") {
      const formattedCalendarDate = new Date(
        date.setHours(0, 0, 0, 0)
      ).toDateString();

      const sleep = sleepPattern?.find((sleepEntry) => {
        const sleepDate = new Date(sleepEntry.time);
        sleepDate.setHours(0, 0, 0, 0); // Set time to midnight to match calendar date
        return sleepDate.toDateString() === formattedCalendarDate;
      });

      console.log("Matching sleep data:", sleep);

      if (sleep) {
        return (
          <div
            style={{
              backgroundColor: sleep.color,
              borderRadius: "50%",
              width: "10px",
              height: "10px",
              margin: "auto",
            }}
          ></div>
        );
      }
    }
    return null;
  };

  //   const tileContent = ({ date, view }: TileContentProps) => {
  //     console.log("Tile Content Function Called", date, view);
  //     if (view === "month") {
  //       const sleep = sleepPattern?.find(
  //         (sleep) => new Date(sleep.time).toDateString() === date.toDateString()
  //       );
  //       console.log("Matching sleep data:", sleep);
  //       return sleep ? (
  //         <div
  //           style={{
  //             backgroundColor: sleep.color,
  //             borderRadius: "50%",
  //             width: "10px",
  //             height: "10px",
  //             margin: "auto",
  //           }}
  //         ></div>
  //       ) : null;
  //     }
  //     return null;
  //   };
  return (
    <div className="flex items-center justify-between flex-wrap bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 p-6">
      <div className="bg-gray-100 p-4">
        <h1 className="text-center text-xl font-bold text-gray-700 mb-4">
          Sleep pattern:
        </h1>

        <div className="text-center text-xl font-bold text-gray-700 mb-4">
          <Calendar tileContent={tileContent} />
        </div>
      </div>
    </div>
  );
}
