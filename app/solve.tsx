import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, LayoutChangeEvent, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { AnswerCard, IconButton, PaperPreview } from '@/components/StudyComponents';
import { solvedProblems } from '@/data/homework';
import { useColors } from '@/hooks/useColors';
import { getLatestSolution } from '@/data/solutionSession';

export default function SolveScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const imageUri = typeof uri === 'string' ? uri : undefined;
  const session = getLatestSolution();
  const [showOriginal, setShowOriginal] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const problems = session?.problems ?? solvedProblems.map((problem, index) => ({
    ...problem,
    placement: {
      x: 0.56,
      y: [0.18, 0.45, 0.72][index] ?? 0.72,
      width: 0.38,
      rotation: [-2, 1, -1][index] ?? 0,
    },
  }));
  const hasSolvedResults = Boolean(session && session.status === 'solved' && problems.length > 0);
  const imageRect = (() => {
    const sourceWidth = session?.imageWidth;
    const sourceHeight = session?.imageHeight;
    if (!previewSize.width || !previewSize.height || !sourceWidth || !sourceHeight) {
      return { left: 0, top: 0, width: previewSize.width, height: previewSize.height };
    }
    const scale = Math.min(previewSize.width / sourceWidth, previewSize.height / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return {
      left: (previewSize.width - width) / 2,
      top: (previewSize.height - height) / 2,
      width,
      height,
    };
  })();

  const onPreviewLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewSize({ width, height });
  };

  const renderHandwrittenLine = (step: string) => {
    const separator = step.lastIndexOf(':');
    const suffix = separator >= 0 ? step.slice(separator + 1).trim() : '';
    return suffix.length > 1 && /[=+\-×÷√²]/.test(suffix) ? suffix : step;
  };

  const renderSolutionOverlay = (problem: (typeof problems)[number], compact = false) => {
    const displaySteps = problem.steps
      .map(renderHandwrittenLine)
      .filter((step, index, allSteps) => step !== problem.answer || allSteps.indexOf(step) !== index);

    return (
      <View
        key={`solution-${problem.id}`}
        style={[
          styles.handwrittenBlock,
          {
            left: imageRect.left + problem.placement.x * imageRect.width,
            top: imageRect.top + problem.placement.y * imageRect.height,
            width: problem.placement.width * imageRect.width,
            transform: [{ rotate: `${problem.placement.rotation}deg` }],
          },
        ]}
      >
        {displaySteps.map((step, stepIndex) => (
          <Text key={`${problem.id}-step-${stepIndex}`} style={[styles.handwrittenWork, compact && styles.compactHandwrittenWork]}>
            {step}
          </Text>
        ))}
        <View style={styles.finalAnswerBox}>
          <Text style={[styles.handwrittenFinal, compact && styles.compactHandwrittenFinal]}>{problem.answer}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 26 : 0) + 6, paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <IconButton name="arrow-left" accessibilityLabel="Go back" onPress={() => router.back()} />
          <View style={styles.topSpacer} />
          <IconButton name="more-horizontal" accessibilityLabel="More options" onPress={() => undefined} />
        </View>
        <View style={[styles.solvedBanner, { backgroundColor: hasSolvedResults ? colors.secondary : colors.muted }]}>
          <View style={[styles.checkCircle, { backgroundColor: hasSolvedResults ? colors.success : colors.warning }]}><Feather name={hasSolvedResults ? 'check' : 'info'} size={15} color={colors.primaryForeground} /></View>
          <View style={styles.bannerCopy}><Text style={[styles.bannerTitle, { color: colors.foreground }]}>{hasSolvedResults ? 'Solved! Here are your answers.' : 'This page needs a clearer or supported problem.'}</Text></View>
        </View>
        {session?.imageUri ? (
          <View style={[styles.solutionPreview, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.previewRow}>
              <View style={styles.solutionThumb} onLayout={onPreviewLayout}>
                <Image source={{ uri: session.imageUri }} resizeMode="cover" style={styles.solutionImage} />
                {hasSolvedResults && !showOriginal ? (
                  <View style={[styles.handwritingLayer, { pointerEvents: 'none' }]}>
                    {problems.map((problem) => renderSolutionOverlay(problem, true))}
                  </View>
                ) : null}
              </View>
              <View style={styles.previewCopy}>
                <Text style={[styles.previewTitle, { color: colors.foreground }]}>{session?.title || 'Math Homework'}</Text>
                <Text style={[styles.previewMeta, { color: colors.mutedForeground }]}>{hasSolvedResults ? `${problems.length} problem${problems.length === 1 ? '' : 's'}  •  Solved just now` : 'Original scan  •  Nothing guessed'}</Text>
                {hasSolvedResults ? (
                  <View style={[styles.toggle, styles.compactToggle, { backgroundColor: colors.muted }]}>
                    <Pressable accessibilityRole="button" accessibilityLabel="Show original scan" onPress={() => setShowOriginal(true)} style={[styles.toggleButton, showOriginal && { backgroundColor: colors.card }]}>
                      <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>Original</Text>
                    </Pressable>
                    <Pressable accessibilityRole="button" accessibilityLabel="Show solved scan" onPress={() => setShowOriginal(false)} style={[styles.toggleButton, !showOriginal && { backgroundColor: colors.card }]}>
                      <Text style={[styles.toggleText, { color: colors.primary }]}>Solved</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.solutionPreview, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.solutionImageFrame} onLayout={onPreviewLayout}>
              <PaperPreview imageUri={imageUri} />
              {hasSolvedResults && !showOriginal ? (
                <View style={[styles.handwritingLayer, { pointerEvents: 'none' }]}>
                  {problems.map((problem) => renderSolutionOverlay(problem))}
                </View>
              ) : null}
            </View>
            <View style={styles.solutionPreviewFooter}>
              <View style={styles.previewCopy}>
                <Text style={[styles.previewTitle, { color: colors.foreground }]}>Math Homework</Text>
                <Text style={[styles.previewMeta, { color: colors.mutedForeground }]}>Offline solved-paper preview</Text>
              </View>
              <View style={[styles.toggle, { backgroundColor: colors.muted }]}>
                <Pressable onPress={() => setShowOriginal(true)} style={[styles.toggleButton, showOriginal && { backgroundColor: colors.card }]}>
                  <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>Original</Text>
                </Pressable>
                <Pressable onPress={() => setShowOriginal(false)} style={[styles.toggleButton, !showOriginal && { backgroundColor: colors.card }]}>
                  <Text style={[styles.toggleText, { color: colors.primary }]}>Solved</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        {hasSolvedResults ? (
          <>
            <View style={styles.answersHeader}><View style={[styles.answerIcon, { backgroundColor: colors.accent }]}><Ionicons name="bulb-outline" size={17} color={colors.primary} /></View><Text style={[styles.answersTitle, { color: colors.foreground }]}>Answers</Text></View>
            {problems.map((problem, index) => <AnswerCard key={problem.id} {...problem} index={index + 1} />)}
            {session?.message ? <Text style={[styles.resultNote, { color: colors.mutedForeground }]}>{session.message}</Text> : null}
            <View style={[styles.followUp, { backgroundColor: colors.secondary }]}>
              <Feather name="star" size={17} color={colors.primary} />
              <View style={styles.followCopy}><Text style={[styles.followTitle, { color: colors.foreground }]}>Want to go one step deeper?</Text><Text style={[styles.followText, { color: colors.secondaryForeground }]}>Ask yourself why each step works, then try a similar problem.</Text></View>
            </View>
          </>
        ) : (
          <View style={[styles.unsupportedCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="search" size={18} color={colors.warning} />
            <View style={styles.followCopy}>
              <Text style={[styles.followTitle, { color: colors.foreground }]}>No unrelated answers were added</Text>
              <Text style={[styles.followText, { color: colors.mutedForeground }]}>{session?.message ?? 'The scan could not be solved locally.'}</Text>
              {session?.ocrText ? <Text style={[styles.ocrText, { color: colors.secondaryForeground }]}>Read from scan: {session.ocrText.slice(0, 220)}</Text> : null}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 },
  topSpacer: { flex: 1 },
  solvedBanner: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontSize: 11, fontWeight: '700' },
  bannerText: { fontSize: 10, marginTop: 3 },
  previewRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, padding: 7, marginTop: 10, gap: 10 },
  solutionPreview: { borderRadius: 10, borderWidth: 1, padding: 7, marginTop: 10 },
  solutionImageFrame: { width: '100%', height: 185, borderRadius: 7, overflow: 'hidden', backgroundColor: '#EDEBE4', position: 'relative' },
  solutionThumb: { width: 86, height: 104, borderRadius: 7, overflow: 'hidden', backgroundColor: '#EDEBE4', position: 'relative' },
  solutionImage: { width: '100%', height: '100%' },
  handwritingLayer: StyleSheet.absoluteFill,
  handwrittenBlock: { position: 'absolute', zIndex: 2 },
  handwrittenWork: { color: '#274A78', fontSize: 8.5, lineHeight: 10.5, fontWeight: '500', fontStyle: 'italic', fontFamily: 'Comic Sans MS' },
  compactHandwrittenWork: { fontSize: 3.3, lineHeight: 4.2 },
  finalAnswerBox: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#274A78', paddingHorizontal: 3, paddingVertical: 1, marginTop: 1 },
  handwrittenFinal: { color: '#274A78', fontSize: 9.5, lineHeight: 11, fontWeight: '700', fontStyle: 'italic', fontFamily: 'Comic Sans MS' },
  compactHandwrittenFinal: { fontSize: 3.6, lineHeight: 4.4, paddingHorizontal: 1 },
  solutionPreviewFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  toggle: { flexDirection: 'row', padding: 2, borderRadius: 8 },
  compactToggle: { alignSelf: 'flex-start', marginTop: 14 },
  toggleButton: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  toggleText: { fontSize: 8, fontWeight: '800' },
  previewWrap: { width: 82, height: 92 },
  previewCopy: { flex: 1 },
  previewTitle: { fontSize: 13, fontWeight: '800' },
  previewMeta: { fontSize: 9, marginTop: 4 },
  resultNote: { fontSize: 10, lineHeight: 14, marginBottom: 8 },
  answersHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14, marginBottom: 7 },
  answerIcon: { width: 27, height: 27, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  answersTitle: { fontSize: 17, fontWeight: '800' },
  followUp: { flexDirection: 'row', gap: 8, borderRadius: 11, padding: 9, marginTop: 2, marginBottom: 8 },
  followCopy: { flex: 1 },
  followTitle: { fontSize: 10, fontWeight: '800' },
  followText: { fontSize: 9, lineHeight: 12, marginTop: 3 },
  unsupportedCard: { flexDirection: 'row', gap: 9, borderRadius: 11, borderWidth: 1, padding: 11, marginTop: 14, marginBottom: 8 },
  ocrText: { fontSize: 9, lineHeight: 13, marginTop: 7 },
});
