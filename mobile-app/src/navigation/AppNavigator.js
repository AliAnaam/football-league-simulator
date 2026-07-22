import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { COLORS } from '../theme';

// ─── Screens ─────────────────────────────────────────────────────────────────
import HomeScreen from '../screens/HomeScreen';
import TeamsScreen from '../screens/TeamsScreen';
import TeamDetailsScreen from '../screens/TeamDetailsScreen';
import FixturesScreen from '../screens/FixturesScreen';
import StandingsScreen from '../screens/StandingsScreen';
import SimulationScreen from '../screens/SimulationScreen';
import WinnerScreen from '../screens/WinnerScreen';

const Tab = createBottomTabNavigator();
const TeamsStack = createNativeStackNavigator();
const SimulateStack = createNativeStackNavigator();

// ─── Teams Stack Navigator ──────────────────────────────────────────────────
const TeamsStackNavigator = () => (
  <TeamsStack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <TeamsStack.Screen name="TeamsList" component={TeamsScreen} />
    <TeamsStack.Screen name="TeamDetails" component={TeamDetailsScreen} />
  </TeamsStack.Navigator>
);

// ─── Simulate Stack Navigator ───────────────────────────────────────────────
const SimulateStackNavigator = () => (
  <SimulateStack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <SimulateStack.Screen name="SimulateMain" component={SimulationScreen} />
    <SimulateStack.Screen name="Winner" component={WinnerScreen} />
  </SimulateStack.Navigator>
);

// ─── Tab Navigator ──────────────────────────────────────────────────────────
const getTabBarIcon = (routeName, focused, color, size) => {
  // Home tab: use the LaLiga logo instead of the football Ionicon
  if (routeName === 'Home') {
    return (
      <Image
        source={require('../../assets/laliga-logo.png')}
        style={{ width: size + 6, height: size + 6 }}
        contentFit="contain"
        tintColor={color}
      />
    );
  }
  const icons = {
    Teams: focused ? 'people' : 'people-outline',
    Fixtures: focused ? 'calendar' : 'calendar-outline',
    Standings: focused ? 'trophy' : 'trophy-outline',
    Simulate: focused ? 'play-circle' : 'play-circle-outline',
  };
  return <Ionicons name={icons[routeName]} size={size} color={color} />;
};

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) =>
        getTabBarIcon(route.name, focused, color, size),
      // ─── Match website: red active tint, slate muted ───────────────
      tabBarActiveTintColor: COLORS.accentPrimary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: COLORS.bgCard,
        borderTopColor: COLORS.borderAccent,
        borderTopWidth: 1,
        height: 88,
        paddingTop: 8,
        paddingBottom: 28,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 10,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Teams" component={TeamsStackNavigator} />
    <Tab.Screen name="Fixtures" component={FixturesScreen} />
    <Tab.Screen name="Standings" component={StandingsScreen} />
    <Tab.Screen name="Simulate" component={SimulateStackNavigator} />
  </Tab.Navigator>
);

export default AppNavigator;
