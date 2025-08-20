// App.js
// PilatesAI 主应用 - 整合版本

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  Alert,
  Text,
  ActivityIndicator,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入组件
import UserProfileSetup from './src/components/setup/UserProfileSetup';
import VideoRecommendationScreen from './src/components/video/VideoRecommendationScreen';
import VideoPlayerScreen from './src/components/video/VideoPlayerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, setup, home, player
  const [userProfile, setUserProfile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  // 初始化应用
  const initializeApp = async () => {
    try {
      console.log('🚀 PilatesAI 启动中...');
      
      // 检查是否已完成用户设置
      const setupComplete = await AsyncStorage.getItem('profileSetupComplete');
      const profileData = await AsyncStorage.getItem('userProfile');
      
      if (setupComplete === 'true' && profileData) {
        // 已设置，直接进入主页
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        setCurrentScreen('home');
        console.log('✅ 用户已设置，进入主页');
      } else {
        // 未设置，进入设置流程
        setCurrentScreen('setup');
        console.log('📝 用户未设置，进入设置流程');
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ 应用初始化失败:', error);
      Alert.alert('初始化失败', '请重启应用');
    }
  };

  // 完成用户设置
  const handleProfileSetupComplete = (profile) => {
    setUserProfile(profile);
    setCurrentScreen('home');
    console.log('✅ 用户设置完成:', profile);
  };

  // 选择视频开始训练
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setCurrentScreen('player');
    console.log('🎬 选择视频:', video.title);
  };

  // 训练完成
  const handleTrainingComplete = (video, trainingData) => {
    console.log('🏁 训练完成:', {
      video: video.title,
      duration: trainingData.duration,
      completionRate: trainingData.completionRate
    });

    // 这里可以保存训练记录
    saveTrainingRecord(video, trainingData);

    // 返回主页
    setCurrentScreen('home');
    setSelectedVideo(null);

    // 显示完成提示
    Alert.alert(
      '训练完成！🎉',
      `恭喜完成 ${video.title}\n训练时长: ${Math.floor(trainingData.duration / 60)}分钟\n完成度: ${trainingData.completionRate}%`,
      [
        { text: '查看更多训练', onPress: () => {} },
        { text: '好的', style: 'default' }
      ]
    );
  };

  // 保存训练记录
  const saveTrainingRecord = async (video, trainingData) => {
    try {
      const record = {
        id: Date.now().toString(),
        videoId: video.id,
        videoTitle: video.title,
        date: new Date().toISOString(),
        duration: trainingData.duration,
        completionRate: trainingData.completionRate,
        platform: video.platform
      };

      // 获取现有记录
      const existingRecords = await AsyncStorage.getItem('trainingRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      
      // 添加新记录
      records.unshift(record); // 最新的在前面
      
      // 只保留最近50条记录
      const limitedRecords = records.slice(0, 50);
      
      // 保存
      await AsyncStorage.setItem('trainingRecords', JSON.stringify(limitedRecords));
      
      console.log('💾 训练记录已保存');
    } catch (error) {
      console.error('❌ 保存训练记录失败:', error);
    }
  };

  // 返回主页
  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedVideo(null);
  };

  // 编辑用户资料
  const handleProfileEdit = () => {
    setCurrentScreen('setup');
  };

  // 渲染加载页面
  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.appTitle}>PilatesAI</Text>
      <Text style={styles.appSubtitle}>你的AI普拉提教练</Text>
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      <Text style={styles.loadingText}>正在启动...</Text>
    </View>
  );

  // 渲染当前页面
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return renderLoadingScreen();
        
      case 'setup':
        return (
          <UserProfileSetup 
            onComplete={handleProfileSetupComplete}
          />
        );
        
      case 'home':
        return (
          <VideoRecommendationScreen
            onVideoSelect={handleVideoSelect}
            onProfileEdit={handleProfileEdit}
          />
        );
        
      case 'player':
        return (
          <VideoPlayerScreen
            video={selectedVideo}
            userProfile={userProfile}
            onComplete={handleTrainingComplete}
            onBack={handleBackToHome}
          />
        );
        
      default:
        return renderLoadingScreen();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={currentScreen === 'player' ? "light-content" : "dark-content"}
        backgroundColor={currentScreen === 'player' ? "#000" : "#f8f9fa"}
        hidden={currentScreen === 'player'}
      />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 加载页面
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight || 24) + 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});