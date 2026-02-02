"use client";

import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useRef, useState } from "react";

const themeCards = [
  {
    label: "Mod",
    background: "/cards/mod.png",
    tint:
      "bg-[linear-gradient(135deg,_rgba(243,196,108,0.35),_rgba(242,123,106,0.25))]",
    position: "object-[65%_70%]",
    cta: "Våga ta första steget.",
  },
  {
    label: "Vänskap",
    background: "/cards/vanskap.png",
    tint:
      "bg-[linear-gradient(135deg,_rgba(255,220,208,0.45),_rgba(242,123,106,0.18))]",
    position: "object-[60%_75%]",
    cta: "Dela något fint.",
  },
  {
    label: "Nyfikenhet",
    background: "/cards/nyfikenhet.png",
    tint:
      "bg-[linear-gradient(135deg,_rgba(124,199,232,0.35),_rgba(243,196,108,0.2))]",
    position: "object-[55%_45%]",
    cta: "Upptäck något nytt.",
  },
  {
    label: "Trygghet",
    background: "/cards/trygghet.png",
    tint:
      "bg-[linear-gradient(135deg,_rgba(170,210,232,0.3),_rgba(243,196,108,0.2))]",
    position: "object-[60%_75%]",
    cta: "Börja lugnt.",
  },
];

const characterCards = [
  {
    label: "Ett barn",
    cta: "Upplever saker för första gången.",
    background: "/cards/step2-barn.png",
    position: "object-[60%_70%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(243,196,108,0.32),_rgba(124,199,232,0.16))]",
  },
  {
    label: "Ett annat barn",
    cta: "Tänker och känner lite annorlunda.",
    background: "/cards/step2-annat-barn.png",
    position: "object-[62%_72%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(255,220,208,0.38),_rgba(139,200,165,0.18))]",
  },
  {
    label: "Ett djur",
    cta: "Följer sina instinkter.",
    background: "/cards/step2-djur.png",
    position: "object-[58%_72%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(139,200,165,0.32),_rgba(124,199,232,0.18))]",
  },
  {
    label: "Något annat",
    cta: "Ser världen med nya ögon.",
    background: "/cards/step2-nagot.png",
    position: "object-[55%_60%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(242,123,106,0.25),_rgba(243,196,108,0.2))]",
  },
];

const placeCards = [
  {
    label: "Skogen",
    cta: "Mjukt, levande och fullt av hemligheter.",
    background: "/cards/step3-skog.png",
    position: "object-[60%_70%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(139,200,165,0.35),_rgba(243,196,108,0.18))]",
  },
  {
    label: "Stranden",
    cta: "Vind, vågor och små skatter i sanden.",
    background: "/cards/step3-strand.png",
    position: "object-[55%_60%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(124,199,232,0.35),_rgba(243,196,108,0.2))]",
  },
  {
    label: "Byn / Hemma",
    cta: "Tryggt och nära – något väntar runt hörnet.",
    background: "/cards/step3-hemma.png",
    position: "object-[60%_70%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(255,220,208,0.4),_rgba(243,196,108,0.15))]",
  },
  {
    label: "Det magiska",
    cta: "En plats som bara finns i sagor.",
    background: "/cards/step3-magiska.png",
    position: "object-[55%_55%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(170,210,232,0.32),_rgba(242,123,106,0.18))]",
  },
];

const directionCards = [
  {
    label: "Utforska",
    cta: "Upptäcka något nytt.",
    background: "/cards/step4-utforska.png",
    position: "object-[58%_60%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(124,199,232,0.32),_rgba(243,196,108,0.2))]",
  },
  {
    label: "Hjälpa",
    cta: "Göra något snällt.",
    background: "/cards/step4-hjalpa.png",
    position: "object-[60%_65%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(255,220,208,0.4),_rgba(243,196,108,0.18))]",
  },
  {
    label: "Våga",
    cta: "Prova något som känns svårt.",
    background: "/cards/step4-vaga.png",
    position: "object-[60%_70%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(242,123,106,0.28),_rgba(243,196,108,0.18))]",
  },
  {
    label: "Förstå",
    cta: "Lära sig något viktigt.",
    background: "/cards/step4-forsta.png",
    position: "object-[55%_55%]",
    tint:
      "bg-[linear-gradient(135deg,_rgba(170,210,232,0.3),_rgba(242,123,106,0.18))]",
  },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectionStep1, setSelectionStep1] = useState(false);
  const [selectionStep2, setSelectionStep2] = useState(false);
  const [selectionStep3, setSelectionStep3] = useState(false);
  const [selectionStep4, setSelectionStep4] = useState(false);
  const [pulseOnce, setPulseOnce] = useState(false);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [storyImages, setStoryImages] = useState<Record<string, string>>({});
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [parentSettings, setParentSettings] = useState<{
    childName?: string;
    nameMode?: string;
    language?: string;
    age?: string;
    maxLength?: string;
    allowedThemes?: string[];
    pronoun?: string;
    hometown?: string;
  } | null>(null);
  const streamBufferRef = useRef("");
  const isStep1 = step === 1;
  const isStep2 = step === 2;
  const isStep3 = step === 3;
  const isStep4 = step === 4;
  const isStep5 = step === 5;
  const selectionMade = isStep1
    ? selectionStep1
    : isStep2
      ? selectionStep2
      : isStep3
        ? selectionStep3
        : selectionStep4;

  const headline = isStep1
    ? "Vad ska sagan handla om idag?"
    : isStep2
      ? "Vem ska sagan följa?"
      : isStep3
        ? "Var börjar sagan?"
        : isStep4
          ? "Vad vill berättelsen utforska?"
          : "Nu börjar sagan";
  const subline = isStep1
    ? "Ett val i taget. Vi skapar en saga tillsammans."
    : isStep2
      ? "Någon som upplever världen på sitt sätt."
      : isStep3
        ? "En plats som passar känslan och huvudpersonen."
        : isStep4
          ? "En mjuk riktning för det som väntar."
          : "Allt är på plats.";
  const overline = isStep1
    ? "Välj fokus"
    : isStep2
      ? "Välj huvudperson"
      : isStep3
        ? "Välj plats"
        : isStep4
          ? "Välj riktning"
          : "Redo att börja";
  const hasStoryAssets = storyText.length > 0 || Object.keys(storyImages).length > 0;
  const previewTitle = isStep1
    ? "En mjuk start"
    : isStep2
      ? "En resa börjar"
      : isStep3
        ? "En värld tar form"
        : isStep4
          ? "Berättelsen får riktning"
          : isGenerating || hasStoryAssets
            ? "Sagan är redo"
            : "Sagan väntar";
  const previewCopy = isStep1
    ? "Illustrationerna blir levande när du väljer."
    : isStep2
      ? "Karaktären formas av dina val."
      : isStep3
        ? "Världen formas av dina val."
        : isStep4
          ? "Berättelsen formas av dina val."
          : isGenerating || hasStoryAssets
            ? "En berättelse skapad tillsammans."
            : "Allt är på plats när du är redo.";
  const glowPulseClass = selectionMade || isStep4 || isStep5 ? "" : "pulse-glow";
  const glowOnceClass = pulseOnce ? "pulse-glow-once" : "";
  const glowPauseClass = isHoveringCard ? "pulse-paused" : "";
  const renderTextBlock = (text: string, keyPrefix: string) => {
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return (
      <div className="flex flex-col gap-4">
        {paragraphs.map((p, idx) => (
          <p key={`${keyPrefix}-${idx}`}>{p}</p>
        ))}
      </div>
    );
  };

  const renderStoryContent = () => {
    if (!storyText) return null;
    const tokenRegex = /\[\[IMG:(slot_\d+):([a-z_]+)\]\]/g;
    const tokens: Array<
      | { type: "text"; value: string }
      | { type: "img"; slot: string; layout: string }
    > = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = tokenRegex.exec(storyText);
    while (match) {
      if (match.index > lastIndex) {
        tokens.push({ type: "text", value: storyText.slice(lastIndex, match.index) });
      }
      tokens.push({ type: "img", slot: match[1], layout: match[2] });
      lastIndex = match.index + match[0].length;
      match = tokenRegex.exec(storyText);
    }
    if (lastIndex < storyText.length) {
      tokens.push({ type: "text", value: storyText.slice(lastIndex) });
    }

    const nodes: JSX.Element[] = [];
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      if (token.type === "text") {
        nodes.push(renderTextBlock(token.value, `text-${i}`));
        i += 1;
        continue;
      }

      const imageUrl = storyImages[token.slot];
      const layout = token.layout;
      const imageElement = (
        <div
          className={`relative overflow-hidden rounded-[22px] border border-white/70 bg-white/90 shadow-[0_12px_26px_rgba(90,62,43,0.12)] ${
            layout === "cutaway" ? "max-w-xs" : "w-full"
          }`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Sagbilde"
              width={layout === "cutaway" ? 600 : 1200}
              height={layout === "cutaway" ? 600 : 800}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-[#f7efe3] text-sm text-[#5a3e2b]/60">
              Skapar bild...
            </div>
          )}
        </div>
      );

      if (layout === "inline_left" || layout === "inline_right") {
        const nextText =
          i + 1 < tokens.length && tokens[i + 1].type === "text"
            ? (tokens[i + 1] as { type: "text"; value: string }).value
            : "";
        nodes.push(
          <div
            key={`inline-${i}`}
            className="flex flex-col gap-6 md:flex-row md:items-start"
          >
            <div
              className={`md:w-2/5 ${layout === "inline_right" ? "md:order-2" : ""}`}
            >
              {imageElement}
            </div>
            <div className="md:w-3/5">
              {renderTextBlock(nextText, `inline-text-${i}`)}
            </div>
          </div>
        );
        i += nextText ? 2 : 1;
        continue;
      }

      if (layout === "background_soft") {
        nodes.push(
          <div key={`bg-${i}`} className="relative overflow-hidden rounded-[26px]">
            <div className="absolute inset-0 opacity-60">{imageElement}</div>
            <div className="relative rounded-[26px] bg-white/75 p-8 shadow-[0_10px_24px_rgba(90,62,43,0.12)]">
              <p className="text-sm text-[#5a3e2b]/70">
                En mjuk stund i berättelsen.
              </p>
            </div>
          </div>
        );
        i += 1;
        continue;
      }

      nodes.push(
        <div key={`img-${i}`} className="flex justify-center">
          {imageElement}
        </div>
      );
      i += 1;
    }

    return <div className="flex flex-col gap-8">{nodes}</div>;
  };

  const startStory = async () => {
    setStoryError("");
    setStoryText("");
    setStoryImages({});
    streamBufferRef.current = "";
    setIsGenerating(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          character: selectedCharacter,
          place: selectedPlace,
          direction: selectedDirection,
          language: parentSettings?.language ?? "sv",
          minutes: parentSettings?.maxLength ?? "5-8",
          name: parentSettings?.childName ?? null,
          nameMode: parentSettings?.nameMode ?? "fixed",
          age: parentSettings?.age ?? null,
          pronoun: parentSettings?.pronoun ?? null,
          hometown: parentSettings?.hometown ?? null,
          allowedThemes: parentSettings?.allowedThemes ?? null,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Kunde inte starta sagan.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (result.value) {
          const chunk = decoder.decode(result.value, { stream: !done });
          const marker = "[[IMAGE:";
          let buffer = streamBufferRef.current + chunk;

          while (true) {
            const markerIndex = buffer.indexOf(marker);
            if (markerIndex === -1) break;
            const endIndex = buffer.indexOf("]]", markerIndex);
            if (endIndex === -1) break;

            const before = buffer.slice(0, markerIndex);
            if (before) {
              setStoryText((prev) => prev + before);
            }

            const payload = buffer.slice(markerIndex + marker.length, endIndex);
            const [slot, ...rest] = payload.split(":");
            const url = rest.join(":");
            if (slot && url) {
              setStoryImages((prev) => ({ ...prev, [slot]: url }));
            }

            buffer = buffer.slice(endIndex + 2);
          }

          if (buffer) {
            const keep = Math.min(buffer.length, marker.length);
            const safeText = buffer.slice(0, buffer.length - keep);
            if (safeText) {
              setStoryText((prev) => prev + safeText);
            }
            buffer = buffer.slice(buffer.length - keep);
          }

          streamBufferRef.current = buffer;
        }
      }
    } catch (error) {
      setStoryError("Något gick fel. Försök igen.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("littlestoic.settings");
      if (raw) {
        setParentSettings(JSON.parse(raw));
      }
    } catch {
      setParentSettings(null);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff5e6_0%,_#fbe8c7_40%,_#f7d7c0_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-[rgba(124,199,232,0.35)] blur-3xl" />
        <div className="absolute right-10 top-6 h-40 w-40 rounded-full bg-[rgba(139,200,165,0.45)] blur-2xl" />
        <div className="absolute bottom-12 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(242,123,106,0.25)] blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#5a3e2b]/15 bg-white/70 text-[#5a3e2b] shadow-[0_6px_18px_rgba(90,62,43,0.12)] transition-opacity ${
                step === 1 ? "pointer-events-none opacity-40" : "opacity-100"
              }`}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              aria-label="Gå tillbaka"
            >
              <span className="text-lg">←</span>
            </button>
              <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[#5a3e2b] shadow-[0_6px_18px_rgba(90,62,43,0.12)]">
              Steg {step} av 5
              </span>
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index < step ? "bg-[#f27b6a]" : "bg-[#f3c46c]/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <Link
            href="/parent"
            className="rounded-full border border-[#5a3e2b]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#5a3e2b] shadow-[0_6px_18px_rgba(90,62,43,0.12)]"
          >
            Förälder
          </Link>
        </header>

        <section
          className={`mt-10 grid gap-10 ${isStep5 ? "lg:grid-cols-1" : "lg:grid-cols-[1.2fr_1fr]"} lg:items-center`}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f27b6a]">
              {overline}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#5a3e2b] [font-family:var(--font-display)] sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-3 max-w-lg text-base text-[#5a3e2b]/75 sm:text-lg">
              {subline}
            </p>

            {!isStep5 && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {(isStep1
                  ? themeCards
                  : isStep2
                    ? characterCards
                    : isStep3
                      ? placeCards
                      : directionCards
                ).map((item) => (
                  <button
                    key={item.label}
                    className="group relative overflow-hidden rounded-[24px] border border-white/70 bg-[#fffdf9] px-5 py-6 text-left shadow-[0_10px_30px_rgba(90,62,43,0.12)] transition-transform duration-200 hover:-translate-y-1"
                    onClick={() => {
                      if (isStep1) {
                        setSelectionStep1(true);
                        setSelectedTheme(item.label);
                        setStep(2);
                      } else if (isStep2) {
                        setSelectionStep2(true);
                        setSelectedCharacter(item.label);
                        setStep(3);
                      } else if (isStep3) {
                        setSelectionStep3(true);
                        setSelectedPlace(item.label);
                        setStep(4);
                      } else {
                        setSelectionStep4(true);
                        setSelectedDirection(item.label);
                        setStep(5);
                        setPulseOnce(true);
                      }
                    }}
                    onMouseEnter={() => setIsHoveringCard(true)}
                    onMouseLeave={() => setIsHoveringCard(false)}
                    onPointerDown={() => setIsHoveringCard(true)}
                    onPointerUp={() => setIsHoveringCard(false)}
                    onPointerLeave={() => setIsHoveringCard(false)}
                  >
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
                      <div className={`absolute inset-0 ${item.tint}`} />
                      {"background" in item && "position" in item && (
                        <Image
                          src={item.background as string}
                          alt=""
                          fill
                          className={`object-cover opacity-100 transition-transform duration-300 group-hover:scale-[1.03] ${item.position as string}`}
                        />
                      )}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,_rgba(255,255,255,0.65),_rgba(255,255,255,0.0)_55%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,0.72)_0%,_rgba(255,255,255,0.3)_55%,_rgba(255,255,255,0.75)_100%)]" />
                    </div>
                    <h2 className="relative text-xl font-semibold text-[#5a3e2b]">
                      {item.label}
                    </h2>
                    <p className="relative mt-2 inline-flex items-center gap-2 text-sm text-[#5a3e2b]/70">
                      {item.cta}
                      <span className="text-[#5a3e2b]/45 transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            )}
            {isStep5 && (
              <div className="mt-10 flex w-full flex-col items-center gap-6">
                <div className="w-full max-w-3xl rounded-[20px] border border-white/70 bg-white/70 px-5 py-4 text-sm text-[#5a3e2b]/80 shadow-[0_8px_18px_rgba(90,62,43,0.12)]">
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#5a3e2b]/80">
                      Fokus
                      <span className="text-[#5a3e2b]">{selectedTheme ?? "—"}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#5a3e2b]/80">
                      Huvudperson
                      <span className="text-[#5a3e2b]">
                        {selectedCharacter ?? "—"}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#5a3e2b]/80">
                      Plats
                      <span className="text-[#5a3e2b]">{selectedPlace ?? "—"}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#5a3e2b]/80">
                      Riktning
                      <span className="text-[#5a3e2b]">
                        {selectedDirection ?? "—"}
                      </span>
                    </span>
                  </div>
                </div>
                {!storyText && !isGenerating && (
                  <button
                    className="w-full max-w-sm rounded-full bg-[#f3c46c] px-6 py-4 text-base font-semibold text-[#5a3e2b] shadow-[0_12px_26px_rgba(90,62,43,0.18)] disabled:opacity-60"
                    onClick={startStory}
                    disabled={isGenerating}
                  >
                    Starta sagan
                  </button>
                )}
                {isGenerating && (
                  <div className="w-full max-w-3xl rounded-[24px] border border-white/70 bg-white/80 p-6 text-center text-base font-semibold text-[#5a3e2b]/70 shadow-[0_12px_26px_rgba(90,62,43,0.12)]">
                    Sagan skapas...
                  </div>
                )}
                {(storyText || Object.keys(storyImages).length > 0) && (
                  <div className="w-full max-w-3xl rounded-[28px] border border-white/70 bg-white/85 p-8 text-[18px] leading-8 text-[#5a3e2b] shadow-[0_12px_26px_rgba(90,62,43,0.12)]">
                    {renderStoryContent()}
                  </div>
                )}
                {storyError && (
                  <p className="text-sm text-[#f27b6a]">{storyError}</p>
                )}
                {isStep5 && (
                  <button
                    className="text-sm font-semibold text-[#5a3e2b]/70"
                    onClick={() => {
                      setStep(1);
                      setStoryText("");
                      setStoryError("");
                      setIsGenerating(false);
                      setStoryImages({});
                    }}
                  >
                    Ändra val
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={`relative ${isStep5 ? "w-full" : ""}`}>
            <div className={`relative mx-auto w-full ${isStep5 ? "max-w-3xl" : "max-w-md"} overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(90,62,43,0.18)] ${isStep5 ? "h-[420px]" : "h-[360px]"}`}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(124,199,232,0.35),_rgba(243,196,108,0.35),_rgba(139,200,165,0.35))]" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#5a3e2b]/70">
                    Förhandskänsla
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#5a3e2b] [font-family:var(--font-display)]">
                    {previewTitle}
                  </h3>
                  {isStep5 && (
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#5a3e2b]/50">
                      Det var en gång…
                    </p>
                  )}
                </div>
                <div className="relative flex h-48 items-center justify-center">
                  <div
                    className={`absolute h-44 w-44 rounded-full bg-white/70 blur-2xl ${glowPulseClass} ${glowOnceClass} ${glowPauseClass}`}
                    onAnimationEnd={() => {
                      if (pulseOnce) setPulseOnce(false);
                    }}
                  />
                  <div className="absolute h-32 w-32 rounded-full bg-[#7cc7e8]/50 blur-xl" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#f3c46c]/70 shadow-[0_10px_18px_rgba(90,62,43,0.18)]">
                    <div className="h-6 w-6 rounded-full bg-white/90" />
                  </div>
                </div>
                <p className="text-sm text-[#5a3e2b]/70">
                  {previewCopy}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
