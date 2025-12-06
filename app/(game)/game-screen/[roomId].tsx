import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { RootState } from '@/store';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CoinsIcon, WalletIcon } from '@/components/common/Header';
// import { useGameActions } from '@/hooks/useSocket';

// Icons
const BackIcon = () => (
  <Svg width={25} height={25} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
import { CardNumber, CardShape, Card as CardType } from '@/types/card.types';
import PlayerGrid from '@/components/game/PlayerGrid';
import { useGameActions, useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { formatTime } from '@/utils/formatters';
import { useAppSelector } from '@/store/hooks';
// import { playCard } from '@/store/slices/gameSlice';
const TimerIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
    <Path d="M12 6V12L16 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MicIcon = ({ muted }: { muted: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    {muted ? (
      <>
        <Path
          d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path d="M3 3L21 21" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <Path
          d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    )}
  </Svg>
);

const VideoIcon = ({ disabled }: { disabled: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    {disabled ? (
      <>
        <Path
          d="M16 16V8C16 6.89543 15.1046 6 14 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M16 10L21 7V17L16 14"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M3 3L21 21" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <Path
          d="M16 16V8C16 6.89543 15.1046 6 14 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M16 10L21 7V17L16 14"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

// Player Avatar Component
interface PlayerSlotProps {
  player: {
    username: string;
    avatar?: string;
    cardCount: number;
    isLastCard?: boolean;
    audioMuted?: boolean;
    videoDisabled?: boolean;
  };
  isActive: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// const PlayerSlot = ({ player, isActive, position }: PlayerSlotProps) => {
//   const positionClasses = {
//     'top-left': 'absolute top-2 left-2',
//     'top-right': 'absolute top-2 right-2',
//     'bottom-left': 'absolute bottom-2 left-2',
//     'bottom-right': 'absolute bottom-2 right-2',
//   };

//   return (
//     <View className={positionClasses[position]}>
//       <View
//         className={`w-28 h-36 rounded-xl overflow-hidden ${
//           isActive ? 'border-4 border-primary' : 'border-2 border-neutral-300'
//         }`}
//       >
//         {/* Video/Avatar Area */}
//         <View className="flex-1 bg-neutral-800 items-center justify-center">
//           {player.avatar ? (
//             <Image source={{ uri: player.avatar }} className="w-full h-full" resizeMode="cover" />
//           ) : (
//             <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
//               <Path
//                 d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
//                 stroke="#B0B0B0"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <Path
//                 d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
//                 stroke="#B0B0B0"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </Svg>
//           )}
//         </View>

//         {/* Player Info Overlay */}
//         <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
//           <Text className="text-white text-xs font-semibold" numberOfLines={1}>
//             {player.username}
//           </Text>
//         </View>

//         {/* Card Count Badge */}
//         <View className="absolute top-1 right-1">
//           <View
//             className={`px-2 py-0.5 rounded-full ${
//               player.isLastCard ? 'bg-error' : 'bg-neutral-800'
//             }`}
//           >
//             <Text className="text-white text-xs font-bold">{player.cardCount}</Text>
//           </View>
//         </View>

//         {/* Last Card Warning */}
//         {player.isLastCard && (
//           <View className="absolute top-1 left-1">
//             <Text className="text-error text-[10px] font-bold">Last Card</Text>
//           </View>
//         )}

//         {/* Audio/Video Controls */}
//         <View className="absolute bottom-8 left-1 flex-row gap-1">
//           {player.audioMuted && (
//             <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
//               <MicIcon muted={true} />
//             </View>
//           )}
//           {player.videoDisabled && (
//             <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
//               <VideoIcon disabled={true} />
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// Game Card Component
interface GameCardProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const GameCard = ({ card, size = 'md', onPress, selected, disabled = false }: GameCardProps) => {
  const sizeClasses = {
    sm: 'w-18 h-24',
    md: 'w-20 h-32',
    lg: 'w-24 h-36',
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`
    ${sizeClasses[size]}
    ${selected ? '-translate-y-4' : ''}
    ${!disabled ? 'hover:scale-105 pressed:scale-95' : ''}
    transition-all duration-150
  `}
    >
      <Animated.View
        className={`flex-1 bg-white rounded-lg border-2 border-neutral-900 items-center justify-center ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        {/* Card Number (Top Left) */}
        <Text className="absolute top-0.5 left-0.5 text-md font-bold">{card.number}</Text>

        {/* Card Shape Icon (Center) */}
        <View className="items-center justify-center">
          {card.shape === 'star' && (
            <Svg width={40} height={40} viewBox="0 0 24 24">
              <Path
                d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
                fill="#000"
              />
            </Svg>
          )}
          {card.shape === 'circle' && (
            <Svg width="40" height="40" viewBox="0 0 40 40">
              <Circle cx="20" cy="20" r="15" fill="#000" />
            </Svg>
          )}
        </View>

        {/* Card Number (Bottom Right) */}
        <Text className="absolute bottom-[0.5px] right-0.5 text-md font-bold rotate-180">
          {card.number}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function GameRoom() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();
  const user = useAppSelector((state: RootState) => state.user.user);
  // const { isConnected } = useSocket();

  const gameState = useAppSelector((state: RootState) => state.game);
  // Initialize WebRTC
  useWebRTC(roomId as string);

  // Mock game state (replace with real Redux state)
  const [gameTimer, setGameTimer] = useState(195); // 03:15 in seconds
  const [activeTab, setActiveTab] = useState<'cards' | 'chat' | 'menu'>('cards');

  // Mock players
  // const players = [
  //   { username: 'Bot1', cardCount: 0, isLastCard: true, audioMuted: false, videoDisabled: false },
  //   { username: 'Bot2', cardCount: 14, isLastCard: false, audioMuted: false, videoDisabled: false },
  //   { username: 'Bot3', cardCount: 5, isLastCard: false, audioMuted: false, videoDisabled: false },
  //   { username: 'Me', cardCount: 3, isLastCard: false, audioMuted: true, videoDisabled: true },
  // ];

  const myCards: {
    id: string;
    shape: CardShape;
    number: CardNumber;
  }[] = [
    { id: '1', shape: 'star', number: 1 },
    { id: '2', shape: 'circle', number: 5 },
    { id: '3', shape: 'star', number: 1 },
    { id: '4', shape: 'circle', number: 5 },
    { id: '5', shape: 'circle', number: 5 },
    { id: '6', shape: 'star', number: 1 },
    { id: '7', shape: 'circle', number: 5 },
    { id: '8', shape: 'star', number: 1 },
    { id: '9', shape: 'circle', number: 5 },
    { id: '10', shape: 'circle', number: 5 },
    { id: '11', shape: 'star', number: 1 },
    { id: '12', shape: 'circle', number: 5 },
    { id: '13', shape: 'star', number: 1 },
    { id: '14', shape: 'circle', number: 5 },
    { id: '15', shape: 'circle', number: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    router.replace('/(game)/join-create-game?mode=');
  };

  const balance = user?.balance;
  const coins = user?.coins; // Mock coins data

  const walletScale = useSharedValue(1);

  const animatedWalletButton = useAnimatedStyle(() => {
    return {
      transform: [{ scale: walletScale.value }],
    };
  });

  const handleWalletPress = () => {
    walletScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
      walletScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

    // router.push('/(wallet)/fund');
  };
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const { playCard } = useGameActions();

  const isMyTurn = false;
  const canPlayCard = false;

  const handleCardClick = (card: CardType) => {
    // if (!isMyTurn || !canPlayCard) return;

    if (selectedCard?.id === card.id) {
      // Play the selected card
      playCard(card.id);
      setSelectedCard(null);
    } else {
      // Select the card
      setSelectedCard(card);
    }
  };

  const handleMarket = () => {
    console.log('Market touched');
  };
  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      {/* Top Bar */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between">
        <Pressable onPress={handleBack} className="pr-8">
          <BackIcon />
        </Pressable>
        <View className="flex-row">
          {/* Wallet, coins & Notification */}
          <Pressable onPress={handleWalletPress} className="flex-row items-center ">
            <Animated.View
              style={animatedWalletButton}
              className="flex-row items-center gap-1 px-2 py-2 "
            >
              <WalletIcon />
              <Text className="text-m font-semibold text-neutral-600">₦{balance}</Text>
            </Animated.View>

            <View className="flex-row items-center gap-1 px-2 py-2">
              <CoinsIcon />
              <Text className="text-m font-semibold text-neutral-600">{coins}</Text>
            </View>
          </Pressable>
        </View>
        <View className="flex-row items-center gap-2">
          <TimerIcon />
          <Text className="text-neutral-600 text-lg font-bold">{formatTime(gameTimer)}</Text>
        </View>
      </View>

      {/* Main Game Area */}
      <View className="flex-1">
        {/* Players Grid */}
        <View className="h-[60%]">
          <PlayerGrid
            players={gameState.players}
            currentTurn={gameState.currentTurn}
            myId={user ? user.id : ''}
          />
          <View className="absolute  top-[15%] w-full">
            {/* Last Played Card */}
            <View className="mb-4 left-[38%]">
              <GameCard card={{ id: 'played', shape: 'star', number: 1 }} size="lg" />
            </View>

            {/* Market Pile */}
            <Pressable className="top-[10%] w-[85px] left-[38%] relative" onPress={handleMarket}>
              <View className="   h-[120px] bg-primary rounded-lg p-2 justify-center items-center">
                <Text className="text-white font-bold text-lg">Market</Text>
                {/* <Text className="text-white text-xs mt-1">pile</Text> */}
                <View className=" absolute top-1 right-1 bg-neutral-200 rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold">5</Text>
                </View>
              </View>
            </Pressable>

            {/* Game Status */}
            <View className=" w-full px-6 py-3 rounded-md top-[18%]">
              <Text className="text-white text-center text-sm">Game status</Text>
            </View>
          </View>
          {/* <View className="relative h-[50%] bg-neutral-800  mt-2">
            <PlayerSlot player={players[0]} isActive={true} position="top-left" />
            <PlayerSlot player={players[1]} isActive={false} position="top-right" />
            <PlayerSlot player={players[2]} isActive={false} position="bottom-left" />
            <PlayerSlot player={players[3]} isActive={false} position="bottom-right" />
          </View> */}

          {/* Center Playing Area */}
        </View>
        {/* Bottom Section - Player's Cards */}
        <View className="bg-neutral-800 h-[40%] w-full rounded-t-3xl py-2 ">
          <View className="flex-row border-b-2 border-neutral-700">
            <Pressable
              onPress={() => setActiveTab('cards')}
              className={`flex-1 py-3 ${activeTab === 'cards' ? 'border-b-[1.2px] border-primary-400' : ''}`}
            >
              <Text className="text-white text-center font-semibold">My cards</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('chat')}
              className={`flex-1 py-3 ${activeTab === 'chat' ? 'border-b-[1.2px] border-primary-400' : ''}`}
            >
              <Text className="text-white text-center font-semibold">Game chat</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('menu')}
              className={`flex-1 py-3 ${activeTab === 'menu' ? 'border-b-[1.2px] border-primary-400' : ''}`}
            >
              <Text className="text-white text-center font-semibold">Menu</Text>
            </Pressable>
          </View>
          {activeTab === 'cards' && (
            <FlatList
              data={myCards}
              numColumns={5}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
              className="bg-gray-800 rounded-lg p-2"
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
              renderItem={({ item }) => (
                <View style={{ flex: 1, maxWidth: '20%' }}>
                  <GameCard card={item} size="sm" onPress={() => handleCardClick(item)} />
                </View>
              )}
            />
          )}

          {/* Bottom Tabs */}
        </View>
      </View>
    </SafeAreaView>
  );
}
