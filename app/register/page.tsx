"use-client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useNotification } from "../components/Notification";
import Link from "next/link";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [error, setError] = useState<String | null>("");

  const { showNotification } = useNotification();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== cnfPassword) {
      showNotification("Passwords do not match", "error");
      //   setError("Password doesn't match");
      return;
    }
    const data = { email, password };
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setError("Registration Failed");
        throw new Error(json.error || "Registration failed");
      }
      showNotification("Registration successful! Please log in.", "success");
      router.push("/login");
    } catch (error) {
      setError("Registration Failed");
      showNotification(
        error instanceof Error ? error.message : "Registration failed",
        "error"
      );
      return;
    }
  };
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={cnfPassword}
            onChange={(e) => setCnfPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
