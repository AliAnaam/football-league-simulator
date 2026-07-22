import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TeamLogo from '../components/TeamLogo';
import TeamFormModal from '../components/TeamFormModal';
import * as api from '../services/api';
import { COLORS } from '../theme';

const TeamDetailsScreen = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
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
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateTeam = async (updatedData) => {
    await api.updateTeam(teamId, updatedData);
    await fetchData();
  };

  const handleDeleteTeam = () => {
    if (!team) return;

    Alert.alert(
      'Delete Team',
      `Are you sure you want to delete ${team.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.deleteTeam(teamId);
              navigation.goBack();
            } catch (err) {
              setError(err.message);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentPrimary} />
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
    { label: 'Power', value: team.power, icon: '⚡', color: COLORS.gold },
    { label: 'Morale', value: `${team.morale}%`, icon: '🔥', color: COLORS.warning },
    { label: 'Wins', value: stats?.won ?? '-', icon: '✅', color: COLORS.success },
    { label: 'Draws', value: stats?.drawn ?? '-', icon: '🤝', color: '#3b82f6' },
    { label: 'Losses', value: stats?.lost ?? '-', icon: '❌', color: COLORS.error },
    { label: 'Goals For', value: stats?.goalsFor ?? '-', icon: '⚽', color: COLORS.success },
    { label: 'Goals Against', value: stats?.goalsAgainst ?? '-', icon: '🥅', color: COLORS.error },
    { label: 'Points', value: stats?.points ?? '-', icon: '🏆', color: COLORS.accentPrimary },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#c0392b', '#e8443d', '#FF4B44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.hero}
      >
        {/* Top Header Buttons: Back, Edit, Delete */}
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.actionIconBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.actionIconText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.actionIconText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionIconBtn, styles.deleteBtn]}
              onPress={handleDeleteTeam}
            >
              <Text style={[styles.actionIconText, styles.deleteBtnText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Large Logo */}
        <TeamLogo
          team={team}
          size={90}
          style={styles.heroLogo}
        />

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
      <Text style={styles.sectionTitle}>Season Statistics</Text>
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
          <Text style={styles.sectionTitle}>Recent Form</Text>
          <View style={styles.formContainer}>
            {stats.form.map((result, index) => {
              // Backend sends: G = win, B = draw, M = loss
              const isWin  = result === 'G' || result === 'W';
              const isDraw = result === 'B' || result === 'D';
              const symbol = isWin ? '✓' : isDraw ? '−' : '✕';
              const bg     = isWin ? COLORS.success : isDraw ? '#94a3b8' : COLORS.error;
              return (
                <View key={index} style={[styles.formBubble, { backgroundColor: bg }]}>
                  <Text style={styles.formText}>{symbol}</Text>
                </View>
              );
            })}
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

      {/* Edit Team Modal */}
      <TeamFormModal
        visible={isEditModalVisible}
        team={team}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleUpdateTeam}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
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
  // ─── Hero ──────────────────────────────────────────────────────────
  hero: {
    paddingTop: 50,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionIconText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  deleteBtnText: {
    color: '#ffffff',
  },
  heroLogo: {
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rankBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  rankText: {
    color: '#ffffff',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  // ─── Stats ─────────────────────────────────────────────────────────
  sectionTitle: {
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    width: '23%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
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
    color: COLORS.textMuted,
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
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  // ─── Capacity ──────────────────────────────────────────────────────
  capacityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  capacityIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  capacityInfo: {
    flex: 1,
  },
  capacityLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  capacityValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
});

export default TeamDetailsScreen;
