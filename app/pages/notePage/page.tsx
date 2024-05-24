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
        alert("Please fill in all containers");
        console.error("Failed to save the note:", errorData.message);
      }
    } catch (error) {
      console.log("error occured for saving the note", error);
    }
  };

  return (
    <div className="relative min-h-screen p-4 flex justify-center items-center  bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="relative z-10 bg-gradient-to-br from-blue-300 via-purple-600 to-blue-400 p-6 rounded-lg shadow-lg">
        <button
          onClick={() => router.push("/pages/homePage")}
          className="absolute top-0 right-3 py-2 px-4 text-white rounded-full hover:bg-red-500"
          style={{ marginTop: "1rem" }}
        >
          &times;
        </button>
        <div className="mt-12">
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
        </div>

        {/* <img
          src="/clouds.png"
          className="absolute right-5 bottom-1 top-56 w-1/2 h-auto object-cover z-0"
          alt="Cloud"
        /> */}
        <h1>What was this dream emotion?</h1>
        <Select
          defaultValue={selectedColor}
          value={selectedColor}
          onChange={handleChange}
          options={colors}
          styles={customStyles}
          getOptionLabel={(option) => `${option.name}`}
        />
        <button
          className="absolute bottom-6 right-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600"
          onClick={saveNotes}
        >
          Save
        </button>
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
