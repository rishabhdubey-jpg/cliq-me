import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { handle } = await params;
  const client = await clientPromise;
  const db = client.db("cliqme");
  const collection = db.collection("links");

  const item = await collection.findOne({ handle });
  if (!item) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#254F1A] to-[#163110] text-white flex flex-col items-center justify-between py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg flex flex-col items-center text-center">
        <img
          src={item.pic}
          alt={`@${item.handle}`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#D2E823] shadow-xl"
        />
        <h1 className="font-extrabold text-2xl sm:text-3xl mt-4">@{item.handle}</h1>
        {item.desc && (
          <p className="text-sm sm:text-base text-white/85 mt-2 max-w-md leading-relaxed">
            {item.desc}
          </p>
        )}

        <div className="w-full mt-8 flex flex-col gap-3.5">
          {item.links.map((linkItem, index) => (
            <a
              key={index}
              href={linkItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-[#D2E823] text-[#1E2330] font-bold text-base py-4 px-6 rounded-full shadow-md transition transform hover:scale-[1.02] text-center"
            >
              {linkItem.linktext}
            </a>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition"
      >
        Powered by <span className="text-[#D2E823]">CliqMe</span>
      </Link>
    </main>
  );
}