import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Header from '@components/common/Header';
import { useSocket } from '@/hooks/useSocket';

// Icons
const BackIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill={filled ? '#FFB400' : 'none'}>
    <Path
      d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
      stroke="#FFB400"
      strokeWidth="2"
      fill={filled ? '#FFB400' : 'none'}
    />
  </Svg>
);

const UsersIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const UserAvatarIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Types
interface RankTier {
  id: string;
  name: string;
  fee: number;
  stars: number;
}

interface Room {
  id: string;
  host: string;
  players: number;
  maxPlayers: number;
  status: 'Live' | 'Starting in' | 'Game ended';
  timeRemaining: string;
  startingIn?: number; // seconds until start
  lastUpdated: number;
}

// Mock data
const TIERS: RankTier[] = [
  { id: 'amateur', name: 'Amateur', fee: 50, stars: 1 },
  { id: 'master', name: 'Whot Master', fee: 100, stars: 2 },
  { id: 'lord', name: 'Whot Lord', fee: 200, stars: 3 },
  { id: 'free', name: 'Free Room', fee: 0, stars: 0 },
  { id: 'celebrity', name: 'Celebrity Room', fee: 200, stars: 0 },
];

const MOCK_ROOMS: { [key: string]: Room[] } = {
  celebrity: [
    {
      id: '1',
      host: 'Officer woos',
      players: 2,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '2:15s',
      lastUpdated: 0,
    },
    {
      id: '2',
      host: 'Broda Shaggi',
      players: 4,
      maxPlayers: 4,
      status: 'Game ended',
      timeRemaining: '5:12s',
      lastUpdated: 0,
    },
    {
      id: '3',
      host: 'Davido',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '2:15s',
      lastUpdated: 0,
    },
    {
      id: '4',
      host: 'Shanks',
      players: 1,
      maxPlayers: 3,
      status: 'Starting in',
      timeRemaining: '--:--',
      lastUpdated: 0,
    },
  ],
  free: [
    {
      id: '5',
      host: 'Player One',
      players: 3,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '1:30s',
      lastUpdated: 0,
    },
    {
      id: '6',
      host: 'Player Two',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '0:45s',
      lastUpdated: 0,
    },
  ],
  amateur: [
    {
      id: '5',
      host: 'Baddo sne',
      players: 3,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '1:30s',
      lastUpdated: 0,
    },
    {
      id: '6',
      host: 'Flame',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '0:45s',
      lastUpdated: 0,
    },
  ],
  master: [
    {
      id: '5',
      host: 'Player One',
      players: 3,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '1:30s',
      lastUpdated: 0,
    },
    {
      id: '6',
      host: 'Player Two',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '0:45s',
      lastUpdated: 0,
    },
  ],
  lord: [
    {
      id: '7',
      host: 'Pro Player',
      players: 4,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '3:20s',
      lastUpdated: 0,
    },
  ],
};

const RoomListItem = ({ room, onPress }: { room: Room; onPress: () => void }) => {
  const [countdown, setCountdown] = useState(room.startingIn || 0);
  useEffect(() => {
    if (room.status === 'Starting in' && room.startingIn) {
      setCountdown(room.startingIn);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [room.startingIn, room.status]);

  const getStatusColor = () => {
    switch (room.status) {
      case 'Live':
        return 'text-success';
      case 'Starting in':
        return 'text-warning';
      case 'Game ended':
        return 'text-neutral-400';
      default:
        return 'text-neutral-600';
    }
  };

  const getStatusText = () => {
    if (room.status === 'Starting in' && countdown > 0) {
      return `Starting in ${countdown}s`;
    }
    return room.status;
  };

  const isJoinable = room.status !== 'Game ended' && room.players < room.maxPlayers;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isJoinable}
      activeOpacity={0.7}
      className={`bg-white rounded-2xl p-4 mb-3 border border-neutral-200  ${
        !isJoinable ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-neutral-200 items-center justify-center mr-3">
            <UserAvatarIcon />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-900 mb-1">{room.host}</Text>
            <View className="flex-row items-center">
              <UsersIcon />
              <Text
                className={`text-sm ml-1 ${
                  room.players >= room.maxPlayers ? 'text-error font-bold' : 'text-neutral-600'
                }`}
              >
                {room.players}/{room.maxPlayers}
              </Text>
              {room.status === 'Live' && (
                <View className="ml-2 flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-success mr-1 animate-pulse" />
                  <Text className="text-xs text-success font-semibold">LIVE</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text className={`text-sm font-semibold mb-1 ${getStatusColor()}`}>{room.status}</Text>
          <Text className="text-sm text-neutral-600">{room.timeRemaining}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function JoinCreateGame() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params.mode as string; // 'offline' | 'rank' | 'free' | 'celebrity'
  const { on, off } = useSocket();

  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS.amateur);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [mode]);

  useEffect(() => {
    on('roomUpdated', (data: any) => {
      setRooms((prevRooms) => {
        const index = prevRooms.findIndex((r) => r.id === data.roomId);
        if (index !== -1) {
          const newRooms = [...prevRooms];
          newRooms[index] = {
            ...newRooms[index],
            ...data.updates,
            lastUpdated: Date.now(),
          };
          return newRooms;
        }
        return prevRooms;
      });
    });

    on('roomCreated', (data: any) => {
      setRooms((prevRooms) => [
        {
          id: data.roomId,
          host: data.hostUsername,
          players: 1,
          maxPlayers: data.settings.maxPlayers,
          status: 'Starting in',
          timeRemaining: '--:--',
          lastUpdated: Date.now(),
        },
        ...prevRooms,
      ]);
    });

    on('roomDeleted', (data: { roomId: string }) => {
      setRooms((prevRooms) => prevRooms.filter((r) => r.id !== data.roomId));
    });

    return () => {
      off('roomUpdated');
      off('roomCreated');
      off('roomDeleted');
    };
  }, [on, off]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.getRooms(mode);
      // setRooms(response.data);

      // Mock data for now
      setTimeout(() => {
        setRooms(MOCK_ROOMS[mode as keyof typeof MOCK_ROOMS] || []);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRooms();
    setIsRefreshing(false);
  };

  const filteredRooms = rooms.filter((room) =>
    room.host.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleCreateGame = () => {
    // Navigate to select-players with tier info
    router.push({
      pathname: '/(game)/select-players',
      params: {
        mode,
        tier: params.tier,
        fee: TIERS.find((t) => t.id === params.mode)?.fee,
      },
    } as any);
  };

  const handleJoinRoom = (roomId: string) => {
    // Navigate to lobby
    // router.push('/game-result');
    router.push(`/(game)/lobby/${roomId}?mode=${mode}` as any);
  };

  const handleBackPress = () => {
    router.back();
  };
  const getTierName = () => {
    switch (mode) {
      case 'amateur':
        return 'Amateur';
      case 'master':
        return 'Whot Master';
      case 'lord':
        return 'Whot Lord';
      case 'offline':
        return 'Offline Room';
      case 'celebrity':
        return 'Celebrity Room';
      default:
        return 'Free Room';
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header hasNotification />
      <View className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold text-neutral-900 mb-2 text-center">
          Kaji Whot | {getTierName()}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center  mb-4">
          <View className=" px-4 py-3 rounded-l-xl  items-center bg-purple-500">
            <SearchIcon />
          </View>
          <TextInput
            placeholder="Search"
            cursorColor="#a855f7"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1  border border-purple-500 rounded-r-xl text-base text-purple-800  px-4 py-3"
            placeholderTextColor="#d8b4fe"
          />
        </View>
        {/* Create Game Button */}
        <TouchableOpacity
          onPress={handleCreateGame}
          activeOpacity={0.7}
          className="bg-purple-500 rounded-2xl p-5 mb-4  flex-row items-center justify-center"
        >
          <PlusIcon />
          <Text className="text-base font-bold text-white ml-2">Create game</Text>
        </TouchableOpacity>

        {/* Rooms List */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-semibold text-neutral-600">
            Available Rooms ({filteredRooms.length})
          </Text>
          {/* <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
            <Text className="text-sm font-semibold text-primary">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Text>
          </TouchableOpacity> */}
        </View>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#a855f7" />
          </View>
        ) : (
          <FlatList
            data={filteredRooms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RoomListItem room={item} onPress={() => handleJoinRoom(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#FF385C"
              />
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-neutral-400 text-base">No rooms available</Text>
                <Text className="text-neutral-300 text-sm mt-2">Create one to get started!</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Back Button */}
      <View className="absolute bottom-8 right-4">
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
