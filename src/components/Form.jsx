"use client";

import { Helmet } from "react-helmet";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoriesForm = () => {
  const fileInputRef = useRef(null);
  const [storyForm, setStoryForm] = useState({
    name: "",
    email: "",
    title: "",
    body: "",
    badge: "",
    media: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "name" || name === "title") && !/^[a-zA-Z0-9\s.,'"-]*$/.test(value)) {
      toast.error(`No special characters allowed in ${name}`);
      return;
    }

    setStoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*") && !file.type.match("video.*")) {
      toast.error("Only images and videos are allowed");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading media...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "stories_upload");

      const res = await fetch(`https://api.cloudinary.com/v1_1/dcevzhfy9/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      setStoryForm((prev) => ({
        ...prev,
        media: {
          publicId: data.public_id,
          url: data.secure_url,
          fileType: data.resource_type,
        },
      }));

      toast.update(toastId, {
        render: "Media uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, title, body } = storyForm;

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Invalid email format");
    if (title.length > 80) return toast.error("Title must be 80 characters or less");
    if (body.length < 50 || body.length > 1000) return toast.error("Body must be 50–1000 characters");

    try {
      const response = await fetch("/api/submit-lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Thank you—your story is under review.");
        setStoryForm({
          name: "",
          email: "",
          title: "",
          body: "",
          badge: "",
          media: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit Story | New York Lore</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12 text-white">
        <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-400">Submit Your Story</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={storyForm.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={storyForm.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm mb-1">
                Title <span className="text-red-500">*</span> (max 80 chars)
              </label>
              <input
                type="text"
                name="title"
                value={storyForm.title}
                onChange={handleChange}
                maxLength={80}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
                required
              />
              <p className="text-xs text-gray-400">{storyForm.title.length}/80 characters</p>
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm mb-1">
                Story Body <span className="text-red-500">*</span> (50–1000 chars)
              </label>
              <textarea
                name="body"
                value={storyForm.body}
                onChange={handleChange}
                minLength={50}
                maxLength={1000}
                className="w-full px-4 py-2 h-32 bg-gray-700 border border-gray-600 rounded focus:outline-none resize-none"
                required
              ></textarea>
              <p className="text-xs text-gray-400">{storyForm.body.length}/1000 characters</p>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-sm mb-1">
                Badge <span className="text-red-500">*</span>
              </label>
              <select
                name="badge"
                value={storyForm.badge}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              >
                <option value="">Select a category</option>
                <option value="Article">Article</option>
                <option value="Poems">Poems</option>
                <option value="Stories">Stories</option>
              </select>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm mb-1">Upload Image/Video</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleMediaChange}
                disabled={isUploading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded file:mr-2 file:py-1 file:px-3 file:border-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded transition"
              >
                Submit Story
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
};

export default StoriesForm;
