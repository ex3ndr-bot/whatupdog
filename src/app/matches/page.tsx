"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { demoFounders } from "@/lib/data";
import { getSortedMatches, MatchInput } from "@/lib/matching";

const STORAGE_KEY = "whatupdog-profile";

const fallbackProfile: MatchInput = {
  name: "Demo Builder",
  skills: ["React", "AI products", "Product strategy"],
  interests: ["healthtech", "developer tools"],
  lookingForRole: "business",
  role: "technical",
  bio: "Technical founder validating a vertical AI product and looking for a strong commercial partner.",
};

export default function MatchesPage() {
  const [profile, setProfile] = useState<MatchInput>(fallbackProfile);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as MatchInput;
      setProfile(parsed);
    } catch {
      setProfile(fallbackProfile);
    }
  }, []);

  const matches = getSortedMatches(profile, demoFounders);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Your profile</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">
              Matches for {profile.name || "Demo Builder"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{profile.bio}</p>
          </div>
          <Link className="secondary-button rounded-full px-5 py-3" href="/create-profile">
            Edit profile
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="pill rounded-full px-3 py-1 text-sm">
              {skill}
            </span>
          ))}
          {profile.interests.map((interest) => (
            <span key={interest} className="rounded-full border border-indigo-300/15 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-100">
              {interest}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {matches.map((match, index) => (
          <article
            key={match.founder.id}
            className="glass-card grid gap-6 rounded-[1.75rem] p-6 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm text-violet-100">
                  #{index + 1} match
                </span>
                <span className="text-sm capitalize text-slate-400">{match.founder.role}</span>
                <span className="text-sm text-slate-500">{match.founder.email}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{match.founder.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{match.founder.bio}</p>
              <p className="mt-4 text-sm text-slate-400">{match.founder.experience}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {match.founder.skills.map((skill) => (
                  <span key={skill} className="pill rounded-full px-3 py-1 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-violet-300/10 bg-slate-950/45 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Compatibility</p>
              <p className="mt-4 text-5xl font-semibold text-white">{match.percentage}%</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  style={{ width: `${match.percentage}%` }}
                />
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-300">
                {match.reasons.map((reason) => (
                  <p key={reason}>{reason}</p>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  className="cta-button rounded-full px-4 py-2 text-sm font-medium"
                  href={`/chat/${match.founder.id}`}
                >
                  Connect
                </Link>
                <button className="secondary-button rounded-full px-4 py-2 text-sm" type="button">
                  Save for later
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

