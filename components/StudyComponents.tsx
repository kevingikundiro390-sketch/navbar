import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

type StudyHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function StudyHeader({ eyebrow, title, subtitle, right }: StudyHeaderProps) {
  const colors = useColors();
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerCopy}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function IconButton({ name, onPress, accessibilityLabel, filled = false }: { name: keyof typeof Feather.glyphMap; onPress: () => void; accessibilityLabel: string; filled?: boolean }) {
  const colors = useColors();
  return (
    <Pressable
      testID={`icon-${name}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: filled ? colors.primary : colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}
    >
      <Feather name={name} size={19} color={filled ? colors.primaryForeground : colors.ink} />
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress, icon = 'arrow-up-right', compact = false }: { label: string; onPress: () => void; icon?: keyof typeof Feather.glyphMap; compact?: boolean }) {
  const colors = useColors();
  return (
    <Pressable
      testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, compact && styles.primaryButtonCompact, { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 }]}
    >
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{label}</Text>
      <Feather name={icon} size={17} color={colors.primaryForeground} />
    </Pressable>
  );
}

export function ScanCard({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.scanCard, { backgroundColor: colors.secondary, borderColor: colors.border, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
      <View style={[styles.scanOrb, { backgroundColor: colors.primary }]}>
        <Ionicons name="camera-outline" size={34} color={colors.primaryForeground} />
      </View>
      <View style={styles.scanCopy}>
        <Text style={[styles.scanTitle, { color: colors.foreground }]}>Scan & Solve</Text>
        <Text style={[styles.scanSubtitle, { color: colors.secondaryForeground }]}>Take a photo of your paper and get step-by-step answers.</Text>
        <View style={[styles.scanActionRow, { backgroundColor: colors.primary }]}>
          <Text style={[styles.scanAction, { color: colors.primaryForeground }]}>Scan Now</Text>
          <Feather name="arrow-right" size={14} color={colors.primaryForeground} />
        </View>
      </View>
      <View style={[styles.scanSpark, { backgroundColor: colors.softLime }]} />
    </Pressable>
  );
}

export function ToolCard({ icon, title, subtitle, color, onPress }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; subtitle: string; color: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.toolCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}>
      <View style={[styles.toolIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={22} color={colors.ink} />
      </View>
      <Text style={[styles.toolTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.toolSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </Pressable>
  );
}

export function PaperPreview({ imageUri, compact = false }: { imageUri?: string; compact?: boolean }) {
  const colors = useColors();
  if (imageUri) {
    return <Image source={{ uri: imageUri }} resizeMode="cover" style={[styles.paperPreview, compact ? styles.paperCompact : styles.paperLarge]} />;
  }
  return (
    <View style={[styles.paperPreview, compact ? styles.paperCompact : styles.paperLarge, { backgroundColor: colors.paper, borderColor: colors.paperLine }]}>
      <Text style={[styles.paperKicker, { color: colors.mutedForeground }]}>ALGEBRA • PRACTICE</Text>
      <Text style={[styles.paperHeading, { color: colors.ink }]}>Solve for x</Text>
      <Text style={[styles.paperEquation, { color: colors.ink }]}>1.  2x + 5 = 13</Text>
      <View style={[styles.paperRule, { backgroundColor: colors.paperLine }]} />
      <Text style={[styles.paperEquation, { color: colors.ink }]}>2.  3(x + 2) − 4 = 14</Text>
      {!compact ? <Text style={[styles.paperEquation, { color: colors.ink }]}>3.  (x + 1)² = 16</Text> : null}
      <View style={[styles.paperAnswer, { backgroundColor: colors.mint }]}>
        <Text style={[styles.paperAnswerText, { color: colors.ink }]}>x = 4</Text>
      </View>
      <View style={[styles.paperLineShort, { backgroundColor: colors.paperLine }]} />
    </View>
  );
}

export function HomeworkRow({ title, subject, time, problems, colorKey, onPress }: { title: string; subject: string; time: string; problems: string; colorKey: 'mint' | 'lavender' | 'blue'; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.homeworkRow, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}>
      <View style={[styles.rowThumb, { backgroundColor: colors.paper, borderColor: colors.paperLine }]}>
        <Text style={[styles.thumbEquation, { color: colors.ink }]}>2x + 5 = 13</Text>
        <View style={[styles.thumbRule, { backgroundColor: colors.paperLine }]} />
        <Text style={[styles.thumbAnswer, { color: colors.ink }]}>x = 4</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.rowMeta, { color: colors.mutedForeground }]}>{problems}  •  {subject}  •  {time}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export function AnswerCard({ question, answer, steps, index }: { question: string; answer: string; steps: string[]; index: number }) {
  const colors = useColors();
  return (
    <View style={[styles.answerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.answerTop}>
        <View style={styles.numberBadge}><Text style={[styles.numberText, { color: colors.foreground }]}>{index}.</Text></View>
        <Text style={[styles.questionText, { color: colors.foreground }]}>{question}</Text>
        <Feather name="chevron-up" size={16} color={colors.mutedForeground} />
      </View>
      <View style={[styles.answerPill, { backgroundColor: colors.accent }]}><Text style={[styles.answerText, { color: colors.accentForeground }]}>{answer}</Text></View>
      <View style={[styles.stepsBox, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.stepsLabel, { color: colors.primary }]}>Steps:</Text>
        {steps.map((step, stepIndex) => (
          <View key={`${question}-${stepIndex}`} style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: colors.mutedForeground }]}>{stepIndex + 1}</Text>
            <Text style={[styles.stepText, { color: colors.secondaryForeground }]}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.7, textTransform: 'uppercase', marginBottom: 7 },
  headerTitle: { fontSize: 31, fontWeight: '800', letterSpacing: -1.1 },
  headerSubtitle: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  primaryButton: { minHeight: 52, paddingHorizontal: 19, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonCompact: { minHeight: 45, borderRadius: 15 },
  primaryButtonText: { fontSize: 15, fontWeight: '800' },
  scanCard: { minHeight: 132, borderRadius: 20, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  scanOrb: { width: 62, height: 62, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  scanCopy: { flex: 1, zIndex: 2 },
  scanTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.35 },
  scanSubtitle: { fontSize: 11, lineHeight: 15, marginTop: 4, maxWidth: 190 },
  scanActionRow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 9, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  scanAction: { fontSize: 11, fontWeight: '800' },
  scanSpark: { width: 82, height: 82, borderRadius: 41, position: 'absolute', right: -31, top: -28, opacity: 0.55 },
  toolCard: { width: '48.2%', minHeight: 96, borderRadius: 16, borderWidth: 1, padding: 11, marginBottom: 10 },
  toolIcon: { width: 31, height: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  toolTitle: { fontSize: 11, fontWeight: '800' },
  toolSubtitle: { fontSize: 9, lineHeight: 12, marginTop: 2 },
  paperPreview: { borderRadius: 13, borderWidth: 1, overflow: 'hidden', padding: 15, justifyContent: 'center' },
  paperCompact: { width: 67, height: 72, padding: 7 },
  paperLarge: { width: '100%', minHeight: 190, padding: 21 },
  paperKicker: { fontSize: 7, fontWeight: '800', letterSpacing: 1.1, marginBottom: 12 },
  paperHeading: { fontSize: 17, fontWeight: '800', marginBottom: 13 },
  paperEquation: { fontSize: 12, fontWeight: '600', marginBottom: 11, fontStyle: 'italic' },
  paperRule: { height: 1, width: '70%', marginBottom: 12, opacity: 0.7 },
  paperAnswer: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginTop: 3 },
  paperAnswerText: { fontSize: 12, fontWeight: '800' },
  paperLineShort: { width: '42%', height: 1, marginTop: 15, opacity: 0.8 },
  homeworkRow: { minHeight: 55, borderRadius: 10, borderWidth: 1, padding: 7, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rowThumb: { width: 43, height: 40, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  thumbEquation: { fontSize: 5, fontWeight: '700' },
  thumbRule: { height: 1, width: '75%', marginVertical: 3 },
  thumbAnswer: { fontSize: 6, fontWeight: '800' },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 12, fontWeight: '800' },
  rowMeta: { fontSize: 9, marginTop: 3 },
  answerCard: { borderRadius: 12, borderWidth: 1, padding: 9, marginBottom: 8 },
  answerTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numberBadge: { width: 19, alignItems: 'flex-start', justifyContent: 'center' },
  numberText: { fontSize: 11, fontWeight: '700' },
  questionText: { flex: 1, fontSize: 11, fontWeight: '700' },
  answerPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9, marginTop: 7, marginLeft: 25 },
  answerText: { fontSize: 11, fontWeight: '800' },
  stepsBox: { marginTop: 7, marginLeft: 25, padding: 7, borderRadius: 8 },
  stepsLabel: { fontSize: 10, fontWeight: '800', marginBottom: 4 },
  stepRow: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  stepNumber: { width: 11, fontSize: 9, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 9, lineHeight: 12 },
});
