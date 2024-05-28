"use client";
import { useEffect, useState } from "react";
import { User } from "../../utils/models/types/user";
import { UserModel } from "../../utils/models/userModel";
import { Sleep } from "../../utils/models/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ProfilePage() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerStop, setTimerStop] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isClock, setIsClock] = useState(false);
  const router = useRouter();

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

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  //timer
  const startTimer = () => {
    setIsTimerRunning(true);
    setIsClock(true);
    setTimerStart(new Date());
  };
  const stopTimer = () => {
    if (timerStart) {
      const durationInMSeconds = Math.floor(
        new Date().getTime() - timerStart.getTime()
      );

      const durationInSeconds = Math.floor(durationInMSeconds / 1000);

      setTimerStop(durationInSeconds);
      setIsClock(false);
      setIsTimerRunning(false);
    }
  };

  const handleSubmit = () => {
    if (timerStop !== null) {
      const hours = timerStop / 3600;
      let quality: "bad" | "avarage" | "good" = "bad"; //bad is default

      const colorOption = {
        bad: "#FF6B4B",
        avarage: "#F4F25E",
        good: "#82F474",
      };

      const color = colorOption[quality] || "white";

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
        time: new Date(),
        color: color,
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
    <div className={`relative`}>
      <nav className="flex items-center justify-between flex-wrap bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight animate-bounce">
            {user ? (
              <p>Hello, {user.username || user.email}</p>
            ) : (
              <p>Loading...</p>
            )}
          </span>
          <div>
            {isNameOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-black opacity-50 absolute inset-0"></div>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-xl "></div>

                <div className="bg-white p-6 rounded-lg shadow-lg z-50">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="enter new username"
                    className="mb-4 px-4 py-2 border rounded-lg w-full text-black"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={submitUsername}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      save
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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
            <Link
              href="/pages/calendarPage"
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Track sleeping quality
            </Link>
            <button
              onClick={logOut}
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Log out
            </button>
          </div>
          <Link href={"/pages/homePage"}>
            <button className="px-6 py-2 mt-5 bg-white rounded-lg shadow  md:w-auto">
              <img src="/home.png" style={{ width: 15, height: 15 }}></img>
            </button>
          </Link>
        </div>
      </nav>
      <h1 className="text-lg md:text-xl font-semibold p-3"> Going to sleep?</h1>
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 items-center md:justify-items-center p-4 md:p-20 w-full">
        {isTimerRunning ? (
          <button
            className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-300 md:w-auto m-4 md:mr-10"
            onClick={stopTimer}
          >
            Stop Dream
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 md:w-auto m-4 md:mr-10 "
            onClick={startTimer}
          >
            Start Dream
          </button>
        )}

        {!isTimerRunning && timerStop !== null && (
          <p className="text-center  m-4 md:mb-0">
            Your sleep session: {timer(timerStop)}
          </p>
        )}
        {!isTimerRunning && timerStop !== null && (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-all duration-300 md:w-auto"
          >
            Save
          </button>
        )}
      </div>
      {isClock && (
        <div className="flex justify-center mt-10">
          <img
            src="/midnight.gif"
            style={{ width: 100, height: 100 }}
            className=""
          />
        </div>
      )}
    </div>
  );
}
