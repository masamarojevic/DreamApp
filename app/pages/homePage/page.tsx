"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { noteItem } from "../../utils/models/types/user";
export default function HomePage() {
  const [notes, setNotes] = useState<noteItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    //GET NOTES/DISPLAY IN SCROLL
    if (token) {
      fetch("/api/getNotes", {
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
          setNotes(data.notes);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-300 via-white to-gray-300 min-h-screen p-4">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <input
            type="search"
            placeholder="search for dream"
            className="px-4 py-2 border rounded-lg w-full max-w-md"
          />

          <Link href="/pages/notePage">
            <button className="px-6 py-2 bg-white rounded-lg shadow">
              new
            </button>
          </Link>
        </div>

        <div className="overflow-auto h-[80vh] p-2 bg-white rounded-lg shadow">
          <div className="grid grid-cols-3 gap-5">
            {notes.length > 0 ? (
              notes.map((note) => {
                console.log("Rendering note with ID:", note._id); // Log the ID
                return (
                  <Link
                    key={note._id.toString()}
                    href={`/pages/viewNote/${note._id.toString()}`}
                  >
                    <div className="p-4 border rounded-lg bg-gray-200 shadow-md cursor-pointer">
                      <h5 className="text-lg font-bold mb-2">{note.title}</h5>
                      <p className="text-sm">{note.description}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>No notes to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
