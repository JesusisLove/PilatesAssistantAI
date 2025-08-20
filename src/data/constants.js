// src/data/constants.js
// 应用常量定义

// 应用信息
export const APP_INFO = {
  name: 'PilatesAI',
  version: '1.0.0',
  description: '你的AI普拉提教练',
  author: 'PilatesAI Team'
};

// 用户画像选项
export const USER_PROFILE_OPTIONS = {
  ageGroups: [
    { value: 25, label: '18-35岁', group: 'young' },
    { value: 42, label: '36-50岁', group: 'middle' },
    { value: 55, label: '50岁以上', group: 'senior' }
  ],
  
  genders: [
    { value: 'female', label: '女性' },
    { value: 'male', label: '男性' }
  ],
  
  experienceLevels: [
    { value: '新手', label: '完全新手', level: 1 },
    { value: '有基础', label: '练过一些', level: 2 },
    { value: '比较熟练', label: '比较熟练', level: 3 }
  ],
  
  languages: [
    { value: 'chinese', label: '中文指导' },
    { value: 'english', label: '英文也OK' },
    { value: 'both', label: '都可以' }
  ],
  
  timePreferences: [
    { value: '10分钟以内', label: '10分钟以内', seconds: 600 },
    { value: '15分钟以内', label: '10-15分钟', seconds: 900 },
    { value: '20分钟以上', label: '15分钟以上', seconds: 1800 }
  ]
};

// 视频分类
export const VIDEO_CATEGORIES = {
  targets: {
    'abs': '腹部',
    'legs': '腿部',
    'arms': '手臂', 
    'back': '背部',
    'full': '全身'
  },
  
  levels: {
    1: '初学者',
    2: '进阶',
    3: '高级'
  },
  
  platforms: {
    'youtube': 'YouTube',
    'xiaohongshu': '小红书'
  }
};

// AI教练风格
export const COACH_STYLES = {
  gentle: {
    name: '温柔鼓励',
    description: '温和陪伴，适合女性和初学者',
    icon: 'heart',
    color: '#E91E63'
  },
  strict: {
    name: '严格督促', 
    description: '严格要求，适合男性和挑战者',
    icon: 'fitness',
    color: '#FF5722'
  },
  friend: {
    name: '朋友陪伴',
    description: '朋友式鼓励，适合年轻人', 
    icon: 'people',
    color: '#2196F3'
  },
  professional: {
    name: '专业指导',
    description: '专业建议，适合有经验者',
    icon: 'school',
    color: '#4CAF50'
  }
};

// 训练相关常量
export const TRAINING_CONSTANTS = {
  // 运动检测阈值
  movementThreshold: 15, // 运动强度阈值
  stopDetectionDelay: 5000, // 停止检测延迟 (毫秒)
  encouragementInterval: 120000, // 鼓励间隔 (毫秒)
  
  // 训练时长分类
  durations: {
    short: { min: 0, max: 600, label: '短时训练' }, // 0-10分钟
    medium: { min: 600, max: 1200, label: '标准训练' }, // 10-20分钟  
    long: { min: 1200, max: 3600, label: '长时训练' } // 20-60分钟
  },
  
  // 完成度评级
  completionRating: {
    excellent: { min: 90, label: '优秀', emoji: '🏆' },
    good: { min: 70, label: '良好', emoji: '👍' },
    average: { min: 50, label: '一般', emoji: '😊' },
    needsWork: { min: 0, label: '需要努力', emoji: '💪' }
  }
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  PROFILE_SETUP_COMPLETE: 'profileSetupComplete', 
  TRAINING_RECORDS: 'trainingRecords',
  APP_SETTINGS: 'appSettings',
  COACH_STYLE: 'coachStyle',
  LAST_TRAINING_DATE: 'lastTrainingDate',
  TOTAL_TRAINING_TIME: 'totalTrainingTime',
  FAVORITE_VIDEOS: 'favoriteVideos',
  TRAINING_STREAK: 'trainingStreak'
};

// 网络相关
export const NETWORK_CONFIG = {
  requestTimeout: 10000, // 请求超时时间
  retryAttempts: 3, // 重试次数
  retryDelay: 1000 // 重试延迟
};

// 应用设置默认值
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  voiceCoachEnabled: true,
  cameraDetectionEnabled: true,
  notificationsEnabled: true,
  theme: 'light',
  language: 'chinese'
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  CAMERA_PERMISSION_DENIED: '摄像头权限被拒绝，请在设置中开启',
  MICROPHONE_PERMISSION_DENIED: '麦克风权限被拒绝，请在设置中开启',
  VIDEO_LOAD_FAILED: '视频加载失败，请重试',
  STORAGE_ERROR: '数据保存失败，请重试',
  UNKNOWN_ERROR: '发生未知错误，请重启应用'
};

// 成功消息
export const SUCCESS_MESSAGES = {
  PROFILE_SAVED: '用户资料保存成功',
  TRAINING_COMPLETED: '训练完成，太棒了！',
  SETTINGS_UPDATED: '设置更新成功',
  DATA_SYNCED: '数据同步成功'
};

// API端点 (未来如果需要服务器)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.pilatesai.com',
  USER_PROFILE: '/api/user/profile',
  TRAINING_RECORDS: '/api/training/records',
  VIDEO_LIBRARY: '/api/videos',
  FEEDBACK: '/api/feedback'
};

// 社交分享文案
export const SHARE_MESSAGES = {
  TRAINING_COMPLETE: '我刚刚用 PilatesAI 完成了一次完美的普拉提训练！💪',
  STREAK_ACHIEVEMENT: '我已经连续训练 {days} 天了！坚持就是胜利！🏆',
  MILESTONE: '我在 PilatesAI 上累计训练了 {hours} 小时！🎉'
};

// 动画配置
export const ANIMATION_CONFIG = {
  spring: {
    damping: 12,
    stiffness: 120,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
  timing: {
    duration: 300,
    useNativeDriver: true,
  }
};

export default {
  APP_INFO,
  USER_PROFILE_OPTIONS,
  VIDEO_CATEGORIES,
  COACH_STYLES,
  TRAINING_CONSTANTS,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};