"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  {
    label: "Products",
    links: [
      { title: "Link in Bio", desc: "Customize your CliqMe page", href: "/generate" },
      { title: "Analytics", desc: "Track clicks & audience growth", href: "/#analytics" },
      { title: "Monetize", desc: "Sell products & collect tips", href: "/#bento" },
    ],
  },
  {
    label: "Templates",
    links: [
      { title: "Creators", desc: "Bold themes for influencers", href: "/generate" },
      { title: "Developers", desc: "Clean portfolio layouts", href: "/generate" },
      { title: "Musicians", desc: "Embed tracks & tour dates", href: "/generate" },
    ],
  },
  { label: "Pricing", href: "/#faq" },
  { label: "Learn", href: "/#faq" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const activeUser =
    user ||
    (session?.user
      ? {
        username: session.user.email.split("@")[0],
        email: session.user.email,
      }
      : null);

  useEffect(() => {
    if (!activeUser) {
      setProfiles([]);
      return;
    }

    const fetchProfiles = () => {
      const params = new URLSearchParams();
      if (activeUser.username) params.set("username", activeUser.username);
      if (activeUser.email) params.set("email", activeUser.email);

      fetch(`/api/my-profiles?${params.toString()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setProfiles(data.profiles || []);
        })
        .catch(() => setProfiles([]));
    };

    fetchProfiles();
    window.addEventListener("cliqme-profiles-updated", fetchProfiles);
    return () => window.removeEventListener("cliqme-profiles-updated", fetchProfiles);
  }, [activeUser?.username, activeUser?.email, pathname]);

  const showNavbar = ["/", "/generate"].includes(pathname);
  if (!showNavbar) return null;

  const primaryHandleHref =
    profiles.length > 0 ? `/${profiles[0].handle}` : "/generate";

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    if (session) await signOut({ callbackUrl: "/" });
    setUser(null);
    setProfiles([]);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10">
      <nav className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md shadow-lg border border-black/5 rounded-full px-5 sm:px-7 py-3 flex items-center justify-between">
        {/* Left: Logo + Desktop Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl font-extrabold tracking-tight text-[#1E2330] flex items-center gap-1.5">
              <span>Cliq<span className="text-[#D2E823]">Me</span></span>
            <img className="w-10 h-10 object-contain" src="/logo.gif" alt="CliqMe logo" />
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 text-[15px] font-semibold text-[#1E2330]">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.links && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.links ? (
                  <>
                    <button className="px-4 py-2.5 rounded-xl hover:bg-[#F3F3F1] transition flex items-center gap-1 cursor-pointer">
                      {item.label}
                      <svg
                        className="w-3.5 h-3.5 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-white rounded-2xl shadow-xl border border-black/5 p-2 flex flex-col gap-1">
                          {item.links.map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className="p-3 rounded-xl hover:bg-[#F3F3F1] transition"
                            >
                              <p className="font-bold text-sm text-[#1E2330]">{sub.title}</p>
                              <p className="text-xs text-gray-500 font-medium">{sub.desc}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2.5 rounded-xl hover:bg-[#F3F3F1] transition block"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Auth Buttons + User Profiles Dropdown + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeUser ? (
            <>
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <Link
                  href={primaryHandleHref}
                  className="inline-flex items-center gap-1.5 justify-center bg-[#D2E823] hover:bg-[#c3d91b] text-[#254F1A] font-bold text-sm px-5 py-3 rounded-xl transition max-w-[200px] truncate"
                >
                  <span className="truncate">
                    {activeUser.email || `@${activeUser.username}`}
                  </span>
                </Link>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-2xl shadow-xl border border-black/5 p-2 flex flex-col gap-1">
                      <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                        Your Handles
                      </p>
                      {profiles.length > 0 ? (
                        profiles.map((p) => (
                          <Link
                            key={p._id}
                            href={`/${p.handle}`}
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F3F3F1] transition"
                          >
                            <img
                              src={p.pic}
                              alt={`@${p.handle}`}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="font-bold text-sm text-[#1E2330] truncate">
                              @{p.handle}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-xs text-gray-500">
                          No handles created yet
                        </p>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href="/generate"
                          onClick={() => setProfileMenuOpen(false)}
                          className="block p-2.5 rounded-xl text-xs font-extrabold text-[#2665D6] hover:bg-[#F3F3F1]"
                        >
                          + Create / Manage Handles
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center bg-[#1E2330] hover:bg-[#32394A] text-white font-bold text-sm px-5 py-3 rounded-full transition cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center bg-[#EFF0EC] hover:bg-[#E2E4DD] text-[#1E2330] font-bold text-sm px-5 py-3 rounded-xl transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-[#1E2330] hover:bg-[#32394A] text-white font-bold text-sm px-5 py-3 rounded-full transition"
              >
                Sign up free
              </Link>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2.5 rounded-full hover:bg-[#F3F3F1] text-[#1E2330] cursor-pointer"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-black/5 p-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-gray-100 pb-3 last:border-none last:pb-0">
              {item.links ? (
                <div>
                  <p className="font-extrabold text-[#1E2330] mb-2">{item.label}</p>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {item.links.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-semibold text-gray-600 hover:text-[#1E2330] py-1"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-extrabold text-[#1E2330] block py-1"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2 pt-2">
            {activeUser ? (
              <>
                <Link
                  href={primaryHandleHref}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-[#D2E823] text-[#254F1A] font-bold py-3.5 rounded-xl truncate px-4"
                >
                  {activeUser.email || `@${activeUser.username}`}
                </Link>
                {profiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-1">
                    {profiles.map((p) => (
                      <Link
                        key={p._id}
                        href={`/${p.handle}`}
                        onClick={() => setMobileOpen(false)}
                        className="text-xs font-bold bg-[#F3F3F1] text-[#1E2330] px-3 py-2 rounded-full"
                      >
                        @{p.handle} →
                      </Link>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center bg-[#1E2330] text-white font-bold py-3.5 rounded-full cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-[#EFF0EC] text-[#1E2330] font-bold py-3.5 rounded-xl"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-[#1E2330] text-white font-bold py-3.5 rounded-full"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;