"use client";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { noteItem } from "../../../utils/models/types/user";
import { DreamItem } from "../../../utils/models/types/dream";
import { useRouter } from "next/navigation";
import Loader from "../../../components/loader";
import { BackgroundGradientAnimation } from "../../../components/gradient";

export default function ViewNote() {
  const [note, setNote] = useState<noteItem | null>(null); //one item or null
  const [dreams, setDreams] = useState<DreamItem[]>([]);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState<DreamItem | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  // this code runs on client side
  const pathname = usePathname();

  //the split : /api/getNote/65f985e1436d281e735ca4e7,
  //splitting it by / will result in the following array: ["", "api", "getNote", "65f985e1436d281e735ca4e7"].
  const getIdFromPath = () => {
    const paths = pathname.split("/");
    return paths[paths.length - 1];
  };

  const returnHome = () => {
    router.push("/pages/homePage");
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
    let timer: ReturnType<typeof setTimeout>;

    const fetchData = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    const getDreams = async () => {
      try {
        const response = await fetch(`/api/getDreams`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dreams");
        }

        const data = await response.json();
        setDreams(data.dreams);
      } catch (error) {
        console.error("Error fetching dreams:", error);
      }
    };

    setLoading(true);
    timer = setTimeout(() => {
      Promise.all([fetchData(), getDreams()]);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
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

  const DeleteNote = async () => {
    try {
      const response = await fetch(`/api/deleteNote/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("failed to delete note");
      }
      returnHome();
    } catch (error) {
      console.error("error deleting note", error);
    }
  };

  if (!note) {
    return <Loader />;
  }
  return (
    <BackgroundGradientAnimation>
      <div className="relative min-h-screen p-4 flex justify-center items-center  bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
        <div className="relative z-10 bg-gradient-to-br from-blue-300 via-purple-600 to-blue-400 p-6 rounded-lg shadow-lg space-y-10 w-full md:w-1/2">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search for dream meaning"
              className="px-4 py-2 border rounded-lg w-full max-w-md"
            />
            {search.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto z-10 ">
                {dreams
                  .filter(
                    (dream) =>
                      dream.title
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
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
          </div>
          {select && (
            <div className="relative border  border-emerald-300 p-4 rounded-lg mt-4">
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
          <div className="space-y-4 space-x-4">
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
                <button
                  onClick={editNote}
                  className="px-6 py-2 bg-white rounded-lg shadow"
                >
                  Save
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="px-6 py-2 bg-white rounded-lg shadow"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="container mx-auto  p-4 border rounded-lg bg-gray-200 shadow-md space-y-2">
                  <h3 className=" from-neutral-500 text-start font-thin">
                    {new Date(note.date).toLocaleString()}
                  </h3>
                  <h1 className="text-center font-bold ">{note.title}</h1>
                  <p className="text-center">{note.description}</p>
                </div>
                <button
                  onClick={() => setEdit(true)}
                  className="px-6 py-2 bg-white rounded-lg shadow"
                >
                  Edit
                </button>
                <button
                  onClick={DeleteNote}
                  className="px-6 py-2 bg-white rounded-lg shadow"
                >
                  Delete
                </button>
                <button
                  onClick={() => router.push("/pages/homePage")}
                  className=" py-2 px-4 absolute right-5 text-white rounded-full hover:bg-red-500"
                  style={{ marginTop: "1rem" }}
                >
                  &times;
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
