import Link from "next/link";
import { demoFounders } from "@/lib/data";

const features = [
  {
    title: "Role-aware matching",
    description: "Spot founders with overlapping conviction but complementary execution strengths.",
  },
  {
    title: "Fast founder profiles",
    description: "Capture skills, markets, and what role you want to pair with in under a minute.",
  },
  {
    title: "Instant outreach",
    description: "Open a mock chat flow immediately to pressure-test chemistry before a real intro.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="hero-grid glass-card relative overflow-hidden rounded-[2rem] px-6 py-16 sm:px-10 lg:px-14">
        <div className="mesh-orb bottom-0 right-10 h-44 w-44 bg-fuchsia-500/20" />
        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="pill inline-flex rounded-full px-4 py-2 text-sm">
              Founder matching for builders, operators, and designers
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Meet the <span className="text-gradient">co-founder fit</span> you would actually build with.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                What Up Dog helps early founders find strong matches by combining skill overlap,
                market alignment, and complementary roles into one simple score.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="cta-button rounded-full px-6 py-3 font-medium" href="/create-profile">
                Build your profile
              </Link>
              <Link className="secondary-button rounded-full px-6 py-3 font-medium" href="/matches">
                Explore demo matches
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span>8 demo founders</span>
              <span>Local-only profile storage</span>
              <span>Live match scoring</span>
            </div>
          </div>

          <div className="glass-card rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Top match</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{demoFounders[0].name}</h2>
              </div>
              <div className="rounded-2xl bg-violet-500/15 px-4 py-3 text-right">
                <p className="text-sm text-violet-200">Compatibility</p>
                <p className="text-3xl font-semibold text-white">92%</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{demoFounders[0].bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {demoFounders[0].skills.map((skill) => (
                <span key={skill} className="pill rounded-full px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-950/40 p-4">
              <p className="text-sm text-slate-400">{demoFounders[0].experience}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="glass-card rounded-[1.5rem] p-6">
            <div className="mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30" />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Demo network</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">A curated set of ambitious early founders</h2>
          </div>
          <Link className="cta-button rounded-full px-5 py-3 font-medium" href="/create-profile">
            Get matched now
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {demoFounders.slice(0, 4).map((founder) => (
            <article key={founder.id} className="rounded-[1.5rem] border border-violet-300/10 bg-slate-950/35 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{founder.name}</h3>
                  <p className="mt-1 text-sm capitalize text-violet-200">{founder.role}</p>
                </div>
                <span className="pill rounded-full px-3 py-1 text-xs">{founder.interests[0]}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{founder.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
