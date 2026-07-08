import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    if (rank === 1) return '#e8b923';   // Gold — champion
    if (rank <= 4) return '#10b981';    // Green — UCL
    if (rank >= 18) return '#ef4444';   // Red — relegation
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
        <View style={[styles.miniBadge, { backgroundColor: row.primaryColor || '#334155' }]}>
          <Text style={styles.miniBadgeText}>{row.teamShortName}</Text>
        </View>
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
    borderBottomColor: '#1e293b',
    position: 'relative',
  },
  rowAlt: {
    backgroundColor: 'rgba(22, 33, 62, 0.4)',
  },
  headerRow: {
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    color: '#94a3b8',
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
    color: '#f1f5f9',
    fontSize: 12,
    textAlign: 'center',
  },
  posCell: {
    width: 28,
    fontWeight: '700',
    fontSize: 13,
  },
  posChampion: {
    color: '#e8b923',
    fontWeight: '900',
  },
  posUCL: {
    color: '#10b981',
    fontWeight: '800',
  },
  posRelegation: {
    color: '#ef4444',
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
  miniBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  miniBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  teamName: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  statCell: {
    width: 28,
    fontSize: 12,
    fontWeight: '500',
  },
  winCell: {
    color: '#10b981',
  },
  lossCell: {
    color: '#ef4444',
  },
  ptsCell: {
    width: 32,
    fontWeight: '900',
    fontSize: 13,
    color: '#e8b923',
  },
  gdPositive: {
    color: '#10b981',
  },
  gdNegative: {
    color: '#ef4444',
  },
});

export default StandingsRow;
