import { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApplicationsStore } from '../../src/features/applications/store/applications_store';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import { ApplicationStatus } from '../../src/features/applications/types';

const statusColors: Record<ApplicationStatus, { bg: string; text: string; emoji: string }> = {
  pending:  { bg: '#FEF3C7', text: '#B45309', emoji: '⏳' },
  reviewed: { bg: '#DBEAFE', text: '#1D4ED8', emoji: '👁' },
  accepted: { bg: '#DCFCE7', text: '#15803D', emoji: '✅' },
  rejected: { bg: '#FEE2E2', text: '#B91C1C', emoji: '❌' },
};

export default function MyApplicationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { myApplications, loading, fetchMine } = useApplicationsStore();

  const isEmployer = user?.role === 'employer';

  useEffect(() => {
    fetchMine();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEmployer ? 'Applications' : 'My Applications'}
        </Text>
        <Text style={styles.subtitle}>
          {myApplications.length} application{myApplications.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isEmployer && (
        <TouchableOpacity
          style={styles.employerBtn}
          onPress={() => router.push('/(app)/my-jobs')}
        >
          <Text style={styles.employerBtnText}>
            📝 View applications on your posted jobs
          </Text>
        </TouchableOpacity>
      )}

      {loading && myApplications.length === 0 ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <FlatList
          data={myApplications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchMine} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                {isEmployer ? '📭' : '📋'}
              </Text>
              <Text style={styles.emptyText}>
                {isEmployer ? 'No applications received yet' : 'No applications sent yet'}
              </Text>
              <Text style={styles.emptySub}>
                {isEmployer
                  ? 'Post a job and candidates will apply!'
                  : 'Browse jobs and start applying!'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const color = statusColors[item.status] ?? statusColors.pending;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  item.job
                    ? router.push(`/(app)/job-details?id=${item.job.id}`)
                    : null
                }
              >
                <View style={styles.cardHeader}>
                  <View style={styles.logo}>
                    <Text style={styles.logoText}>
                      {item.job?.company?.[0]?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {item.job?.title ?? 'Job'}
                    </Text>
                    <Text style={styles.jobCompany} numberOfLines={1}>
                      {item.job?.company} • {item.job?.location}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
                    <Text style={[styles.statusText, { color: color.text }]}>
                      {color.emoji} {item.status}
                    </Text>
                  </View>
                  <Text style={styles.date}>{item.created_at?.split(' ')[0]}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  title:    { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  employerBtn: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#EEF2FF', borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: '#C7D2FE',
  },
  employerBtnText: { color: '#2563EB', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  list:   { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 60 },
  card: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  logoText: { color: '#2563EB', fontSize: 18, fontWeight: 'bold' },
  cardInfo:   { flex: 1 },
  jobTitle:   { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  jobCompany: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  date:       { fontSize: 12, color: '#94A3B8' },
  empty:    { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  emptySub:  { fontSize: 14, color: '#64748B', marginTop: 4 },
});
