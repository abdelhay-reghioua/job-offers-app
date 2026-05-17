import { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import { useApplicationsStore } from '../../src/features/applications/store/applications_store';
import { ApplicationStatus } from '../../src/features/applications/types';

const statusColors: Record<ApplicationStatus, { bg: string; text: string; emoji: string }> = {
  pending:  { bg: '#FEF3C7', text: '#B45309', emoji: '⏳' },
  reviewed: { bg: '#DBEAFE', text: '#1D4ED8', emoji: '👁' },
  accepted: { bg: '#DCFCE7', text: '#15803D', emoji: '✅' },
  rejected: { bg: '#FEE2E2', text: '#B91C1C', emoji: '❌' },
};

export default function JobApplicationsScreen() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { user } = useAuthStore();
  const { jobApplications, loading, fetchForJob } = useApplicationsStore();

  useEffect(() => {
    if (id) fetchForJob(parseInt(id, 10));
  }, [id]);

  if (user?.role !== 'employer') {
    return (
      <View style={styles.guard}>
        <Text style={styles.guardIcon}>🔒</Text>
        <Text style={styles.guardTitle}>Employers Only</Text>
        <Text style={styles.guardSub}>Only employer accounts can view job applications.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Applications</Text>
        {title && <Text style={styles.subtitle}>{title}</Text>}
        <Text style={styles.count}>
          {jobApplications.length} application{jobApplications.length !== 1 ? 's' : ''} received
        </Text>
      </View>

      {loading && jobApplications.length === 0 ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <FlatList
          data={jobApplications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchForJob(parseInt(id!, 10))} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No applications yet</Text>
              <Text style={styles.emptySub}>Candidates will start applying soon!</Text>
            </View>
          }
          renderItem={({ item }) => {
            const color = statusColors[item.status] ?? statusColors.pending;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.applicant?.name?.[0]?.toUpperCase() ?? '?'}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.applicantName} numberOfLines={1}>{item.applicant?.name ?? 'Unknown Applicant'}</Text>
                    <Text style={styles.applicantEmail} numberOfLines={1}>{item.applicant?.email ?? ''}</Text>
                  </View>
                </View>
                {item.cover_letter ? (
                  <View style={styles.coverSection}>
                    <Text style={styles.coverLabel}>Cover Letter</Text>
                    <Text style={styles.coverText} numberOfLines={3}>{item.cover_letter}</Text>
                  </View>
                ) : null}
                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: color.bg }]}>
                    <Text style={[styles.statusText, { color: color.text }]}>{color.emoji} {item.status}</Text>
                  </View>
                  <Text style={styles.date}>{item.created_at?.split(' ')[0] ?? ''}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: '#fff' },
  back: { fontSize: 16, color: '#2563EB', fontWeight: '500', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  count: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 60 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#2563EB', fontSize: 18, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  applicantName: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  applicantEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },
  coverSection: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 12, marginBottom: 10 },
  coverLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' },
  coverText: { fontSize: 13, color: '#475569', lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  date: { fontSize: 12, color: '#94A3B8' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  emptySub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  guard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  guardIcon: { fontSize: 64, marginBottom: 12 },
  guardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  guardSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
});
