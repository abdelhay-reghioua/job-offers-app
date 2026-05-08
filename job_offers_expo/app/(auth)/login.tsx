import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store/auth_store';

export default function LoginScreen() {
  const { login, loading, error, clearError } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);

  const handleSubmit = async () => {
    clearError();
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    const ok = await login({ email: email.trim(), password });
    if (!ok) {
      Alert.alert('Login failed', useAuthStore.getState().error ?? 'Try again.');
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

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

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
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPw}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}>
              <Text style={styles.eye}>{showPw ? '🙈' : '👁'}</Text>
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
            : <Text style={styles.btnText}>Sign In</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" style={styles.link}>
            <Text style={styles.linkText}>Register</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, paddingTop: 72 },

  iconBox: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 24,
  },
  icon: { fontSize: 44 },

  title: {
    fontSize: 28, fontWeight: 'bold',
    color: '#1E293B', textAlign: 'center', marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: '#64748B',
    textAlign: 'center', marginBottom: 32,
  },

  field: { marginBottom: 16 },
  label: {
    fontSize: 14, color: '#334155',
    marginBottom: 6, fontWeight: '500',
  },
  input: {
    borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10,
    paddingRight: 14, backgroundColor: '#fff',
  },
  inputFlex: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
  },
  eye: { fontSize: 20 },

  btnPrimary: {
    backgroundColor: '#2563EB',
    paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: { color: '#64748B', fontSize: 14 },
  link:       { marginLeft: 0 },
  linkText:   { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});