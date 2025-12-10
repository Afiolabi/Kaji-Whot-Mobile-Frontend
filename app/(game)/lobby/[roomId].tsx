import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { GiftedChat, IMessage, Send, InputToolbar, Bubble, Time } from 'react-native-gifted-chat';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { useLobbyActions, useSocket } from '@/hooks/useSocket';
import { socketClient } from '@/services/socket.service';
import { PlayerSlot } from '../select-players';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="8.5" cy="7" r="4" stroke="#fff" strokeWidth="2" />
    <Path d="M20 8V14M23 11H17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
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
  const { roomId, mode } = useLocalSearchParams();
  const user = useAppSelector((state: RootState) => state.user.user);
  const lobby = useAppSelector((state: RootState) => state.lobby);
  const { on, off } = useSocket();
  const { setReady, setUnready, inviteFriend } = useLobbyActions();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [potAmount] = useState(500000);
  const [isJoiningAsPlayer, setIsJoiningAsPlayer] = useState(false);

  const isUserHost = lobby.players.some((p) => p.id === user?.id && p.isHost);
  const isUserInGame = lobby.players.some((p) => p.id === user?.id);
  const isUserObserver = lobby.observers.some((o) => o.id === user?.id);
  const maxPlayers = lobby.settings?.maxPlayers || 4;

  // Initialize with system message
  useEffect(() => {
    setMessages([
      {
        _id: '1',
        text: 'Welcome to the game lobby! Chat with other players while waiting.',
        createdAt: new Date(),
        system: true,
        user: null,
      },
    ]);
  }, []);

  useEffect(() => {
    // Listen for chat messages
    on(
      'chatMessage',
      (data: { userId: string; username: string; message: string; timestamp: number }) => {
        const newMessage: IMessage = {
          _id: Date.now().toString(),
          text: data.message,
          createdAt: new Date(data.timestamp),
          user: {
            _id: data.userId,
            name: data.username,
          },
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
      }
    );

    // Listen for countdown
    on('gameStartCountdown', (data: { seconds: number }) => {
      setCountdown(data.seconds);
    });

    // Listen for game started
    on('gameStarted', () => {
      router.replace(`/(game)/game-screen/${roomId}`);
    });

    return () => {
      off('chatMessage');
      off('gameStartCountdown');
      off('gameStarted');
    };
  }, [on, off, roomId, router]);

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

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    // Emit to socket
    const message = newMessages[0];
    socketClient.emit('chatMessage', { message: message.text });
  }, []);

  const handleReadyToggle = () => {
    const isReady = lobby.players.find((p) => p.id === user?.id)?.isReady;
    if (isReady) {
      setUnready();
    } else {
      setReady();
    }
  };

  const handleInvite = () => {
    // TODO: Open invite modal
    console.log('Invite player');
  };

  const handleJoinAsPlayer = () => {
    setIsJoiningAsPlayer((prev) => !prev);
    console.log('JOining as  player');
    // Emit join as player event
    // Will be handled by socket middleware
  };
  const handleJoinAudience = () => {
    // TODO: Join as observer
    console.log('Join audience');
  };

  // const handleStartGame = () => {
  //   // Check if at least 2 players are ready
  //   const readyPlayers = players.filter((p) => p.isReady).length;
  //   if (readyPlayers >= 2) {
  //     setCountdown(5); // Start 5-second countdown
  //   }
  // };

  const handleBackPress = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
            stroke="#FF385C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Send>
    );
  };

  const renderBubble = (props: any) => {
    return (
      <View>
        {/* Username and Time on top */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: props.currentMessage.user._id === user?.id ? 'flex-end' : 'flex-start',
            marginBottom: 4,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12, color: '#424242', fontWeight: '600' }}>
            {props.currentMessage.user.name}
          </Text>
          <Text style={{ fontSize: 11, color: '#424242', marginLeft: 8 }}>
            {new Date(props.currentMessage.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Message bubble */}
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#a04ef7',
            },
            right: {
              backgroundColor: '#ebe2f7',
            },
          }}
          textStyle={{
            left: {
              color: '#6105f7',
            },
            right: {
              color: '#6105f7',
            },
          }}
          renderTime={() => null} // Hide default time display
        />
      </View>
    );
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
            <Text className="text-sm font-bold text-neutral-900 ml-2">
              ₦{potAmount.toLocaleString()}
            </Text>
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
        <Text className="text-xl font-bold text-neutral-900">Kaji Whot | {getTierName()}</Text>
      </View>

      <View className="px-4 py-4">
        {/* Players Grid */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-neutral-600">
              Players ({lobby.players.length}/{maxPlayers})
            </Text>

            <TouchableOpacity
              onPress={handleInvite}
              className="flex-row items-center bg-purple-500 rounded-full px-3 py-1.5"
              activeOpacity={0.7}
            >
              <InviteIcon />
              <Text className="text-white text-sm font-semibold ml-1">Invite</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={Array.from({ length: maxPlayers })}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ index }) => (
              <PlayerSlot
                label={lobby.players[index]?.username}
                isSelected={isJoiningAsPlayer}
                type={isJoiningAsPlayer === true ? 'player' : 'empty'}
                onPress={handleJoinAsPlayer}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
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
        <View>
          {isUserInGame && !isUserHost && (
            <TouchableOpacity
              onPress={handleReadyToggle}
              className={`rounded-2xl p-4 items-center mb-4 ${
                lobby.players.find((p) => p.id === user?.id)?.isReady
                  ? 'bg-neutral-300'
                  : 'bg-success'
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">
                {lobby.players.find((p) => p.id === user?.id)?.isReady ? 'Not Ready' : 'Ready'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Start Game Button (Host Only) */}
          {isUserHost && (
            <TouchableOpacity
              onPress={() => {}}
              disabled={countdown !== null || !lobby.canStart}
              className={`rounded-2xl p-4 items-center mb-4 ${
                countdown !== null || !lobby.canStart ? 'bg-neutral-300' : 'bg-primary'
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">
                {countdown !== null
                  ? `Starting in ${countdown}...`
                  : lobby.canStart
                    ? 'Start Game'
                    : 'Waiting for players...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Chat Section */}
      </View>

      {/* Chat Input */}

      <ScrollView className="flex-1 rounded-2xl p-2  bg-purple-50 pb-16">
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user?.id || 'guest',
            name: user?.username || 'Guest',
          }}
          renderSend={renderSend}
          renderBubble={renderBubble}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              icon={
                <TouchableOpacity activeOpacity={0.7} className="mr-2">
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="10" stroke="#6A6A6A" strokeWidth="2" />
                    <Path d="M12 5V19M5 12H19" stroke="#6A6A6A" strokeWidth="2" />
                  </Svg>
                </TouchableOpacity>
              }
              containerStyle={{
                backgroundColor: '#fff',
                borderColor: '#a04ef7',
                borderRadius: 50,
                borderWidth: 1,
                marginRight: 2,
                paddingHorizontal: 4,
                paddingVertical: 6,
              }}
            />
          )}
          isSendButtonAlwaysVisible
          renderAvatar={null}
          renderTime={() => null}
          isScrollToBottomEnabled
        />. 
      </ScrollView>
    </SafeAreaView>
  );
}
