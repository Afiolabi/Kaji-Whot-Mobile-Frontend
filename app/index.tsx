import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { RootState } from '@/store';
import React from 'react';

export default function Index() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user.user);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  // Redirect based on auth status
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/splash" />;
  }

  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)/landing" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#FF385C" />
    </View>
  );
}