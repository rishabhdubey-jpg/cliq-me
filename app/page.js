"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const rotatingWords = ["creators", "developers", "artists", "entrepreneurs", "brands"];

const creators = [
  { name: "@alexbuilds", role: "Indie Hacker", bg: "bg-[#2665D6]", text: "text-white" },
  { name: "@maya.design", role: "UI/UX Designer", bg: "bg-[#E9C0E9]", text: "text-[#502274]" },
  { name: "@devwithsam", role: "Full-Stack Dev", bg: "bg-[#D2E823]", text: "text-[#254F1A]" },
  { name: "@aria.beats", role: "Music Producer", bg: "bg-[#780016]", text: "text-[#E9C0E9]" },
  { name: "@kieranfit", role: "Fitness Coach", bg: "bg-[#1E2330]", text: "text-white" },
  { name: "@studio.nova", role: "Creative Agency", bg: "bg-[#502274]", text: "text-[#D2E823]" },
];

const testimonials = [
  {
    quote: "CliqMe turned my Instagram bio into a clean portfolio and doubled my click-through rate in a week.",
    author: "Riya Sharma",
    role: "Product Designer & Creator",
  },
  {
    quote: "I replaced five messy links with one CliqMe page. Setup took less than two minutes.",
    author: "Arjun Mehta",
    role: "Full-Stack Developer",
  },
  {
    quote: "Everything from my YouTube videos to my digital store lives in one place that actually matches my vibe.",
    author: "Chloe Park",
    role: "Content Creator",
  },
];

const faqs = [
  {
    q: "Why do I need a link in bio tool?",
    a: "Social platforms like Instagram, TikTok, and X limit how you share links. CliqMe gives you one permanent, customizable URL that connects your audience to everything you create, sell, and share.",
  },
  {
    q: "Is CliqMe free to use?",
    a: "Yes! You can claim your handle, add unlimited links, customize your profile picture and bio, and share your CliqMe page completely free.",
  },
  {
    q: "How quickly can I set up my CliqMe?",
    a: "Under 60 seconds. Claim your handle, paste your links, add your avatar, and hit create—your page is live immediately.",
  },
  {
    q: "Where can I share my CliqMe link?",
    a: "Anywhere! Add it to your Instagram, YouTube, LinkedIn, GitHub, X bio, email signature, or even turn it into a QR code for business cards.",
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [handle, setHandle] = useState("");
  const [footerHandle, setFooterHandle] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const authenticated = isLoggedIn || Boolean(session?.user);
  const ctaHref = authenticated ? "/generate" : "/signup";

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const createCliq = (value) => {
    const clean = value.trim().replace(/^@/, "");
    router.push(clean ? `/generate?handle=${encodeURIComponent(clean)}` : ctaHref);
  };

  return (
    <main className="w-full overflow-x-hidden">
      {/* 1. HERO SECTION — LIME */}
      <section
        id="hero"
        className="bg-[#D2E823] text-[#254F1A] min-h-screen pt-32 pb-20 px-5 sm:px-8 lg:px-16 flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Copy */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Everything you are. In one, simple link in bio.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-medium text-[#254F1A]/90 max-w-xl">
              Join creators using CliqMe for their link in bio. One link to help you share everything you create, curate, and sell from your Instagram, YouTube, LinkedIn, and other profiles.
            </p>

            {/* Claim Handle Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 max-w-xl">
              <div className="flex items-center bg-white rounded-xl px-4 py-3.5 flex-1 shadow-sm focus-within:ring-2 focus-within:ring-[#254F1A]">
                <span className="text-gray-500 font-semibold text-sm sm:text-base select-none">cliqme/</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createCliq(handle)}
                  type="text"
                  placeholder="yourname"
                  className="w-full bg-transparent outline-none text-[#1E2330] font-semibold text-sm sm:text-base pl-0.5"
                />
              </div>
              <button
                onClick={() => createCliq(handle)}
                className="bg-[#254F1A] hover:bg-[#1b3a13] text-white font-bold px-7 py-4 rounded-full transition cursor-pointer whitespace-nowrap"
              >
                Claim your CliqMe
              </button>
            </div>
          </div>

          {/* Right Visual Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#254F1A] rounded-[2.5rem] p-6 shadow-2xl border-4 border-white/20 text-white">
              <div className="flex flex-col items-center text-center gap-3 mt-2">
                <div className="w-20 h-20 rounded-full bg-[#D2E823] text-[#254F1A] flex items-center justify-center text-3xl font-extrabold shadow-md">
                  C
                </div>
                <div>
                  <h3 className="font-extrabold text-xl">@yourname</h3>
                  <p className="text-sm text-white/80">Creator • Developer • Designer</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {["My Portfolio Website", "Latest YouTube Video", "GitHub Projects", "Book a 1:1 Call"].map(
                  (label) => (
                    <div
                      key={label}
                      className="bg-white text-[#1E2330] font-bold text-sm py-3.5 px-4 rounded-full text-center shadow-sm hover:scale-[1.02] transition"
                    >
                      {label}
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">Instagram</span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">YouTube</span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">X</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CREATE & CUSTOMIZE — ROYAL BLUE */}
      <section className="bg-[#2665D6] text-white py-20 lg:py-28 px-5 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Mockup Cards */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-[#D2E823] text-[#254F1A] rounded-3xl p-5 flex flex-col justify-between h-52 shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wider">Theme</span>
                <p className="font-extrabold text-xl leading-snug">Bold & Minimal</p>
              </div>
              <div className="bg-[#E9C0E9] text-[#502274] rounded-3xl p-5 flex flex-col justify-between h-52 shadow-xl translate-y-4">
                <span className="text-xs font-bold uppercase tracking-wider">Links</span>
                <p className="font-extrabold text-xl leading-snug">Unlimited Cards</p>
              </div>
              <div className="bg-white text-[#1E2330] rounded-3xl p-5 col-span-2 flex items-center justify-between shadow-xl mt-2">
                <div>
                  <p className="font-extrabold text-base">Custom Handle</p>
                  <p className="text-xs text-gray-500">cliqme.vercel.app/you</p>
                </div>
                <span className="bg-[#2665D6] text-white text-xs font-bold px-3 py-1.5 rounded-full">Live</span>
              </div>
            </div>
          </div>

          {/* Right Copy */}
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#D2E823] leading-[1.08]">
              Create and customize your CliqMe in minutes
            </h2>
            <p className="text-base sm:text-lg text-white/90 max-w-xl">
              Connect all your content across social media, websites, stores, and more in one link in bio. Customize every detail to match your personal brand.
            </p>
            <div>
              <Link
                href={ctaHref}
                className="inline-block bg-[#D2E823] hover:bg-[#c3d91b] text-[#1E2330] font-bold px-8 py-4 rounded-full transition"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHARE ANYWHERE — MAROON */}
      <section className="bg-[#780016] text-white py-20 lg:py-28 px-5 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#E9C0E9] leading-[1.08]">
              Share your CliqMe from your Instagram, YouTube, and everywhere else
            </h2>
            <p className="text-base sm:text-lg text-white/85 max-w-xl">
              Add your unique CliqMe URL to all the platforms and places you find your audience. Then use your page to drive traffic straight to what matters most.
            </p>
            <div>
              <Link
                href={ctaHref}
                className="inline-block bg-[#E9C0E9] hover:bg-[#dfa8df] text-[#1E2330] font-bold px-8 py-4 rounded-full transition"
              >
                Get started for free
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-[#5A0010] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#E9C0E9] text-[#780016] font-extrabold text-xs px-3 py-1 rounded-full">
                  ONE LINK EVERYWHERE
                </span>
                <span className="text-white/60 text-xs font-semibold">cliqme/you</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Instagram Bio", "YouTube Desc", "LinkedIn Profile", "GitHub README"].map((platform) => (
                  <div
                    key={platform}
                    className="bg-white/10 hover:bg-white/15 transition rounded-2xl p-4 font-bold text-sm text-center"
                  >
                    {platform}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AUDIENCE ANALYTICS — CREAM */}
      <section id="analytics" className="bg-[#F3F3F1] text-[#1E2330] py-20 lg:py-28 px-5 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* 2x2 Metric Bento */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full">
            <div className="bg-[#D2E823] text-[#254F1A] rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold uppercase opacity-75">Total Clicks</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-2">48.2K</p>
              <p className="text-xs font-semibold mt-1">+24% this week</p>
            </div>
            <div className="bg-[#2665D6] text-white rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold uppercase opacity-80">Profile Views</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-2">112K</p>
              <p className="text-xs font-semibold mt-1">92% mobile</p>
            </div>
            <div className="bg-[#E9C0E9] text-[#502274] rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold uppercase opacity-80">Top Link CTR</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-2">64%</p>
              <p className="text-xs font-semibold mt-1">Portfolio</p>
            </div>
            <div className="bg-[#1E2330] text-white rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold uppercase opacity-75">Subscribers</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-2">3,940</p>
              <p className="text-xs font-semibold mt-1 text-[#D2E823]">Active audience</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08]">
              Analyze your audience and keep them engaged
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              Track your engagement over time, see which links perform best, and understand what converts your followers into loyal fans.
            </p>
            <div>
              <Link
                href={ctaHref}
                className="inline-block bg-[#E9C0E9] hover:bg-[#dfa8df] text-[#1E2330] font-bold px-8 py-4 rounded-full transition"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF MARQUEE + BENTO GRID — CREAM */}
      <section id="bento" className="bg-[#F3F3F1] text-[#1E2330] pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 text-center mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            The only link in bio trusted by{" "}
            <span className="text-[#2665D6] inline-block min-w-[200px]">
              {rotatingWords[wordIndex]}
            </span>
          </h2>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden py-4">
          <div className="animate-marquee gap-5 px-4">
            {[...creators, ...creators].map((c, idx) => (
              <div
                key={idx}
                className={`${c.bg} ${c.text} w-64 sm:w-72 h-40 rounded-3xl p-6 flex flex-col justify-between shrink-0 shadow-md`}
              >
                <span className="text-xs font-bold uppercase opacity-75">{c.role}</span>
                <p className="text-2xl font-extrabold">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#E9C0E9] text-[#502274] rounded-3xl p-8 flex flex-col justify-between min-h-[240px]">
              <h3 className="text-2xl font-extrabold">Share your content in limitless ways</h3>
              <p className="text-sm font-medium mt-4 opacity-90">
                Add links to videos, portfolios, music, and social feeds—all neatly organized.
              </p>
            </div>
            <div className="bg-[#D2E823] text-[#254F1A] rounded-3xl p-8 flex flex-col justify-between min-h-[240px]">
              <h3 className="text-2xl font-extrabold">Sell products & collect support</h3>
              <p className="text-sm font-medium mt-4 opacity-90">
                Turn your bio into a mini storefront for digital downloads, bookings, and merch.
              </p>
            </div>
          </div>

          <div className="bg-[#2665D6] text-white rounded-3xl p-8 flex flex-col justify-between min-h-[240px]">
            <h3 className="text-2xl font-extrabold">Grow, own, and engage your audience</h3>
            <p className="text-sm font-medium mt-4 text-white/85">
              One clean destination that works seamlessly on every phone, tablet, and desktop.
            </p>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 mt-20 text-center">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-snug text-[#1E2330]">
            &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
          </p>
          <p className="mt-5 font-bold text-gray-700">{testimonials[activeTestimonial].author}</p>
          <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() =>
                setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="w-11 h-11 rounded-full border border-gray-300 hover:bg-white flex items-center justify-center font-bold cursor-pointer transition"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="w-11 h-11 rounded-full border border-gray-300 hover:bg-white flex items-center justify-center font-bold cursor-pointer transition"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION — MAROON */}
      <section id="faq" className="bg-[#780016] text-white py-20 lg:py-28 px-5 sm:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-[#E9C0E9] mb-12">
            Questions? Answered.
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="bg-[#51000F] rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span className="text-[#E9C0E9] text-2xl leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm sm:text-base text-white/80 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. PRE-FOOTER & FOOTER — DEEP PURPLE */}
      <footer className="bg-[#502274] text-white pt-20 pb-12 px-5 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#E9C0E9] leading-tight">
            Jumpstart your corner of the internet today
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 max-w-lg mx-auto">
            <div className="flex items-center bg-white rounded-xl px-4 py-3.5 flex-1">
              <span className="text-gray-500 font-semibold text-sm sm:text-base">cliqme/</span>
              <input
                value={footerHandle}
                onChange={(e) => setFooterHandle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCliq(footerHandle)}
                type="text"
                placeholder="yourname"
                className="w-full bg-transparent outline-none text-[#1E2330] font-semibold text-sm sm:text-base pl-0.5"
              />
            </div>
            <button
              onClick={() => createCliq(footerHandle)}
              className="bg-[#D2E823] hover:bg-[#c3d91b] text-[#1E2330] font-bold px-7 py-4 rounded-full transition cursor-pointer whitespace-nowrap"
            >
              Claim your CliqMe
            </button>
          </div>
        </div>

        {/* White Rounded Footer Card */}
        <div className="max-w-7xl mx-auto bg-white text-[#1E2330] rounded-[2rem] p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-extrabold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><Link href="/#hero" className="hover:text-black">About CliqMe</Link></li>
                <li><Link href="/#bento" className="hover:text-black">Templates</Link></li>
                <li><Link href="/#analytics" className="hover:text-black">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><Link href="/#bento" className="hover:text-black">Creators</Link></li>
                <li><Link href="/#bento" className="hover:text-black">Developers</Link></li>
                <li><Link href="/#faq" className="hover:text-black">Help & FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><Link href="/login" className="hover:text-black">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-black">Sign up free</Link></li>
                <li><Link href="/generate" className="hover:text-black">Create Page</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold mb-3">Trust & Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {authenticated ? (
                <Link
                  href="/generate"
                  className="bg-[#D2E823] hover:bg-[#c3d91b] text-[#254F1A] font-bold text-sm px-6 py-3 rounded-full transition"
                >
                  Open Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-[#EFF0EC] hover:bg-[#E2E4DD] text-[#1E2330] font-bold text-sm px-5 py-3 rounded-xl transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-[#D2E823] hover:bg-[#c3d91b] text-[#1E2330] font-bold text-sm px-6 py-3 rounded-full transition"
                  >
                    Get started for free
                  </Link>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              © {new Date().getFullYear()} CliqMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}