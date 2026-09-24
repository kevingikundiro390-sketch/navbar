import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudyHeader } from '@/components/StudyComponents';
import { useColors } from '@/hooks/useColors';

const topics = [
  { icon: 'function-variant' as const, title: 'Algebra basics', text: 'Make equations feel less mysterious.', colorKey: 'mint' as const },
  { icon: 'flask-outline' as const, title: 'Science lab', text: 'Connect the words to the why.', colorKey: 'blue' as const },
  { icon: 'book-open-variant' as const, title: 'Reading room', text: 'Find the main idea with confidence.', colorKey: 'lavender' as const },
];

export default function ExploreTab() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) + 12, paddingBottom: insets.bottom + 104 }]} showsVerticalScrollIndicator={false}>
        <StudyHeader eyebrow="Curiosity corner" title="Explore" subtitle="Short explainers for the moments when a worksheet is not enough." />
        <View style={[styles.feature, { backgroundColor: colors.ink }]}>
          <View style={[styles.featureDot, { backgroundColor: colors.mint }]} />
          <Text style={[styles.featureEyebrow, { color: colors.mint }]}>TODAY'S MINI LESSON</Text>
          <Text style={[styles.featureTitle, { color: colors.primaryForeground }]}>How to read an equation</Text>
          <Text style={[styles.featureText, { color: colors.border }]}>An equals sign is a balance, not a finish line. Whatever you do to one side, do to the other.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/scan')} style={({ pressed }) => [styles.featureButton, { backgroundColor: colors.mint, opacity: pressed ? 0.76 : 1 }]}><Text style={[styles.featureButtonText, { color: colors.ink }]}>Try it with a problem</Text><Feather name="arrow-up-right" size={16} color={colors.ink} /></Pressable>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse by feeling</Text>
        {topics.map((topic) => <Pressable key={topic.title} onPress={() => router.push('/scan')} accessibilityRole="button" style={({ pressed }) => [styles.topicRow, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}><View style={[styles.topicIcon, { backgroundColor: colors[topic.colorKey] }]}><MaterialCommunityIcons name={topic.icon} size={21} color={colors.ink} /></View><View style={styles.topicCopy}><Text style={[styles.topicTitle, { color: colors.foreground }]}>{topic.title}</Text><Text style={[styles.topicText, { color: colors.mutedForeground }]}>{topic.text}</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  feature: { borderRadius: 24, padding: 20, minHeight: 253, marginTop: 25, overflow: 'hidden', position: 'relative' },
  featureDot: { position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -42, top: -48, opacity: 0.55 },
  featureEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '800' },
  featureTitle: { fontSize: 23, lineHeight: 28, fontWeight: '800', maxWidth: 230, marginTop: 30 },
  featureText: { fontSize: 12, lineHeight: 18, maxWidth: 285, marginTop: 10 },
  featureButton: { alignSelf: 'flex-start', borderRadius: 14, paddingHorizontal: 13, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18 },
  featureButtonText: { fontSize: 12, fontWeight: '800' },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 28, marginBottom: 12 },
  topicRow: { minHeight: 76, borderRadius: 18, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  topicIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  topicCopy: { flex: 1 },
  topicTitle: { fontSize: 14, fontWeight: '800' },
  topicText: { fontSize: 11, lineHeight: 15, marginTop: 3 },
});
