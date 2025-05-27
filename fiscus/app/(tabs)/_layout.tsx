import Entypo from '@expo/vector-icons/Entypo';
import { router, Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Entypo size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Entypo size={28} name="wallet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <Entypo size={28} name="plus" color={color} />,
        }}listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/addModal');
          },
        })}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => <Entypo size={28} name="chat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Entypo size={28} name="cog" color={color} />,
        }}
      />

    </Tabs>
  );
}