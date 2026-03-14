"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { demoFounders } from "@/lib/data";

type Message = {
  id: string;
  author: "user" | "founder";
  text: string;
};

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const founder = demoFounders.find((item) => item.id === params.id) ?? demoFounders[0];
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      author: "founder",
      text: `Hey, I’m ${founder.name}. I’m interested in ${founder.interests.join(", ")} and usually spend my time on ${founder.skills.slice(0, 2).join(" and ")}.`,
    },
  ]);

  const sendMessage = () => {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      author: "user",
      text: trimmed,
    };

    const founderReply: Message = {
      id: `${Date.now()}-founder`,
      author: "founder",
      text: `That lines up well. I’m especially excited about teams building in ${founder.interests[0]}. Want to compare how we would split product, GTM, and fundraising in week one?`,
    };

    setMessages((current) => [...current, userMessage, founderReply]);
    setDraft("");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="glass-card rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Conversation</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{founder.name}</h1>
        <p className="mt-2 text-sm capitalize text-violet-100">{founder.role} founder</p>
        <p className="mt-4 text-sm leading-7 text-slate-300">{founder.bio}</p>
        <p className="mt-5 text-sm text-slate-400">{founder.experience}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {founder.interests.map((interest) => (
            <span key={interest} className="pill rounded-full px-3 py-1 text-sm">
              {interest}
            </span>
          ))}
        </div>
        <Link className="secondary-button mt-8 inline-flex rounded-full px-4 py-2 text-sm" href="/matches">
          Back to matches
        </Link>
      </aside>

      <section className="glass-card flex min-h-[38rem] flex-col rounded-[2rem] p-6">
        <div className="space-y-4 overflow-y-auto pb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-xl rounded-[1.5rem] px-4 py-3 text-sm leading-7 ${
                message.author === "user"
                  ? "ml-auto bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                  : "bg-slate-900/70 text-slate-100"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="mt-auto flex gap-3">
          <input
            className="input-surface flex-1 rounded-full px-5 py-3"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message ${founder.name}...`}
          />
          <button className="cta-button rounded-full px-5 py-3 font-medium" onClick={sendMessage} type="button">
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
