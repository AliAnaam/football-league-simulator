import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Team Badge (small) ─────────────────────────────────────────────────────
const MiniBadge = ({ shortName, primaryColor }) => (
  <View style={[styles.badge, { backgroundColor: primaryColor || '#334155' }]}>
    <Text style={styles.badgeText}>{shortName || '??'}</Text>
  </View>
);

// ─── MatchCard Component ─────────────────────────────────────────────────────
const MatchCard = ({ match, compact = false }) => {
  const isPlayed = match.played;

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
          <MiniBadge shortName={match.homeTeamShortName} primaryColor={match.homePrimaryColor} />
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
          <MiniBadge shortName={match.awayTeamShortName} primaryColor={match.awayPrimaryColor} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 14,
    marginVertical: 5,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
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
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  ftBadge: {
    backgroundColor: '#10b981',
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
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  teamName: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  scoreBox: {
    backgroundColor: '#16213e',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreText: {
    color: '#e8b923',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  vsText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});

export default MatchCard;
