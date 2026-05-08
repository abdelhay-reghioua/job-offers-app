import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApplicationsStore } from '../../src/features/applications/store/applications_store';

export default function ApplyScreen() {
  const router = useRouter();
  const { jobId, jobTitle, company } =
    useLocalSearchParams<{ jobId: string; jobTitle?: string; company?: string }>();

  const { apply, loading } = useApplicationsStore();

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl,   setResumeUrl]   = useState('');

  const handleSubmit = async () => {
    if (!jobId) return;

    const ok = await apply({
      job_offer_id: parseInt(jobId, 10),
      cover_letter: coverLetter.trim() || undefined,
      resume_url:   resumeUrl.trim()   || undefined,
    });

    if (ok) {
      Alert.alert('Submitted! 🎉', 'Your application has been sent.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(
        'Failed',
        useApplicationsStore.getState().error ?? 'Try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Apply for Position</Text>
        {jobTitle && (
          <Text style={styles.subtitle}>
            {jobTitle} {company ? `@ ${company}` : ''}
          </Text>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Cover Letter</Text>
          <Text style={styles.hint}>
            Tell the employer why you're a great fit
          </Text>
          <TextInput
            style={[styles.input, styles.multi]}
            value={coverLetter}
            onChangeText={setCoverLetter}
            placeholder="Hi, I'm excited to apply because..."
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Resume URL</Text>
          <Text style={styles.hint}>
            Link to your CV (Google Drive, Dropbox, LinkedIn...)
          </Text>
          <TextInput
            style={styles.input}
            value={resumeUrl}
            onChangeText={setResumeUrl}
            placeholder="https://..."
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.btnText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12,
    backgroundColor: '#fff',
  },
  back: { fontSize: 16, color: '#2563EB', fontWeight: '500' },

  container: { padding: 20 },

  title:    { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },

  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#334155', fontWeight: '600', marginBottom: 4 },
  hint:  { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  multi: { minHeight: 160 },

  btn: {
    backgroundColor: '#2563EB', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 12,
  },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
});