import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Confetti Particle ───────────────────────────────────────────────────────
const ConfettiParticle = ({ delay, color }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const startX = Math.random() * SCREEN_WIDTH;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(translateY, {
            toValue: 600,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(translateX, {
            toValue: (Math.random() - 0.5) * 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay + 2000),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: startX,
          backgroundColor: color,
          opacity,
          transform: [
            { translateY },
            { translateX },
            {
              rotate: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '720deg'],
              }),
            },
          ],
        },
      ]}
    />
  );
};

// ─── WinnerScreen ────────────────────────────────────────────────────────────
const WinnerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [champion, setChampion] = useState(null);
  const [standings, setStandings] = useState([]);
  const [error, setError] = useState(null);

  // Trophy animation
  const trophyScale = useRef(new Animated.Value(0)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const standingsData = await api.getStandings();
        setStandings(standingsData || []);
        if (standingsData && standingsData.length > 0) {
          setChampion(standingsData[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Run entrance animations after data loads
  useEffect(() => {
    if (!loading && champion) {
      Animated.sequence([
        // Trophy bounces in
        Animated.spring(trophyScale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        // Trophy gentle wobble
        Animated.sequence([
          Animated.timing(trophyRotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(trophyRotate, {
            toValue: -1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(trophyRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Text fades in
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // Standings fade in
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, champion]);

  const confettiColors = ['#e8b923', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e8b923" />
        <Text style={styles.loadingText}>Loading champion...</Text>
      </View>
    );
  }

  if (error || !champion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'No champion data available. Complete the season first!'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Confetti Background */}
      <View style={styles.confettiContainer} pointerEvents="none">
        {confettiColors.map((color, i) =>
          Array.from({ length: 3 }).map((_, j) => (
            <ConfettiParticle
              key={`${i}-${j}`}
              delay={(i * 3 + j) * 200}
              color={color}
            />
          ))
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Trophy Animation */}
        <Animated.View
          style={[
            styles.trophyContainer,
            {
              transform: [
                { scale: trophyScale },
                {
                  rotate: trophyRotate.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-10deg', '0deg', '10deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
        </Animated.View>

        {/* Champion Info */}
        <Animated.View style={[styles.championSection, { opacity: textOpacity }]}>
          <Text style={styles.championLabel}>CHAMPION</Text>

          <LinearGradient
            colors={['#e8b923', '#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.championNameGradient}
          >
            <Text style={styles.championName}>{champion.teamName}</Text>
          </LinearGradient>

          {/* Champion Badge */}
          <View style={[styles.championBadge, { backgroundColor: champion.primaryColor || '#334155' }]}>
            <Text style={styles.championBadgeText}>{champion.teamShortName}</Text>
          </View>

          {/* Champion Stats */}
          <View style={styles.championStatsRow}>
            <View style={styles.champStatItem}>
              <Text style={styles.champStatValue}>{champion.points}</Text>
              <Text style={styles.champStatLabel}>Points</Text>
            </View>
            <View style={styles.champStatDivider} />
            <View style={styles.champStatItem}>
              <Text style={styles.champStatValue}>{champion.won}</Text>
              <Text style={styles.champStatLabel}>Wins</Text>
            </View>
            <View style={styles.champStatDivider} />
            <View style={styles.champStatItem}>
              <Text style={styles.champStatValue}>{champion.goalsFor}</Text>
              <Text style={styles.champStatLabel}>Goals</Text>
            </View>
            <View style={styles.champStatDivider} />
            <View style={styles.champStatItem}>
              <Text style={styles.champStatValue}>{champion.goalDiff > 0 ? `+${champion.goalDiff}` : champion.goalDiff}</Text>
              <Text style={styles.champStatLabel}>GD</Text>
            </View>
          </View>
        </Animated.View>

        {/* Final Standings Summary */}
        <Animated.View style={[styles.standingsSection, { opacity: listOpacity }]}>
          <Text style={styles.standingsTitle}>📊 Final Standings</Text>
          {standings.slice(0, 10).map((row, index) => (
            <View key={row.teamId} style={[styles.standingsRowItem, index === 0 && styles.standingsRowChampion]}>
              <Text style={[styles.standingsRank, index === 0 && styles.standingsRankGold]}>
                {row.rank}
              </Text>
              <View style={[styles.standingsBadge, { backgroundColor: row.primaryColor || '#334155' }]}>
                <Text style={styles.standingsBadgeText}>{row.teamShortName}</Text>
              </View>
              <Text style={styles.standingsTeamName} numberOfLines={1}>{row.teamName}</Text>
              <Text style={styles.standingsPoints}>{row.points} pts</Text>
            </View>
          ))}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.viewStandingsBtn}
            onPress={() => navigation.navigate('Standings')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewStandingsBtnText}>📊 View Full Standings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newSeasonBtn}
            onPress={async () => {
              try {
                await api.resetSeason();
                navigation.navigate('Simulate');
              } catch (err) {
                setError(err.message);
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.newSeasonBtnText}>🔄 New Season</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 80,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#e8b923',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#0f0f23',
    fontWeight: '800',
    fontSize: 15,
  },
  // ─── Confetti ──────────────────────────────────────────────────────
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
    top: -10,
  },
  // ─── Trophy ────────────────────────────────────────────────────────
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trophyEmoji: {
    fontSize: 80,
  },
  // ─── Champion ──────────────────────────────────────────────────────
  championSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  championLabel: {
    color: '#e8b923',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  championNameGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  championName: {
    color: '#0f0f23',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  championBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(232, 185, 35, 0.5)',
    marginBottom: 24,
    shadowColor: '#e8b923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  championBadgeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  championStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  champStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  champStatDivider: {
    width: 1,
    backgroundColor: '#334155',
  },
  champStatValue: {
    color: '#e8b923',
    fontSize: 24,
    fontWeight: '900',
  },
  champStatLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  // ─── Standings ─────────────────────────────────────────────────────
  standingsSection: {
    marginTop: 28,
    marginHorizontal: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  standingsTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  standingsRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  standingsRowChampion: {
    backgroundColor: 'rgba(232, 185, 35, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  standingsRank: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  standingsRankGold: {
    color: '#e8b923',
  },
  standingsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  standingsBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  standingsTeamName: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '600',
  },
  standingsPoints: {
    color: '#e8b923',
    fontSize: 14,
    fontWeight: '800',
  },
  // ─── Actions ───────────────────────────────────────────────────────
  actionsContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    gap: 12,
  },
  viewStandingsBtn: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewStandingsBtnText: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '700',
  },
  newSeasonBtn: {
    backgroundColor: 'rgba(232, 185, 35, 0.1)',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 185, 35, 0.3)',
  },
  newSeasonBtnText: {
    color: '#e8b923',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default WinnerScreen;
