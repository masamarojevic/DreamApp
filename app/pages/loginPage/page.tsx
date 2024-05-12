"use client";
import { User } from "../../utils/models/types/user";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
    notes: [],
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Store the token in localStorage
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        router.push("/pages/homePage");
      } else {
        console.log("login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="relative min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-950 via-purple-600 to-blue-400 ">
      <img
        src="/clouds.png"
        className="absolute z-0 w-full bottom-0"
        alt="Cloud"
        style={{ maxWidth: "150%" }}
      />

      <div className="z-10">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
          DreamCatch
        </h1>
        <div className="max-w-md w-full shadow-xl rounded-2xl p-8 border-4 border-white bg-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-2 text-sm font-medium text-gray-700"
              ></label>
              <input
                type="email"
                id="email"
                className="mt-1 px-3 py-2 bg-gray-200 border border-white rounded-lg  focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                value={formData.email}
                onChange={handleChange}
                placeholder="email:"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-2 text-sm font-medium text-gray-700"
              ></label>
              <input
                type="password"
                id="password"
                className="mt-1 px-3 py-2 bg-gray-200 border border-white rounded-lg  focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                value={formData.password}
                onChange={handleChange}
                placeholder="password:"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 px-4 py-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg border border-white  hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
              >
                Log in
              </button>
            </div>
            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Don't have an account? Register here!
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
