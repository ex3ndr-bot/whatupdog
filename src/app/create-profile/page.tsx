"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FounderRole, interestOptions, skillOptions } from "@/lib/data";
import { inferRoleFromSkills } from "@/lib/matching";

const STORAGE_KEY = "whatupdog-profile";

export default function CreateProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState("AI products, B2B SaaS");
  const [lookingForRole, setLookingForRole] = useState<FounderRole>("business");
  const [bio, setBio] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const profile = {
      name: name.trim(),
      skills: selectedSkills,
      interests: interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      lookingForRole,
      role: inferRoleFromSkills(selectedSkills),
      bio: bio.trim(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    router.push("/matches");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Create profile</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Tell us what you bring to the table.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Your profile is stored in local storage for this MVP. Pick your strongest skills, list
          the markets you care about, and the matching engine will rank the best demo founders.
        </p>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-medium text-slate-200">Name</span>
              <input
                required
                className="input-surface w-full rounded-2xl px-4 py-3"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jordan Lee"
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-medium text-slate-200">Looking for</span>
              <select
                className="input-surface w-full rounded-2xl px-4 py-3"
                value={lookingForRole}
                onChange={(event) => setLookingForRole(event.target.value as FounderRole)}
              >
                <option value="technical">Technical co-founder</option>
                <option value="business">Business co-founder</option>
                <option value="design">Design co-founder</option>
              </select>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Skills</p>
              <p className="mt-2 text-sm text-slate-400">Choose as many as apply.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {skillOptions.map((skill) => {
                const active = selectedSkills.includes(skill);

                return (
                  <button
                    key={skill}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? "cta-button"
                        : "secondary-button text-slate-200"
                    }`}
                    onClick={() => toggleSkill(skill)}
                    type="button"
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-medium text-slate-200">Interests</span>
              <input
                className="input-surface w-full rounded-2xl px-4 py-3"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                placeholder="healthtech, marketplaces, climate"
              />
              <span className="text-xs text-slate-400">
                Comma-separated. Popular tags: {interestOptions.slice(0, 4).join(", ")}.
              </span>
            </label>

            <label className="space-y-3">
              <span className="text-sm font-medium text-slate-200">Bio</span>
              <textarea
                required
                className="input-surface min-h-32 w-full rounded-2xl px-4 py-3"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="I want to build workflow software for healthcare teams and own product + GTM."
              />
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-violet-300/10 bg-slate-950/40 p-5 text-sm text-slate-300">
            Your inferred role updates from the skills you choose. Right now you look most like a{" "}
            <span className="font-semibold capitalize text-white">
              {inferRoleFromSkills(selectedSkills.length ? selectedSkills : ["React"])}
            </span>{" "}
            founder.
          </div>

          <button className="cta-button rounded-full px-6 py-3 font-medium" type="submit">
            Save profile and view matches
          </button>
        </form>
      </section>
    </div>
  );
}

