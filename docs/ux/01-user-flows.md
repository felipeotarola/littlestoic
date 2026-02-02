# UX Artefacts - User Flows

This file documents the primary child flow and the parent settings flow.

## 1) Child Flow (5-step story creation)

```mermaid
flowchart TD
  A[Start] --> B[Step 1: Theme]
  B --> C[Step 2: Character]
  C --> D[Step 3: Place]
  D --> E[Step 4: Event]
  E --> F[Step 5: Story Experience]
  F --> G[End / Replay]

  B -->|Back| A
  C -->|Back| B
  D -->|Back| C
  E -->|Back| D
  F -->|Create another| B
```

## 2) Parent Flow (Out-of-band settings)

```mermaid
flowchart TD
  P[Parent Entry] --> S[Settings Home]
  S --> A1[Child Age]
  S --> A2[Name & Pronouns]
  S --> A3[Language]
  S --> A4[Allowed Themes]
  S --> A5[Max Story Length]
  A1 --> S
  A2 --> S
  A3 --> S
  A4 --> S
  A5 --> S
  S --> D[Done]
```

## 3) Edge Paths & Recovery

- Incomplete flow: allow "Resume story" from Step 1 if last session is mid-flow.
- Timeout: if idle for N seconds, pause animations and show a gentle "Continue" prompt.
- Safe retry: if story generation fails, show a single-tap "Try again" with calming copy.
