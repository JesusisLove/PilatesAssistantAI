// src/services/AICoachService.js
// PilatesAI 核心AI教练服务

import AsyncStorage from '@react-native-async-storage/async-storage';

class AICoachService {
  constructor() {
    this.userProfile = null;
    this.currentSession = null;
    this.encouragementCount = 0;
    this.lastMovementTime = Date.now();
    
    // AI教练人格配置
    this.coachPersonality = {
      gentle: {
        name: '温柔导师',
        style: 'supportive',
        encouragements: [
          '慢慢来，你做得很好',
          '深呼吸，感受身体的变化',
          '相信自己，你一定可以的',
          '每一次练习都是进步'
        ]
      },
      motivational: {
        name: '活力教练',
        style: 'energetic',
        encouragements: [
          '加油！你比想象中更强大！',
          '感受肌肉的力量！',
          '坚持住，马甲线在向你招手！',
          '你的努力不会白费！'
        ]
      },
      professional: {
        name: '专业导师',
        style: 'technical',
        encouragements: [
          '注意保持核心收紧',
          '呼吸要与动作配合',
          '感受深层肌肉的参与',
          '质量比数量更重要'
        ]
      }
    };
  }

  // 初始化AI教练
  async initialize(userProfile) {
    this.userProfile = userProfile;
    
    // 根据用户特征选择教练风格
    const coachStyle = this.selectCoachStyle(userProfile);
    this.currentCoach = this.coachPersonality[coachStyle];
    
    // 保存用户配置
    await this.saveUserProfile(userProfile);
    
    return {
      welcomeMessage: this.generateWelcomeMessage(),
      coachStyle: coachStyle,
      dailyGoal: this.calculateDailyGoal(userProfile)
    };
  }

  // 根据用户特征选择AI教练风格
  selectCoachStyle(profile) {
    // 年轻用户倾向于活力型教练
    if (profile.age < 30) {
      return 'motivational';
    }
    
    // 零基础用户需要温柔引导
    if (profile.fitnessLevel === 'beginner') {
      return 'gentle';
    }
    
    // 有经验的用户适合专业指导
    if (profile.fitnessLevel === 'advanced') {
      return 'professional';
    }
    
    // 默认使用温柔型
    return 'gentle';
  }

  // 生成欢迎消息
  generateWelcomeMessage() {
    const timeOfDay = this.getTimeOfDay();
    const userName = this.userProfile?.name || '朋友';
    
    const welcomeMessages = {
      morning: `早上好，${userName}！新的一天，让我们用普拉提唤醒身体的活力吧！`,
      afternoon: `下午好，${userName}！工作间隙来一组普拉提，为身体充充电！`,
      evening: `晚上好，${userName}！结束忙碌的一天，让普拉提帮你放松身心！`
    };
    
    return welcomeMessages[timeOfDay];
  }

  // 推荐今日训练
  recommendTodayWorkout() {
    if (!this.userProfile) return null;
    
    const { fitnessLevel, availableTime, targetAreas, goal } = this.userProfile;
    
    // 获取训练库
    const workoutLibrary = this.getWorkoutLibrary();
    
    // 根据用户条件筛选
    let suitableWorkouts = workoutLibrary.filter(workout => {
      return workout.level === fitnessLevel && 
             workout.duration <= parseInt(availableTime);
    });
    
    // 根据目标部位进一步筛选
    if (targetAreas && targetAreas.length > 0) {
      suitableWorkouts = suitableWorkouts.filter(workout => {
        return targetAreas.some(area => workout.targetAreas.includes(area));
      });
    }
    
    // 如果没有合适的，返回基础训练
    if (suitableWorkouts.length === 0) {
      suitableWorkouts = workoutLibrary.filter(w => w.level === 'beginner');
    }
    
    // 随机选择一个（后续可以添加更智能的算法）
    const selectedWorkout = suitableWorkouts[
      Math.floor(Math.random() * suitableWorkouts.length)
    ];
    
    return {
      ...selectedWorkout,
      aiTip: this.generateWorkoutTip(selectedWorkout),
      encouragement: this.getRandomEncouragement()
    };
  }

  // 分析运动状态并提供反馈
  analyzeMovementState(isMoving, exerciseProgress = 0) {
    const now = Date.now();
    const idleTime = now - this.lastMovementTime;
    
    if (isMoving) {
      this.lastMovementTime = now;
      return {
        state: 'active',
        feedback: null,
        encouragement: null
      };
    }
    
    // 根据停止时间生成不同级别的鼓励
    if (idleTime > 5000 && idleTime < 15000) {
      return {
        state: 'paused',
        feedback: 'gentle_nudge',
        encouragement: this.getGentleEncouragement(),
        urgency: 'low'
      };
    } else if (idleTime > 15000 && idleTime < 30000) {
      return {
        state: 'stopped',
        feedback: 'motivational_push',
        encouragement: this.getMotivationalEncouragement(),
        urgency: 'medium'
      };
    } else if (idleTime > 30000) {
      return {
        state: 'abandoned',
        feedback: 'strong_encouragement',
        encouragement: this.getStrongEncouragement(),
        urgency: 'high'
      };
    }
    
    return { state: 'active', feedback: null, encouragement: null };
  }

  // 生成个性化鼓励语句
  getRandomEncouragement() {
    if (!this.currentCoach) return '加油，你可以的！';
    
    const encouragements = this.currentCoach.encouragements;
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  getGentleEncouragement() {
    const userName = this.userProfile?.name || '';
    const gentle = [
      `${userName}，深呼吸，我们继续`,
      '没关系，慢慢来，感受每一个动作',
      '你已经做得很好了，坚持一下',
      '聆听身体的声音，然后继续前进'
    ];
    return gentle[Math.floor(Math.random() * gentle.length)];
  }

  getMotivationalEncouragement() {
    const motivational = [
      '想想你的目标！每一次坚持都在改变你！',
      '你比你想象的更强大！',
      '普拉提的魅力就在于坚持！',
      '感受肌肉在燃烧，这是蜕变的信号！'
    ];
    return motivational[Math.floor(Math.random() * motivational.length)];
  }

  getStrongEncouragement() {
    const strong = [
      '不要放弃！这就是突破的时刻！',
      '记住你开始的理由，为了更好的自己！',
      '每个高手都经历过这样的时刻！',
      '坚持下去，你会感谢今天努力的自己！'
    ];
    return strong[Math.floor(Math.random() * strong.length)];
  }

  // 生成训练小贴士
  generateWorkoutTip(workout) {
    const tips = {
      abs: [
        '普拉提的核心在于控制，不是速度',
        '保持呼吸稳定，动作要有控制',
        '感受腹部深层肌肉的参与',
        '质量胜过数量，每个动作都要标准'
      ],
      fullbody: [
        '全身协调比单个动作的完美更重要',
        '保持身体的流畅性，像水一样柔顺',
        '专注于肌肉的连接和协调',
        '呼吸是普拉提的灵魂，不要忘记'
      ],
      flexibility: [
        '拉伸时要放松，不要强迫身体',
        '感受肌肉慢慢放松的过程',
        '保持深呼吸，让身体自然伸展',
        '柔韧性需要时间，耐心是关键'
      ]
    };
    
    const targetArea = workout.targetAreas[0] || 'fullbody';
    const tipCategory = tips[targetArea] || tips.fullbody;
    
    return tipCategory[Math.floor(Math.random() * tipCategory.length)];
  }

  // 计算每日目标
  calculateDailyGoal(profile) {
    const availableMinutes = parseInt(profile.availableTime) || 30;
    const fitnessLevel = profile.fitnessLevel || 'beginner';
    
    const goalMultipliers = {
      beginner: 0.7,
      intermediate: 1.0,
      advanced: 1.3
    };
    
    const baseCalories = availableMinutes * 3; // 基础卡路里消耗
    const targetCalories = Math.round(baseCalories * goalMultipliers[fitnessLevel]);
    
    return {
      duration: availableMinutes,
      targetCalories: targetCalories,
      exercises: fitnessLevel === 'beginner' ? 5 : fitnessLevel === 'intermediate' ? 8 : 12
    };
  }

  // 获取训练库（简化版，实际应该从数据文件导入）
  getWorkoutLibrary() {
    return [
      {
        id: 'pilates_core_beginner',
        title: '初级核心普拉提',
        level: 'beginner',
        duration: 15,
        targetAreas: ['abs'],
        exercises: [
          { name: '呼吸法练习', duration: 60 },
          { name: '骨盆倾斜', duration: 120 },
          { name: '单腿画圈', duration: 180 },
          { name: '轻柔卷腹', duration: 150 },
          { name: '放松拉伸', duration: 90 }
        ],
        description: '温和的核心启动训练，适合普拉提新手',
        benefits: ['改善核心稳定性', '学习正确呼吸', '建立身体意识']
      },
      {
        id: 'pilates_core_intermediate',
        title: '中级核心雕塑',
        level: 'intermediate',
        duration: 30,
        targetAreas: ['abs', 'core'],
        exercises: [
          { name: '百次呼吸', duration: 180 },
          { name: '单腿伸展', duration: 240 },
          { name: '双腿伸展', duration: 300 },
          { name: '旋转拉伸', duration: 240 },
          { name: '平板支撑变式', duration: 180 },
          { name: '放松冥想', duration: 120 }
        ],
        description: '加强核心力量，雕塑腹部线条',
        benefits: ['增强核心力量', '改善身体线条', '提高协调性']
      },
      {
        id: 'pilates_fullbody_advanced',
        title: '高级全身塑形',
        level: 'advanced',
        duration: 45,
        targetAreas: ['fullbody', 'abs', 'legs'],
        exercises: [
          { name: '复合卷腹系列', duration: 360 },
          { name: '侧身平衡', duration: 300 },
          { name: '腿部力量组合', duration: 420 },
          { name: '全身协调流', duration: 480 },
          { name: '高级核心挑战', duration: 300 },
          { name: '深度拉伸恢复', duration: 240 }
        ],
        description: '全面的身体塑形训练，挑战身体极限',
        benefits: ['全身力量提升', '完美身体线条', '增强身体控制力']
      }
    ];
  }

  // 工具方法
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('保存用户配置失败:', error);
    }
  }

  async loadUserProfile() {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('加载用户配置失败:', error);
      return null;
    }
  }

  // 训练完成后的总结和鼓励
  generateWorkoutSummary(sessionData) {
    const { duration, exercisesCompleted, caloriesBurned } = sessionData;
    const userName = this.userProfile?.name || '';
    
    const summaryMessages = [
      `太棒了${userName}！你刚刚完成了${duration}分钟的普拉提训练！`,
      `恭喜你坚持完成${exercisesCompleted}个动作，消耗了约${caloriesBurned}卡路里！`,
      `你的身体正在感谢这次训练，明天会更有活力！`,
      `每一次练习都让你离目标更近一步！`
    ];
    
    return {
      mainMessage: summaryMessages[0],
      achievements: summaryMessages.slice(1),
      nextTrainingTip: '记得给身体适当休息，明天我们继续加油！'
    };
  }
}

// 导出单例实例
export default new AICoachService();