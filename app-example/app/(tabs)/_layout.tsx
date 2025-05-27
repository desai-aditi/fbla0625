import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      {/* Add more tabs here, e.g.:
      <Tabs.Screen name="about" options={{ title: 'About' }} />
      */}
    </Tabs>
  );
}