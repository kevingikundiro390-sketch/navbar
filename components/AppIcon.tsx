import { Image, StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function AppIcon({ size = 42 }: { size?: number }) {
  const colors = useColors();
  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: colors.primary }]}>
      <Image source={require('@/assets/images/icon.png')} style={{ width: size, height: size, borderRadius: size * 0.28 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden' },
});