"use client";
import React from "react";
import { noteItem } from "../utils/models/types/user";

interface NoteModal {
  isOpen: boolean;
  note: noteItem | null;
  onClose: () => void;
  onView: () => void;
}

const NoteModal: React.FC<NoteModal> = ({ isOpen, note, onClose, onView }) => {
  if (!isOpen || !note) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
        <div className="flex items-center mb-2">
          {note.emotions.map((emotion, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                backgroundColor: emotion.color,
                marginRight: "8px",
              }}
            />
          ))}
          <h1 className="text-xs">{new Date(note.date).toDateString()}</h1>
        </div>
        <h2 className="text-xl font-bold mb-4">{note.title}</h2>
        <p className="mb-4">{note.description}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onView}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            View Full Note
          </button>
        </div>
      </div>
    </div>
  );
};
export default NoteModal;
