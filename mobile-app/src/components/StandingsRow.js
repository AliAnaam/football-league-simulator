import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TeamLogo from './TeamLogo';
import { COLORS } from '../theme';

// ─── StandingsRow Component ──────────────────────────────────────────────────
const StandingsRow = ({ row, isHeader = false }) => {
  if (isHeader) {
    return (
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.posCell, styles.headerText]}>#</Text>
        <Text style={[styles.cell, styles.teamCell, styles.headerText]}>Team</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>P</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>W</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>D</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>L</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>GF</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>GA</Text>
        <Text style={[styles.cell, styles.statCell, styles.headerText]}>GD</Text>
        <Text style={[styles.cell, styles.ptsCell, styles.headerText]}>Pts</Text>
      </View>
    );
  }

  // Position-based styling
  const getPositionStyle = (rank) => {
    if (rank === 1) return styles.posChampion;
    if (rank <= 4) return styles.posUCL;
    if (rank >= 18) return styles.posRelegation;
    return null;
  };

  const getPositionIndicator = (rank) => {
    if (rank === 1) return COLORS.gold;       // Gold — champion
    if (rank <= 4) return COLORS.success;     // Green — UCL
    if (rank >= 18) return COLORS.error;      // Red — relegation
    return 'transparent';
  };

  return (
    <View style={[styles.row, row.rank % 2 === 0 && styles.rowAlt]}>
      {/* Position indicator bar */}
      <View style={[styles.posIndicator, { backgroundColor: getPositionIndicator(row.rank) }]} />

      <Text style={[styles.cell, styles.posCell, getPositionStyle(row.rank)]}>
        {row.rank}
      </Text>

      <View style={[styles.cell, styles.teamCell, styles.teamInfo]}>
        <TeamLogo
          team={{ shortName: row.teamShortName, logoUrl: row.logoUrl, primaryColor: row.primaryColor }}
          size={24}
        />
        <Text style={styles.teamName} numberOfLines={1}>{row.teamName}</Text>
      </View>

      <Text style={[styles.cell, styles.statCell]}>{row.played}</Text>
      <Text style={[styles.cell, styles.statCell, styles.winCell]}>{row.won}</Text>
      <Text style={[styles.cell, styles.statCell]}>{row.drawn}</Text>
      <Text style={[styles.cell, styles.statCell, styles.lossCell]}>{row.lost}</Text>
      <Text style={[styles.cell, styles.statCell]}>{row.goalsFor}</Text>
      <Text style={[styles.cell, styles.statCell]}>{row.goalsAgainst}</Text>
      <Text style={[styles.cell, styles.statCell, row.goalDiff > 0 && styles.gdPositive, row.goalDiff < 0 && styles.gdNegative]}>
        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
      </Text>
      <Text style={[styles.cell, styles.ptsCell]}>{row.points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgPrimary,
    position: 'relative',
  },
  rowAlt: {
    backgroundColor: '#fafafa',
  },
  headerRow: {
    backgroundColor: COLORS.bgCardAlt,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.borderAccent,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    color: COLORS.textSecondary,
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  posIndicator: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 3,
    borderRadius: 2,
  },
  cell: {
    color: COLORS.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
  posCell: {
    width: 28,
    fontWeight: '700',
    fontSize: 13,
  },
  posChampion: {
    color: COLORS.gold,
    fontWeight: '900',
  },
  posUCL: {
    color: COLORS.success,
    fontWeight: '800',
  },
  posRelegation: {
    color: COLORS.error,
    fontWeight: '800',
  },
  teamCell: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 4,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    marginLeft: 4,
  },
  statCell: {
    width: 28,
    fontSize: 12,
    fontWeight: '500',
  },
  winCell: {
    color: COLORS.success,
  },
  lossCell: {
    color: COLORS.error,
  },
  ptsCell: {
    width: 32,
    fontWeight: '900',
    fontSize: 13,
    color: COLORS.accentPrimary,
  },
  gdPositive: {
    color: COLORS.success,
  },
  gdNegative: {
    color: COLORS.error,
  },
});

export default StandingsRow;
