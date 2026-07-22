import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TeamLogo from './TeamLogo';
import { COLORS } from '../theme';

// ─── TeamCard Component ──────────────────────────────────────────────────────
const TeamCard = ({ team, onPress }) => {
  const powerPercent = Math.min(100, Math.max(0, team.power));
  const moralePercent = Math.min(100, Math.max(0, team.morale));

  const powerBarColor = powerPercent >= 80 ? COLORS.gold
    : powerPercent >= 60 ? COLORS.success
    : COLORS.accentPrimary;

  const moraleBarColor = moralePercent >= 70 ? COLORS.success
    : moralePercent >= 40 ? COLORS.warning
    : COLORS.error;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <TeamLogo team={team} size={52} style={styles.logo} />
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
                  { width: `${powerPercent}%`, backgroundColor: powerBarColor },
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
                  { width: `${moralePercent}%`, backgroundColor: moraleBarColor },
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
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  stadium: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    width: 45,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
});

export default TeamCard;
