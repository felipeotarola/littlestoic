# UX Artefacts - Information Architecture

## App Map

```mermaid
mindmap
  root((littlestoic))
    Child Mode
      Step 1 Theme
      Step 2 Character
      Step 3 Place
      Step 4 Event
      Step 5 Story Experience
      Story Library (future)
    Parent Mode
      Settings Home
        Child Age
        Name & Pronouns
        Language
        Allowed Themes
        Max Story Length
```

## Navigation Rules

- Child Mode uses a single forward/back stack with no global navigation.
- Parent Mode is a separate route group with a small hub-and-spoke pattern.
- No cross-links from Child Mode to Parent Mode (use parent gate).

## Entry Points

- App launch defaults to Child Mode Step 1.
- Parent Mode entry is a discrete action behind a simple gate.
