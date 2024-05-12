"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import Select, {
  StylesConfig,
  SingleValue,
  OptionProps,
  GroupBase,
  components,
  Props as SelectProps,
} from "react-select";
import chroma from "chroma-js";

interface Options {
  value: string;
  name: string;
  color: string;
}

// const dot = (color = "transparent") => ({
//   alignItems: "center",
//   display: "flex",

//   ":before": {
//     backgroundColor: color,
//     borderRadius: "50%",
//     content: '" "',
//     display: "block",
//     marginRight: 8,
//     height: 10,
//     width: 10,
//   },
// });

//CUSTOM STYLE
const customStyles: StylesConfig<Options, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    width: 300,
    borderColor: "gray",
  }),
  option: (styles, { data, isFocused }) => ({
    ...styles,
    display: "flex",
    alignItems: "center",
    backgroundColor: isFocused ? chroma(data.color).alpha(0.1).css() : "white",
    color: chroma(data.color).luminance() < 0.5 ? "black" : "gray",
    paddingLeft: 30,
    ":before": {
      backgroundColor: data.color,
      borderRadius: "50%",
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    display: "flex",
    alignItems: "center",
    color: "black",
    paddingLeft: 5,
    ":before": {
      backgroundColor: data.color,
      borderRadius: "50%",
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }),
};

export default function NotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState<Options | null>(null);

  const colors: Options[] = [
    { value: "Black", name: "Fear", color: "#363636" },
    { value: "Red", name: "Impulsivity", color: "#FF6B4B" },
    { value: "Green", name: "Fertility", color: "#82F474" },
    { value: "Purple", name: "Vivid", color: "#CF9FFF" },
    { value: "Orange", name: "Vibrancy", color: "#F09E30" },
    { value: "Yellow", name: "Creativity", color: "#F4F25E" },
    { value: "Pink", name: "Romance", color: "#FFC0CB" },
    { value: "Blue", name: "Sensitivity", color: "#5ED2F4" },
  ];

  const handleChange: SelectProps<Options, false>["onChange"] = (newValue) => {
    setSelectedColor(newValue as Options);
  };

  const saveNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const noteData = {
        title,
        description,
        emotions: selectedColor
          ? [
              {
                emotion: selectedColor.name,
                color: selectedColor.color,
              },
            ]
          : [],
      };
      const response = await fetch("/api/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token, ...noteData, title, description }),
      });
      if (response.ok) {
        router.push("/pages/homePage");
      } else {
        const errorData = await response.json();
        console.error("Failed to save the note:", errorData.message);
      }
    } catch (error) {
      console.log("error occured for saving the note", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-300 via-white to-gray-300 min-h-screen p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Note description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 h-40 border border-gray-300 rounded"
        ></textarea>

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={saveNotes}
        >
          Save
        </button>
        <h1>What was this dream emotion?</h1>
        <Select
          defaultValue={selectedColor}
          value={selectedColor}
          onChange={handleChange}
          options={colors}
          styles={customStyles}
          getOptionLabel={(option) => `${option.name}`}
        />
        {/* <div>
          <select value={""}>Choose dream emotion</select>
         {colors.map((color,index) => (
          <option key={index} value={color.name} style={color: colour.code}>

          </option>
         ))}
        </div> */}
        {/* <button className="px-6 py-1 m-2 bg-white rounded-lg shadow">
          Choose dream colour
        </button> */}
      </div>
    </div>
  );
}
