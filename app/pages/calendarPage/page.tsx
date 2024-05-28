"use client";
import Calendar from "react-calendar";
import { Sleep } from "../../utils/models/types/user";
import { useEffect, useState } from "react";
import Link from "next/link";
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 p-6">
      <div className="flex justify-end items-start">
        <Link href={"/pages/homePage"}>
          <button className="px-6 py-2 mt-5 bg-white rounded-lg shadow">
            <img src="/home.png" style={{ width: 15, height: 15 }} alt="Home" />
          </button>
        </Link>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-purple-200 p-4 shadow-lg rounded border border-emerald-300">
          <h1 className="text-center text-xl font-bold text-gray-700 mb-4 ">
            Sleep pattern:
          </h1>
          <div className="flex justify-center text-center text-xl font-bold text-gray-700 mb-4">
            <Calendar tileContent={tileContent} />
          </div>
        </div>
      </div>
      <div className="bg-purple-200 p-3 shadow-lg rounded border border-emerald-300">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-2">
            <span
              className="block w-4 h-4 bg-red-500 rounded-full mb-1"
              style={{ backgroundColor: "#FF6B4B" }}
            ></span>
            <p className="text-sm text-gray-700">Bad</p>
          </div>
          <div className="flex flex-col items-center mb-2">
            <span
              className="block w-4 h-4 bg-yellow-300 rounded-full mb-1"
              style={{ backgroundColor: "#F4F25E" }}
            ></span>
            <p className="text-sm text-gray-700">Average</p>
          </div>
          <div className="flex flex-col items-center mb-2">
            <span
              className="w-4 h-4 bg-green-500 rounded-full mb-1"
              style={{ backgroundColor: "#82F474" }}
            ></span>
            <p className="text-sm text-gray-700">Good</p>
          </div>
        </div>
      </div>
    </div>
  );
}
