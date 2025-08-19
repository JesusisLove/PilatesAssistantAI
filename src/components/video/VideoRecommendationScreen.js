// src/components/video/VideoRecommendationScreen.js
// 视频推荐主页面

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import videoLibraryService from '../../services/VideoLibraryService';

const { width } = Dimensions.get('window');

const VideoRecommendationScreen = ({ onVideoSelect, onProfileEdit }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  // 加载用户数据和推荐
  const loadUserData = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        
        // 获取个性化推荐
        const recs = videoLibraryService.getRecommendedVideos(profile);
        setRecommendations(recs);
      }
      
      // 获取热门视频
      const popular = videoLibraryService.getPopularVideos();
      setPopularVideos(popular);
      
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // 格式化时长
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  };

  // 获取难度标签
  const getDifficultyLabel = (level) => {
    const labels = { 1: '初学者', 2: '进阶', 3: '高级' };
    return labels[level] || '未知';
  };

  // 获取目标部位标签
  const getTargetLabel = (target) => {
    const labels = {
      'abs': '腹部',
      'legs': '腿部', 
      'arms': '手臂',
      'back': '背部',
      'full': '全身'
    };
    return labels[target] || target;
  };

  // 获取平台图标
  const getPlatformIcon = (platform) => {
    return platform === 'youtube' ? 'logo-youtube' : 'heart';
  };

  // 获取平台颜色
  const getPlatformColor = (platform) => {
    return platform === 'youtube' ? '#FF0000' : '#FF4081';
  };

  // 渲染视频卡片
  const renderVideoCard = (video, isLarge = false) => (
    <TouchableOpacity
      key={video.id}
      style={[styles.videoCard, isLarge && styles.largeVideoCard]}
      onPress={() => onVideoSelect(video)}
      activeOpacity={0.8}
    >
      <View style={styles.videoImageContainer}>
        <Image
          source={{ uri: video.thumbnail }}
          style={[styles.videoImage, isLarge && styles.largeVideoImage]}
          resizeMode="cover"
        />
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>
            {formatDuration(video.duration)}
          </Text>
        </View>
        <View style={styles.platformBadge}>
          <Ionicons 
            name={getPlatformIcon(video.platform)} 
            size={12} 
            color={getPlatformColor(video.platform)} 
          />
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoInstructor}>
          👩‍🏫 {video.instructor}
        </Text>
        
        <View style={styles.videoMeta}>
          <View style={styles.metaTag}>
            <Ionicons name="fitness" size={12} color="#4CAF50" />
            <Text style={styles.metaText}>{getDifficultyLabel(video.level)}</Text>
          </View>
          <View style={styles.metaTag}>
            <Ionicons name="body" size={12} color="#FF9800" />
            <Text style={styles.metaText}>{getTargetLabel(video.target)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="fitness" size={50} color="#4CAF50" />
        <Text style={styles.loadingText}>AI正在为你推荐...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 用户欢迎区域 */}
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            你好！准备开始今天的训练吗？
          </Text>
          {userProfile && (
            <Text style={styles.welcomeSubtitle}>
              为{userProfile.experience}推荐，{userProfile.timePreference}课程
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfileEdit}
        >
          <Ionicons name="person-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* AI个性化推荐 */}
      {recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>🤖 AI为你推荐</Text>
          </View>
          
          {/* 主推荐 */}
          {recommendations[0] && renderVideoCard(recommendations[0], true)}
          
          {/* 其他推荐 */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {recommendations.slice(1).map((video) => (
              <View key={video.id} style={styles.horizontalCard}>
                {renderVideoCard(video)}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 快速开始 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flash" size={20} color="#FF9800" />
          <Text style={styles.sectionTitle}>⚡ 快速开始</Text>
        </View>
        
        <View style={styles.quickStartGrid}>
          <TouchableOpacity 
            style={styles.quickStartCard}
            onPress={() => {
              const quickVideos = videoLibraryService.getVideosByDuration(600);
              if (quickVideos.length > 0) onVideoSelect(quickVideos[0]);
            }}
          >
            <Ionicons name="timer" size={30} color="#FF9800" />
            <Text style={styles.quickStartTitle}>10分钟快练</Text>
            <Text style={styles.quickStartDesc}>忙碌时的最佳选择</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickStartCard}
            onPress={() => {
              const absVideos = videoLibraryService.getVideosByTarget('abs', userProfile);
              if (absVideos.length > 0) onVideoSelect(absVideos[0]);
            }}
          >
            <Ionicons name="body" size={30} color="#E91E63" />
            <Text style={styles.quickStartTitle}>腹部专练</Text>
            <Text style={styles.quickStartDesc}>马甲线养成</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 热门推荐 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trending-up" size={20} color="#FF5722" />
          <Text style={styles.sectionTitle}>🔥 热门课程</Text>
        </View>
        
        {popularVideos.map((video) => (
          <View key={video.id} style={styles.listVideoCard}>
            {renderVideoCard(video)}
          </View>
        ))}
      </View>

      {/* 底部间距 */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // 加载状态
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },

  // 欢迎区域
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  profileButton: {
    padding: 8,
  },

  // 分区样式
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // 视频卡片
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  largeVideoCard: {
    marginBottom: 20,
  },
  listVideoCard: {
    marginVertical: 5,
  },
  
  videoImageContainer: {
    position: 'relative',
  },
  videoImage: {
    width: '100%',
    height: 120,
  },
  largeVideoImage: {
    height: 160,
  },
  
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoDurationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  platformBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 6,
  },

  videoInfo: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  videoInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  
  videoMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // 横向滚动
  horizontalScroll: {
    marginTop: 10,
  },
  horizontalCard: {
    width: width * 0.7,
    marginLeft: 20,
  },

  // 快速开始网格
  quickStartGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  quickStartCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  quickStartDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // 底部间距
  bottomSpacing: {
    height: 30,
  },
});

export default VideoRecommendationScreen;