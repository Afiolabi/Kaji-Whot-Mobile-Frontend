import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';

export default function Index() {
  const { isAuthenticated, isLoading } = useAppSelector((state: RootState) => state.auth);
  const user = useAppSelector((state: RootState) => state.user.user);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  // Redirect based on auth status
  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/splash" />;
  // }

  // if (isAuthenticated && user) {
  return <Redirect href="/(tabs)/landing" />;
  // }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#FF385C" />
    </View>
  );
}
