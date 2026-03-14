export type FounderRole = "technical" | "business" | "design";

export type FounderProfile = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  role: FounderRole;
  bio: string;
  experience: string;
};

export const demoFounders: FounderProfile[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    email: "maya@whatupdog.demo",
    skills: ["React", "TypeScript", "AI products", "Product strategy"],
    interests: ["healthtech", "developer tools", "remote work"],
    role: "technical",
    bio: "Full-stack builder focused on AI-native products that shorten manual workflows for small teams.",
    experience: "Ex-Stripe engineer, shipped 3 SaaS products, one acquisition.",
  },
  {
    id: "adrian-brooks",
    name: "Adrian Brooks",
    email: "adrian@whatupdog.demo",
    skills: ["Sales", "Partnerships", "B2B GTM", "Customer discovery"],
    interests: ["fintech", "marketplaces", "founder-led sales"],
    role: "business",
    bio: "Commercial operator who likes turning early customer pain into clear pricing and repeatable deals.",
    experience: "Former enterprise AE, first sales hire at two seed startups.",
  },
  {
    id: "sofia-patel",
    name: "Sofia Patel",
    email: "sofia@whatupdog.demo",
    skills: ["Brand design", "Figma", "User research", "Design systems"],
    interests: ["creator economy", "consumer apps", "community"],
    role: "design",
    bio: "Product designer obsessed with making ambitious products feel calm, legible, and trustworthy.",
    experience: "Led design at a Series A creator platform used by 2M users.",
  },
  {
    id: "noah-kim",
    name: "Noah Kim",
    email: "noah@whatupdog.demo",
    skills: ["Python", "Machine learning", "APIs", "Data infrastructure"],
    interests: ["climate", "automation", "supply chain"],
    role: "technical",
    bio: "Backend and ML engineer who enjoys building hard technical moats around unsexy operational problems.",
    experience: "Former staff engineer, built forecasting systems for logistics teams.",
  },
  {
    id: "leila-hassan",
    name: "Leila Hassan",
    email: "leila@whatupdog.demo",
    skills: ["Growth marketing", "Lifecycle", "SEO", "Content strategy"],
    interests: ["edtech", "AI products", "bootstrapping"],
    role: "business",
    bio: "Growth-minded operator who pairs scrappy experimentation with strong customer narrative.",
    experience: "Scaled organic acquisition from 0 to 400k monthly users at an edtech startup.",
  },
  {
    id: "julian-mora",
    name: "Julian Mora",
    email: "julian@whatupdog.demo",
    skills: ["Mobile design", "Prototyping", "UX writing", "Visual systems"],
    interests: ["fintech", "wellness", "mobile-first products"],
    role: "design",
    bio: "Interface designer who likes reducing complexity until a product feels inevitable.",
    experience: "Designed onboarding and payments flows for two venture-backed mobile apps.",
  },
  {
    id: "ava-nguyen",
    name: "Ava Nguyen",
    email: "ava@whatupdog.demo",
    skills: ["Next.js", "Node.js", "DevOps", "System architecture"],
    interests: ["cybersecurity", "developer tools", "B2B SaaS"],
    role: "technical",
    bio: "Product-minded engineer who can ship the first version fast and tighten architecture as traction appears.",
    experience: "CTO at a prior startup, managed platform reliability through hypergrowth.",
  },
  {
    id: "ethan-ross",
    name: "Ethan Ross",
    email: "ethan@whatupdog.demo",
    skills: ["Fundraising", "Operations", "Financial modeling", "Pricing"],
    interests: ["healthtech", "B2B SaaS", "vertical AI"],
    role: "business",
    bio: "Generalist founder type with a bias for structured thinking, speed, and messy zero-to-one execution.",
    experience: "Raised seed financing twice and ran operations across product and revenue teams.",
  },
];

export const skillOptions = Array.from(
  new Set(demoFounders.flatMap((founder) => founder.skills)),
).sort((a, b) => a.localeCompare(b));

export const interestOptions = Array.from(
  new Set(demoFounders.flatMap((founder) => founder.interests)),
).sort((a, b) => a.localeCompare(b));

