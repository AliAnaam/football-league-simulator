import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

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
  const icons = {
    Home: focused ? 'football' : 'football-outline',
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
      tabBarActiveTintColor: '#e8b923',
      tabBarInactiveTintColor: '#64748b',
      tabBarStyle: {
        backgroundColor: '#1a1a2e',
        borderTopColor: '#334155',
        borderTopWidth: 1,
        height: 88,
        paddingTop: 8,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
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
