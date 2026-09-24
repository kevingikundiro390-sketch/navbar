import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home"><NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="ic_menu_home" /><NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="scan"><NativeTabs.Trigger.Icon sf={{ default: 'camera.viewfinder', selected: 'camera.viewfinder' }} drawable="ic_menu_camera" /><NativeTabs.Trigger.Label>Scan</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="library"><NativeTabs.Trigger.Icon sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }} drawable="ic_menu_library" /><NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore"><NativeTabs.Trigger.Icon sf={{ default: 'safari', selected: 'safari.fill' }} drawable="ic_menu_explore" /><NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile"><NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} drawable="ic_menu_manage" /><NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.mutedForeground,
      tabBarLabelStyle: { fontSize: 9, fontWeight: '500' },
      tabBarIconStyle: { marginBottom: -1 },
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: isIOS ? 'transparent' : colors.card,
        borderTopWidth: isWeb ? 1 : 0,
        borderTopColor: colors.border,
        elevation: 0,
        height: isWeb ? 84 : 62 + insets.bottom,
        paddingBottom: isWeb ? 17 : insets.bottom,
        paddingTop: 8,
      },
      tabBarBackground: () => isIOS
        ? <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        : isWeb
          ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
          : null,
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarStyle: { display: 'none' }, tabBarIcon: ({ color }) => <Ionicons name="camera-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="library" options={{ title: 'Library', tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={21} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={21} color={color} /> }} />
    </Tabs>
  );
}

export default function TabsLayout() {
  return Platform.OS === 'ios' && isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />;
}