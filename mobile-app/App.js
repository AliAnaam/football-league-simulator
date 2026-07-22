import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

// ─── Navigation Theme (Light, matching website palette) ───────────────────────
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.accentPrimary,      // red-600 — matches website accent
    background: COLORS.bgPrimary,       // slate-50 — light background
    card: COLORS.bgCard,                // white — card surfaces
    text: COLORS.textPrimary,           // slate-950 — main text
    border: COLORS.border,              // slate-200 — standard borders
    notification: COLORS.accentPrimary, // red-600
  },
};

// ─── App Entry Point ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      {/* dark status bar icons on light background */}
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
}
