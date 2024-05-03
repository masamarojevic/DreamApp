"use client";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { noteItem } from "../../../utils/models/types/user";

export default function ViewNote() {
  // const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<noteItem | null>(null); //one item or null

  //and this code runs on client side
  const pathname = usePathname();

  //the split : /api/getNote/65f985e1436d281e735ca4e7,
  //splitting it by / will result in the following array: ["", "api", "getNote", "65f985e1436d281e735ca4e7"].
  const getIdFromPath = () => {
    const paths = pathname.split("/");
    return paths[paths.length - 1];
  };

  const noteId = getIdFromPath();

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

    getNote();
  }, [noteId]);

  if (!note) {
    return <p>No note found or loading...</p>;
  }
  return (
    <div>
      <h1>{note.title}</h1>
      <h2>{note.description}</h2>
    </div>
  );
}
