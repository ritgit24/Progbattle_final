import random
from typing import List, Dict, Optional

class UserBot3:
    def __init__(self):
        self.name = "StrategicBot_v3"
        self.version = "1.1"
        self.last_move = None
        self.opponent_history = []
        self.round = 0

    def make_move(self, game_state: Dict) -> str:
        """Main method called by game engine to get the bot's move"""
        self.round += 1
        
        # First move is always random
        if self.round == 1:
            self.last_move = random.choice(['R', 'P', 'S'])
            return self.last_move
        
        # Analyze opponent's patterns
        opponent_pattern = self._detect_pattern()
        
        # Counter opponent's most likely move
        if opponent_pattern:
            predicted_move = self._predict_move(opponent_pattern)
            counter_move = self._get_counter(predicted_move)
            self.last_move = counter_move
            return counter_move
        
        # Fallback strategy
        return self._adaptive_strategy()

    def _detect_pattern(self) -> Optional[str]:
        """Detects if opponent is repeating patterns"""
        if len(self.opponent_history) < 3:
            return None
            
        last_three = self.opponent_history[-3:]
        
        # Check for constant moves
        if all(move == last_three[0] for move in last_three):
            return 'constant'
        
        # Check for rotation patterns
        rotations = ['RPS', 'PSR', 'SRP']
        sequence = ''.join(last_three)
        if sequence in rotations:
            return 'rotating'
            
        return None

    def _predict_move(self, pattern: str) -> str:
        """Predicts next move based on detected pattern"""
        if pattern == 'constant':
            return self.opponent_history[-1]
        elif pattern == 'rotating':
            last_move = self.opponent_history[-1]
            return {'R': 'P', 'P': 'S', 'S': 'R'}[last_move]
        else:
            return random.choice(['R', 'P', 'S'])

    def _get_counter(self, move: str) -> str:
        """Returns the move that beats the given move"""
        return {'R': 'P', 'P': 'S', 'S': 'R'}[move]

    def _adaptive_strategy(self) -> str:
        """Adaptive strategy based on opponent's move distribution"""
        if not self.opponent_history:
            return random.choice(['R', 'P', 'S'])
            
        # Calculate move frequencies
        freq = {'R': 0, 'P': 0, 'S': 0}
        for move in self.opponent_history:
            freq[move] += 1
            
        # Find most common move
        common_move = max(freq, key=freq.get)
        
        # Counter with probability weighting
        rand = random.random()
        if rand < 0.7:  # 70% chance to counter most common move
            return self._get_counter(common_move)
        elif rand < 0.9:  # 20% chance to mirror
            return common_move
        else:  # 10% chance random
            return random.choice(['R', 'P', 'S'])

    def update(self, game_state: Dict):
        """Update bot with results of last round"""
        if game_state.get('p2_move'):  # Assuming we're player 1
            self.opponent_history.append(game_state['p2_move'])