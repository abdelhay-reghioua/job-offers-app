import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useJobsStore } from '../../src/features/jobs/store/jobs_store';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import { ApplicationsService } from '../../src/features/applications/services/applications_service';

export default function JobDetailsScreen() {
  const router   = useRouter();
  const { id }   = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { currentJob, loading, fetchJob } = useJobsStore();

  const [applied,        setApplied]        = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);

  useEffect(() => {
    if (id) fetchJob(parseInt(id, 10));
  }, [id]);

  // Check applied status every time screen refocuses
  useFocusEffect(
    useCallback(() => {
      if (!id || user?.role !== 'candidate') return;
      (async () => {
        setCheckingApplied(true);
        try {
          const result = await ApplicationsService.hasApplied(parseInt(id, 10));
          setApplied(result);
        } catch { /* ignore */ }
        finally { setCheckingApplied(false); }
      })();
    }, [id, user?.role]),
  );

  if (loading || !currentJob) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const formatSalary = () => {
    if (!currentJob.salary_min && !currentJob.salary_max) return 'Not specified';
    const min = currentJob.salary_min ? parseFloat(currentJob.salary_min).toLocaleString() : '';
    const max = currentJob.salary_max ? parseFloat(currentJob.salary_max).toLocaleString() : '';
    if (min && max) return `${currentJob.currency} ${min} - ${max}`;
    return `${currentJob.currency} ${min || max}`;
  };

  const handleApply = () => {
    if (user?.role !== 'candidate') {
      Alert.alert('Not allowed', 'Only candidates can apply to jobs.');
      return;
    }
    if (applied) return;
    router.push({
      pathname: '/(app)/apply',
      params: {
        jobId:    currentJob.id.toString(),
        jobTitle: currentJob.title,
        company:  currentJob.company,
      },
    });
  };

  // Determine button state
  let btnText = 'Apply Now';
  let btnStyle = styles.applyBtn;
  let disabled = false;

  if (user?.role === 'employer') {
    btnText = 'Employers cannot apply';
    btnStyle = styles.btnDisabled;
    disabled = true;
  } else if (checkingApplied) {
    btnText = 'Checking...';
    disabled = true;
  } else if (applied) {
    btnText = '✓ Already Applied';
    btnStyle = styles.btnApplied;
    disabled = true;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>
              {currentJob.company[0]?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{currentJob.title}</Text>
          <Text style={styles.company}>{currentJob.company}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>📍 {currentJob.location}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentJob.type}</Text>
            </View>
          </View>

          <View style={styles.salaryBox}>
            <Text style={styles.salaryLabel}>💰 Salary</Text>
            <Text style={styles.salary}>{formatSalary()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{currentJob.description}</Text>
        </View>

        {currentJob.requirements ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.sectionText}>{currentJob.requirements}</Text>
          </View>
        ) : null}

        {currentJob.posted_by ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posted by</Text>
            <Text style={styles.sectionText}>
              {currentJob.posted_by.name} • {currentJob.created_at}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={btnStyle}
          onPress={handleApply}
          disabled={disabled}
        >
          <Text style={styles.applyText}>{btnText}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12,
    backgroundColor: '#fff',
  },
  back: { fontSize: 16, color: '#2563EB', fontWeight: '500' },

  scroll: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  logo: {
    width: 72, height: 72, borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  logoText: { color: '#2563EB', fontSize: 28, fontWeight: 'bold' },
  title:    { fontSize: 20, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  company:  { fontSize: 15, color: '#64748B', marginTop: 4, marginBottom: 14 },

  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 14,
  },
  meta: { fontSize: 13, color: '#475569' },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#1D4ED8', textTransform: 'capitalize' },

  salaryBox: {
    width: '100%', backgroundColor: '#F0FDFA',
    padding: 14, borderRadius: 10, alignItems: 'center',
  },
  salaryLabel: { fontSize: 12, color: '#0F766E', fontWeight: '500' },
  salary:      { fontSize: 16, fontWeight: 'bold', color: '#0F766E', marginTop: 2 },

  section: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  sectionText:  { fontSize: 14, color: '#475569', lineHeight: 22 },

  applyBtn: {
    backgroundColor: '#2563EB', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 8,
  },
  btnApplied: {
    backgroundColor: '#10B981', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: {
    backgroundColor: '#94A3B8', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 8,
  },
  applyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});