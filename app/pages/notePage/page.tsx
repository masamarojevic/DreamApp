"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch("/api/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token, title, description }),
      });
      if (response.ok) {
        router.push("/pages/homePage");
      } else {
        const errorData = await response.json();
        console.error("Failed to save the note:", errorData.message);
      }
    } catch (error) {
      console.log("error occured for saving the note", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-300 via-white to-gray-300 min-h-screen p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Note description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 h-40 border border-gray-300 rounded"
        ></textarea>

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={saveNotes}
        >
          Save
        </button>
        <button className="px-6 py-1 m-2 bg-white rounded-lg shadow">
          Choose dream colour
        </button>
      </div>
    </div>
  );
}
