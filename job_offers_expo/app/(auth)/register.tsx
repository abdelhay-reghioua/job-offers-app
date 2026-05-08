import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store/auth_store';

export default function RegisterScreen() {
  const { register, loading, clearError } = useAuthStore();

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [pwConf,  setPwConf]  = useState('');
  const [role,    setRole]    = useState<'candidate' | 'employer'>('candidate');
  const [showPw,  setShowPw]  = useState(false);

  const handleSubmit = async () => {
    clearError();
    if (!name.trim() || !email.trim() || pw.length < 8) {
      Alert.alert('Invalid', 'Fill all fields. Password min 8 chars.');
      return;
    }
    if (pw !== pwConf) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    const ok = await register({
      name: name.trim(), email: email.trim(),
      password: pw, password_confirmation: pwConf, role,
    });
    if (!ok) {
      Alert.alert('Registration failed', useAuthStore.getState().error ?? 'Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>💼</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Job Offers today</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              value={pw}
              onChangeText={setPw}
              placeholder="Min 8 characters"
              secureTextEntry={!showPw}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              <Text style={styles.eye}>{showPw ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={pwConf}
            onChangeText={setPwConf}
            placeholder="Repeat password"
            secureTextEntry={!showPw}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>I am a...</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'candidate' && styles.roleBtnActive]}
              onPress={() => setRole('candidate')}
            >
              <Text style={[styles.roleText, role === 'candidate' && styles.roleTextActive]}>
                👤 Candidate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'employer' && styles.roleBtnActive]}
              onPress={() => setRole('employer')}
            >
              <Text style={[styles.roleText, role === 'employer' && styles.roleTextActive]}>
                🏢 Employer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            <Text style={styles.linkText}>Sign In</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, paddingTop: 48, paddingBottom: 32 },

  iconBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 16,
  },
  icon: { fontSize: 36 },

  title: {
    fontSize: 26, fontWeight: 'bold',
    color: '#1E293B', textAlign: 'center', marginBottom: 4,
  },
  subtitle: {
    fontSize: 14, color: '#64748B',
    textAlign: 'center', marginBottom: 24,
  },

  field: { marginBottom: 14 },
  label: {
    fontSize: 14, color: '#334155',
    marginBottom: 6, fontWeight: '500',
  },
  input: {
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10,
    paddingRight: 14, backgroundColor: '#fff',
  },
  inputFlex: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  eye: { fontSize: 20 },

  roleRow:       { flexDirection: 'row', gap: 10 },
  roleBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center', backgroundColor: '#fff',
  },
  roleBtnActive:  { borderColor: '#2563EB', backgroundColor: '#EEF2FF' },
  roleText:       { fontSize: 14, color: '#64748B', fontWeight: '500' },
  roleTextActive: { color: '#2563EB', fontWeight: '600' },

  btnPrimary: {
    backgroundColor: '#2563EB',
    paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#64748B', fontSize: 14 },
  link: {},
  linkText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});