// src/services/VoiceCoachService.js
// AI语音教练服务 - 核心陪练功能

import * as Speech from 'expo-speech';

class VoiceCoachService {
  constructor() {
    this.isInitialized = false;
    this.userProfile = null;
    this.coachingStyle = 'gentle'; // gentle, strict, friend, professional
    this.lastEncouragementTime = 0;
    this.stopCount = 0;
    this.isCurrentlySpeaking = false;
    
    // 不同教练风格的话语库
    this.encouragementLibrary = {
      gentle: {
        start: [
          '准备好了吗？我来陪你一起训练！',
          '今天让我们一起创造更好的自己',
          '放松心情，跟着节奏慢慢来',
          '我会全程陪着你，别担心'
        ],
        stopReminder: [
          '别停下，你能做到的！',
          '坚持住，我相信你！',
          '深呼吸，继续保持',
          '想想你的目标，再坚持一下',
          '每一次坚持都让你更强大'
        ],
        midTraining: [
          '你做得很棒！',
          '已经完成一半了，继续加油！',
          '感受到身体的变化了吗？',
          '保持这个节奏，很好！',
          '你比想象中更强大'
        ],
        complete: [
          '太棒了！今天的训练完美完成！',
          '你已经向目标又近了一步',
          '为自己的坚持感到骄傲吧',
          '今天的你超越了昨天的自己'
        ]
      },
      strict: {
        start: [
          '准备接受挑战了吗？开始！',
          '今天要突破自己的极限！',
          '冠军都是这样练出来的！',
          '没有退路，只有前进！'
        ],
        stopReminder: [
          '不能停！继续！',
          '这点强度算什么！',
          '想要结果就坚持住！',
          '冠军从不轻易放弃！',
          '推到极限才有突破！'
        ],
        midTraining: [
          '很好，就是这个强度！',
          '继续保持，不要放松！',
          '感受肌肉在燃烧！',
          '这就是变强的感觉！',
          '再快一点，再标准一点！'
        ],
        complete: [
          '出色！这就是冠军的表现！',
          '你证明了自己的实力！',
          '这样的训练强度才配得上你的目标！',
          '继续保持，胜利属于你！'
        ]
      },
      friend: {
        start: [
          '一起加油！我陪着你！',
          '今天我们一起变美变强！',
          '朋友，准备好挥洒汗水了吗？',
          '我们都是最棒的！开始吧！'
        ],
        stopReminder: [
          '朋友，别放弃！我们一起坚持！',
          '想想我们的约定，继续！',
          '我知道你可以的，加油！',
          '一起努力，一起变美！',
          '坚持住，胜利就在前方！'
        ],
        midTraining: [
          '我们都在努力变得更好！',
          '一起加油，一起坚持！',
          '你看起来状态很棒！',
          '我们已经完成这么多了！',
          '继续保持，我们最棒！'
        ],
        complete: [
          '我们做到了！太棒了！',
          '又一次证明我们是最棒的！',
          '这样的朋友值得骄傲！',
          '明天我们继续一起加油！'
        ]
      },
      professional: {
        start: [
          '开始今天的普拉提训练',
          '注意保持正确的呼吸节奏',
          '专注核心肌群的控制',
          '让我们开始科学训练'
        ],
        stopReminder: [
          '保持动作连贯性',
          '注意核心收紧',
          '呼吸要配合动作',
          '动作质量比速度重要',
          '继续保持标准姿势'
        ],
        midTraining: [
          '很好，保持这个节奏',
          '感受目标肌群发力',
          '注意身体的正位',
          '呼吸控制很重要',
          '动作幅度很标准'
        ],
        complete: [
          '训练完成，效果很好',
          '今天的动作质量很高',
          '肌肉激活效果达到了',
          '继续保持这个训练水平'
        ]
      }
    };
  }

  // 初始化语音教练
  async initialize(userProfile = null) {
    try {
      this.userProfile = userProfile;
      this.isInitialized = true;
      
      // 根据用户画像选择教练风格
      if (userProfile) {
        this.coachingStyle = this.selectCoachingStyle(userProfile);
      }
      
      console.log('🗣️ 语音教练初始化成功，风格:', this.coachingStyle);
      return true;
    } catch (error) {
      console.error('❌ 语音教练初始化失败:', error);
      return false;
    }
  }

  // 根据用户画像选择教练风格
  selectCoachingStyle(profile) {
    const { gender, age, experience } = profile;
    
    // 简单的风格选择逻辑
    if (gender === 'female' && age < 35) {
      return 'gentle'; // 年轻女性：温柔鼓励
    } else if (gender === 'male') {
      return 'strict'; // 男性：严格督促
    } else if (age < 30) {
      return 'friend'; // 年轻人：朋友陪伴
    } else if (experience === '比较熟练') {
      return 'professional'; // 有经验：专业指导
    } else {
      return 'gentle'; // 默认：温柔鼓励
    }
  }

  // 文字转语音播放
  async speak(text, options = {}) {
    if (!this.isInitialized || this.isCurrentlySpeaking) return;
    
    try {
      this.isCurrentlySpeaking = true;
      
      const speechOptions = {
        language: 'zh-CN', // 中文
        pitch: 1.0,
        rate: 0.8, // 稍慢一点，让用户听清楚
        quality: 'enhanced',
        ...options
      };
      
      await Speech.speak(text, speechOptions);
      
      console.log('🗣️ AI教练说:', text);
    } catch (error) {
      console.error('语音播放失败:', error);
    } finally {
      setTimeout(() => {
        this.isCurrentlySpeaking = false;
      }, 1000);
    }
  }

  // 随机选择话语
  getRandomMessage(category, fallback = '加油！') {
    const messages = this.encouragementLibrary[this.coachingStyle]?.[category];
    if (!messages || messages.length === 0) return fallback;
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  // 训练开始语音
  speakTrainingStart(videoTitle) {
    const startMessage = this.getRandomMessage('start');
    const fullMessage = `${startMessage} 今天我们要练习${videoTitle}。`;
    this.speak(fullMessage);
  }

  // 训练完成语音
  speakTrainingComplete(trainingData) {
    const completeMessage = this.getRandomMessage('complete');
    const stats = `完成度${trainingData.completionRate}%，训练时长${Math.floor(trainingData.duration / 60)}分钟。`;
    const fullMessage = `${completeMessage} ${stats}`;
    this.speak(fullMessage);
  }

  // 处理运动状态更新
  handleMovementUpdate(isMoving, intensity, elapsedSeconds) {
    const now = Date.now();
    
    // 停止运动处理
    if (!isMoving) {
      this.stopCount++;
      
      // 根据停止时长给出不同提醒
      if (this.stopCount === 10) { // 停止5秒 (每500ms检测一次)
        const message = this.getRandomMessage('stopReminder');
        this.speak(message);
        this.lastEncouragementTime = now;
      } else if (this.stopCount === 30) { // 停止15秒
        const message = '休息一下没关系，但不要停太久哦！';
        this.speak(message);
      } else if (this.stopCount === 60) { // 停止30秒
        const message = '需要休息吗？喝口水，我们继续！';
        this.speak(message);
      }
    } else {
      // 重新开始运动，重置计数
      if (this.stopCount > 0) {
        this.stopCount = 0;
        if (this.stopCount > 20) {
          this.speak('很好，继续保持！');
        }
      }
    }

    // 定期鼓励 (每2分钟)
    if (now - this.lastEncouragementTime > 120000 && isMoving) {
      const message = this.getRandomMessage('midTraining');
      this.speak(message);
      this.lastEncouragementTime = now;
    }

    // 特殊强度提醒
    if (isMoving && intensity > 80) {
      if (now - this.lastEncouragementTime > 30000) { // 30秒内不重复
        this.speak('强度很棒，保持住！');
        this.lastEncouragementTime = now;
      }
    }
  }

  // 手动鼓励
  giveEncouragement() {
    const message = this.getRandomMessage('midTraining');
    this.speak(message);
  }

  // 休息提醒
  suggestBreak() {
    const breakMessages = [
      '适当休息一下，喝口水',
      '听听身体的声音，累了就休息',
      '休息30秒，然后我们继续',
      '深呼吸，放松一下'
    ];
    const message = breakMessages[Math.floor(Math.random() * breakMessages.length)];
    this.speak(message);
  }

  // 动作提醒
  giveFormReminder() {
    const formReminders = [
      '注意保持核心收紧',
      '呼吸要配合动作',
      '动作可以慢一点，但要标准',
      '感受肌肉的发力',
      '保持身体稳定'
    ];
    const message = formReminders[Math.floor(Math.random() * formReminders.length)];
    this.speak(message);
  }

  // 时间提醒
  timeReminder(remainingMinutes) {
    if (remainingMinutes === 5) {
      this.speak('还有5分钟，坚持住！');
    } else if (remainingMinutes === 2) {
      this.speak('最后2分钟，冲刺！');
    } else if (remainingMinutes === 1) {
      this.speak('最后1分钟，你一定可以的！');
    }
  }

  // 切换教练风格
  switchCoachingStyle(newStyle) {
    if (this.encouragementLibrary[newStyle]) {
      this.coachingStyle = newStyle;
      console.log('🔄 教练风格切换为:', newStyle);
      
      const announcement = {
        gentle: '我会温柔地陪伴你训练',
        strict: '准备接受严格的训练！',
        friend: '我们一起加油吧！',
        professional: '开始专业训练模式'
      };
      
      this.speak(announcement[newStyle]);
    }
  }

  // 获取当前风格
  getCurrentStyle() {
    return this.coachingStyle;
  }

  // 停止当前语音
  stopSpeaking() {
    Speech.stop();
    this.isCurrentlySpeaking = false;
  }

  // 获取教练风格列表
  getAvailableStyles() {
    return [
      { value: 'gentle', label: '温柔鼓励', desc: '温和陪伴，适合女性和初学者' },
      { value: 'strict', label: '严格督促', desc: '严格要求，适合男性和挑战者' },
      { value: 'friend', label: '朋友陪伴', desc: '朋友式鼓励，适合年轻人' },
      { value: 'professional', label: '专业指导', desc: '专业建议，适合有经验者' }
    ];
  }

  // 重置状态
  reset() {
    this.stopCount = 0;
    this.lastEncouragementTime = 0;
    this.stopSpeaking();
  }
}

// 创建单例实例
const voiceCoachService = new VoiceCoachService();

export default voiceCoachService;