# Driving Test Coach

An Expo Router app that runs in Expo Go with no account, API key, or custom
native build required for startup.

## Run in Cursor

```bash
git clone https://github.com/kevingikundiro390-sketch/navbar.git
cd navbar
pnpm install
npx expo start
```

Scan the QR code with Expo Go while the phone and computer are on the same
network. If the LAN connection is blocked, press `s` in the Expo terminal to
switch to tunnel mode.

## Checks

```bash
npx expo install --check
npx expo-doctor
pnpm run typecheck
```

The scanner uses the device camera or photo library. Its solve action uses a
public free vision endpoint; no environment variables or secrets are required
to launch the app.