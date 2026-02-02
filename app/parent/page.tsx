"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Settings = {
  childName: string;
  nameMode: "fixed" | "auto" | "random";
  language: "sv" | "en";
  age: string;
  maxLength: "5-8" | "3-5" | "8-10";
  allowedThemes: string[];
  pronoun: "han" | "hon" | "hen" | "undvik";
  hometown: string;
};

const defaultSettings: Settings = {
  childName: "",
  nameMode: "fixed",
  language: "sv",
  age: "7",
  maxLength: "5-8",
  allowedThemes: ["Mod", "Vänskap", "Nyfikenhet", "Trygghet"],
  pronoun: "undvik",
  hometown: "",
};

const themeOptions = ["Mod", "Vänskap", "Nyfikenhet", "Trygghet"];

function getQuestion() {
  const a = Math.floor(Math.random() * 6) + 2;
  const b = Math.floor(Math.random() * 6) + 2;
  const c = Math.floor(Math.random() * 3) + 1;
  return {
    text: `${a} + ${b} - ${c}`,
    answer: a + b - c,
  };
}

export default function ParentPage() {
  const [gateAnswer, setGateAnswer] = useState("");
  const [passedGate, setPassedGate] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const gate = useMemo(getQuestion, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("littlestoic.settings");
      if (raw) {
        setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    if (!passedGate) return;
    localStorage.setItem("littlestoic.settings", JSON.stringify(settings));
  }, [passedGate, settings]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff5e6_0%,_#fbe8c7_40%,_#f7d7c0_100%)]">
      <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-12">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5a3e2b]/15 bg-white/70 text-[#5a3e2b] shadow-[0_6px_18px_rgba(90,62,43,0.12)]"
          >
            <span className="text-lg">←</span>
          </Link>
          <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[#5a3e2b] shadow-[0_6px_18px_rgba(90,62,43,0.12)]">
            Föräldrakontroll
          </span>
        </header>

        {!passedGate && (
          <section className="mt-12 rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_12px_26px_rgba(90,62,43,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f27b6a]">
              Förälder
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[#5a3e2b] [font-family:var(--font-display)]">
              Svara på en snabb fråga
            </h1>
            <p className="mt-2 text-sm text-[#5a3e2b]/70">
              För att komma in i inställningarna.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#f3c46c]/40 px-4 py-2 text-lg font-semibold text-[#5a3e2b]">
                {gate.text}
              </span>
              <input
                className="w-32 rounded-full border border-[#5a3e2b]/20 bg-white px-4 py-2 text-base text-[#5a3e2b]"
                value={gateAnswer}
                onChange={(event) => setGateAnswer(event.target.value)}
                placeholder="Svar"
                inputMode="numeric"
              />
              <button
                className="rounded-full bg-[#f3c46c] px-5 py-2 text-sm font-semibold text-[#5a3e2b]"
                onClick={() => {
                  if (Number(gateAnswer) === gate.answer) {
                    setPassedGate(true);
                    setError("");
                  } else {
                    setError("Försök igen.");
                  }
                }}
              >
                Lås upp
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-[#f27b6a]">{error}</p>}
          </section>
        )}

        {passedGate && (
          <section className="mt-10 rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_12px_26px_rgba(90,62,43,0.12)]">
            <h2 className="text-2xl font-semibold text-[#5a3e2b] [font-family:var(--font-display)]">
              Inställningar
            </h2>
            <div className="mt-6 grid gap-5">
              <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                Barnets namn
                <input
                  className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                  value={settings.childName}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      childName: event.target.value,
                    }))
                  }
                  placeholder="Namn"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                Namn-läge
                <select
                  className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                  value={settings.nameMode}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      nameMode: event.target.value as Settings["nameMode"],
                    }))
                  }
                >
                  <option value="fixed">Fast</option>
                  <option value="auto">Auto-genererat</option>
                  <option value="random">Slumpa per saga</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                  Språk
                  <select
                    className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                    value={settings.language}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        language: event.target.value as Settings["language"],
                      }))
                    }
                  >
                    <option value="sv">Svenska</option>
                    <option value="en">English</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                  Ålder
                  <input
                    className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                    type="number"
                    min={4}
                    max={10}
                    value={settings.age}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        age: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                Max längd
                <select
                  className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                  value={settings.maxLength}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxLength: event.target.value as Settings["maxLength"],
                    }))
                  }
                >
                  <option value="3-5">3–5 min</option>
                  <option value="5-8">5–8 min</option>
                  <option value="8-10">8–10 min</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                Pronomen
                <select
                  className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                  value={settings.pronoun}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      pronoun: event.target.value as Settings["pronoun"],
                    }))
                  }
                >
                  <option value="han">Han</option>
                  <option value="hon">Hon</option>
                  <option value="hen">Hen</option>
                  <option value="undvik">Undvik</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm text-[#5a3e2b]/80">
                Hemstad
                <input
                  className="rounded-[14px] border border-[#5a3e2b]/20 bg-white px-4 py-3 text-base text-[#5a3e2b]"
                  value={settings.hometown}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      hometown: event.target.value,
                    }))
                  }
                  placeholder="Valfri"
                />
              </label>

              <div className="flex flex-col gap-3 text-sm text-[#5a3e2b]/80">
                Tillåtna teman
                <div className="flex flex-wrap gap-2">
                  {themeOptions.map((theme) => {
                    const active = settings.allowedThemes.includes(theme);
                    return (
                      <button
                        key={theme}
                        type="button"
                        className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                          active
                            ? "border-[#f27b6a] bg-[#fbe3d7] text-[#5a3e2b]"
                            : "border-[#5a3e2b]/20 bg-white text-[#5a3e2b]/70"
                        }`}
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            allowedThemes: active
                              ? prev.allowedThemes.filter((item) => item !== theme)
                              : [...prev.allowedThemes, theme],
                          }))
                        }
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link
                href="/"
                className="rounded-full bg-[#f3c46c] px-6 py-3 text-sm font-semibold text-[#5a3e2b]"
              >
                Spara & tillbaka
              </Link>
              <button
                className="text-sm font-semibold text-[#5a3e2b]/70"
                onClick={() => setPassedGate(false)}
              >
                Lås igen
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
