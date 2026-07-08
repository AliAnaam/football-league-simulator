import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

// ─── Navigation Theme (Dark, based on built-in DarkTheme) ────────────────────
// Extend React Navigation's built-in DarkTheme so fonts are always included
const AppTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#e8b923',
    background: '#0f0f23',
    card: '#1a1a2e',
    text: '#f1f5f9',
    border: '#334155',
    notification: '#e8b923',
  },
};

// ─── App Entry Point ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
