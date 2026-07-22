/**
 * Shared theme tokens — mirrors the website's color palette
 * Website: red-accented, light background with slate text
 */

export const COLORS = {
  // ─── Backgrounds ──────────────────────────────────────────────────
  bgPrimary: '#f8fafc',       // slate-50 — main screen background
  bgCard: '#ffffff',          // white — card backgrounds
  bgCardAlt: '#fef2f2',       // red-50 — tinted card/sidebar
  bgHeader: '#fef2f2',        // red-50 — header areas
  bgInput: '#ffffff',         // white — input fields
  bgDark: '#0f172a',          // slate-950 — dark elements (score boxes, etc.)

  // ─── Red Accent (brand color = #FF4B44) ────────────────────────────
  accentPrimary: '#FF4B44',   // brand red — active tabs, buttons
  accentSecondary: '#ff6b66', // lighter brand red — highlights
  accentLight: '#ffe4e3',     // very light tint — backgrounds
  accentXLight: '#fff2f2',    // ultra-light tint — subtle tints

  // ─── Text ─────────────────────────────────────────────────────────
  textPrimary: '#0f172a',     // slate-950 — main text
  textSecondary: '#475569',   // slate-600 — secondary text
  textMuted: '#94a3b8',       // slate-400 — muted text
  textOnAccent: '#ffffff',    // white — text on red buttons
  textOnDark: '#f1f5f9',      // slate-100 — text on dark backgrounds

  // ─── Borders ──────────────────────────────────────────────────────
  border: '#e2e8f0',          // slate-200 — standard border
  borderAccent: '#ffbcba',    // tinted border for brand red
  borderDark: '#334155',      // slate-700 — dark border

  // ─── Status Colors ────────────────────────────────────────────────
  success: '#10b981',         // emerald-500 — wins / UCL spots
  warning: '#94a3b8',         // grey — draws
  error: '#ef4444',           // red-500 — losses / relegation
  gold: '#e8b923',            // gold — champion highlight

  // ─── Shadow ───────────────────────────────────────────────────────
  shadow: '#000000',
};

// ─── FALLBACK LOGOS — High-res PNG crests (renders reliably on iOS, Android & Web) ────────
export const FALLBACK_LOGOS = {
  'RM':  'https://crests.football-data.org/86.png',
  'BAR': 'https://crests.football-data.org/81.png',
  'ATM': 'https://crests.football-data.org/78.png',
  'GIR': 'https://crests.football-data.org/298.png',
  'ATH': 'https://crests.football-data.org/77.png',
  'VIL': 'https://crests.football-data.org/94.png',
  'RSO': 'https://crests.football-data.org/92.png',
  'BET': 'https://crests.football-data.org/90.png',
  'LPA': 'https://crests.football-data.org/275.png',
  'RAY': 'https://crests.football-data.org/87.png',
  'OSA': 'https://crests.football-data.org/79.png',
  'SEV': 'https://crests.football-data.org/559.png',
  'CEL': 'https://crests.football-data.org/558.png',
  'GET': 'https://crests.football-data.org/82.png',
  'VAL': 'https://crests.football-data.org/95.png',
  'MAL': 'https://crests.football-data.org/89.png',
  'CAD': 'https://crests.football-data.org/264.png',
  'GRA': 'https://crests.football-data.org/84.png',
};

/**
 * Returns the logo URL for a team: uses team.logoUrl first (converting .svg to .png),
 * then FALLBACK_LOGOS by shortName.
 * Returns null if neither is available.
 */
export const getLogoUrl = (team) => {
  if (!team) return null;
  
  if (team.logoUrl && team.logoUrl.trim().length > 0) {
    return team.logoUrl.trim().replace(/\.svg$/i, '.png');
  }
  
  const key = (team.shortName || team.short_name || team.teamShortName || '').toUpperCase();
  return FALLBACK_LOGOS[key] || null;
};
