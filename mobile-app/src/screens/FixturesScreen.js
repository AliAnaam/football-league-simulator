import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import MatchCard from '../components/MatchCard';
import * as api from '../services/api';
import { COLORS } from '../theme';

const FixturesScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [maxWeek, setMaxWeek] = useState(38);

  const fetchWeekData = useCallback(async (week) => {
    try {
      setError(null);
      const weekMatches = await api.getMatchesByWeek(week);
      setMatches(weekMatches || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setError(null);
      const [week, max] = await Promise.all([
        api.getCurrentWeek(),
        api.getMaxWeek(),
      ]);
      const w = week || 1;
      const m = max || 38;
      setCurrentWeek(w);
      setMaxWeek(m);
      // Start on the current (or most recent played) week
      const startWeek = w > m ? m : w > 1 ? w - 1 : 1;
      setSelectedWeek(startWeek);
      await fetchWeekData(startWeek);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchWeekData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Refresh when screen gains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInitialData();
    });
    return unsubscribe;
  }, [navigation, fetchInitialData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInitialData();
  };

  const goToWeek = async (week) => {
    if (week < 1 || week > maxWeek) return;
    setSelectedWeek(week);
    setLoading(true);
    await fetchWeekData(week);
    setLoading(false);
  };

  const allPlayed = matches.length > 0 && matches.every((m) => m.played);
  const somePlayed = matches.some((m) => m.played);

  if (loading && matches.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
        <Text style={styles.loadingText}>Loading fixtures...</Text>
      </View>
    );
  }

  if (error && matches.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInitialData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fixtures</Text>
        <Text style={styles.subtitle}>Season Schedule</Text>
      </View>

      {/* Week Selector */}
      <View style={styles.weekSelector}>
        <TouchableOpacity
          style={[styles.arrowBtn, selectedWeek <= 1 && styles.arrowBtnDisabled]}
          onPress={() => goToWeek(selectedWeek - 1)}
          disabled={selectedWeek <= 1}
        >
          <Text style={[styles.arrowText, selectedWeek <= 1 && styles.arrowTextDisabled]}>◀</Text>
        </TouchableOpacity>

        <View style={styles.weekInfo}>
          <Text style={styles.weekLabel}>Week {selectedWeek} of {maxWeek}</Text>
          <View style={[
            styles.weekStatus,
            allPlayed ? styles.weekStatusPlayed :
            somePlayed ? styles.weekStatusPartial : styles.weekStatusUpcoming,
          ]}>
            <Text style={styles.weekStatusText}>
              {allPlayed ? 'Completed' : somePlayed ? 'In Progress' : 'Upcoming'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.arrowBtn, selectedWeek >= maxWeek && styles.arrowBtnDisabled]}
          onPress={() => goToWeek(selectedWeek + 1)}
          disabled={selectedWeek >= maxWeek}
        >
          <Text style={[styles.arrowText, selectedWeek >= maxWeek && styles.arrowTextDisabled]}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Nav */}
      <View style={styles.quickNav}>
        <TouchableOpacity
          style={styles.quickNavBtn}
          onPress={() => goToWeek(1)}
        >
          <Text style={styles.quickNavText}>First</Text>
        </TouchableOpacity>
        {currentWeek > 1 && currentWeek <= maxWeek && (
          <TouchableOpacity
            style={[styles.quickNavBtn, styles.quickNavBtnActive]}
            onPress={() => goToWeek(currentWeek > maxWeek ? maxWeek : currentWeek)}
          >
            <Text style={[styles.quickNavText, styles.quickNavTextActive]}>Current</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.quickNavBtn}
          onPress={() => goToWeek(maxWeek)}
        >
          <Text style={styles.quickNavText}>Last</Text>
        </TouchableOpacity>
      </View>

      {/* Matches List */}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MatchCard match={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accentPrimary} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No matches for this week</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
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
  // ─── Header ────────────────────────────────────────────────────────
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bgCardAlt,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderAccent,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  // ─── Week Selector ─────────────────────────────────────────────────
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentXLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  arrowBtnDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    color: COLORS.accentPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  arrowTextDisabled: {
    color: COLORS.textMuted,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekLabel: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  weekStatus: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  weekStatusPlayed: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  weekStatusPartial: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  weekStatusUpcoming: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
  },
  weekStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  // ─── Quick Nav ─────────────────────────────────────────────────────
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginHorizontal: 16,
  },
  quickNavBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickNavBtnActive: {
    backgroundColor: COLORS.accentXLight,
    borderColor: COLORS.borderAccent,
  },
  quickNavText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  quickNavTextActive: {
    color: COLORS.accentPrimary,
  },
  // ─── List ──────────────────────────────────────────────────────────
  list: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default FixturesScreen;
