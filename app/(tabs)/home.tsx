import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeworkRow, ScanCard, StudyHeader, ToolCard } from '@/components/StudyComponents';
import { recentHomework } from '@/data/homework';
import { useColors } from '@/hooks/useColors';

export default function HomeTab() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 30 : 0) + 8, paddingBottom: insets.bottom + 104 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <View style={styles.homeHeaderCopy}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>STUDY DESK</Text>
            <Text style={[styles.homeTitle, { color: colors.foreground }]}>Make one problem click.</Text>
            <Text style={[styles.homeSubtitle, { color: colors.mutedForeground }]}>Scan, understand, repeat.</Text>
          </View>
          <View style={[styles.profileBadge, { backgroundColor: colors.ink }]}>
            <Text style={[styles.profileInitials, { color: colors.primaryForeground }]}>KG</Text>
          </View>
        </View>
        <View style={styles.sectionGap} />
        <ScanCard onPress={() => router.push('/scan')} />
        <View style={[styles.progressCard, { backgroundColor: colors.ink }]}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressEyebrow, { color: colors.mint }]}>THIS WEEK</Text>
              <Text style={[styles.progressTitle, { color: colors.primaryForeground }]}>A little practice adds up.</Text>
            </View>
            <View style={[styles.progressBadge, { backgroundColor: colors.softLime }]}>
              <Text style={[styles.progressBadgeText, { color: colors.ink }]}>3 / 5</Text>
            </View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: '#35504D' }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.mint, width: '60%' }]} />
          </View>
          <Text style={[styles.progressMeta, { color: colors.muted }]}>{'Two more short sessions to keep your rhythm.'}</Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push('/scan')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.mint }]}><Ionicons name="camera-outline" size={18} color={colors.primary} /></View>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>Scan a page</Text>
            <Text style={[styles.actionMeta, { color: colors.mutedForeground }]}>Get unstuck fast</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push('/explore')}>
            <View style={[styles.actionIcon, { backgroundColor: colors.lavender }]}><Ionicons name="sparkles-outline" size={18} color={colors.primary} /></View>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>Explore ideas</Text>
            <Text style={[styles.actionMeta, { color: colors.mutedForeground }]}>Learn by topic</Text>
          </Pressable>
        </View>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose a mode</Text>
          </View>
        <View style={styles.toolsGrid}>
          <ToolCard icon="calculator-variant" title="Math Solver" subtitle="Algebra, geometry, more" color={colors.mint} onPress={() => router.push('/scan')} />
          <ToolCard icon="file-document-outline" title="Text & Reading" subtitle="Summaries & explanations" color={colors.lavender} onPress={() => router.push('/scan')} />
          <ToolCard icon="flask-outline" title="Science" subtitle="Step-by-step help" color={colors.blue} onPress={() => router.push('/scan')} />
          <ToolCard icon="book-open-variant" title="History" subtitle="Key points & summaries" color={colors.coral} onPress={() => router.push('/explore')} />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent</Text>
          <Text style={[styles.seeAll, { color: colors.primary }]} onPress={() => router.push('/library')}>See all</Text>
        </View>
        <HomeworkRow {...recentHomework[0]} onPress={() => router.push('/solve')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  homeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  homeHeaderCopy: { flex: 1 },
  eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 6 },
  homeTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.7 },
  homeSubtitle: { fontSize: 11, lineHeight: 15, marginTop: 5 },
  profileBadge: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileInitials: { fontSize: 11, fontWeight: '900', letterSpacing: 0.4 },
  sectionGap: { height: 16 },
  progressCard: { borderRadius: 20, padding: 14, marginTop: 12 },
  progressHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  progressEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  progressTitle: { fontSize: 13, fontWeight: '800', marginTop: 5 },
  progressBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  progressBadgeText: { fontSize: 10, fontWeight: '900' },
  progressTrack: { height: 7, borderRadius: 4, overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressMeta: { fontSize: 9, marginTop: 8 },
  actionRow: { flexDirection: 'row', gap: 9, marginTop: 10 },
  actionCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 10 },
  actionIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionTitle: { fontSize: 11, fontWeight: '800' },
  actionMeta: { fontSize: 9, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 19, marginBottom: 9 },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: -0.1 },
  seeAll: { fontSize: 10, fontWeight: '800' },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});