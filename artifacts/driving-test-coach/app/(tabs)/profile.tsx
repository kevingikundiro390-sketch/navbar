import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudyHeader } from '@/components/StudyComponents';
import { useColors } from '@/hooks/useColors';

export default function ProfileTab() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) + 12, paddingBottom: insets.bottom + 104 }]} showsVerticalScrollIndicator={false}>
        <StudyHeader eyebrow="Your rhythm" title="Profile" subtitle="A little progress is still progress." right={<View style={[styles.avatar, { backgroundColor: colors.softLime }]}><Text style={[styles.avatarText, { color: colors.ink }]}>K</Text></View>} />
        <View style={[styles.progressCard, { backgroundColor: colors.ink }]}>
          <View style={styles.progressTop}><View><Text style={[styles.progressLabel, { color: colors.mint }]}>THIS WEEK</Text><Text style={[styles.progressTitle, { color: colors.primaryForeground }]}>Keep the thread going</Text></View><Feather name="trending-up" size={22} color={colors.mint} /></View>
          <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}><View style={[styles.progressFill, { backgroundColor: colors.mint, width: '68%' }]} /></View>
          <View style={styles.progressMeta}><Text style={[styles.progressSmall, { color: colors.border }]}>4 study sessions</Text><Text style={[styles.progressSmall, { color: colors.border }]}>68% of your goal</Text></View>
        </View>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PREFERENCES</Text>
        <Pressable accessibilityRole="button" onPress={() => undefined} style={[styles.preference, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.preferenceIcon, { backgroundColor: colors.secondary }]}><Feather name="volume-2" size={17} color={colors.primary} /></View><View style={styles.preferenceCopy}><Text style={[styles.preferenceTitle, { color: colors.foreground }]}>Explanation style</Text><Text style={[styles.preferenceText, { color: colors.mutedForeground }]}>Clear and encouraging</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
        <Pressable accessibilityRole="button" onPress={() => undefined} style={[styles.preference, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.preferenceIcon, { backgroundColor: colors.secondary }]}><Feather name="moon" size={17} color={colors.primary} /></View><View style={styles.preferenceCopy}><Text style={[styles.preferenceTitle, { color: colors.foreground }]}>Appearance</Text><Text style={[styles.preferenceText, { color: colors.mutedForeground }]}>Follows your device</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
        <View style={[styles.footerNote, { backgroundColor: colors.paper, borderColor: colors.paperLine }]}><Feather name="heart" size={15} color={colors.primary} /><Text style={[styles.footerText, { color: colors.secondaryForeground }]}>You do not have to know everything before you start.</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  avatar: { width: 43, height: 43, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '800' },
  progressCard: { borderRadius: 23, padding: 18, marginTop: 25 },
  progressTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  progressLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  progressTitle: { fontSize: 19, fontWeight: '800', marginTop: 9 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 24 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  progressSmall: { fontSize: 11 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 29, marginBottom: 11 },
  preference: { minHeight: 70, borderRadius: 17, borderWidth: 1, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 9 },
  preferenceIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  preferenceCopy: { flex: 1 },
  preferenceTitle: { fontSize: 13, fontWeight: '800' },
  preferenceText: { fontSize: 11, marginTop: 4 },
  footerNote: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 17, borderWidth: 1, padding: 13, marginTop: 9 },
  footerText: { flex: 1, fontSize: 11, lineHeight: 16 },
});