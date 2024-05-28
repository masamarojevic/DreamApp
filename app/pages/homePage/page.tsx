"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { noteItem, Emotions } from "../../utils/models/types/user";
import { usePathname, useRouter } from "next/navigation";
import { BackgroundBeams } from "../../components/background-beas";
import { BackgroundGradientAnimation } from "../../components/gradient";
import { useModal } from "../../components/sortmodalFC";
import NoteModal from "../../components/noteModal";
import React from "react";
import { SortByOrder } from "../../enums/sortEnum";
export default function HomePage() {
  const [noteModal, setNoteModal] = useState<noteItem | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState<noteItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<noteItem | null>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setSearch("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { modalOptions, openModal, closeModal, selectModal } = useModal();

  //search for dream note
  const handleSelect = (dream: noteItem) => {
    //setSelect(dream);
    setNoteModal(dream);
    setIsNoteModalOpen(true);
    //setSearch(""); //after selecting empty the input
    //router.push(`/pages/viewNote/${dream._id}`);
  };

  const handlCloseModal = () => {
    setIsNoteModalOpen(false);
    setNoteModal(null);
  };

  const handleViewNote = () => {
    if (noteModal) {
      router.push(`/pages/viewNote/${noteModal._id}`);
    }
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

  //useEffect for sorting modal
  useEffect(() => {
    console.log("Effect triggered for sorting:", modalOptions.isSelected);
    if (modalOptions.isSelected !== null) {
      sortNotes(modalOptions.isSelected);
    }
  }, [modalOptions.isSelected]);

  //sort notes
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
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen p-4 z-10">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-start">
            <img
              src="/logo.png"
              className="animate-fifth w-16 md:w-24 lg:w-24 mb-5"
              // className="absolute z-0 bottom-0 mb-2 animate-fifth  w-[10%] sm:w-[30%] md:w-[20%] lg:w-[5%]"
              alt="Logo"
              // style={{ maxWidth: "40%", top: "-3%" }}
            />
            <h1 className="text-white mb-10  ml-3 mt-5 text-xl md:text-3xl  flex-grow">
              DreamCatch
            </h1>
            <Link href={"/pages/profilePage"}>
              <button className="mb-5 ml-20 px-5 py-2  rounded-lg shadow  flex-shrink-0  border border-emerald-400">
                <img
                  src="/profile.png"
                  className="mix-blend-multiply"
                  style={{ width: 20, height: 20 }}
                ></img>
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-20 ">
            <input
              type="search"
              value={search}
              placeholder="search for dream note"
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full lg:max-w-lg mb-5 relative  "
            />

            {search.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute bg-white border border-gray-300 rounded-lg mt-12 max-h-40 overflow-auto z-30 w-full md:max-w-md lg:max-w-lg md:mt-20"
                style={{ maxHeight: "5rem" }}
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

            {/* <Link href={"/pages/profilePage"}>
              <button className="px-6 py-2 bg-white rounded-lg shadow w-full md:w-auto z-20">
                <img src="/profile.png" style={{ width: 15, height: 15 }}></img>
              </button>
            </Link> */}
          </div>

          <h1 className="text-center text-white font-bold  border border-emerald-400 p-2 rounded ">
            Dream notes
          </h1>

          <div className=" border border-emerald-400 overflow-auto h-[80vh] p-2 bg-gradient-to-br from-purple-700 via-blue-300 to-gray-600 rounded-lg shadow m-2 md:m-10 z-10 ">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={openModal}
                  className="px-6 py-1 m-2 border border-emerald-300 rounded-lg shadow z-20 text-white"
                >
                  sort
                </button>
                {modalOptions.isOpen && (
                  <div className="flex flex-col md:flex-row z-30">
                    <button
                      onClick={() => selectModal(SortByOrder.NewToOld)}
                      className="px-6 py-1 m-2 rounded-lg shadow"
                    >
                      newest to oldest
                    </button>
                    <button
                      onClick={() => selectModal(SortByOrder.OldToNew)}
                      className="px-6 py-1 m-2  rounded-lg shadow"
                    >
                      oldest to newest
                    </button>
                    <button
                      onClick={sortNotesEmotions}
                      className="px-6 py-1 m-2 rounded-lg shadow"
                    >
                      emotions
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-6 py-1 m-2  rounded-lg shadow"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              <Link href="/pages/notePage">
                <button className="px-5 py-1 m-2 bg-gray-300 rounded-lg shadow z-20 animate-pulse">
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
                        className={`p-2 border rounded-lg bg-slate-300 text-black shadow-md cursor-pointer transition-colors duration-400 z-20 ${
                          select && select._id === note._id ? "bg-blue-300" : ""
                        }`}
                      >
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
      <NoteModal
        isOpen={isNoteModalOpen}
        note={noteModal}
        onClose={handlCloseModal}
        onView={handleViewNote}
      />
    </BackgroundGradientAnimation>
  );
}
