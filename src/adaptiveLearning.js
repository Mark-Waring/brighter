export default class AdaptiveLearning {
  constructor(config = {}) {
    this.questionsPerLevel = config.questionsPerLevel;
    this.masteryThreshold = config.masteryThreshold || 0.8;
    this.demotionThreshold = config.demotionThreshold || 0.3;
    this.performanceHistory = [];
  }

  processResponse(isCorrect, currentLevel) {
    this.performanceHistory.push({
      level: currentLevel,
      isCorrect,
    });

    if (currentLevel === 1) {
      this.questionsPerLevel = 1;
    } else if (this.questionsPerLevel !== currentLevel + 1) {
      this.questionsPerLevel = currentLevel + 1;
    }

    const recentPerformance = this.performanceHistory
      .filter((p) => p.level === currentLevel)
      .slice(-this.questionsPerLevel);

    const mastery =
      recentPerformance.filter((p) => p.isCorrect).length /
      recentPerformance.length;

    if (recentPerformance.length >= this.questionsPerLevel) {
      if (mastery >= this.masteryThreshold) {
        return 1;
      } else if (mastery <= this.demotionThreshold) {
        return -1;
      }
    }
    return 0;
  }
}
