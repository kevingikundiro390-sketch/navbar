---
name: Offline homework solving
description: Product constraint for the homework scan and solve flow.
---

The homework flow must work without paid AI services, provider upgrades, or user-supplied API keys. A public free vision endpoint is allowed when it works without account setup; preserve the original scan and render the solved copy separately.

**Why:** The user explicitly rejected paid plans and secret setup, then asked for a genuinely capable no-key AI flow when the deterministic placeholder was insufficient.

**How to apply:** Prefer validated vision-model output over deterministic answers. Render concise intermediate steps followed by a visibly marked final answer, and report an explicit error if the public endpoint is unavailable instead of silently guessing.

The native OCR implementation requires an Expo development build with the OCR module enabled; the browser/Expo Go preview must explain that limitation instead of pretending to recognize the image.

**Why:** The on-device ML Kit module is a native dependency and is not bundled in Expo Go, while the product still needs a usable zero-setup preview and an honest failure state.

**How to apply:** Keep the OCR import lazy and catch unsupported environments. Native QA must use an iOS or Android development build, not only the web preview.
