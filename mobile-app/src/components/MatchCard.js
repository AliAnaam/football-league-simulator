import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TeamLogo from './TeamLogo';
import { COLORS } from '../theme';

// ─── MatchCard Component ─────────────────────────────────────────────────────
const MatchCard = ({ match, compact = false }) => {
  const isPlayed = match.played;

  // Build team objects for logo lookup
  const homeTeam = {
    shortName: match.homeTeamShortName,
    logoUrl: match.homeLogoUrl,
    primaryColor: match.homePrimaryColor,
  };
  const awayTeam = {
    shortName: match.awayTeamShortName,
    logoUrl: match.awayLogoUrl,
    primaryColor: match.awayPrimaryColor,
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      {/* Match Date/Time */}
      {!compact && (
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>
            {match.matchDate}{match.matchTime ? ` • ${match.matchTime}` : ''}
          </Text>
          {isPlayed && (
            <View style={styles.ftBadge}>
              <Text style={styles.ftText}>FT</Text>
            </View>
          )}
        </View>
      )}

      {/* Teams & Score */}
      <View style={styles.matchRow}>
        {/* Home Team */}
        <View style={styles.teamSide}>
          <TeamLogo team={homeTeam} size={compact ? 28 : 34} />
          <Text style={styles.teamName} numberOfLines={1}>
            {compact ? match.homeTeamShortName : match.homeTeamName}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreBox}>
          {isPlayed ? (
            <Text style={styles.scoreText}>
              {match.homeScore} - {match.awayScore}
            </Text>
          ) : (
            <Text style={styles.vsText}>vs</Text>
          )}
        </View>

        {/* Away Team */}
        <View style={[styles.teamSide, styles.teamSideAway]}>
          <Text style={styles.teamName} numberOfLines={1}>
            {compact ? match.awayTeamShortName : match.awayTeamName}
          </Text>
          <TeamLogo team={awayTeam} size={compact ? 28 : 34} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    marginVertical: 5,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    marginVertical: 4,
    width: 280,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  ftBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ftText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamSideAway: {
    justifyContent: 'flex-end',
  },
  teamName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  scoreBox: {
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  vsText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

export default MatchCard;
