import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REPLICATE_API = "https://api.replicate.com/v1";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createReplicatePrediction(prompt: string) {
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
          aspect_ratio: "3:2",
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

  const system = [
    "Du är en trygg, varm och fantasifull sagoberättare för barn 6–10 år.",
    "Skriv på lättläst svenska med korta meningar och tydliga stycken.",
    "Sagan ska vara 5–8 minuter lång att läsa (cirka 900–1200 ord).",
    "Allt ska vara barnvänligt, lugnt och aldrig skrämmande.",
    "Ingen våldsam konflikt. Alltid positiv upplösning.",
    "Struktur: början – mitt – slut.",
    "Ingen markdown, inga listor. Bara ren text i stycken.",
  ].join(" ");

  const user = [
    "Skapa en personlig saga baserad på följande val:",
    `Tema: ${theme}.`,
    `Huvudperson: ${character}.`,
    `Plats: ${place}.`,
    `Riktning: ${direction}.`,
    "Anpassa tonen till barn, och låt sagan kännas trygg och magisk.",
  ].join(" ");

  const imagePrompts = [
    [
      "Storybook painterly illustration, calm and detailed, safe for children,",
      "soft edges, dreamy light, no text, no scary elements.",
      `World atmosphere: ${place}.`,
      `Emotion: ${theme}.`,
      `Character as soft silhouette: ${character}.`,
      "Wide landscape, gentle haze, 3:2.",
    ].join(" "),
    [
      "Storybook painterly illustration, calm and detailed, safe for children,",
      "soft edges, dreamy light, no text, no scary elements.",
      `Direction cue: ${direction}.`,
      `Place: ${place}.`,
      "Subtle warm glow, 3:2.",
    ].join(" "),
    [
      "Storybook painterly illustration, calm and detailed, safe for children,",
      "soft edges, dreamy light, no text, no scary elements.",
      "A gentle concluding moment in the same world.",
      `Place: ${place}.`,
      "Evening light, soft sparkles, 3:2.",
    ].join(" "),
  ];

  const stream = await client.responses.stream({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.8,
    max_output_tokens: 1800,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const imageTasks = imagePrompts.map(async (prompt, index) => {
          const predictionUrl = await createReplicatePrediction(prompt);
          const imageUrl = await waitForReplicate(predictionUrl);
          controller.enqueue(
            encoder.encode(`\n[[IMAGE:${index + 1}:${imageUrl}]]\n`)
          );
        });

        for await (const event of stream) {
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
