# Main Portfolio V2

## Build
- Refactor the three existing glitch interactions into reusable homepage scenes while keeping all concept routes available and noindexed.
- Replace the homepage opening with a readable fragmented operator wall driven by the Clearing Field interaction.
- Rework the operating model into the first controlled editorial sequence after the hero.
- Add Shard Reassembly before Aegis and Evidence Trace before the incident index, while preserving readable case-study content.
- Restyle Lamdan as a calm source/provenance workspace and BotForge as an interactive surface-versus-system stack.
- Rebuild Lab as an irregular four-item archive and add the verified WhatsApp Receptionist prototype.
- Keep About and Contact calm, preserve public copy, and leave `/cv` unchanged.

## Technical details
- Use shared pointer, spring, canvas, and reduced-motion utilities already present; avoid new heavy dependencies.
- Keep semantic content in the DOM, duplicated visual text hidden from assistive technology, and all interactions usable by keyboard or touch.
- Contain full-bleed scenes to prevent horizontal overflow and stop continuous animation when reduced motion is enabled.
- Add route-level `noindex` metadata to all concept pages without changing their interactions.

## Verification
- Run typecheck and confirm the preview build succeeds.
- Exercise the homepage interactions at 1440×900 and 375×812, inspect screenshots, check overflow and browser errors, and verify reduced motion.
- Confirm `/cv` still renders unchanged and the concept routes remain available.
