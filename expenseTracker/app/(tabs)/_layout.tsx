import CustomTabs from '@/components/CustomTabs';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function _layout() {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"/>
      <Tabs.Screen name="ledger"/>
      <Tabs.Screen
        name='add'
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(modals)/transactionModal');
          },
        })}
      />
      <Tabs.Screen name="chat"/>
      <Tabs.Screen name="profile"/>
    </Tabs>
  );
};
const styles = StyleSheet.create({});