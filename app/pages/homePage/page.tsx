"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { noteItem } from "../../utils/models/types/user";
import { usePathname } from "next/navigation";
//import useModalSort from "../../modals/sortModal";

//so it did not work by some reason to import the component but using it directly here it works
import SortByDateModal from "../../components/sortmodalFC";

import React from "react";
import { SortByOrder } from "../../enums/sortEnum";
export default function HomePage() {
  const [notes, setNotes] = useState<noteItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<noteItem | null>(null);

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

          <Link href="/pages/notePage">
            <button className="px-6 py-2 bg-white rounded-lg shadow">
              new
            </button>
          </Link>

          <button className="px-6 py-2 bg-white rounded-lg shadow">
            profile
          </button>
        </div>

        <div className="overflow-auto h-[80vh] p-2 bg-white rounded-lg shadow">
          <button
            onClick={openModal}
            className="px-6 py-1 m-2 bg-white rounded-lg shadow"
          >
            Sort
          </button>
          {modalOptions.isOpen && (
            <div>
              <button
                onClick={() => selectModal(SortByOrder.NewToOld)}
                className="px-6 py-1 m-2 bg-white rounded-lg shadow"
              >
                Newest to Oldest
              </button>
              <button
                onClick={() => selectModal(SortByOrder.OldToNew)}
                className="px-6 py-1 m-2 bg-white rounded-lg shadow"
              >
                Oldest to Newest
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-1 m-2 bg-white rounded-lg shadow"
              >
                &times;
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-5">
            {notes.length > 0 ? (
              notes.map((note) => {
                console.log("Rendering note with ID:", note._id);
                return (
                  <Link
                    key={note._id.toString()}
                    href={`/pages/viewNote/${note._id.toString()}`}
                  >
                    <div
                      className={`p-4 border rounded-lg bg-gray-200 shadow-md cursor-pointer transition-colors duration-400 ${
                        select && select._id === note._id ? "bg-blue-200" : ""
                      }`}
                    >
                      <h1>{new Date(note.date).toLocaleString()}</h1>
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
