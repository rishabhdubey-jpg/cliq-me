"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function GenerateForm() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [links, setLinks] = useState([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState(searchParams.get("handle") || "");
  const [pic, setPic] = useState("");
  const [desc, setDesc] = useState("");
  const [createdHandle, setCreatedHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const [customUser, setCustomUser] = useState(null);
  const [myProfiles, setMyProfiles] = useState([]);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setCustomUser(data.user);
        else setCustomUser(null);
      })
      .catch(() => setCustomUser(null));
  }, []);

  const activeUser =
    customUser ||
    (session?.user
      ? {
          username: session.user.email.split("@")[0],
          email: session.user.email,
        }
      : null);

  const fetchMyProfiles = useCallback(async () => {
    if (!activeUser) return;
    const params = new URLSearchParams();
    if (activeUser.username) params.set("username", activeUser.username);
    if (activeUser.email) params.set("email", activeUser.email);

    try {
      const res = await fetch(`/api/my-profiles?${params.toString()}`);
      const data = await res.json();
      if (data.success) setMyProfiles(data.profiles || []);
    } catch {
      setMyProfiles([]);
    }
  }, [activeUser?.username, activeUser?.email]);

  useEffect(() => {
    fetchMyProfiles();
  }, [fetchMyProfiles]);

  const handleChange = (index, link, linktext) => {
    setLinks((prev) =>
      prev.map((item, i) => (i === index ? { link, linktext } : item))
    );
  };

  const addLink = () => {
    setLinks([...links, { link: "", linktext: "" }]);
  };

  const removeLink = (index) => {
    if (links.length === 1) return;
    setLinks(links.filter((_, i) => i !== index));
  };

  const submitLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links,
          handle: handle.trim(),
          pic,
          desc,
          ownerUsername: activeUser?.username || null,
          ownerEmail: activeUser?.email || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setCreatedHandle(handle.trim().toLowerCase());
        setLinks([{ link: "", linktext: "" }]);
        setPic("");
        setDesc("");
        setHandle("");
        fetchMyProfiles();
        window.dispatchEvent(new Event("cliqme-profiles-updated"));
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !handle.trim() ||
    !pic.trim() ||
    !links[0]?.linktext?.trim() ||
    !links[0]?.link?.trim();

  return (
    <div className="min-h-screen bg-[#F3F3F1] pt-28 pb-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Logged-in User's Created Profiles */}
        {activeUser && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2330]">
                  Your CliqMe Profiles
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Signed in as{" "}
                  <span className="font-bold text-[#1E2330]">
                    {activeUser.email || `@${activeUser.username}`}
                  </span>{" "}
                  — click any handle below to open its live page.
                </p>
              </div>
              <span className="w-fit bg-[#D2E823] text-[#254F1A] text-xs font-extrabold px-3 py-1.5 rounded-full">
                {myProfiles.length} {myProfiles.length === 1 ? "Profile" : "Profiles"}
              </span>
            </div>

            {myProfiles.length === 0 ? (
              <p className="text-sm text-gray-500 bg-[#F3F3F1] rounded-2xl p-4">
                You haven&apos;t created a CliqMe handle yet. Use the form below to launch your first one!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProfiles.map((profile) => (
                  <Link
                    key={profile._id}
                    href={`/${profile.handle}`}
                    className="group flex items-center gap-3.5 p-4 rounded-2xl bg-[#F3F3F1] hover:bg-[#D2E823]/40 border border-transparent hover:border-[#254F1A]/20 transition"
                  >
                    <img
                      src={profile.pic}
                      alt={`@${profile.handle}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#254F1A]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-[#1E2330] truncate">
                        @{profile.handle}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.links?.length || 0} links • Open page →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Builder + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Form Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-black/5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] mb-2">
              Create your CliqMe
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Claim your handle, add your links, and launch in seconds.
            </p>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block font-bold text-sm text-[#1E2330] mb-2">
                  Step 1: Claim your Handle
                </label>
                <div className="flex items-center bg-[#F3F3F1] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#2665D6]">
                  <span className="text-gray-500 font-semibold text-sm">cliqme/</span>
                  <input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    type="text"
                    placeholder="yourname"
                    className="w-full bg-transparent outline-none text-[#1E2330] font-semibold text-sm pl-0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm text-[#1E2330] mb-2">
                  Step 2: Add Links
                </label>
                <div className="flex flex-col gap-3">
                  {links.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <input
                        value={item.linktext}
                        onChange={(e) => handleChange(index, item.link, e.target.value)}
                        type="text"
                        placeholder="Link title (e.g. Portfolio)"
                        className="flex-1 bg-[#F3F3F1] px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2665D6]"
                      />
                      <input
                        value={item.link}
                        onChange={(e) => handleChange(index, e.target.value, item.linktext)}
                        type="url"
                        placeholder="https://..."
                        className="flex-1 bg-[#F3F3F1] px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2665D6]"
                      />
                      {links.length > 1 && (
                        <button
                          onClick={() => removeLink(index)}
                          className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addLink}
                  className="mt-3 bg-[#EFF0EC] hover:bg-[#E2E4DD] text-[#1E2330] font-bold text-sm px-5 py-2.5 rounded-full transition cursor-pointer"
                >
                  + Add another link
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <label className="block font-bold text-sm text-[#1E2330]">
                  Step 3: Profile Picture & Bio
                </label>
                <input
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  type="url"
                  placeholder="Profile image URL (https://...)"
                  className="w-full bg-[#F3F3F1] px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2665D6]"
                />
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Short bio about you..."
                  className="w-full bg-[#F3F3F1] px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#2665D6] resize-none"
                />
              </div>

              <button
                disabled={isDisabled}
                onClick={submitLinks}
                className="w-full bg-[#1E2330] hover:bg-[#32394A] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-4 rounded-full transition cursor-pointer"
              >
                {loading ? "Creating..." : "Create your CliqMe"}
              </button>

              {createdHandle && (
                <div className="p-4 rounded-2xl bg-[#D2E823]/30 border border-[#254F1A]/20 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#254F1A]">
                    Your CliqMe is live!
                  </span>
                  <Link
                    href={`/${createdHandle}`}
                    className="bg-[#254F1A] text-white text-xs font-bold px-4 py-2 rounded-full"
                  >
                    View /{createdHandle} →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Phone Preview */}
          <div className="flex flex-col items-center justify-center lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Live Mobile Preview
            </p>
            <div className="w-full max-w-[330px] min-h-[540px] bg-[#254F1A] text-white rounded-[2.5rem] p-6 shadow-2xl border-8 border-[#1E2330] flex flex-col items-center">
              {pic ? (
                <img
                  src={pic}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#D2E823]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#D2E823] text-[#254F1A] flex items-center justify-center text-2xl font-extrabold">
                  {(handle || "C")[0].toUpperCase()}
                </div>
              )}
              <h2 className="font-extrabold text-lg mt-3">@{handle || "yourname"}</h2>
              <p className="text-xs text-white/80 text-center mt-1 px-2">
                {desc || "Your bio will appear right here."}
              </p>

              <div className="w-full mt-6 flex flex-col gap-3">
                {links.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-white text-[#1E2330] font-bold text-sm py-3.5 px-4 rounded-full text-center shadow-sm truncate"
                  >
                    {item.linktext || `Link #${idx + 1}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default function Generate() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F3F3F1]" />}>
      <GenerateForm />
    </Suspense>
  );
}