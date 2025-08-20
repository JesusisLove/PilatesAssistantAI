// src/components/setup/UserProfileSetup.js
// 简化版用户画像收集 - 只问核心问题

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileSetup = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    age: null,
    gender: null,
    experience: null,
    language: null,
    timePreference: null,
    goals: []
  });

  // 问题配置
  const questions = [
    {
      id: 'age',
      title: '你的年龄段？',
      subtitle: '帮助AI推荐适合的训练强度',
      icon: 'person',
      options: [
        { value: 25, label: '18-35岁', desc: '年轻活力，可以尝试各种强度' },
        { value: 42, label: '36-50岁', desc: '工作忙碌，注重效率和安全' },
        { value: 55, label: '50岁以上', desc: '温和训练，注重健康维护' }
      ]
    },
    {
      id: 'gender',
      title: '性别？',
      subtitle: 'AI会推荐更适合的训练内容',
      icon: 'people',
      options: [
        { value: 'female', label: '女性', desc: '更多塑形和柔韧性训练' },
        { value: 'male', label: '男性', desc: '更多力量和核心训练' }
      ]
    },
    {
      id: 'experience',
      title: '普拉提经验？',
      subtitle: '确保推荐合适难度的课程',
      icon: 'fitness',
      options: [
        { value: '新手', label: '完全新手', desc: '从最基础的动作开始' },
        { value: '有基础', label: '练过一些', desc: '可以尝试进阶动作' },
        { value: '比较熟练', label: '比较熟练', desc: '挑战高难度训练' }
      ]
    },
    {
      id: 'language',
      title: '语言偏好？',
      subtitle: '选择你更容易理解的指导语言',
      icon: 'globe',
      options: [
        { value: 'chinese', label: '中文指导', desc: '小红书、国内教练' },
        { value: 'english', label: '英文也OK', desc: 'YouTube、国外教练' },
        { value: 'both', label: '都可以', desc: '内容更丰富多样' }
      ]
    },
    {
      id: 'timePreference',
      title: '通常有多少时间？',
      subtitle: 'AI会推荐合适时长的课程',
      icon: 'time',
      options: [
        { value: '10分钟以内', label: '10分钟以内', desc: '快速高效，适合忙碌生活' },
        { value: '15分钟以内', label: '10-15分钟', desc: '标准训练时长' },
        { value: '20分钟以上', label: '15分钟以上', desc: '充分训练，效果更好' }
      ]
    }
  ];

  // 更新选择
  const handleSelect = (questionId, value) => {
    setProfile(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 下一步
  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    const currentValue = profile[currentQuestion.id];
    
    if (!currentValue) {
      Alert.alert('请选择一个选项', '这样AI才能为你提供最佳推荐😊');
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // 上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 完成设置
  const handleComplete = async () => {
    try {
      // 保存用户画像
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      
      // 添加设置完成标记
      await AsyncStorage.setItem('profileSetupComplete', 'true');
      
      console.log('✅ 用户画像保存成功:', profile);
      
      // 回调通知完成
      if (onComplete) {
        onComplete(profile);
      }
    } catch (error) {
      console.error('❌ 保存用户画像失败:', error);
      Alert.alert('保存失败', '请重试或联系客服');
    }
  };

  const currentQuestion = questions[currentStep];
  const currentValue = profile[currentQuestion.id];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* 状态栏 */}
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} / {questions.length}
        </Text>
      </View>

      {/* 问题区域 */}
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Ionicons name={currentQuestion.icon} size={40} color="#4CAF50" />
          <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>
        </View>

        {/* 选项列表 */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                currentValue === option.value && styles.selectedOption
              ]}
              onPress={() => handleSelect(currentQuestion.id, option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <Text style={[
                  styles.optionLabel,
                  currentValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {currentValue === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </View>
              <Text style={[
                styles.optionDesc,
                currentValue === option.value && styles.selectedOptionDesc
              ]}>
                {option.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 控制按钮 */}
      <View style={styles.controlsContainer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={20} color="#666" />
            <Text style={styles.secondaryButtonText}>上一步</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !currentValue && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!currentValue}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep === questions.length - 1 ? '开始体验' : '下一步'}
          </Text>
          <Ionicons 
            name={currentStep === questions.length - 1 ? "rocket" : "chevron-forward"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* 底部提示 */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          🔒 你的信息仅用于个性化推荐，我们承诺保护隐私
        </Text>
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24, // 适配状态栏
  },
  
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  
  // 进度条
  progressContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  // 问题区域
  questionContainer: {
    flex: 1,
    marginBottom: 30,
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  // 选项
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedOptionText: {
    color: '#4CAF50',
  },
  optionDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedOptionDesc: {
    color: '#2E7D32',
  },

  // 控制按钮
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginLeft: 10,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 5,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },

  // 底部提示
  footerContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default UserProfileSetup;