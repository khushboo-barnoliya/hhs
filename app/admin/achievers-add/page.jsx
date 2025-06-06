"use client";
import { useState } from "react";

export default function AddAchiever() {
  const [form, setForm] = useState({
    name: "",
    image: "",
    result: "",
    subject: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/achievers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      alert(`🎉 Achiever added! ID: ${data.data._id}`);
      setForm({ name: "", image: "", result: "", subject: "", description: "" });
      setImagePreview("");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to add achiever");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 space-y-6 max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-xl shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-center">🎖️ Add New Achiever</h2>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Fancy Image Upload Box */}
      <div className="w-full">
        <label
          htmlFor="imageUpload"
          className="flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-800 border-gray-600 hover:border-blue-500 transition"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-1h6v1a1 1 0 01-1 1z"
                />
              </svg>
              <p className="text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setImagePreview(url);
                setForm({ ...form, image: url });
              }
            }}
          />
        </label>
      </div>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        value={form.name}
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        required
      />

      {/* Result */}
      <input
        type="text"
        name="result"
        placeholder="Result (e.g., 95%)"
        onChange={handleChange}
        value={form.result}
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        required
      />

      {/* Subject */}
      <input
        type="text"
        name="subject"
        placeholder="Subject (e.g., Math)"
        onChange={handleChange}
        value={form.subject}
        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        required
      />


      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded text-white font-semibold ${
          isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Adding..." : "Add Achiever"}
      </button>
    </form>
  );
}
