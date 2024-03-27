class NumberUtil {
  static calculateChangedValue(value, changed, negative = false) {
    const newValue = value + changed;

    if (negative) return newValue;

    return Math.max(0, newValue);
  }

  static calculateChangedMilestone(currentMilestone, changed, milestones) {
    if (!milestones) return currentMilestone;

    const { value: currentValue, level: currentLevel } = currentMilestone;
    const { maxValue, ...rest } = milestones[currentLevel];

    let newValue = currentValue + changed;
    let newLevel = currentLevel;

    // Exceeded current milestone value, change to next milestone
    if (newValue >= maxValue) {
      // Reached max milestone, there is no need to recursive
      if (newLevel + 1 > Object.keys(milestones).length)
        return milestones[newLevel];

      const nextMilestone = milestones[newLevel + 1];
      const { maxValue: nextMaxValue, level: nextLevel } = nextMilestone;

      newValue -= maxValue;
      newLevel = nextLevel;

      if (newValue >= nextMaxValue)
        return NumberUtil.calculateChangedMilestone(
          nextMilestone,
          changed,
          milestones
        );
    }

    // Lose current milestone value, change to previous milestone
    if (newValue < 0) {
      // Reached min milestone, there is no need to recursive
      if (newLevel - 1 <= 0) return { ...milestones[newLevel], value: 0 };

      const prevMilestone = milestones[newLevel - 1];
      const { maxValue: prevMaxValue, level: prevLevel } = prevMilestone;

      newValue += prevMaxValue;
      newLevel = prevLevel;

      if (newValue < 0)
        return NumberUtil.calculateChangedMilestone(
          prevMilestone,
          changed,
          milestones
        );
    }

    return {
      ...rest,
      maxValue,
      value: newValue,
      level: newLevel,
    };
  }
}

module.exports = NumberUtil;
