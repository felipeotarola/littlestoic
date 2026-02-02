import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REPLICATE_API = "https://api.replicate.com/v1";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createReplicatePrediction(
  prompt: string,
  aspect_ratio: "3:2" | "1:1"
) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("Missing REPLICATE_API_TOKEN.");
  }

  const response = await fetch(
    `${REPLICATE_API}/models/black-forest-labs/flux-schnell/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio,
          output_format: "png",
          guidance_scale: 3,
          num_inference_steps: 4,
          num_outputs: 1,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create Replicate prediction.");
  }

  const data = (await response.json()) as {
    urls: { get: string };
  };

  return data.urls.get;
}

async function waitForReplicate(url: string) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("Missing REPLICATE_API_TOKEN.");
  }

  for (let i = 0; i < 40; i += 1) {
    const response = await fetch(url, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch Replicate prediction.");
    }
    const data = (await response.json()) as {
      status: string;
      output?: string[] | string;
    };
    if (data.status === "succeeded") {
      if (Array.isArray(data.output)) {
        return data.output[0];
      }
      if (typeof data.output === "string") {
        return data.output;
      }
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error("Replicate prediction failed.");
    }
    await sleep(1500);
  }

  throw new Error("Replicate prediction timed out.");
}

type StoryRequest = {
  theme?: string | null;
  character?: string | null;
  place?: string | null;
  direction?: string | null;
  language?: string;
  minutes?: string;
  name?: string | null;
  nameMode?: string | null;
  age?: string | null;
  pronoun?: string | null;
  hometown?: string | null;
  allowedThemes?: string[] | null;
};

const SLOT_CONFIG = {
  slot_1: { aspect_ratio: "3:2" as const },
  slot_2: { aspect_ratio: "1:1" as const },
  slot_3: { aspect_ratio: "3:2" as const },
  slot_4: { aspect_ratio: "1:1" as const },
};

type ImageSlot = keyof typeof SLOT_CONFIG;

type LayoutType =
  | "hero_wide"
  | "inline_left"
  | "inline_right"
  | "background_soft"
  | "cutaway"
  | "no_image";

type FixedBeat = {
  beat: number;
  layout_type: LayoutType;
  image_slot: ImageSlot | null;
};

const FIXED_BEATS: FixedBeat[] = [
  { beat: 1, layout_type: "hero_wide", image_slot: "slot_1" },
  { beat: 2, layout_type: "inline_left", image_slot: "slot_2" },
  { beat: 3, layout_type: "no_image", image_slot: null },
  { beat: 4, layout_type: "inline_right", image_slot: "slot_4" },
  { beat: 5, layout_type: "background_soft", image_slot: "slot_3" },
];

const DEFAULT_IMAGE_PROMPTS: Record<ImageSlot, string> = {
  slot_1: "Etablerande scen i världens miljö, mjuk morgonljus och lugn stämning.",
  slot_2: "Närbild av huvudpersonen eller en viktig detalj, vänlig och lugn.",
  slot_3: "Mjukt bakgrundsljus och atmosfär, drömlikt och varmt.",
  slot_4: "Liten detalj eller föremål som antyder riktning eller lärdom.",
};

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY.", { status: 500 });
  }
  if (!process.env.REPLICATE_API_TOKEN) {
    return new Response("Missing REPLICATE_API_TOKEN.", { status: 500 });
  }

  const body = (await request.json()) as StoryRequest;
  const theme = body.theme ?? "Okänt tema";
  const character = body.character ?? "En huvudperson";
  const place = body.place ?? "En plats";
  const direction = body.direction ?? "En riktning";
  const language = body.language ?? "sv";
  const minutes = body.minutes ?? "5-8";
  const childName = body.name ?? null;
  const nameMode = body.nameMode ?? "fixed";
  const age = body.age ?? null;
  const pronoun = body.pronoun ?? null;
  const hometown = body.hometown ?? null;
  const isAnimalCharacter =
    character.toLowerCase().includes("djur") ||
    character.toLowerCase().includes("animal");

  const durationLine =
    minutes === "3-5"
      ? "Sagan ska vara 3–5 minuter lång att läsa (cirka 500–700 ord)."
      : minutes === "8-10"
        ? "Sagan ska vara 8–10 minuter lång att läsa (cirka 1300–1600 ord)."
        : "Sagan ska vara 5–8 minuter lång att läsa (cirka 900–1200 ord).";

  const languageLine =
    language === "en"
      ? "Write in clear, gentle English."
      : "Skriv på lättläst svenska med korta meningar och tydliga stycken.";

  const imagePromptSystem = [
    "Du är en trygg, varm och fantasifull sagoberättare för barn 6–10 år.",
    "Du skapar bildprompter för en sagobok i en konsekvent, mjuk målad stil.",
    "Du måste svara ENDAST med giltig JSON. Ingen annan text.",
  ].join(" ");

  const imagePromptUser = [
    "Skapa bildprompter för följande fasta slots.",
    `Tema: ${theme}.`,
    `Huvudperson: ${character}.`,
    `Plats: ${place}.`,
    `Riktning: ${direction}.`,
    childName ? `Barnets namn: ${childName}.` : "Barnets namn: ej angivet.",
    age ? `Ålder: ${age}.` : "Ålder: ej angivet.",
    pronoun ? `Pronomen: ${pronoun}.` : "Pronomen: ej angivet.",
    hometown ? `Hemstad: ${hometown}.` : "Hemstad: ej angivet.",
    "",
    "Slots (måste finnas):",
    "- slot_1 = etablerande scen (wide 3:2)",
    "- slot_2 = karaktär/objekt nära (square 1:1)",
    "- slot_3 = mjuk bakgrundsstämning (wide 3:2)",
    "- slot_4 = liten detalj/cutaway (square 1:1)",
    "",
    "Regler:",
    "- Samma visuella stil i alla bilder.",
    "- Ingen text i bilderna.",
    "- Barnvänligt, lugnt, inte skrämmande.",
    "",
    "Output-format (JSON):",
    '{ "images": { "slot_1": { "prompt": "..." }, "slot_2": { "prompt": "..." }, "slot_3": { "prompt": "..." }, "slot_4": { "prompt": "..." } } }',
  ].join("\n");

  const imagePromptResp = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: imagePromptSystem },
      { role: "user", content: imagePromptUser },
    ],
    temperature: 0.6,
    max_output_tokens: 1500,
  });

  const imagePromptText =
    imagePromptResp.output_text ??
    imagePromptResp.output
      ?.map((o: any) =>
        o.content?.map((c: any) => (typeof c.text === "string" ? c.text : "")).join("")
      )
      .join("") ??
    "";

  let imagePlan: { images: Partial<Record<ImageSlot, { prompt: string }>> } = {
    images: {},
  };
  try {
    imagePlan = JSON.parse(imagePromptText) as {
      images: Partial<Record<ImageSlot, { prompt: string }>>;
    };
  } catch {
    imagePlan = { images: {} };
  }

  const storySystem = [
    "Du är en trygg, varm och fantasifull sagoberättare för barn 6–10 år.",
    languageLine,
    durationLine,
    "Allt ska vara barnvänligt, lugnt och aldrig skrämmande.",
    "Ingen våldsam konflikt. Alltid positiv upplösning.",
    "Struktur: början – mitt – slut.",
    "Ingen markdown, inga listor. Bara ren text i stycken.",
    "Du måste inkludera placeholder-taggar exakt som angivet, på egen rad.",
    "Ändra inte taggarna och lägg inte till extra taggar.",
  ].join(" ");

  const beatLines = FIXED_BEATS.map((beat) => {
    const placeholder = beat.image_slot
      ? `[[IMG:${beat.image_slot}:${beat.layout_type}]]`
      : "NO_IMAGE";
    return `Beat ${beat.beat}: layout ${beat.layout_type} | Placeholder: ${placeholder}`;
  });

  const storyUser = [
    "Skriv en personlig saga baserad på följande val:",
    `Tema: ${theme}.`,
    `Huvudperson: ${character}.`,
    `Plats: ${place}.`,
    `Riktning: ${direction}.`,
    childName ? `Barnets namn: ${childName}.` : "Barnets namn: ej angivet.",
    `Namn-läge: ${nameMode}.`,
    age ? `Ålder: ${age}.` : "Ålder: ej angivet.",
    pronoun ? `Pronomen: ${pronoun}.` : "Pronomen: ej angivet.",
    hometown ? `Hemstad: ${hometown}.` : "Hemstad: ej angivet.",
    "",
    "Följ beatsen i ordning och inkludera placeholder-taggarna exakt en gång där de passar.",
    "Använd inga andra placeholder-taggar än de som står i listan.",
    ...beatLines,
  ].join("\n");

  const storyStream = await client.responses.stream({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: storySystem },
      { role: "user", content: storyUser },
    ],
    temperature: 0.8,
    max_output_tokens:
      minutes === "3-5" ? 1400 : minutes === "8-10" ? 2600 : 2000,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const style = [
          "Storybook painterly illustration, calm and detailed, safe for children.",
          "Soft edges, dreamy light, warm pastel palette, gentle haze.",
          "No text, no scary elements, no harsh contrast.",
          "Consistent art style across all images.",
          !isAnimalCharacter ? "No animals unless explicitly described." : "",
          `Theme: ${theme}.`,
          `Place: ${place}.`,
          `Character: ${character}.`,
          `Direction: ${direction}.`,
        ]
          .filter(Boolean)
          .join(" ");

        const slots = Object.keys(SLOT_CONFIG) as ImageSlot[];
        const imageTasks = slots.map(async (slot) => {
          const prompt = imagePlan.images?.[slot]?.prompt ?? DEFAULT_IMAGE_PROMPTS[slot];
          const predictionUrl = await createReplicatePrediction(
            `${style} ${prompt}`,
            SLOT_CONFIG[slot].aspect_ratio
          );
          const imageUrl = await waitForReplicate(predictionUrl);
          controller.enqueue(encoder.encode(`\n[[IMAGE:${slot}:${imageUrl}]]\n`));
        });

        for await (const event of storyStream) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }
        }

        await Promise.allSettled(imageTasks);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
