import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store/auth_store';
import { useJobsStore } from '../../src/features/jobs/store/jobs_store';
import { JobType } from '../../src/features/jobs/types';

const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship'];

export default function CreateJobScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createJob, loading, fetchJobs } = useJobsStore();

  const [title, setTitle]         = useState('');
  const [company, setCompany]     = useState('');
  const [location, setLocation]   = useState('');
  const [type, setType]           = useState<JobType>('full-time');
  const [description, setDesc]    = useState('');
  const [requirements, setReqs]   = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  if (user?.role !== 'employer') {
    return (
      <View style={styles.guard}>
        <Text style={styles.guardIcon}>🔒</Text>
        <Text style={styles.guardTitle}>Employers Only</Text>
        <Text style={styles.guardSub}>
          Only employer accounts can post jobs.{'\n'}
          You're signed in as a candidate.
        </Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim() || !company.trim() || !location.trim() || description.length < 20) {
      Alert.alert('Invalid', 'Fill all required fields. Description min 20 chars.');
      return;
    }

    const ok = await createJob({
      title:        title.trim(),
      company:      company.trim(),
      location:     location.trim(),
      type,
      description:  description.trim(),
      requirements: requirements.trim() || undefined,
      salary_min:   salaryMin ? parseFloat(salaryMin) : undefined,
      salary_max:   salaryMax ? parseFloat(salaryMax) : undefined,
    });

    if (ok) {
      Alert.alert('Success! 🎉', 'Your job has been posted.', [
        {
          text: 'OK',
          onPress: async () => {
            // reset
            setTitle(''); setCompany(''); setLocation('');
            setDesc(''); setReqs(''); setSalaryMin(''); setSalaryMax('');
            await fetchJobs();
            router.push('/(app)/home');
          },
        },
      ]);
    } else {
      Alert.alert('Failed', useJobsStore.getState().error ?? 'Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post a Job</Text>
        <Text style={styles.subtitle}>Reach thousands of candidates</Text>

        <Field label="Job Title *" value={title} onChangeText={setTitle}
               placeholder="e.g. Senior Flutter Developer" />
        <Field label="Company *" value={company} onChangeText={setCompany}
               placeholder="e.g. TechCorp Inc." />
        <Field label="Location *" value={location} onChangeText={setLocation}
               placeholder="e.g. Remote / New York, NY" />

        <Text style={styles.label}>Job Type *</Text>
        <View style={styles.typeGrid}>
          {jobTypes.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field
          label="Description * (min 20 chars)"
          value={description}
          onChangeText={setDesc}
          placeholder="Describe the role, responsibilities..."
          multiline
          numberOfLines={5}
        />

        <Field
          label="Requirements"
          value={requirements}
          onChangeText={setReqs}
          placeholder="Skills, experience, qualifications..."
          multiline
          numberOfLines={4}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Field label="Min Salary" value={salaryMin} onChangeText={setSalaryMin}
                   placeholder="0" keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Field label="Max Salary" value={salaryMax} onChangeText={setSalaryMax}
                   placeholder="0" keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.btnText}>Publish Job</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Reusable Field ──────────────────────────────────────────
function Field({
  label, value, onChangeText, placeholder,
  multiline, numberOfLines, keyboardType,
}: {
  label:           string;
  value:           string;
  onChangeText:    (v: string) => void;
  placeholder?:    string;
  multiline?:      boolean;
  numberOfLines?:  number;
  keyboardType?:   'default' | 'numeric' | 'email-address';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  title:    { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },

  field: { marginBottom: 14 },
  label: { fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  inputMulti: { minHeight: 110 },

  typeGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, marginBottom: 14,
  },
  typeBtn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  typeBtnActive:  { borderColor: '#2563EB', backgroundColor: '#EEF2FF' },
  typeText:       { fontSize: 13, color: '#64748B', textTransform: 'capitalize' },
  typeTextActive: { color: '#2563EB', fontWeight: '600' },

  row:  { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },

  btn: {
    backgroundColor: '#2563EB', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 12,
  },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },

  guard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  guardIcon:  { fontSize: 64, marginBottom: 12 },
  guardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  guardSub:   { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
});