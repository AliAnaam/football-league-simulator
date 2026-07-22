import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MatchCard from '../components/MatchCard';
import * as api from '../services/api';
import { COLORS } from '../theme';

const SimulationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxWeek, setMaxWeek] = useState(38);
  const [lastResults, setLastResults] = useState(null);
  const [seasonComplete, setSeasonComplete] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnims = useRef([]).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [week, max] = await Promise.all([
        api.getCurrentWeek(),
        api.getMaxWeek(),
      ]);
      setCurrentWeek(week || 1);
      setMaxWeek(max || 38);
      setSeasonComplete((week || 1) > (max || 38));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    startPulse();
  }, [fetchData, startPulse]);

  // Refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation, fetchData]);

  // Stagger animation for results
  const animateResults = (count) => {
    fadeAnims.length = 0;
    for (let i = 0; i < count; i++) {
      fadeAnims.push(new Animated.Value(0));
    }

    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  };

  const handleSimulateWeek = async () => {
    if (seasonComplete) return;

    setSimulating(true);
    setLastResults(null);
    try {
      const result = await api.simulateWeek(currentWeek);
      setLastResults(result);
      animateResults(result?.results?.length || 0);

      const newWeek = currentWeek + 1;
      setCurrentWeek(newWeek);
      if (newWeek > maxWeek) {
        setSeasonComplete(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateAll = async () => {
    if (seasonComplete) return;

    Alert.alert(
      'Simulate All Remaining',
      `This will simulate weeks ${currentWeek} through ${maxWeek}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate',
          style: 'default',
          onPress: async () => {
            setSimulating(true);
            setLastResults(null);
            try {
              const result = await api.simulateRemaining();
              setLastResults(result);
              animateResults(result?.results?.length || 0);
              setCurrentWeek(maxWeek + 1);
              setSeasonComplete(true);
            } catch (err) {
              setError(err.message);
            } finally {
              setSimulating(false);
            }
          },
        },
      ]
    );
  };

  const handleResetSeason = async () => {
    Alert.alert(
      'Reset Season',
      'This will reset all match results and standings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setSimulating(true);
            try {
              await api.resetSeason();
              setLastResults(null);
              setCurrentWeek(1);
              setSeasonComplete(false);
            } catch (err) {
              setError(err.message);
            } finally {
              setSimulating(false);
            }
          },
        },
      ]
    );
  };

  const progress = Math.min(1, Math.max(0, (currentWeek - 1) / maxWeek));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
        <Text style={styles.loadingText}>Loading simulation...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#c0392b', '#e8443d', '#FF4B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>⚡ Simulation</Text>
        <Text style={styles.subtitle}>Match Engine Control Panel</Text>
      </LinearGradient>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Season Progress</Text>
          <Text style={styles.progressValue}>
            {seasonComplete ? 'Complete!' : `Week ${currentWeek} of ${maxWeek}`}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[COLORS.accentPrimary, '#e8443d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
      </View>

      {/* Action Buttons */}
      {!seasonComplete ? (
        <View style={styles.buttonsContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.simButton, simulating && styles.simButtonDisabled]}
              onPress={handleSimulateWeek}
              disabled={simulating}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={simulating ? [COLORS.border, COLORS.bgPrimary] : [COLORS.accentPrimary, '#e8443d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.simButtonGradient}
              >
                {simulating ? (
                  <ActivityIndicator size="small" color={COLORS.accentPrimary} />
                ) : (
                  <>
                    <Text style={styles.simButtonIcon}>▶️</Text>
                    <Text style={styles.simButtonText}>Simulate Week {currentWeek}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.secondaryButton, simulating && styles.simButtonDisabled]}
            onPress={handleSimulateAll}
            disabled={simulating}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonIcon}>⏩</Text>
            <Text style={styles.secondaryButtonText}>Simulate All Remaining</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.winnerButton}
            onPress={() => navigation.navigate('Winner')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.gold, '#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.simButtonGradient}
            >
              <Text style={styles.winnerButtonIcon}>🏆</Text>
              <Text style={styles.winnerButtonText}>View Champion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetSeason}
        disabled={simulating}
        activeOpacity={0.8}
      >
        <Text style={styles.resetButtonIcon}>🔄</Text>
        <Text style={styles.resetButtonText}>Reset Season</Text>
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Simulation Results */}
      {simulating && (
        <View style={styles.simulatingContainer}>
          <ActivityIndicator size="large" color={COLORS.accentPrimary} />
          <Text style={styles.simulatingText}>Simulating matches...</Text>
          <Text style={styles.simulatingSubtext}>The match engine is calculating results</Text>
        </View>
      )}

      {lastResults && lastResults.results && (
        <>
          <Text style={styles.resultsTitle}>
            📋 Week {lastResults.week} Results
          </Text>
          {lastResults.results.map((result, index) => {
            const fadeAnim = fadeAnims[index] || new Animated.Value(1);
            return (
              <Animated.View
                key={result.matchId}
                style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })}]}}
              >
                <View style={styles.resultCard}>
                  <Text style={styles.resultTeam} numberOfLines={1}>{result.homeTeam}</Text>
                  <View style={styles.resultScoreBox}>
                    <Text style={styles.resultScore}>
                      {result.homeScore} - {result.awayScore}
                    </Text>
                  </View>
                  <Text style={[styles.resultTeam, styles.resultTeamAway]} numberOfLines={1}>
                    {result.awayTeam}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  content: {
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
  // ─── Header ────────────────────────────────────────────────────────
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  // ─── Progress ──────────────────────────────────────────────────────
  progressCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  progressValue: {
    color: COLORS.accentPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.accentLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 6,
  },
  // ─── Buttons ───────────────────────────────────────────────────────
  buttonsContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  simButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  simButtonDisabled: {
    opacity: 0.6,
  },
  simButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  simButtonIcon: {
    fontSize: 20,
  },
  simButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
    gap: 10,
  },
  secondaryButtonIcon: {
    fontSize: 18,
  },
  secondaryButtonText: {
    color: COLORS.accentPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  winnerButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  winnerButtonIcon: {
    fontSize: 24,
  },
  winnerButtonText: {
    color: '#0f0f23',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    gap: 8,
  },
  resetButtonIcon: {
    fontSize: 16,
  },
  resetButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
  },
  // ─── Error ─────────────────────────────────────────────────────────
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  // ─── Simulating ────────────────────────────────────────────────────
  simulatingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  simulatingText: {
    color: COLORS.accentPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 16,
  },
  simulatingSubtext: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  // ─── Results ───────────────────────────────────────────────────────
  resultsTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  resultTeam: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  resultTeamAway: {
    textAlign: 'right',
  },
  resultScoreBox: {
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  resultScore: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default SimulationScreen;
