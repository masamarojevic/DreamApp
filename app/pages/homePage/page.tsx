"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { noteItem } from "../../utils/models/types/user";

import { usePathname } from "next/navigation";
export default function HomePage() {
  const [notes, setNotes] = useState<noteItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<noteItem | null>(null);

  const handleSelect = (dream: noteItem) => {
    setSelect(dream);
    setSearch(""); //after selecting empty the input
  };
  const removeSelected = () => {
    setSelect(null);
  };

  const pathname = usePathname();
  const getIdFromPath = () => {
    const paths = pathname.split("/");
    return paths[paths.length - 1];
  };
  const noteId = getIdFromPath();

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
            value={search}
            placeholder="search for dream note"
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full max-w-md"
          />
          {search.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto z-10">
              {notes
                .filter(
                  (note) =>
                    note.title.toLowerCase().includes(search.toLowerCase()) ||
                    note.description
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
                .map((note, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(note)}
                  >
                    {note.title}
                  </li>
                ))}
            </ul>
          )}
          {select && (
            <div className="relative border p-4 rounded-lg mt-4">
              <button
                onClick={removeSelected}
                className="absolute top-0 right-0 p-1 text-xl font-bold hover:text-red-600"
              >
                &times;
              </button>
              <h2>{select.title}</h2>
              <p>{select.description}</p>
            </div>
          )}

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
