import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as api from '../services/api';

const TeamDetailsScreen = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [teamData, standingsData] = await Promise.all([
          api.getTeamById(teamId),
          api.getStandings(),
        ]);
        setTeam(teamData);

        // Find this team's standings row
        const row = (standingsData || []).find((r) => r.teamId === teamId);
        setStats(row || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e8b923" />
      </View>
    );
  }

  if (error || !team) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error || 'Team not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statItems = [
    { label: 'Power', value: team.power, icon: '⚡', color: '#e8b923' },
    { label: 'Morale', value: `${team.morale}%`, icon: '🔥', color: '#f59e0b' },
    { label: 'Wins', value: stats?.won ?? '-', icon: '✅', color: '#10b981' },
    { label: 'Draws', value: stats?.drawn ?? '-', icon: '🤝', color: '#3b82f6' },
    { label: 'Losses', value: stats?.lost ?? '-', icon: '❌', color: '#ef4444' },
    { label: 'Goals For', value: stats?.goalsFor ?? '-', icon: '⚽', color: '#10b981' },
    { label: 'Goals Against', value: stats?.goalsAgainst ?? '-', icon: '🥅', color: '#ef4444' },
    { label: 'Points', value: stats?.points ?? '-', icon: '🏆', color: '#e8b923' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[team.primaryColor || '#1a1a2e', '#0f0f23']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        {/* Large Badge */}
        <View style={[styles.largeBadge, { backgroundColor: team.primaryColor || '#334155' }]}>
          <Text style={styles.largeBadgeText}>{team.shortName}</Text>
        </View>

        <Text style={styles.teamName}>{team.name}</Text>

        {/* Rank Badge */}
        {stats && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{stats.rank} in the League</Text>
          </View>
        )}

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏟</Text>
            <Text style={styles.infoLabel}>Stadium</Text>
            <Text style={styles.infoValue}>{team.stadium}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👔</Text>
            <Text style={styles.infoLabel}>Manager</Text>
            <Text style={styles.infoValue}>{team.manager}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏛</Text>
            <Text style={styles.infoLabel}>Founded</Text>
            <Text style={styles.infoValue}>{team.foundingYear}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>📊 Season Statistics</Text>
      <View style={styles.statsGrid}>
        {statItems.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{item.icon}</Text>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Form Guide */}
      {stats?.form && stats.form.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>📈 Recent Form</Text>
          <View style={styles.formContainer}>
            {stats.form.map((result, index) => (
              <View
                key={index}
                style={[
                  styles.formBubble,
                  {
                    backgroundColor:
                      result === 'W' ? '#10b981' :
                      result === 'D' ? '#3b82f6' : '#ef4444',
                  },
                ]}
              >
                <Text style={styles.formText}>{result}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Stadium Capacity */}
      {team.capacity && (
        <View style={styles.capacityCard}>
          <Text style={styles.capacityIcon}>🏟</Text>
          <View style={styles.capacityInfo}>
            <Text style={styles.capacityLabel}>Stadium Capacity</Text>
            <Text style={styles.capacityValue}>{team.capacity}</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
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
  // ─── Hero ──────────────────────────────────────────────────────────
  hero: {
    paddingTop: 60,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  largeBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  largeBadgeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  teamName: {
    color: '#f1f5f9',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rankBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(232, 185, 35, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 185, 35, 0.3)',
  },
  rankText: {
    color: '#e8b923',
    fontSize: 13,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  // ─── Stats ─────────────────────────────────────────────────────────
  sectionTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  statCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    width: '23%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  // ─── Form ──────────────────────────────────────────────────────────
  formContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  formBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  // ─── Capacity ──────────────────────────────────────────────────────
  capacityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  capacityIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  capacityInfo: {
    flex: 1,
  },
  capacityLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  capacityValue: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default TeamDetailsScreen;
