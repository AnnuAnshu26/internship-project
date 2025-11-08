"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Upload, FileText, User } from "lucide-react";
import { motion } from "framer-motion";

export default function FilesPage() {
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const teamId = typeof window !== "undefined" ? localStorage.getItem("teamId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch files from backend
  const fetchFiles = async () => {
    if (!teamId || !token) return;
    const res = await fetch(`http://localhost:5000/api/files/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setFiles(data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ✅ Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teamId || !token) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("teamId", teamId);

    await fetch(`http://localhost:5000/api/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    fetchFiles(); // reload list after upload
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-5 md:p-8">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-100 to-purple-200 bg-clip-text text-transparent">
          Files & Storage
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Manage your team's documents and resources
        </p>
      </motion.div>

      {/* UPLOAD + SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition text-white px-5 py-2.5 rounded-xl font-medium"
          >
            <Upload size={18} /> Upload File
          </button>
        </>

        <div className="flex items-center bg-[#111827] px-4 py-2.5 rounded-xl border border-white/10 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            className="bg-transparent outline-none ml-3 w-full text-sm"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* FILE LIST */}
      <div className="space-y-3">
        {files
          .filter((file) => file.fileName.toLowerCase().includes(search.toLowerCase()))
          .map((file, i) => (
            <motion.div
              key={file._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#111827] border border-white/10 hover:border-purple-500/40 transition p-4 rounded-xl gap-3"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <FileText className="text-purple-400 w-7 h-7" />
                <div>
                  <p className="font-medium text-sm md:text-base">
                   <a
  href={file.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="hover:underline text-blue-400"
  download
>
  {file.fileName}
</a>



                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <User className="text-gray-400 w-4 h-4" />
                  <p className="text-xs sm:text-sm text-gray-300">{file.uploadedByName}</p>
                </div>

                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(file.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}

        {files.length === 0 && (
          <p className="text-gray-400 text-center mt-4">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
