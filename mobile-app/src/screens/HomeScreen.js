import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import StatCard from '../components/StatCard';
import MatchCard from '../components/MatchCard';
import TeamLogo from '../components/TeamLogo';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { COLORS } from '../theme';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [standings, setStandings] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxWeek, setMaxWeek] = useState(38);
  const [teams, setTeams] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [teamsData, standingsData, scorersData, week, max] = await Promise.all([
        api.getTeams(),
        api.getStandings(),
        api.getScorers(),
        api.getCurrentWeek(),
        api.getMaxWeek(),
      ]);

      setTeams(teamsData || []);
      setStandings(standingsData || []);
      setScorers(scorersData || []);
      setCurrentWeek(week || 1);
      setMaxWeek(max || 38);

      // Fetch recent (last played week) and upcoming matches
      const lastPlayedWeek = (week || 1) - 1;
      if (lastPlayedWeek >= 1) {
        const recent = await api.getMatchesByWeek(lastPlayedWeek);
        setRecentMatches(recent || []);
      } else {
        setRecentMatches([]);
      }

      if (week <= max) {
        const upcoming = await api.getMatchesByWeek(week);
        setUpcomingMatches(upcoming || []);
      } else {
        setUpcomingMatches([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when screen gains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Computed stats
  const totalTeams = teams.length;
  const matchesPlayed = standings.reduce((sum, r) => sum + r.played, 0) / 2;
  const totalGoals = standings.reduce((sum, r) => sum + r.goalsFor, 0);
  const seasonComplete = currentWeek > maxWeek;
  const champion = seasonComplete && standings.length > 0 ? standings[0] : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
        <Text style={styles.loadingText}>Loading LALIGA SIM...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accentPrimary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#c0392b', '#e8443d', '#FF4B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.userHeaderRow}>
          <Text style={styles.userGreeting}>Welcome, {user?.username || 'Fan'}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../assets/laliga-logo.png')}
          style={styles.headerLogo}
          contentFit="contain"
        />
        <Text style={styles.headerSubtitle}>Football League Simulator</Text>
        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>
            {seasonComplete ? '🏆 Season Complete' : `Week ${currentWeek} of ${maxWeek}`}
          </Text>
        </View>
      </LinearGradient>

      {/* ─── Champion Spotlight ────────────────────────────────────────── */}
      {champion && (
        <LinearGradient
          colors={['#e8b923', '#f59e0b', '#d97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.championCard}
        >
          <Text style={styles.championTrophy}>🏆</Text>
          <Text style={styles.championLabel}>CHAMPION</Text>
          <Text style={styles.championName}>{champion.teamName}</Text>
          <Text style={styles.championStats}>
            {champion.points} pts • {champion.won}W {champion.drawn}D {champion.lost}L
          </Text>
        </LinearGradient>
      )}

      {/* ─── Stats Row ────────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>League Overview</Text>
      <View style={styles.statsRow}>
        <StatCard icon="🏟" label="Teams" value={totalTeams} colors={['#FF4B44', '#e8443d']} />
        <StatCard icon="🥅" label="Matches" value={Math.round(matchesPlayed)} colors={['#FF4B44', '#e8443d']} />
        <StatCard icon="⚽" label="Goals" value={totalGoals} colors={['#FF4B44', '#e8443d']} />
      </View>

      {/* ─── Recent Results ───────────────────────────────────────────── */}
      {recentMatches.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Results — Week {currentWeek - 1}</Text>
          <FlatList
            data={recentMatches}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MatchCard match={item} compact />}
            contentContainerStyle={styles.horizontalList}
          />
        </>
      )}

      {/* ─── Upcoming Fixtures ────────────────────────────────────────── */}
      {upcomingMatches.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Upcoming — Week {currentWeek}</Text>
          <FlatList
            data={upcomingMatches}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MatchCard match={item} compact />}
            contentContainerStyle={styles.horizontalList}
          />
        </>
      )}

      {/* ─── Top Teams ────────────────────────────────────────────────── */}
      {standings.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Top 5 Teams</Text>
          <View style={styles.topTeamsContainer}>
            {standings.slice(0, 5).map((row, index) => (
              <View key={row.teamId} style={styles.topTeamRow}>
                <Text style={[styles.topTeamRank, index === 0 && styles.topTeamRankGold]}>
                  {row.rank}
                </Text>
                <TeamLogo
                  team={{ shortName: row.teamShortName, logoUrl: row.logoUrl, primaryColor: row.primaryColor }}
                  size={32}
                  style={styles.topTeamLogoImg}
                />
                <Text style={styles.topTeamName} numberOfLines={1}>{row.teamName}</Text>
                <Text style={styles.topTeamPoints}>{row.points} pts</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ─── Top Scorers (Pichichi) ───────────────────────────────────── */}
      {scorers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pichichi — Top Scorers</Text>
          <View style={styles.scorersContainer}>
            {scorers.slice(0, 5).map((scorer, index) => (
              <View key={`${scorer.name}-${index}`} style={styles.scorerRow}>
                <Text style={[styles.scorerRank, index === 0 && styles.topTeamRankGold]}>
                  {index + 1}
                </Text>
                <View style={styles.scorerInfo}>
                  <Text style={styles.scorerName}>{scorer.name}</Text>
                  <Text style={styles.scorerTeam}>{scorer.teamName}</Text>
                </View>
                <View style={styles.goalsBadge}>
                  <Text style={styles.goalsText}>{scorer.goals}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 30 }} />
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
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  userHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  userGreeting: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerLogo: {
    width: 180,
    height: 100,
    marginBottom: 4,
    tintColor: '#ffffff',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  weekBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  weekText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  // ─── Champion ──────────────────────────────────────────────────────
  championCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  championTrophy: {
    fontSize: 42,
    marginBottom: 6,
  },
  championLabel: {
    color: '#0f0f23',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  championName: {
    color: '#0f0f23',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  championStats: {
    color: 'rgba(15,15,35,0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  // ─── Sections ──────────────────────────────────────────────────────
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 4,
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  // ─── Top Teams ─────────────────────────────────────────────────────
  topTeamsContainer: {
    marginHorizontal: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  topTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgPrimary,
  },
  topTeamRank: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  topTeamRankGold: {
    color: COLORS.gold,
  },
  topTeamLogoImg: {
    marginRight: 10,
  },
  topTeamName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  topTeamPoints: {
    color: COLORS.accentPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  // ─── Top Scorers ───────────────────────────────────────────────────
  scorersContainer: {
    marginHorizontal: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgPrimary,
  },
  scorerRank: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '800',
    width: 28,
    textAlign: 'center',
  },
  scorerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  scorerName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  scorerTeam: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  goalsBadge: {
    backgroundColor: COLORS.accentXLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderAccent,
  },
  goalsText: {
    color: COLORS.accentPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
});

export default HomeScreen;
