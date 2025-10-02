import numpy as np
from collections import Counter
from datetime import datetime

class BehaviorAnalyzer:
    def analyze_patterns(self, user_id, challenge_history):
        """Analyze user behavior patterns from challenge history"""
        
        if not challenge_history:
            return self._default_patterns()
        
        # Analyze category preferences
        categories = [ch.get('category') for ch in challenge_history if ch.get('category')]
        category_counts = Counter(categories)
        preferred_categories = [cat for cat, _ in category_counts.most_common(3)]
        
        # Calculate completion rate
        completed = sum(1 for ch in challenge_history if ch.get('completed'))
        completion_rate = (completed / len(challenge_history) * 100) if challenge_history else 0
        
        # Analyze time patterns
        completion_times = [
            ch.get('timeToComplete', 7) 
            for ch in challenge_history 
            if ch.get('completed')
        ]
        avg_time_to_complete = np.mean(completion_times) if completion_times else 7
        
        # Analyze difficulty progression
        difficulties = [ch.get('difficulty') for ch in challenge_history]
        difficulty_progression = self._analyze_difficulty_progression(difficulties)
        
        # Detect engagement patterns
        engagement_level = self._calculate_engagement_level(challenge_history)
        
        return {
            'preferredCategories': preferred_categories,
            'completionRate': round(completion_rate, 2),
            'averageTimeToComplete': round(avg_time_to_complete, 2),
            'difficultyProgression': difficulty_progression,
            'engagementLevel': engagement_level,
            'totalChallenges': len(challenge_history),
            'completedChallenges': completed,
            'mostActiveTime': 'evening',  # Could be calculated from timestamps
            'recommendedDifficulty': self._recommend_difficulty(completion_rate)
        }
    
    def _default_patterns(self):
        """Return default patterns for new users"""
        return {
            'preferredCategories': ['health'],
            'completionRate': 0,
            'averageTimeToComplete': 7,
            'difficultyProgression': 'beginner',
            'engagementLevel': 'new',
            'totalChallenges': 0,
            'completedChallenges': 0,
            'mostActiveTime': 'morning',
            'recommendedDifficulty': 'easy'
        }
    
    def _analyze_difficulty_progression(self, difficulties):
        """Analyze how user's difficulty preferences have evolved"""
        if not difficulties:
            return 'beginner'
        
        recent_difficulties = difficulties[-5:]  # Last 5 challenges
        
        if 'hard' in recent_difficulties or 'expert' in recent_difficulties:
            return 'advanced'
        elif 'medium' in recent_difficulties:
            return 'intermediate'
        else:
            return 'beginner'
    
    def _calculate_engagement_level(self, challenge_history):
        """Calculate user engagement level"""
        if len(challenge_history) == 0:
            return 'new'
        elif len(challenge_history) < 5:
            return 'beginner'
        elif len(challenge_history) < 20:
            return 'regular'
        elif len(challenge_history) < 50:
            return 'active'
        else:
            return 'expert'
    
    def _recommend_difficulty(self, completion_rate):
        """Recommend difficulty level based on completion rate"""
        if completion_rate >= 80:
            return 'hard'
        elif completion_rate >= 60:
            return 'medium'
        else:
            return 'easy'
