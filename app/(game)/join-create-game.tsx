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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Header from '@components/common/Header';

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
      stroke="#6A6A6A"
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
    <Path d="M12 5V19M5 12H19" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
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
}

// Mock data
const RANK_TIERS: RankTier[] = [
  { id: 'amateur', name: 'Amateur', fee: 50, stars: 1 },
  { id: 'master', name: 'Whot Master', fee: 100, stars: 2 },
  { id: 'lord', name: 'Whot Lord', fee: 200, stars: 3 },
];

const MOCK_ROOMS: { [key: string]: Room[] } = {
  amateur: [
    {
      id: '1',
      host: 'Officer woos',
      players: 2,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '2:15s',
    },
    {
      id: '2',
      host: 'Broda Shaggi',
      players: 4,
      maxPlayers: 4,
      status: 'Game ended',
      timeRemaining: '5:12s',
    },
    {
      id: '3',
      host: 'Davido',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '2:15s',
    },
    {
      id: '4',
      host: 'Shanks',
      players: 1,
      maxPlayers: 3,
      status: 'Starting in',
      timeRemaining: '--:--',
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
    },
    {
      id: '6',
      host: 'Player Two',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '0:45s',
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
    },
  ],
};

// Components
const RankTierCard = ({
  tier,
  isSelected,
  onPress,
}: {
  tier: RankTier;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`
      p-4 rounded-2xl border-2 mb-3
      ${isSelected ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-white'}
    `}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-lg font-bold text-neutral-900 mb-1">{tier.name}</Text>
        <View className="flex-row items-center">
          {Array.from({ length: tier.stars }).map((_, i) => (
            <View className="mr-1">
              <StarIcon filled />
            </View>
          ))}
        </View>
      </View>
      <Text className="text-xl font-bold text-primary">₦{tier.fee}</Text>
    </View>
  </TouchableOpacity>
);

const RoomListItem = ({ room, onPress }: { room: Room; onPress: () => void }) => {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl p-4 mb-3 border border-neutral-200"
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
              <Text className="text-sm text-neutral-600 ml-1">
                {room.players}/{room.maxPlayers}
              </Text>
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
  const [selectedTier, setSelectedTier] = useState<string>('amateur');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS.amateur);
  const [isLoading, setIsLoading] = useState(false);

  const params = useLocalSearchParams();

  const mode = params.mode as string; // 'offline' | 'rank' | 'free' | 'celebrity'
  useEffect(() => {
    // Load rooms when tier changes
    setIsLoading(true);
    setTimeout(() => {
      setRooms(MOCK_ROOMS[selectedTier as keyof typeof MOCK_ROOMS] || []);
      setIsLoading(false);
    }, 300);
  }, [selectedTier]);

  const filteredRooms = rooms.filter((room) =>
    room.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGame = () => {
    // Navigate to select-players with tier info
    router.push({
      pathname: '/(game)/select-players',
      params: {
        mode: 'rank',
        tier: selectedTier,
        fee: RANK_TIERS.find((t) => t.id === selectedTier)?.fee,
      },
    } as any);
  };

  const handleJoinRoom = (roomId: string) => {
    // Navigate to lobby
    // router.push('/game-result');
    router.push(`/(game)/lobby/${roomId}` as any);
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
        <View className="flex-row items-center bg-neutral-50 rounded-2xl px-4 py-3 mb-4 border border-neutral-200">
          <SearchIcon />
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base text-neutral-900"
            placeholderTextColor="#B0B0B0"
          />
        </View>
        {/* Create Game Button */}
        <TouchableOpacity
          onPress={handleCreateGame}
          activeOpacity={0.7}
          className="bg-white rounded-2xl p-4 mb-4 border-2 border-neutral-900 flex-row items-center justify-center"
        >
          <PlusIcon />
          <Text className="text-base font-bold text-neutral-900 ml-2">Create game</Text>
        </TouchableOpacity>

        {/* Rooms List */}
        <Text className="text-sm font-semibold text-neutral-600 mb-3">Available Rooms</Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FF385C" />
          </View>
        ) : (
          <FlatList
            data={filteredRooms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RoomListItem room={item} onPress={() => handleJoinRoom(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
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
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   StatusBar,
//   TouchableOpacity,
//   FlatList,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import Svg, { Path } from 'react-native-svg';

// // Icons
// const BackIcon = () => (
//   <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
//     <Path
//       d="M19 12H5M5 12L12 19M5 12L12 5"
//       stroke="#484848"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Svg>
// );

// const SearchIcon = () => (
//   <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
//     <Path
//       d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
//       stroke="#6A6A6A"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Svg>
// );

// const StarIcon = ({ filled = false }: { filled?: boolean }) => (
//   <Svg width={16} height={16} viewBox="0 0 24 24" fill={filled ? '#FFB400' : 'none'}>
//     <Path
//       d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
//       stroke="#FFB400"
//       strokeWidth="2"
//       fill={filled ? '#FFB400' : 'none'}
//     />
//   </Svg>
// );

// const UsersIcon = () => (
//   <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
//     <Path
//       d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
//       stroke="#6A6A6A"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//     <Path
//       d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
//       stroke="#6A6A6A"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//     <Path
//       d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
//       stroke="#6A6A6A"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//     <Path
//       d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
//       stroke="#6A6A6A"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//   </Svg>
// );

// // Types
// interface RankTier {
//   id: string;
//   name: string;
//   fee: number;
//   stars: number;
// }

// interface Room {
//   id: string;
//   host: string;
//   players: number;
//   maxPlayers: number;
//   status: 'Live' | 'Starting in' | 'Game ended';
//   timeRemaining: string;
// }

// // Mock data
// const RANK_TIERS: RankTier[] = [
//   { id: 'amateur', name: 'Amateur', fee: 50, stars: 1 },
//   { id: 'master', name: 'Whot Master', fee: 100, stars: 2 },
//   { id: 'lord', name: 'Whot Lord', fee: 200, stars: 3 },
// ];

// const MOCK_ROOMS: { [key: string]: Room[] } = {
//   amateur: [
//     {
//       id: '1',
//       host: 'Officer woos',
//       players: 2,
//       maxPlayers: 4,
//       status: 'Live',
//       timeRemaining: '2:15s',
//     },
//     {
//       id: '2',
//       host: 'Broda Shaggi',
//       players: 4,
//       maxPlayers: 4,
//       status: 'Game ended',
//       timeRemaining: '5:12s',
//     },
//     {
//       id: '3',
//       host: 'Davido',
//       players: 2,
//       maxPlayers: 4,
//       status: 'Starting in',
//       timeRemaining: '2:15s',
//     },
//     {
//       id: '4',
//       host: 'Shanks',
//       players: 1,
//       maxPlayers: 3,
//       status: 'Starting in',
//       timeRemaining: '--:--',
//     },
//   ],
//   master: [
//     {
//       id: '5',
//       host: 'Player One',
//       players: 3,
//       maxPlayers: 4,
//       status: 'Live',
//       timeRemaining: '1:30s',
//     },
//     {
//       id: '6',
//       host: 'Player Two',
//       players: 2,
//       maxPlayers: 4,
//       status: 'Starting in',
//       timeRemaining: '0:45s',
//     },
//   ],
//   lord: [
//     {
//       id: '7',
//       host: 'Pro Player',
//       players: 4,
//       maxPlayers: 4,
//       status: 'Live',
//       timeRemaining: '3:20s',
//     },
//   ],
// };

// // Components
// const RankTierCard = ({
//   tier,
//   isSelected,
//   onPress,
// }: {
//   tier: RankTier;
//   isSelected: boolean;
//   onPress: () => void;
// }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     activeOpacity={0.7}
//     className={`
//       p-4 rounded-2xl border-2 mb-3
//       ${isSelected ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-white'}
//     `}
//   >
//     <View className="flex-row items-center justify-between">
//       <View className="flex-1">
//         <Text className="text-lg font-bold text-neutral-900 mb-1">{tier.name}</Text>
//         <View className="flex-row items-center">
//           {Array.from({ length: tier.stars }).map((_, i) => (
//             <View className="mr-1">
//               <StarIcon filled />
//             </View>
//           ))}
//         </View>
//       </View>
//       <Text className="text-xl font-bold text-primary">₦{tier.fee}</Text>
//     </View>
//   </TouchableOpacity>
// );

// const RoomListItem = ({ room, onPress }: { room: Room; onPress: () => void }) => {
//   const getStatusColor = () => {
//     switch (room.status) {
//       case 'Live':
//         return 'text-success';
//       case 'Starting in':
//         return 'text-warning';
//       case 'Game ended':
//         return 'text-neutral-400';
//       default:
//         return 'text-neutral-600';
//     }
//   };

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.7}
//       className="bg-white rounded-2xl p-4 mb-3 border border-neutral-200"
//     >
//       <View className="flex-row items-center justify-between mb-2">
//         <View className="flex-row items-center flex-1">
//           <View className="w-10 h-10 rounded-full bg-neutral-200 items-center justify-center mr-3">
//             <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
//               <Path
//                 d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
//                 stroke="#6A6A6A"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
//               <Path
//                 d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
//                 stroke="#6A6A6A"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
//             </Svg>
//           </View>
//           <View className="flex-1">
//             <Text className="text-base font-semibold text-neutral-900 mb-1">{room.host}</Text>
//             <View className="flex-row items-center">
//               <UsersIcon />
//               <Text className="text-sm text-neutral-600 ml-1">
//                 {room.players}/{room.maxPlayers}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View className="items-end">
//           <Text className={`text-sm font-semibold mb-1 ${getStatusColor()}`}>{room.status}</Text>
//           <Text className="text-sm text-neutral-600">{room.timeRemaining}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default function JoinCreateGame() {
//   const router = useRouter();
//   const [selectedTier, setSelectedTier] = useState<string>('amateur');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS.amateur);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     // Load rooms when tier changes
//     setIsLoading(true);
//     setTimeout(() => {
//       setRooms(MOCK_ROOMS[selectedTier as keyof typeof MOCK_ROOMS] || []);
//       setIsLoading(false);
//     }, 300);
//   }, [selectedTier]);

//   const filteredRooms = rooms.filter((room) =>
//     room.host.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleCreateGame = () => {
//     // Navigate to select-players with tier info
//     router.push({
//       pathname: '/(game)/select-players',
//       params: {
//         mode: 'rank',
//         tier: selectedTier,
//         fee: RANK_TIERS.find((t) => t.id === selectedTier)?.fee,
//       },
//     });
//   };

//   const handleJoinRoom = (roomId: string) => {
//     // Navigate to lobby
//     router.push(`/(game)/lobby/${roomId}`);
//   };

//   const handleBackPress = () => {
//     router.back();
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View className="px-4 py-3 flex-row items-center justify-between border-b border-neutral-100">
//         <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
//           <BackIcon />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-neutral-900">Rank Room</Text>
//         <View className="w-12" />
//       </View>

//       <View className="flex-1 px-4 py-4">
//         {/* Tier Selection */}
//         <Text className="text-base font-semibold text-neutral-600 mb-3">
//           Select to create or view available games
//         </Text>

//         <FlatList
//           data={RANK_TIERS}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <RankTierCard
//               tier={item}
//               isSelected={selectedTier === item.id}
//               onPress={() => setSelectedTier(item.id)}
//             />
//           )}
//           showsVerticalScrollIndicator={false} // optional
//         />

//         {/* Create Game Button */}
//         <TouchableOpacity
//           onPress={handleCreateGame}
//           activeOpacity={0.7}
//           className="bg-white rounded-2xl p-4 mb-4 border-2 border-neutral-900 flex-row items-center justify-center"
//         >
//           <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="mr-2">
//             <Path d="M12 5V19M5 12H19" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
//           </Svg>
//           <Text className="text-base font-bold text-neutral-900">Create game</Text>
//         </TouchableOpacity>

//         {/* Search Bar */}
//         <View className="flex-row items-center bg-neutral-50 rounded-2xl px-4 py-3 mb-4 border border-neutral-200">
//           <SearchIcon />
//           <TextInput
//             placeholder="Search"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             className="flex-1 ml-3 text-base text-neutral-900"
//             placeholderTextColor="#B0B0B0"
//           />
//         </View>

//         {/* Rooms List */}
//         <Text className="text-sm font-semibold text-neutral-600 mb-3">Available Rooms</Text>

//         {isLoading ? (
//           <View className="flex-1 items-center justify-center">
//             <ActivityIndicator size="large" color="#FF385C" />
//           </View>
//         ) : (
//           <FlatList
//             data={filteredRooms}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <RoomListItem room={item} onPress={() => handleJoinRoom(item.id)} />
//             )}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               <View className="items-center justify-center py-12">
//                 <Text className="text-neutral-400 text-base">No rooms available</Text>
//                 <Text className="text-neutral-300 text-sm mt-2">Create one to get started!</Text>
//               </View>
//             }
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }
