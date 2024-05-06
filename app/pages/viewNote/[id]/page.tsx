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

  const handleSelect = (dream: DreamItem) => {
    setSelect(dream);
    setSearch(""); //after selecting empty the input
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

  // const filterDreams1 = dreams.filter(
  //   (dream) =>
  //     dream.title.toLowerCase().includes(search.toLowerCase()) ||
  //     dream.meaning.toLocaleLowerCase().includes(search.toLowerCase())
  // );

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
  }, [noteId]);

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
        <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto">
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
        <div>
          <h2>{select.title}</h2>
          <p>{select.meaning}</p>
        </div>
      )}
      <h1>{note.title}</h1>
      <h2>{note.description}</h2>
      {/* <div>
        {filterDreams.map((dream, index) => (
          <div key={index}>
            <h2>{dream.title}</h2>
            <p>{dream.meaning}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}
