import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function SectionTitle({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  const colors = useColors();
  const styles = makeStyles(colors);
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
          <View style={styles.actionRow}>
            <Text style={styles.action}>{action}</Text>
            <Feather name="chevron-right" size={15} color={colors.primary} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  title: { color: colors.foreground, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  action: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.6 },
});