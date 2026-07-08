import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// ─── Team Badge (colored circle with team initials) ──────────────────────────
const TeamBadge = ({ shortName, primaryColor, size = 48 }) => (
  <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2, backgroundColor: primaryColor || '#334155' }]}>
    <Text style={[styles.badgeText, { fontSize: size * 0.35 }]}>{shortName || '??'}</Text>
  </View>
);

// ─── TeamCard Component ──────────────────────────────────────────────────────
const TeamCard = ({ team, onPress }) => {
  const powerPercent = Math.min(100, Math.max(0, team.power));
  const moralePercent = Math.min(100, Math.max(0, team.morale));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <TeamBadge
          shortName={team.shortName}
          primaryColor={team.primaryColor}
          size={52}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{team.name}</Text>
          <Text style={styles.stadium} numberOfLines={1}>🏟 {team.stadium}</Text>

          {/* Power Bar */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Power</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${powerPercent}%`,
                    backgroundColor: powerPercent >= 80 ? '#e8b923' : powerPercent >= 60 ? '#10b981' : '#3b82f6',
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{team.power}</Text>
          </View>

          {/* Morale */}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Morale</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${moralePercent}%`,
                    backgroundColor: moralePercent >= 70 ? '#10b981' : moralePercent >= 40 ? '#f59e0b' : '#ef4444',
                  },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{team.morale}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#f1f5f9',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  stadium: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    width: 45,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
});

export default TeamCard;
