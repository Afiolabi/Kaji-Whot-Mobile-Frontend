import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

// Icons
const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TimerIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="2" />
    <Path d="M12 6V12L16 14" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const PotIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 7.5V18.5C21 19.88 19.88 21 18.5 21H5.5C4.12 21 3 19.88 3 18.5V7.5C3 6.12 4.12 5 5.5 5H18.5C19.88 5 21 6.12 21 7.5Z"
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

const InviteIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="8.5" cy="7" r="4" stroke="#000" strokeWidth="2" />
    <Path d="M20 8V14M23 11H17" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SendIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke="#FF385C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Types
interface Player {
  id: string;
  username: string;
  avatar?: string;
  isHost: boolean;
  isReady: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  isMe: boolean;
}

// Mock data
const MOCK_PLAYERS: Player[] = [
  { id: '1', username: 'Officer woos', isHost: true, isReady: true },
  { id: '2', username: 'Player 1', isHost: false, isReady: false },
  { id: '3', username: 'Player 2', isHost: false, isReady: false },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    username: 'User12345',
    message: 'I would be glad to help. When is this game starting? Loren ipsum dolorum.',
    timestamp: Date.now() - 120000,
    isMe: false,
  },
  {
    id: '2',
    userId: '2',
    username: 'User12345',
    message: 'I would be glad to help. When is this game starting? Loren ipsum dolorum.',
    timestamp: Date.now() - 60000,
    isMe: false,
  },
  {
    id: '3',
    userId: 'me',
    username: 'Me',
    message: 'I would be glad to help.',
    timestamp: Date.now() - 30000,
    isMe: true,
  },
  {
    id: '4',
    userId: '3',
    username: 'User12345',
    message: 'I would be glad to help. When is this game starting? Loren ipsum dolorum.',
    timestamp: Date.now() - 10000,
    isMe: false,
  },
];

// Components
const PlayerSlot = ({
  player,
  isEmpty,
  onInvite,
  isHost,
}: {
  player?: Player;
  isEmpty?: boolean;
  onInvite?: () => void;
  isHost: boolean;
}) => {
  if (isEmpty) {
    return (
      <View className="items-center">
        <TouchableOpacity
          onPress={onInvite}
          disabled={!isHost}
          className="w-20 h-24 rounded-2xl border-2 border-neutral-900 items-center justify-center mb-2"
          activeOpacity={0.7}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="w-20 h-24 rounded-2xl bg-neutral-200 items-center justify-center mb-2 relative">
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
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
        {player?.isHost && (
          <View className="absolute top-1 right-1 bg-primary rounded-full px-2 py-0.5">
            <Text className="text-white text-[10px] font-bold">Host</Text>
          </View>
        )}
      </View>
      <Text className="text-sm font-semibold text-neutral-900">{player?.username}</Text>
    </View>
  );
};

const ChatMessageItem = ({ message }: { message: ChatMessage }) => {
  return (
    <View className={`mb-3 ${message.isMe ? 'items-end' : 'items-start'}`}>
      {!message.isMe && (
        <Text className="text-xs font-semibold text-neutral-600 mb-1">{message.username}</Text>
      )}
      <View
        className={`rounded-2xl px-2 py-1 max-w-[80%] ${
          message.isMe ? 'bg-neutral-100' : 'bg-white border border-neutral-200'
        }`}
      >
        <Text className="text-sm text-neutral-900">{message.message}</Text>
      </View>
    </View>
  );
};

export default function LobbyScreen() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();
  const user = useAppSelector((state: RootState) => state.user.user);

  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [countdown, setCountdown] = useState<number | null>(3);
  const [potAmount] = useState(500000);
  const scrollViewRef = useRef<ScrollView>(null);

  const isUserHost = players.some((p) => p.id === user?.id && p.isHost);
  const maxPlayers = 4;

  useEffect(() => {
    // Countdown logic
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Navigate to game screen
      router.push(`/(game)/game-screen/${roomId}`);
    }
  }, [countdown, roomId, router]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user?.id || 'me',
        username: user?.username || 'Me',
        message: messageInput.trim(),
        timestamp: Date.now(),
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleInvite = () => {
    // TODO: Open invite modal
    console.log('Invite player');
  };

  const handleJoinAudience = () => {
    // TODO: Join as observer
    console.log('Join audience');
  };

  const handleStartGame = () => {
    // Check if at least 2 players are ready
    const readyPlayers = players.filter((p) => p.isReady).length;
    if (readyPlayers >= 2) {
      setCountdown(5); // Start 5-second countdown
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-neutral-100">
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="flex-row items-center mr-4">
            <PotIcon />
            <Text className="text-sm font-bold text-neutral-900 ml-2">N{potAmount.toLocaleString()}</Text>
          </View>
          <View className="flex-row items-center">
            <TimerIcon />
            <Text className="text-sm font-bold text-neutral-900 ml-2">
              {countdown !== null ? `Starting in ${formatTime(countdown)}` : '03:15'}
            </Text>
          </View>
        </View>
      </View>

      {/* Game Info */}
      <View className="px-4 py-3 items-center border-b border-neutral-100">
        <Text className="text-xl font-bold text-neutral-900">Kaji Whot | Amateur room</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Players Grid */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-neutral-600">Players</Text>
            {isUserHost && (
              <TouchableOpacity
                onPress={handleInvite}
                className="flex-row items-center bg-primary rounded-full px-3 py-1.5"
                activeOpacity={0.7}
              >
                <InviteIcon />
                <Text className="text-white text-sm font-semibold ml-1">Invite</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-around">
            {Array.from({ length: maxPlayers }).map((_, index) => (
              <PlayerSlot
                key={index}
                player={players[index]}
                isEmpty={!players[index]}
                onInvite={handleInvite}
                isHost={isUserHost}
              />
            ))}
          </View>
        </View>

        {/* Join Audience Button */}
        <TouchableOpacity
          onPress={handleJoinAudience}
          className="bg-white rounded-2xl p-4 mb-4 border-2 border-neutral-900 items-center"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <PlusIcon />
            <Text className="text-base font-bold text-neutral-900 ml-2">Join Audience</Text>
          </View>
          <Text className="text-sm text-neutral-600 mt-1">Fee: Nrank fee</Text>
        </TouchableOpacity>

        {/* Chat Section */}
        <View className="flex-1 mb-4">
          <Text className="text-base font-semibold text-neutral-600 mb-3">Game Chat</Text>
          <View className="bg-neutral-50 rounded-2xl p-4 min-h-[200px] border border-neutral-200">
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Start Game Button (Host Only) */}
        {isUserHost && (
          <TouchableOpacity
            onPress={handleStartGame}
            className="bg-primary rounded-2xl p-4 items-center mb-4"
            activeOpacity={0.7}
            disabled={countdown !== null}
          >
            <Text className="text-white text-base font-bold">
              {countdown !== null ? `Starting in ${countdown}...` : 'Start Game'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Chat Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="px-4 py-3 border-t border-neutral-100 flex-row items-center bg-white">
          <View className="flex-1 flex-row items-center bg-neutral-50 rounded-full px-4 py-2 mr-2 border border-neutral-200">
            <TouchableOpacity activeOpacity={0.7} className="mr-2">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#6A6A6A" strokeWidth="2" />
                <Path d="M12 5V19M5 12H19" stroke="#6A6A6A" strokeWidth="2" />
              </Svg>
            </TouchableOpacity>

            <TextInput
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="Aa"
              placeholderTextColor="#B0B0B0"
              className="flex-1 text-base text-neutral-900"
              onSubmitEditing={handleSendMessage}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
            activeOpacity={0.7}
          >
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}