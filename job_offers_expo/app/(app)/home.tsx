import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useJobsStore } from '../../src/features/jobs/store/jobs_store';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import JobCard from '../../src/features/jobs/components/JobCard';

export default function JobsListScreen() {
  const router   = useRouter();
  const { jobs, loading, fetchJobs } = useJobsStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = () => fetchJobs({ search: search.trim() || undefined });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Find your next opportunity</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search jobs, companies..."
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading && jobs.length === 0 ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => fetchJobs()} />
          }
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => router.push(`/(app)/job-details?id=${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💼</Text>
              <Text style={styles.emptyText}>No jobs yet</Text>
              <Text style={styles.emptySub}>Be the first to post one!</Text>
            </View>
          }
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
  hello:    { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchIcon:  { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },

  list:   { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 60 },

  empty:    { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  emptySub:  { fontSize: 14, color: '#64748B', marginTop: 4 },
});