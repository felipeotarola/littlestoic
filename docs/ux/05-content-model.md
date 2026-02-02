# UX Artefacts - Content Model

This describes the structured content used by the UI and story generator.

## Choice Model

- id (string)
- label (string)
- icon (string, asset key)
- illustration (string, asset key)
- tags (string[])

## Story Request

- themeId
- characterId
- placeId
- eventId
- age
- language
- maxWords
- name (optional)
- pronoun (optional)

## Story Response

- title (optional)
- paragraphs (string[])
- themeTag (string)
- readingTimeSec (number)

## UI Content Rules

- Max label length: 14 chars
- Choice label uses sentence case
- Parent setting labels use title case
