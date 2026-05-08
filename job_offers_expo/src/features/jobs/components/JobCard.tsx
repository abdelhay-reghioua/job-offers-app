import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Job } from '../types';

interface Props {
  job:     Job;
  onPress: () => void;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  'full-time':  { bg: '#DCFCE7', text: '#15803D' },
  'part-time':  { bg: '#FEF3C7', text: '#B45309' },
  'contract':   { bg: '#DBEAFE', text: '#1D4ED8' },
  'internship': { bg: '#FCE7F3', text: '#BE185D' },
};

export default function JobCard({ job, onPress }: Props) {
  const color = typeColors[job.type] ?? typeColors['full-time'];

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    const min = job.salary_min ? parseFloat(job.salary_min).toLocaleString() : '';
    const max = job.salary_max ? parseFloat(job.salary_max).toLocaleString() : '';
    if (min && max) return `${job.currency} ${min} - ${max}`;
    return `${job.currency} ${min || max}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            {job.company[0]?.toUpperCase() ?? 'J'}
          </Text>
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
          <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaItem}>📍 {job.location}</Text>
        <View style={[styles.badge, { backgroundColor: color.bg }]}>
          <Text style={[styles.badgeText, { color: color.text }]}>
            {job.type}
          </Text>
        </View>
      </View>

      {formatSalary() && (
        <Text style={styles.salary}>💰 {formatSalary()}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius:    12,
    padding:         16,
    marginBottom:    12,
    borderWidth:     1,
    borderColor:     '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  12,
  },
  logo: {
    width:           44, height: 44, borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent:  'center', alignItems: 'center',
    marginRight:     12,
  },
  logoText: { color: '#2563EB', fontSize: 18, fontWeight: 'bold' },

  titleBox: { flex: 1 },
  title:    { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  company:  { fontSize: 14, color: '#64748B', marginTop: 2 },

  meta: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   4,
  },
  metaItem: { fontSize: 13, color: '#475569' },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },

  salary: { marginTop: 6, fontSize: 13, color: '#0F766E', fontWeight: '500' },
});