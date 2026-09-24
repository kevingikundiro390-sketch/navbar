import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { setLatestSolution } from '@/data/solutionSession';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { solveHomeworkImage } from '@/data/qwenVision';

export default function ScanTab() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [photoSize, setPhotoSize] = useState({ width: 1000, height: 1400 });
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState('Your photo stays here until you are ready to solve.');
  const [isSolving, setIsSolving] = useState(false);
  const [smartCrop, setSmartCrop] = useState(true);
  const [cleanContrast, setCleanContrast] = useState(true);

  const usePickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.uri) return;
    setPhotoUri(asset.uri);
    setPhotoSize({ width: asset.width || 1000, height: asset.height || 1400 });
    setError(undefined);
    setNotice('Ready. The next step reads the page with free Qwen3-VL vision.');
  };

  const selectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      usePickedAsset(result.assets[0]);
    }
  };

  const capturePhoto = async () => {
    if (Platform.OS === 'web') {
      setNotice('Camera preview is available on your device. Choose a page from your photo library here.');
      await selectPhoto();
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        usePickedAsset(result.assets[0]);
      }
    } catch {
      Alert.alert('Camera unavailable', 'You can still choose a photo from your library.');
    }
  };

  const solvePage = async () => {
    if (!photoUri) {
      setError('Choose a clear photo before asking for answers.');
      return;
    }

    setError(undefined);
    setIsSolving(true);
    try {
      const result = await solveHomeworkImage(photoUri, assetMimeType(photoUri), photoSize.width, photoSize.height);
      const confidenceText = typeof result.confidence === 'number'
        ? ` Confidence ${(result.confidence * 100).toFixed(0)}%.`
        : '';
      setLatestSolution({
        title: 'Math Homework',
        imageUri: photoUri,
        imageWidth: photoSize.width,
        imageHeight: photoSize.height,
        status: 'solved',
        message: `Qwen3-VL worked through ${result.problems.length} problem${result.problems.length === 1 ? '' : 's'}.${confidenceText}`,
        ocrText: result.problems.map((problem) => problem.question).join('\n'),
        problems: result.problems,
        confidence: result.confidence,
      });
      setNotice('Worked solution ready. Opening the solved copy.');
      router.push('/solve');
    } catch (solveError) {
      const message = solveError instanceof Error ? solveError.message : 'The free vision service could not solve this scan.';
      setError(message);
      setNotice('Try a brighter, straighter photo with the whole page visible.');
    } finally {
      setIsSolving(false);
    }
  };

  const assetMimeType = (uri: string) => uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  return (
    <View style={[styles.screen, { backgroundColor: colors.scanBackground }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 26 : 0) + 6, paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close scanner" onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={25} color={colors.primaryForeground} />
          </Pressable>
          <View style={styles.modeTitle}>
            <Text style={[styles.modeEyebrow, { color: colors.mint }]}>STUDY MODE</Text>
            <Text style={[styles.modeName, { color: colors.primaryForeground }]}>Scan a page</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Flashlight" onPress={() => setNotice('Use even light without glare for the clearest page.')} hitSlop={12}>
            <Feather name="zap" size={22} color={colors.primaryForeground} />
          </Pressable>
        </View>
        <View style={[styles.photoStage, { backgroundColor: colors.scannerStage }]}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} resizeMode="cover" style={styles.selectedPhoto} />
          ) : (
            <View style={styles.paperScene}>
              <View style={[styles.cameraPaper, { backgroundColor: colors.paper }]}>
                <Text style={[styles.paperNumber, { color: colors.ink }]}>1.   2x + 5 = 13</Text>
                <Text style={[styles.paperWork, { color: colors.ink }]}>      2x = 13 − 5</Text>
                <Text style={[styles.paperWork, { color: colors.ink }]}>      2x = 8</Text>
                <Text style={[styles.paperAnswer, { color: colors.ink }]}>      x = 4</Text>
                <View style={[styles.paperBox, { borderColor: colors.ink }]} />
                <Text style={[styles.paperNumber, { color: colors.ink }]}>2.   3(x + 2) − 4 = 14</Text>
                <Text style={[styles.paperWork, { color: colors.ink }]}>      3x + 6 − 4 = 14</Text>
                <Text style={[styles.paperWork, { color: colors.ink }]}>      3x + 2 = 14</Text>
                <Text style={[styles.paperAnswer, { color: colors.ink }]}>      x = 4</Text>
                <View style={[styles.paperBox, { borderColor: colors.ink }]} />
                <Text style={[styles.paperNumber, { color: colors.ink }]}>3.   (x + 1)² = 16</Text>
              </View>
            </View>
          )}
          <View style={[styles.corner, styles.cornerTopLeft, { borderColor: colors.mint }]} />
          <View style={[styles.corner, styles.cornerTopRight, { borderColor: colors.mint }]} />
          <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: colors.mint }]} />
          <View style={[styles.corner, styles.cornerBottomRight, { borderColor: colors.mint }]} />
        </View>
        <View style={[styles.helperPill, { backgroundColor: colors.scannerPanel }]}>
           <Ionicons name="document-text-outline" size={16} color={colors.primaryForeground} />
           <Text style={[styles.helperText, { color: colors.primaryForeground }]}>Keep the whole page inside the frame</Text>
        </View>
        <View style={[styles.optionsPanel, { backgroundColor: colors.scannerPanel, borderColor: colors.scannerControl }]}>
          <View style={styles.optionsHeader}>
            <View>
              <Text style={[styles.optionsEyebrow, { color: colors.mint }]}>SMART TOOLS</Text>
              <Text style={[styles.optionsTitle, { color: colors.primaryForeground }]}>Make the scan easier to read</Text>
            </View>
            <Ionicons name="options-outline" size={19} color={colors.mint} />
          </View>
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: smartCrop }} onPress={() => setSmartCrop((value) => !value)} style={styles.optionRow}>
            <View style={[styles.optionIcon, { backgroundColor: colors.scannerControl }]}><Feather name="crop" size={15} color={colors.mint} /></View>
            <View style={styles.optionCopy}>
              <Text style={[styles.optionTitle, { color: colors.primaryForeground }]}>Smart crop</Text>
              <Text style={[styles.optionMeta, { color: colors.muted }]}>Straighten the page automatically</Text>
            </View>
            <View style={[styles.toggleTrack, { backgroundColor: smartCrop ? colors.primary : colors.scannerControl }]}>
              <View style={[styles.toggleThumb, { backgroundColor: colors.primaryForeground, alignSelf: smartCrop ? 'flex-end' : 'flex-start' }]} />
            </View>
          </Pressable>
          <View style={[styles.optionDivider, { backgroundColor: colors.scannerControl }]} />
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: cleanContrast }} onPress={() => setCleanContrast((value) => !value)} style={styles.optionRow}>
            <View style={[styles.optionIcon, { backgroundColor: colors.scannerControl }]}><Feather name="sun" size={15} color={colors.mint} /></View>
            <View style={styles.optionCopy}>
              <Text style={[styles.optionTitle, { color: colors.primaryForeground }]}>Clean contrast</Text>
              <Text style={[styles.optionMeta, { color: colors.muted }]}>Lift shadows and soften glare</Text>
            </View>
            <View style={[styles.toggleTrack, { backgroundColor: cleanContrast ? colors.primary : colors.scannerControl }]}>
              <View style={[styles.toggleThumb, { backgroundColor: colors.primaryForeground, alignSelf: cleanContrast ? 'flex-end' : 'flex-start' }]} />
            </View>
          </Pressable>
        </View>
        <View style={styles.cameraControls}>
          <Pressable accessibilityRole="button" accessibilityLabel="Choose from photo library" onPress={selectPhoto} style={[styles.galleryButton, { backgroundColor: '#272A2A' }]}>
            <Feather name="image" size={19} color={colors.primaryForeground} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={photoUri ? 'Read and solve homework' : 'Take photo'} onPress={photoUri ? solvePage : capturePhoto} disabled={isSolving} style={[styles.shutterOuter, { borderColor: colors.primaryForeground, opacity: isSolving ? 0.65 : 1 }]}>
            {isSolving ? <ActivityIndicator color={colors.primaryForeground} /> : <View style={[styles.shutterInner, { backgroundColor: colors.teal }]} />}
          </Pressable>
          <View style={styles.controlSpacer} />
        </View>
        {error ? (
          <Text style={[styles.localNote, { color: '#F5A59B' }]}>{error}</Text>
        ) : photoUri ? (
          <Text style={[styles.localNote, { color: colors.border }]}>{isSolving ? 'Reading and working through the page with Qwen3-VL…' : 'Tap the shutter again to read and solve it with free AI.'}</Text>
        ) : (
          <Text style={[styles.localNote, { color: colors.border }]}>{notice}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 17 },
  modeTitle: { alignItems: 'center', gap: 2 },
  modeEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  modeName: { fontSize: 13, fontWeight: '800' },
  photoStage: { height: 397, borderRadius: 17, overflow: 'hidden', position: 'relative' },
  selectedPhoto: { width: '100%', height: '100%' },
  paperScene: { flex: 1, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-1deg' }] },
  cameraPaper: { width: '74%', height: '87%', padding: 17, justifyContent: 'center', shadowColor: '#17110E', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  paperNumber: { fontSize: 12, fontStyle: 'italic', marginBottom: 13 },
  paperWork: { fontSize: 11, fontStyle: 'italic', marginBottom: 8 },
  paperAnswer: { fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  paperBox: { width: 39, height: 20, borderWidth: 1, alignSelf: 'center', marginBottom: 17 },
  corner: { width: 26, height: 26, position: 'absolute' },
  cornerTopLeft: { top: 28, left: 28, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 9 },
  cornerTopRight: { top: 28, right: 28, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 9 },
  cornerBottomLeft: { bottom: 28, left: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 9 },
  cornerBottomRight: { bottom: 28, right: 28, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 9 },
  helperPill: { height: 39, borderRadius: 11, marginTop: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  helperText: { fontSize: 10, fontWeight: '700' },
  optionsPanel: { borderRadius: 17, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 11, marginTop: 12 },
  optionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  optionsEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  optionsTitle: { fontSize: 11, fontWeight: '800', marginTop: 3 },
  optionRow: { minHeight: 45, flexDirection: 'row', alignItems: 'center', gap: 9 },
  optionIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  optionCopy: { flex: 1 },
  optionTitle: { fontSize: 10, fontWeight: '800' },
  optionMeta: { fontSize: 8, marginTop: 2 },
  optionDivider: { height: 1, marginLeft: 37 },
  toggleTrack: { width: 31, height: 18, borderRadius: 10, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 14, height: 14, borderRadius: 7 },
  cameraControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, paddingHorizontal: 15 },
  galleryButton: { width: 37, height: 37, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  shutterOuter: { width: 62, height: 62, borderWidth: 3, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 49, height: 49, borderRadius: 25 },
  controlSpacer: { width: 37, height: 37 },
  localNote: { fontSize: 10, textAlign: 'center', marginTop: 12 },
});
