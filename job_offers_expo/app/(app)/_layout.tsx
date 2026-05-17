import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuthStore } from '../../src/features/auth/store/auth_store';

export default function AppLayout() {
  const { user } = useAuthStore();
  const isEmployer = user?.role === 'employer';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1, borderTopColor: '#E2E8F0',
          height: 60, paddingBottom: 8, paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Jobs', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💼</Text> }} />
      <Tabs.Screen name="applications" options={{ title: 'Applications', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }} />
      <Tabs.Screen name="create-job" options={{ title: 'Post', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>➕</Text>, href: isEmployer ? undefined : null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
      <Tabs.Screen name="job-details" options={{ href: null }} />
      <Tabs.Screen name="apply" options={{ href: null }} />
      <Tabs.Screen name="my-jobs" options={{ href: null }} />
      <Tabs.Screen name="job-applications" options={{ href: null }} />
    </Tabs>
  );
}
