import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TeamLogo from '../components/TeamLogo';
import * as api from '../services/api';
import { COLORS } from '../theme';

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
  const [resetting, setResetting] = useState(false);
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

  const confettiColors = [COLORS.gold, '#f59e0b', COLORS.error, COLORS.success, '#3b82f6', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
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
            colors={[COLORS.gold, '#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.championNameGradient}
          >
            <Text style={styles.championName}>{champion.teamName}</Text>
          </LinearGradient>

          {/* Champion Logo */}
          <TeamLogo
            team={{ shortName: champion.teamShortName, logoUrl: champion.logoUrl, primaryColor: champion.primaryColor }}
            size={80}
            style={styles.championLogo}
          />

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
          <Text style={styles.standingsTitle}>Final Standings</Text>
          {standings.slice(0, 10).map((row, index) => (
            <View key={row.teamId} style={[styles.standingsRowItem, index === 0 && styles.standingsRowChampion]}>
              <Text style={[styles.standingsRank, index === 0 && styles.standingsRankGold]}>
                {row.rank}
              </Text>
              <TeamLogo
                team={{ shortName: row.teamShortName, logoUrl: row.logoUrl, primaryColor: row.primaryColor }}
                size={28}
                style={styles.standingsLogo}
              />
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
            <Text style={styles.viewStandingsBtnText}>View Full Standings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.newSeasonBtn, resetting && { opacity: 0.6 }]}
            disabled={resetting}
            onPress={async () => {
              if (resetting) return;
              setResetting(true);
              try {
                await api.resetSeason();
                if (navigation.canGoBack()) {
                  navigation.popToTop();
                } else {
                  navigation.navigate('SimulateMain');
                }
              } catch (err) {
                setError(err.message);
              } finally {
                setResetting(false);
              }
            }}
            activeOpacity={0.8}
          >
            {resetting ? (
              <ActivityIndicator size="small" color={COLORS.accentPrimary} />
            ) : (
              <Text style={styles.newSeasonBtnText}>New Season</Text>
            )}
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
    backgroundColor: COLORS.bgPrimary,
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
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: COLORS.textOnAccent,
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
    color: COLORS.accentPrimary,
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
  championLogo: {
    marginBottom: 24,
    borderWidth: 3,
    borderColor: COLORS.borderAccent,
    shadowColor: COLORS.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  championStatsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  champStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  champStatDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  champStatValue: {
    color: COLORS.accentPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  champStatLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  // ─── Standings ─────────────────────────────────────────────────────
  standingsSection: {
    marginTop: 28,
    marginHorizontal: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  standingsTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  standingsRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgPrimary,
  },
  standingsRowChampion: {
    backgroundColor: 'rgba(232, 185, 35, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  standingsRank: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  standingsRankGold: {
    color: COLORS.gold,
  },
  standingsLogo: {
    marginRight: 10,
  },
  standingsTeamName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  standingsPoints: {
    color: COLORS.accentPrimary,
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
    backgroundColor: COLORS.bgCard,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  viewStandingsBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  newSeasonBtn: {
    backgroundColor: COLORS.accentXLight,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  newSeasonBtnText: {
    color: COLORS.accentPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default WinnerScreen;
