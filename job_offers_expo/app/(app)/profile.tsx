import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../src/features/auth/store/auth_store';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {user?.role === 'employer' ? '🏢 Employer' : '👤 Candidate'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Row label="Phone"      value={user?.phone ?? 'Not set'} />
        <Row label="Member since" value={user?.created_at ?? '-'} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20, paddingTop: 60 },
  header:    { alignItems: 'center', marginBottom: 24 },

  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#2563EB',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },

  name:  { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  email: { fontSize: 14, color: '#64748B', marginTop: 2, marginBottom: 10 },

  chip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  chipText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 14, color: '#64748B' },
  rowValue: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  logoutBtn: {
    backgroundColor: '#EF4444', paddingVertical: 14,
    borderRadius: 12, alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});