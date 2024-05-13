"use client";
import { useEffect, useState } from "react";
import { User } from "../../utils/models/types/user";
import { UserModel } from "../../utils/models/userModel";
import { Sleep } from "../../utils/models/types/user";
export default function ProfilePage() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerStop, setTimerStop] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isNameOpen, setIsNameOpen] = useState(false);

  const openModal = () => {
    setUsername("");
    setIsNameOpen(true);
  };

  const closeModal = () => setIsNameOpen(false);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/api/getUser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch notes");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data.user);
          setUsername(data.user.username || "");
        })
        .catch((error) => {
          console.error("Error fetch:", error);
        });
    }
  };

  const submitUsername = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Submitting new username:", username);
      fetch("/api/getUser", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch notes");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data.user);
          setUsername(data.user.username || "");
          closeModal();
        })
        .catch((error) => {
          console.error("failed to uodate username", error);
        });
    }
  };

  const submitSleep = async (sleepData: Sleep) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);

      if (token) {
        const response = await fetch("/api/saveSleep", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sleepData),
        });
        const data = await response.json();
        console.log("data is", data);
        if (!response.ok) {
          throw new Error(data.message || "failed to save sleep");
        }
        console.log("sleep saved", data);
      }
    } catch (error) {
      console.error("Error with saving sleep ");
    }
  };

  //timer
  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerStart(new Date());
  };
  const stopTimer = () => {
    if (timerStart) {
      const durationInMSeconds = Math.floor(
        new Date().getTime() - timerStart.getTime()
      );

      const durationInSeconds = Math.floor(durationInMSeconds / 1000);
      // const hours = durationInSeconds / 3600;
      // let quality: "bad" | "avarage" | "good" = "bad"; //bad is default

      // if (hours < 4) {
      //   quality = "bad";
      // } else if (hours >= 4 && hours <= 7) {
      //   quality = "avarage";
      // } else if (hours > 7) {
      //   quality = "good";
      // }

      // const sleepData: Sleep = {
      //   quality,
      //   duration: durationInSeconds,
      // };
      // console.log("sleep data:", sleepData);
      // submitSleep(sleepData);
      setTimerStop(durationInSeconds);
      setIsTimerRunning(false);
    }
  };

  const handleSubmit = () => {
    if (timerStop !== null) {
      const hours = timerStop / 3600;
      let quality: "bad" | "avarage" | "good" = "bad"; //bad is default

      if (hours < 4) {
        quality = "bad";
      } else if (hours >= 4 && hours <= 7) {
        quality = "avarage";
      } else if (hours > 7) {
        quality = "good";
      }
      const sleepData: Sleep = {
        quality,
        duration: timerStop,
      };
      submitSleep(sleepData);
      setTimerStop(null);
    }
  };
  //display timer
  function timer(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secondsRemaining.toString().padStart(2, "0"),
    ].join(":");
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            {user ? (
              <p>Hello, {user.username || user.email}</p>
            ) : (
              <p>Loading...</p>
            )}
          </span>
          <div>
            {isNameOpen && (
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter new username"
                />
                <button onClick={submitUsername}>save</button>
                <button onClick={closeModal}>cancel</button>
              </div>
            )}
          </div>
        </div>
        <div className="block lg:hidden">
          <div>
            <a
              href="#"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Log out
            </a>
          </div>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <button
              onClick={openModal}
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              {user?.username ? "Change Username" : "Add Username"}
            </button>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Track sleeping quality
            </a>
          </div>
        </div>
      </nav>
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
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-white rounded-lg shadow"
        >
          Save
        </button>
      </div>
    </div>
  );
}
