import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeworkRow, StudyHeader } from '@/components/StudyComponents';
import { recentHomework } from '@/data/homework';
import { useColors } from '@/hooks/useColors';

export default function LibraryTab() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) + 12, paddingBottom: insets.bottom + 104 }]} showsVerticalScrollIndicator={false}>
        <StudyHeader eyebrow="Your saved work" title="Library" subtitle="A quiet place for the pages you want to revisit." right={<View style={[styles.countBadge, { backgroundColor: colors.accent }]}><Text style={[styles.countText, { color: colors.accentForeground }]}>03</Text></View>} />
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={17} color={colors.mutedForeground} /><Text style={[styles.searchText, { color: colors.mutedForeground }]}>Search your homework</Text></View>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ALL HOMEWORK</Text>
        {recentHomework.map((item) => <View key={item.id} style={styles.rowSpace}><HomeworkRow {...item} onPress={() => router.push('/solve')} /></View>)}
        <View style={[styles.emptyHint, { backgroundColor: colors.paper, borderColor: colors.paperLine }]}><Feather name="bookmark" size={17} color={colors.primary} /><Text style={[styles.emptyText, { color: colors.secondaryForeground }]}>Saved pages stay here, ready when you need a refresher.</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  countBadge: { minWidth: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 13, fontWeight: '800' },
  search: { height: 48, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, marginTop: 25 },
  searchText: { fontSize: 13 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 28, marginBottom: 11 },
  rowSpace: { marginBottom: 10 },
  emptyHint: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 1, padding: 13, marginTop: 6 },
  emptyText: { flex: 1, fontSize: 11, lineHeight: 16 },
});
