"use client";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { noteItem } from "../../../utils/models/types/user";
import { DreamItem } from "../../../utils/models/types/dream";

export default function ViewNote() {
  // const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<noteItem | null>(null); //one item or null
  const [dreams, setDreams] = useState<DreamItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<DreamItem | null>(null);

  //const[editNote,setEditNote]=useState(false)
  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSelect = (dream: DreamItem) => {
    setSelect(dream);
    setSearch(""); //after selecting empty the input
  };

  const removeSelected = () => {
    setSelect(null);
  };

  //and this code runs on client side
  const pathname = usePathname();

  //the split : /api/getNote/65f985e1436d281e735ca4e7,
  //splitting it by / will result in the following array: ["", "api", "getNote", "65f985e1436d281e735ca4e7"].
  const getIdFromPath = () => {
    const paths = pathname.split("/");
    return paths[paths.length - 1];
  };

  const noteId = getIdFromPath();

  const filterDreams =
    search.length > 0
      ? dreams.filter(
          (dream) =>
            dream.title.toLowerCase().includes(search.toLowerCase()) ||
            dream.meaning.toLocaleLowerCase().includes(search.toLowerCase())
        )
      : [];

  useEffect(() => {
    const getNote = async () => {
      if (noteId) {
        try {
          const response = await fetch(`/api/getNote/${noteId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch note");
          }
          const data = await response.json();
          setNote(data.note);
        } catch (error) {
          console.error("Error fetching note:", error);
        }
      }
    };

    // const editNote = async () => {
    //   if (noteId) {
    //     try {
    //       const response = await fetch(`/api/editNote/${noteId}`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         },
    //       });

    //       if (!response.ok) {
    //         throw new Error("Failet to edit note");
    //       }
    //       const data = await response.json();
    //       setNote(data.note);
    //     } catch (error) {
    //       console.log("error fetching note:", error);
    //     }
    //   }
    // };

    const getDreams = async () => {
      try {
        const response = await fetch(`/api/getDreams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("failed to fetch dreams");
        }
        const data = await response.json();
        console.log(data);
        setDreams(data.dreams);
        console.log("received dreams", data.dreams);
      } catch (error) {
        console.error("eroor fetchinf dreams:", error);
      }
    };

    getNote();
    getDreams();
    // editNote();
  }, [noteId]);

  const editNote = async () => {
    const updatedNote = { title: editTitle, description: editDescription };
    fetch(`/api/editNote/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedNote),
    })
      .then((response) => response.json())
      .then((data) => {
        setNote(data.note);
        setEdit(false);
      })
      .catch((error) => console.error("Error updating note:", error));
  };

  if (!note) {
    return <p>No note found or loading...</p>;
  }
  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search for dream meaning"
        className="px-4 py-2 border rounded-lg w-full max-w-md"
      />
      {search.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto z-10">
          {dreams
            .filter(
              (dream) =>
                dream.title.toLowerCase().includes(search.toLowerCase()) ||
                dream.meaning.toLowerCase().includes(search.toLowerCase())
            )
            .map((dream, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(dream)}
              >
                {dream.title}
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
          <p>{select.meaning}</p>
        </div>
      )}
      <div>
        {edit ? (
          <>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 m-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full h-32 p-2 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button onClick={editNote}>Save</button>
            <button onClick={() => setEdit(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h1>{note.title}</h1>
            <h2>{note.description}</h2>
            <button onClick={() => setEdit(true)}>Edit</button>
            <button>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
