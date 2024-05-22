"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { noteItem, Emotions } from "../../utils/models/types/user";
import { usePathname, useRouter } from "next/navigation";
import { BackgroundBeams } from "../../components/background-beas";

//import useModalSort from "../../modals/sortModal";

//so it did not work by some reason to import the component but using it directly here it works
import SortByDateModal from "../../components/sortmodalFC";

import React from "react";
import { SortByOrder } from "../../enums/sortEnum";
export default function HomePage() {
  const [notes, setNotes] = useState<noteItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<noteItem | null>(null);
  const router = useRouter();

  // const { modalOptions, openModal, closeModal, selectModal } = useModalSort();

  const [modalOptions, setModalOptions] = useState({
    isOpen: false,
    isSelected: null as SortByOrder | null,
  });

  // const handleSortSelection = (order: SortByOrder) => {
  //   closeModal(); // Assuming closeModal updates the state to reflect changes
  //   sortNotes(order); // Directly pass order to the sort function
  // };
  const openModal = useCallback(() => {
    setModalOptions((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeModal = useCallback(() => {
    setModalOptions((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const selectModal = useCallback((option: SortByOrder) => {
    setModalOptions((prev) => ({
      ...prev,
      isOpen: true,
      isSelected: option,
    }));
  }, []);

  //modal for sorting by date :
  const handleSelect = (dream: noteItem) => {
    setSelect(dream);
    setSearch(""); //after selecting empty the input
    router.push(`/pages/viewNote/${dream._id}`);
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

  //CHECK WHY STATE IS NOT TRIGGERING THE SORTING

  // useEffect(() => {
  //   console.log(
  //     "useEffect for Sorting: Selected order:",
  //     modalOptions.isSelected
  //   );
  //   console.log("Current notes state before sorting:", notes);
  //   if (modalOptions.isSelected) {
  //     const sorted = [...notes].sort((a, b) => {
  //       const dateA = new Date(a.date).getTime();
  //       const dateB = new Date(b.date).getTime();
  //       return modalOptions.isSelected === SortByOrder.NewToOld
  //         ? dateB - dateA
  //         : dateA - dateB;
  //     });

  //     setNotes(sorted);
  //     console.log("Notes sorted", modalOptions.isSelected, sorted);
  //   }
  // }, [modalOptions.isSelected, notes]);

  // const [, forceUpdate] = useState(0);
  // useEffect(() => {
  //   if (modalOptions.isSelected) {
  //     sortNotes(modalOptions.isSelected);
  //     forceUpdate((n) => n + 1); // This is not recommended for production, just for testing if rendering is the issue
  //   }
  // }, [modalOptions.isSelected]);
  useEffect(() => {
    console.log("Effect triggered for sorting:", modalOptions.isSelected);
    if (modalOptions.isSelected !== null) {
      sortNotes(modalOptions.isSelected);
    }
  }, [modalOptions.isSelected]); // Ensure useEffect triggers whenever isSelected changes

  const sortNotes = (sortByOrder: SortByOrder) => {
    console.log("Sorting notes by:", sortByOrder);
    const sorted = [...notes].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortByOrder === SortByOrder.NewToOld
        ? dateB - dateA
        : dateA - dateB;
    });
    console.log("Notes sorted:", sorted);
    setNotes(sorted); // Update the notes state with the sorted notes
  };
  const sortNotesEmotions = () => {
    const colorSorted = [...notes].sort((a, b) => {
      const colorA = a.emotions[0]?.color.toUpperCase();
      const colorB = b.emotions[0]?.color.toUpperCase();
      if (colorA < colorB) return -1;
      if (colorA > colorB) return 1;
      return 0;
    });
    setNotes(colorSorted);
  };

  return (
    <div className="bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 min-h-screen p-4">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <input
            type="search"
            value={search}
            placeholder="search for dream note"
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:max-w-md mb-2 md:mb-0"
          />

          {search.length > 0 && (
            <ul
              className="absolute bg-white border border-gray-300 
            rounded-lg mt-1 max-h-60 overflow-auto z-10  w-full md:w-auto"
            >
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

          {/* {select && (
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
          )} */}

          <Link href={"/pages/profilePage"}>
            <button className="px-6 py-2 bg-white rounded-lg shadow  w-full md:w-auto">
              <img src="/profile.png" style={{ width: 15, height: 15 }}></img>
            </button>
          </Link>
        </div>

        <div className="overflow-auto h-[80vh] p-2 bg-gradient-to-br from-gray-900 via-purple-700 to-gray-600 rounded-lg shadow m-2 md:m-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={openModal}
                className="px-6 py-1 m-2 bg-gray-300 rounded-lg shadow "
              >
                sort
              </button>
              {modalOptions.isOpen && (
                <div className="flex flex-col md:flex-row ">
                  <button
                    onClick={() => selectModal(SortByOrder.NewToOld)}
                    className="px-6 py-1 m-2 bg-gray-300 rounded-lg shadow"
                  >
                    newest to oldest
                  </button>
                  <button
                    onClick={() => selectModal(SortByOrder.OldToNew)}
                    className="px-6 py-1 m-2 bg-gray-300 rounded-lg shadow"
                  >
                    oldest to newest
                  </button>
                  <button
                    onClick={sortNotesEmotions}
                    className="px-6 py-1 m-2 bg-gray-300 rounded-lg shadow"
                  >
                    emotions
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-1 m-2 bg-gray-300 rounded-lg shadow"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <Link href="/pages/notePage">
              <button className="px-5 py-1 m-2 bg-gray-300 rounded-lg shadow">
                <img src="/add.png" style={{ height: 15, width: 15 }}></img>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
            {notes.length > 0 ? (
              notes.map((note) => {
                return (
                  <Link
                    key={note._id.toString()}
                    href={`/pages/viewNote/${note._id.toString()}`}
                  >
                    <div
                      className={`p-2 border rounded-lg bg-slate-300 text-black shadow-md cursor-pointer transition-colors duration-400 ${
                        select && select._id === note._id ? "bg-blue-300" : ""
                      }`}
                    >
                      {" "}
                      <div>
                        {note.emotions.map((emotion, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <span
                              style={{
                                display: "inline-block",
                                height: "10px",
                                width: "10px",
                                borderRadius: "50%",
                                backgroundColor: emotion.color,
                                marginRight: "8px",
                              }}
                            />

                            <h1 className="text-xs">
                              {new Date(note.date).toDateString()}
                            </h1>
                          </div>
                        ))}
                      </div>
                      <h5 className="text-lg font-bold mb-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                        {note.title}
                      </h5>
                      <p className="text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                        {note.description}
                      </p>
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
