import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS } from './src/theme';

// ─── Navigation Theme (Light, matching website palette) ───────────────────────
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.accentPrimary,      // brand red
    background: COLORS.bgPrimary,       // slate-50 — light background
    card: COLORS.bgCard,                // white — card surfaces
    text: COLORS.textPrimary,           // slate-950 — main text
    border: COLORS.border,              // slate-200 — standard borders
    notification: COLORS.accentPrimary,
  },
};

// ─── Root Navigator Component ───────────────────────────────────────────────
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="dark" />
      {user ? <AppNavigator /> : <AuthScreen />}
    </NavigationContainer>
  );
}

// ─── App Entry Point ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
