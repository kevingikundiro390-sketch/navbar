---
name: Expo SDK 57 verification
description: Expo SDK 57 native-tab syntax and validation details for this mobile app
---

Expo Router 57's native tabs expose `Icon` and `Label` as members of `NativeTabs.Trigger`, not as named exports from `unstable-native-tabs`. Run Expo Doctor from the app directory so it resolves the app's SDK version.

**Why:** The SDK upgrade initially produced misleading API/type and root-resolution failures even though the app package was correctly aligned.

**How to apply:** Use `NativeTabs.Trigger.Icon` and `NativeTabs.Trigger.Label`, and validate with `cd artifacts/driving-test-coach && pnpm dlx expo-doctor@latest`.