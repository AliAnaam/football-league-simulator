// ─── LALIGA SIM — Mobile API Service ─────────────────────────────────────────
// Mirrors the existing frontend/src/api.js for React Native.
// Points to the production Render deployment by default.
// For local dev, switch API_BASE to http://<your-lan-ip>:5000/api

const API_BASE = 'https://football-simulator-api-72l4.onrender.com/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errMessage = `API error: ${response.status}`;
      try {
        const data = await response.json();
        if (data && data.message) errMessage = data.message;
      } catch (e) {
        // ignore parse errors
      }
      throw new Error(errMessage);
    }

    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    if (error.message.includes('API error')) {
      throw error;
    }
    throw new Error('Network error: Unable to connect to the server. Please check your connection.');
  }
}

// ─── Teams ───────────────────────────────────────────────────────────────────
export const getTeams = () => request('/teams');
export const getTeamById = (id) => request(`/teams/${id}`);
export const createTeam = (teamData) =>
  request('/teams', { method: 'POST', body: JSON.stringify(teamData) });
export const updateTeam = (id, teamData) =>
  request(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(teamData) });
export const deleteTeam = (id) =>
  request(`/teams/${id}`, { method: 'DELETE' });

// ─── Fixtures ────────────────────────────────────────────────────────────────
export const getFixtures = () => request('/fixtures');
export const getMatchesByWeek = (week) => request(`/fixtures/week/${week}`);
export const getCurrentWeek = () => request('/fixtures/current-week');
export const getMaxWeek = () => request('/fixtures/max-week');

// ─── Standings ───────────────────────────────────────────────────────────────
export const getStandings = () => request('/standings');
export const getScorers = () => request('/standings/scorers');

// ─── Simulation ──────────────────────────────────────────────────────────────
export const simulateWeek = (week) =>
  request(`/simulation/week/${week}`, { method: 'POST' });

export const simulateRemaining = () =>
  request('/simulation/remaining', { method: 'POST' });

// ─── Season Management ───────────────────────────────────────────────────────
export const resetSeason = () =>
  request('/fixtures/reset', { method: 'POST' });

export const generateFixtures = () =>
  request('/fixtures/generate', { method: 'POST' });

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (username, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
