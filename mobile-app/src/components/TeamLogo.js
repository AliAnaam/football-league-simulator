import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getLogoUrl } from '../theme';

/**
 * TeamLogo — Renders a team logo using expo-image (supports high-res PNGs and SVGs).
 * Falls back to a coloured circle with the team's short name if image fails to load.
 *
 * Props:
 *  - team: { shortName, logoUrl, primaryColor }
 *  - size: number (diameter in px, default 40)
 *  - style: optional extra View style
 */
const TeamLogo = ({ team, size = 40, style }) => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = getLogoUrl(team);

  // Reset imgError when logoUrl changes so new URLs get a chance to load
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const radius = size / 2;
  const fontSize = size * 0.3;

  if (logoUrl && !imgError) {
    return (
      <Image
        source={{ uri: logoUrl }}
        style={[
          styles.logoImg,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
          style,
        ]}
        onError={() => setImgError(true)}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    );
  }

  // Fallback: coloured circle with initials
  return (
    <View
      style={[
        styles.logoBadge,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: team?.primaryColor || '#334155',
        },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { fontSize }]}>
        {team?.shortName || team?.short_name || '??'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoImg: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ffbcba',
  },
  logoBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default TeamLogo;
