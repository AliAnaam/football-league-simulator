import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { COLORS } from '../theme';

/**
 * TeamFormModal — Reusable Modal for Creating or Editing a Team.
 *
 * Props:
 *  - visible: boolean
 *  - team: team object if editing, null if creating
 *  - onClose: callback function
 *  - onSubmit: async callback (teamData) => Promise
 */
const TeamFormModal = ({ visible, team, onClose, onSubmit }) => {
  const isEditing = !!team;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [stadium, setStadium] = useState('');
  const [manager, setManager] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [power, setPower] = useState('75');
  const [capacity, setCapacity] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      if (team) {
        setName(team.name || '');
        setShortName(team.shortName || '');
        setStadium(team.stadium || '');
        setManager(team.manager || '');
        setFoundingYear(team.foundingYear ? String(team.foundingYear) : '');
        setPower(team.power ? String(team.power) : '75');
        setCapacity(team.capacity || '');
        setLogoUrl(team.logoUrl || '');
      } else {
        setName('');
        setShortName('');
        setStadium('');
        setManager('');
        setFoundingYear('1900');
        setPower('75');
        setCapacity('50,000');
        setLogoUrl('');
      }
      setError(null);
    }
  }, [visible, team]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    if (!shortName.trim()) {
      setError('Short code (e.g. RM) is required');
      return;
    }

    const payload = {
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      stadium: stadium.trim() || 'Main Stadium',
      manager: manager.trim() || 'Head Coach',
      foundingYear: parseInt(foundingYear, 10) || 1900,
      power: Math.min(99, Math.max(40, parseInt(power, 10) || 75)),
      capacity: capacity.trim() || '40,000',
      primaryColor: team?.primaryColor || '#FF4B44',
      logoUrl: logoUrl.trim() || null,
    };

    setSaving(true);
    setError(null);
    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Modal Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Team' : 'Add New Team'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Team Name */}
            <Text style={styles.label}>Team Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Real Madrid"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Short Name & Power */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Short Code * (2-4 letters)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. RM"
                  placeholderTextColor={COLORS.textMuted}
                  value={shortName}
                  onChangeText={(val) => setShortName(val.toUpperCase())}
                  maxLength={4}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Power Rating (40-99)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="75"
                  placeholderTextColor={COLORS.textMuted}
                  value={power}
                  onChangeText={setPower}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Stadium & Capacity */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Stadium</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Santiago Bernabéu"
                  placeholderTextColor={COLORS.textMuted}
                  value={stadium}
                  onChangeText={setStadium}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Capacity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="85,000"
                  placeholderTextColor={COLORS.textMuted}
                  value={capacity}
                  onChangeText={setCapacity}
                />
              </View>
            </View>

            {/* Manager & Founding Year */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Manager</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Carlo Ancelotti"
                  placeholderTextColor={COLORS.textMuted}
                  value={manager}
                  onChangeText={setManager}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Founding Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1902"
                  placeholderTextColor={COLORS.textMuted}
                  value={foundingYear}
                  onChangeText={setFoundingYear}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Logo URL */}
            <Text style={styles.label}>Logo Image URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/logo.png"
              placeholderTextColor={COLORS.textMuted}
              value={logoUrl}
              onChangeText={setLogoUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isEditing ? 'Save Changes' : 'Create Team'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    maxHeight: 400,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.bgPrimary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.accentPrimary,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default TeamFormModal;
