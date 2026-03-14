window.WhatUpDogData = (function () {
  var skillPool = [
    "AI/ML",
    "Backend",
    "Frontend",
    "Design",
    "Sales",
    "Marketing",
    "Operations",
    "Product",
    "Fundraising",
    "Data",
    "Finance",
    "Customer Success"
  ];

  var demoProfiles = [
    {
      id: "maya-chen",
      name: "Maya Chen",
      avatar: "🧠",
      title: "LLM infra engineer building practical AI products",
      location: "San Francisco, CA",
      timezone: "Pacific Time",
      role: "technical",
      stage: "mvp",
      availability: "full-time",
      interests: ["AI Infrastructure", "Developer Tools", "Workflow Automation"],
      skills: ["AI/ML", "Backend", "Data", "Product"],
      personality: ["high-agency", "fast shipping", "direct feedback", "systems thinker"],
      lookingFor: ["sales motion", "enterprise GTM", "founder market pull"],
      bio: "Ex-ML platform lead. I like turning ugly infra problems into usable product wedges. I care about velocity, technical depth, and talking to real users early.",
      prompts: {
        intro: "I saw your profile and liked the combination of ambition plus execution. What kind of wedge would you want to validate first?",
        focus: "I bias toward painful workflow problems where technical leverage compounds fast.",
        speed: "I like shipping prototypes in days, then getting reality checks from users immediately."
      }
    },
    {
      id: "jordan-banks",
      name: "Jordan Banks",
      avatar: "📈",
      title: "Enterprise seller who knows how to find a wedge and close design partners",
      location: "New York, NY",
      timezone: "Eastern Time",
      role: "business",
      stage: "traction",
      availability: "full-time",
      interests: ["Developer Tools", "B2B SaaS", "Workflow Automation"],
      skills: ["Sales", "Marketing", "Fundraising", "Customer Success"],
      personality: ["customer obsessed", "clear communicator", "structured", "high urgency"],
      lookingFor: ["technical product partner", "shipping velocity", "deep product intuition"],
      bio: "Three early-stage GTM runs, two exits on the commercial side. I love turning loose conviction into pipeline, references, and revenue.",
      prompts: {
        intro: "Your profile feels like the kind of technical counterpart I usually look for. What customer pain are you most energized by right now?",
        focus: "I want a market where customer conversations quickly become roadmap decisions.",
        speed: "I can run calls this week if we have a credible prototype story."
      }
    },
    {
      id: "priya-natarajan",
      name: "Priya Natarajan",
      avatar: "🎯",
      title: "Product-led operator with taste for vertical SaaS",
      location: "Seattle, WA",
      timezone: "Pacific Time",
      role: "hybrid",
      stage: "mvp",
      availability: "part-time",
      interests: ["Health Tech", "Workflow Automation", "Vertical SaaS"],
      skills: ["Product", "Operations", "Design", "Customer Success"],
      personality: ["user empathetic", "calm intensity", "strong prioritizer", "detail sharp"],
      lookingFor: ["technical execution", "founder-level engineering depth"],
      bio: "I sit between product, ops, and customer truth. I love messy industries where software can remove repeated pain fast.",
      prompts: {
        intro: "I liked your profile because it felt practical, not just visionary. How do you decide what to build first?",
        focus: "I care about workflows people repeat every day and hate every time.",
        speed: "I prefer narrow launches with very crisp success metrics."
      }
    },
    {
      id: "diego-alvarez",
      name: "Diego Alvarez",
      avatar: "🚀",
      title: "Growth-minded technical founder obsessed with product loops",
      location: "Austin, TX",
      timezone: "Central Time",
      role: "hybrid",
      stage: "traction",
      availability: "full-time",
      interests: ["Fintech", "Consumer AI", "Growth Tools"],
      skills: ["Frontend", "Backend", "Marketing", "Product"],
      personality: ["energetic", "experimental", "numbers-driven", "fast shipping"],
      lookingFor: ["operational rigor", "enterprise motion", "financial modeling"],
      bio: "Built and sold a prosumer tool. Strong on product velocity, onboarding loops, and converting usage into momentum.",
      prompts: {
        intro: "You seem like someone who values speed with substance. What kind of founder rhythm works best for you?",
        focus: "I love products where usage creates its own distribution advantage.",
        speed: "If we can measure behavior quickly, I am all in."
      }
    },
    {
      id: "lena-petrov",
      name: "Lena Petrov",
      avatar: "🛠️",
      title: "Infrastructure and security builder for serious technical products",
      location: "Toronto, ON",
      timezone: "Eastern Time",
      role: "technical",
      stage: "idea",
      availability: "part-time",
      interests: ["Cybersecurity", "AI Infrastructure", "Fintech"],
      skills: ["Backend", "AI/ML", "Finance", "Operations"],
      personality: ["low ego", "disciplined", "deep work", "blunt honesty"],
      lookingFor: ["distribution", "customer development", "storytelling"],
      bio: "I have spent years on infra, compliance, and reliability. Now I want to apply that muscle to a product people desperately need.",
      prompts: {
        intro: "I am interested in founder pairings where trust and ownership are obvious early. What would we each own if this worked?",
        focus: "I gravitate toward markets where reliability and trust are product features, not afterthoughts.",
        speed: "I move fast, but I do not like fake velocity that creates fragile systems."
      }
    },
    {
      id: "samir-kapoor",
      name: "Samir Kapoor",
      avatar: "🤝",
      title: "Marketplace and partnerships operator who can open doors quickly",
      location: "London, UK",
      timezone: "GMT",
      role: "business",
      stage: "growth",
      availability: "full-time",
      interests: ["Marketplaces", "Climate", "B2B SaaS"],
      skills: ["Sales", "Operations", "Fundraising", "Finance"],
      personality: ["networked", "composed", "commercial", "high trust"],
      lookingFor: ["technical depth", "product craft", "shipping consistency"],
      bio: "I know how to structure partnerships, navigate procurement, and turn strategic interest into signed commitments.",
      prompts: {
        intro: "You seem like the kind of builder who could make partnerships actually usable. What category do you think is most under-built?",
        focus: "I like markets where a credible beachhead can expand into a durable network.",
        speed: "I optimize for momentum with customers, not vanity metrics."
      }
    }
  ];

  var starterProfile = {
    id: "you",
    name: "Alex Morgan",
    avatar: "🐾",
    title: "Product-minded engineer looking for a sharp operator",
    location: "San Francisco, CA",
    timezone: "Pacific Time",
    role: "technical",
    stage: "mvp",
    availability: "full-time",
    interests: ["AI Infrastructure", "Developer Tools", "B2B SaaS"],
    skills: ["AI/ML", "Backend", "Product"],
    personality: ["fast shipping", "direct feedback", "customer obsessed"],
    lookingFor: ["sales", "distribution", "go-to-market"],
    bio: "I like building technical products fast, talking to users early, and pairing with someone who can create pull in the market."
  };

  return {
    skillPool: skillPool,
    demoProfiles: demoProfiles,
    starterProfile: starterProfile
  };
})();
