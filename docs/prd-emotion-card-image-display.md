# PRD: Emotion Card Image Display

Feature: Emotion selection cards (Mod, Vänskap, Nyfikenhet, Trygghet)
Screen: Step 1 – “Vad ska sagan handla om idag?”
Audience: Children (primary), parents (secondary)
Tone: Calm, safe, magical, premium-soft

## 1. Problem Statement
Current emotion cards communicate meaning primarily through text. Visuals need to:

- Convey emotion instantly, even before reading
- Feel integrated, not decorative
- Scale across devices without visual noise
- Remain safe, calm, and non-overstimulating

## 2. Goal
Create a consistent image system for emotion cards where images:

- Act as emotional atmosphere, not icons
- Blend seamlessly into card UI
- Animate subtly on interaction
- Transition naturally into the story experience

## 3. Non-Goals

- No hard borders around images
- No iconography or emoji-style graphics
- No high-contrast or loud imagery
- No full-bleed images that overpower text

## 4. Visual Design Principles

- Image = Scene, not Symbol
- Subtlety First
- Consistency Across Emotions

## 5. Card Image Layout (Required)

### 5.1 Image Placement

- Image is rendered inside the card
- No visible border between image and background
- Image sits behind text, not next to it

Layer order:

1. Card background
2. Emotion image
3. Soft gradient overlay (for text readability)
4. Text content

### 5.2 Image Size & Cropping

- Aspect ratio: 4:5 or 1:1 (adaptive)
- Image is cropped intentionally, never centered like a poster
- Main subject positioned in bottom third or side third
- Never directly behind the title text

### 5.3 Background Treatment

- Image edges must fade softly into card background (blur, vignette, or gradient mask)
- No hard edges, no frames, no drop-shadows on the image itself

## 6. Text & Image Relationship

- Title must always be readable without shadow
- Title positioned in a clear visual pocket
- Image must never compete for attention
- Subtitle lower contrast than title
- Image brightness behind subtitle reduced (overlay required)

## 7. Interaction States

- Default (Idle): image opacity ~100%, no motion
- Hover / Tap: image scale +2–3%, ambient glow increases slightly
- Selected: image slightly more vivid, card outline/background changes

## 8. Emotion-Specific Image Guidelines

### Mod (Courage)
- Single character
- Facing forward or upward
- Light source present (lantern, star, sunrise)
- Color temperature: warm ? cool gradient

### Vänskap (Friendship)
- Two characters close together
- Shared object (blanket, light, book)
- No dominant character
- Warm, soft palette (peach, pink, dusk tones)

### Nyfikenhet (Curiosity)
- Exploration motif
- Path, doorway, stars, or something partially hidden
- Depth and distance encouraged

### Trygghet (Safety)
- Enclosed composition
- Home, arms, blanket, soft light
- Minimal motion, very low contrast

## 9. Image Asset Requirements

- Style: painterly / storybook / soft illustration
- No photorealism
- No sharp edges
- No aggressive expressions
- Export: high-resolution PNG or WebP
- Must tolerate blur + gradient overlays

## 10. Accessibility

- Image must never be required to understand the action
- Text contrast must pass WCAG AA after overlays
- No flashing, no fast animation

## 11. Success Metrics

- Children can choose an emotion without reading
- Parents perceive UI as calm and intentional
- No visual confusion between cards
- Images feel like part of the story world, not UI chrome
