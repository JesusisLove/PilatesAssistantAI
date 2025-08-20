// src/components/video/VideoPlayerScreen.js
// 视频播放 + AI监督集成组件

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import SimpleCameraDetectorModern from '../training/SimpleCameraDetectorModern';
import VoiceCoachService from '../../services/VoiceCoachService';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ 
  video, 
  onComplete, 
  onBack,
  userProfile 
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingData, setTrainingData] = useState({
    startTime: null,
    duration: 0,
    completionRate: 0,
    movementData: []
  });
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const webViewRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    // 初始化语音教练
    VoiceCoachService.initialize(userProfile);
    
    return () => {
      // 清理
      if (isTraining) {
        handleTrainingEnd();
      }
    };
  }, []);

  // 开始训练
  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingData({
      startTime: Date.now(),
      duration: 0,
      completionRate: 0,
      movementData: []
    });

    // AI教练开场白
    VoiceCoachService.speakTrainingStart(video.title);
    
    console.log('🎬 开始训练:', video.title);
  };

  // 结束训练
  const handleTrainingEnd = () => {
    if (!isTraining) return;

    const endTime = Date.now();
    const actualDuration = Math.floor((endTime - trainingData.startTime) / 1000);
    const completionRate = Math.min((actualDuration / video.duration) * 100, 100);

    setIsTraining(false);

    const finalData = {
      ...trainingData,
      duration: actualDuration,
      completionRate: Math.round(completionRate)
    };

    // AI教练结束语
    VoiceCoachService.speakTrainingComplete(finalData);

    console.log('🏁 训练完成:', finalData);
    
    if (onComplete) {
      onComplete(video, finalData);
    }
  };

  // 处理运动检测
  const handleMovementDetected = (isMoving, intensity) => {
    if (!isTraining) return;

    const currentTime = Date.now();
    const newMovementData = {
      timestamp: currentTime,
      isMoving,
      intensity,
      elapsed: Math.floor((currentTime - trainingData.startTime) / 1000)
    };

    setTrainingData(prev => ({
      ...prev,
      movementData: [...prev.movementData.slice(-10), newMovementData] // 只保留最近10个数据点
    }));

    // AI监督逻辑
    VoiceCoachService.handleMovementUpdate(isMoving, intensity, newMovementData.elapsed);
  };

  // 处理AI分析更新
  const handleAnalysisUpdate = (analysis) => {
    // 这里可以根据分析结果进行额外的AI反馈
    if (analysis && analysis.recommendation) {
      console.log('🤖 AI分析:', analysis.recommendation);
    }
  };

  // 切换控制界面显示
  const toggleControls = () => {
    setShowControls(!showControls);
    
    // 3秒后自动隐藏控制界面
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (!showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // 打开外部链接 (小红书)
  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('无法打开链接', '请确保已安装小红书APP');
      }
    } catch (error) {
      console.error('打开链接失败:', error);
    }
  };

  // 渲染YouTube播放器
  const renderYouTubePlayer = () => {
    const youtubeUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&controls=1&rel=0&showinfo=0&fs=1`;
    
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: youtubeUrl }}
        style={styles.videoPlayer}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    );
  };

  // 渲染小红书跳转
  const renderXiaohongshuPlayer = () => (
    <View style={styles.externalPlayerContainer}>
      <View style={styles.externalPlayerContent}>
        <Ionicons name="heart" size={60} color="#FF4081" />
        <Text style={styles.externalPlayerTitle}>小红书视频</Text>
        <Text style={styles.externalPlayerDesc}>
          {video.title}
        </Text>
        <Text style={styles.externalPlayerInstructor}>
          教练：{video.instructor}
        </Text>
        
        <TouchableOpacity
          style={styles.openExternalButton}
          onPress={() => openExternalLink(video.videoUrl)}
        >
          <Ionicons name="open" size={20} color="white" />
          <Text style={styles.openExternalButtonText}>
            在小红书中观看
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.externalPlayerNote}>
          观看完视频后，回到这里开始AI监督训练
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={isFullscreen} barStyle="light-content" />
      
      {/* 视频播放区域 */}
      <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
        {video.platform === 'youtube' ? renderYouTubePlayer() : renderXiaohongshuPlayer()}
        
        {/* 视频控制覆盖层 */}
        {showControls && (
          <TouchableOpacity 
            style={styles.controlsOverlay}
            onPress={toggleControls}
            activeOpacity={1}
          >
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>
              
              <Text style={styles.videoTitle} numberOfLines={1}>
                {video.title}
              </Text>
              
              <TouchableOpacity 
                style={styles.fullscreenButton}
                onPress={() => setIsFullscreen(!isFullscreen)}
              >
                <Ionicons 
                  name={isFullscreen ? "contract" : "expand"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* AI监督区域 */}
      {!isFullscreen && (
        <View style={styles.aiContainer}>
          <SimpleCameraDetectorModern
            onMovementDetected={handleMovementDetected}
            onAnalysisUpdate={handleAnalysisUpdate}
            isActive={isTraining}
            showDebugInfo={false}
          />
        </View>
      )}

      {/* 训练控制区域 */}
      {!isFullscreen && (
        <View style={styles.trainingControls}>
          <View style={styles.trainingInfo}>
            <View style={styles.trainingMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.metaText}>
                  {Math.floor(video.duration / 60)}分钟
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.metaText}>{video.instructor}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="fitness" size={16} color="#666" />
                <Text style={styles.metaText}>
                  {video.level === 1 ? '初学者' : video.level === 2 ? '进阶' : '高级'}
                </Text>
              </View>
            </View>

            {isTraining && trainingData.startTime && (
              <View style={styles.trainingStats}>
                <Text style={styles.trainingStatsText}>
                  已训练: {Math.floor((Date.now() - trainingData.startTime) / 1000 / 60)}分钟
                </Text>
                <Text style={styles.trainingStatsText}>
                  完成度: {Math.min(Math.floor((Date.now() - trainingData.startTime) / 1000 / video.duration * 100), 100)}%
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.trainingButton,
              isTraining ? styles.stopButton : styles.startButton
            ]}
            onPress={isTraining ? handleTrainingEnd : handleStartTraining}
          >
            <Ionicons 
              name={isTraining ? "stop" : "play"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.trainingButtonText}>
              {isTraining ? '完成训练' : '开始AI监督'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0, // 视频页面特殊处理
  },

  // 视频区域
  videoContainer: {
    height: height * 0.3,
    position: 'relative',
  },
  fullscreenVideo: {
    height: height,
  },
  videoPlayer: {
    flex: 1,
  },

  // 外部播放器 (小红书)
  externalPlayerContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  externalPlayerContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  externalPlayerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  externalPlayerDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  externalPlayerInstructor: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
  openExternalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4081',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    gap: 8,
  },
  openExternalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  externalPlayerNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },

  // 控制覆盖层
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // iOS刘海屏适配
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 12, // 增加点击区域
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  videoTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  fullscreenButton: {
    padding: 12, // 增加点击区域
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // AI监督区域
  aiContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // 训练控制
  trainingControls: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  trainingInfo: {
    marginBottom: 20,
  },
  trainingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  trainingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  trainingStatsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },

  trainingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF5722',
  },
  trainingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayerScreen;