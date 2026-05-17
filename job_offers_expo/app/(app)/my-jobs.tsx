import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import { JobsService } from '../../src/features/jobs/services/jobs_service';
import { Job } from '../../src/features/jobs/types';
import JobCard from '../../src/features/jobs/components/JobCard';

export default function MyJobsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const result = await JobsService.myJobs();
      setJobs(result);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyJobs(); }, []);

  if (user?.role !== 'employer') {
    return (
      <View style={styles.guard}>
        <Text style={styles.guardIcon}>🔒</Text>
        <Text style={styles.guardTitle}>Employers Only</Text>
        <Text style={styles.guardSub}>Only employer accounts can view their posted jobs.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Posted Jobs</Text>
        <Text style={styles.subtitle}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMyJobs} />}
          renderItem={({ item }) => (
            <View style={styles.jobRow}>
              <View style={{ flex: 1 }}>
                <JobCard job={item} onPress={() => router.push(`/(app)/job-details?id=${item.id}`)} />
              </View>
              <TouchableOpacity
                style={styles.viewAppsBtn}
                onPress={() => router.push({ pathname: '/(app)/job-applications', params: { id: item.id.toString(), title: item.title } })}
              >
                <Text style={styles.viewAppsIcon}>👥</Text>
                <Text style={styles.viewAppsText}>Applications</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No jobs posted yet</Text>
              <Text style={styles.emptySub}>Tap the Post tab to create one!</Text>
            </View>
          }
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
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 60 },
  jobRow: { marginBottom: 4 },
  viewAppsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', paddingVertical: 10, borderRadius: 10, marginTop: -4, marginBottom: 12, marginHorizontal: 2, borderWidth: 1, borderColor: '#C7D2FE' },
  viewAppsIcon: { fontSize: 16, marginRight: 6 },
  viewAppsText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  guard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  guardIcon: { fontSize: 64, marginBottom: 12 },
  guardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  guardSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  emptySub: { fontSize: 14, color: '#64748B', marginTop: 4 },
});
