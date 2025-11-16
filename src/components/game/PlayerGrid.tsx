import PlayerFrame from './PlayerFrame';
import { Player } from '../../types/game.types';
import { View } from 'react-native';

interface PlayerGridProps {
  players: Player[];
  currentTurn: string;
  myId: string;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ players, currentTurn, myId }) => {
  // Arrange players in grid (top-left, top-right, bottom-left, bottom-right)
  const gridPositions = ['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'];

  return (
    <View className="relative h-64 bg-gray-800 rounded-lg">
      {players.map((player, index) => (
        <View
          // key={player.id}
          className={`absolute ${gridPositions[index]} w-32 h-40 m-4`}
        >
          <PlayerFrame
            player={player}
            isActive={currentTurn === player.id}
            isMe={player.id === myId}
          />
        </View>
      ))}
    </View>
  );
};

export default PlayerGrid;