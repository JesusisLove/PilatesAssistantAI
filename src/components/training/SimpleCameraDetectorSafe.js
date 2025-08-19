// src/components/training/SimpleCameraDetectorSafe.js
// 纯模拟版本 - 不使用摄像头，避免兼容性问题

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimpleMovementDetector from '../../services/SimpleMovementDetector';

const { width, height } = Dimensions.get('window');

const SimpleCameraDetectorSafe = React.memo(({ 
  onMovementDetected, 
  onAnalysisUpdate,
  isActive = false,
  showDebugInfo = false 
}) => {
  // 检测数据状态
  const [movementData, setMovementData] = useState({
    isMoving: false,
    intensity: 0,
    analysis: null
  });
  
  const [detectorStatus, setDetectorStatus] = useState({
    isInitialized: false,
    simulationMode: true
  });

  const [isDetecting, setIsDetecting] = useState(false);

  // 初始化
  useEffect(() => {
    initializeDetector();
    
    return () => {
      cleanup();
    };
  }, []);

  // 当检测状态改变时，启动或停止检测
  useEffect(() => {
    if (isActive && detectorStatus.isInitialized) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [isActive, detectorStatus.isInitialized]);

  // 初始化运动检测器
  const initializeDetector = async () => {
    try {
      console.log('初始化 PilatesAI 检测器...');
      const success = await SimpleMovementDetector.initialize();
      
      const status = SimpleMovementDetector.getDetectionStatus();
      setDetectorStatus(status);
      
      if (success) {
        console.log('PilatesAI 检测器初始化成功');
      }
    } catch (error) {
      console.error('检测器初始化失败:', error);
    }
  };

  // 开始检测
  const startDetection = () => {
    if (isDetecting) return;
    
    console.log('开始 PilatesAI 运动检测...');
    setIsDetecting(true);
    
    // 设置检测回调
    const detectionCallback = (data) => {
      setMovementData(data);
      
      // 通知父组件
      if (onMovementDetected) {
        onMovementDetected(data.isMoving, data.intensity);
      }
      
      if (onAnalysisUpdate) {
        onAnalysisUpdate(data.analysis);
      }
    };
    
    // 启动检测服务
    SimpleMovementDetector.startDetection(detectionCallback);
  };

  // 停止检测
  const stopDetection = () => {
    if (!isDetecting) return;
    
    console.log('停止运动检测...');
    setIsDetecting(false);
    
    SimpleMovementDetector.stopDetection();
  };

  // 清理资源
  const cleanup = () => {
    stopDetection();
  };

  // 切换检测开关
  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else if (detectorStatus.isInitialized) {
      startDetection();
    }
  };

  // 手动触发测试
  const triggerManualTest = () => {
    SimpleMovementDetector.triggerManualDetection(true, Math.floor(Math.random() * 100));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="fitness" size={60} color="#4CAF50" />
        <Text style={styles.title}>PilatesAI 运动检测</Text>
        <Text style={styles.subtitle}>
          AI 模拟检测系统 - 专业普拉提训练助手
        </Text>
      </View>
      
      {/* 模拟运动显示 */}
      <View style={styles.displayContainer}>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot,
            { backgroundColor: movementData.isMoving ? '#4CAF50' : '#FF9800' }
          ]} />
          <Text style={styles.statusText}>
            {isDetecting ? 
              (movementData.isMoving ? '检测到运动' : '静止状态') : 
              '检测已停止'
            }
          </Text>
        </View>

        {/* 运动强度条 */}
        {isDetecting && (
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityLabel}>运动强度</Text>
            <View style={styles.intensityBar}>
              <View style={[
                styles.intensityFill,
                { width: `${movementData.intensity}%` }
              ]} />
            </View>
            <Text style={styles.intensityValue}>{movementData.intensity}%</Text>
          </View>
        )}

        {/* 调试信息 */}
        {showDebugInfo && movementData.analysis && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugTitle}>🔍 AI 分析详情</Text>
            <Text style={styles.debugText}>
              运动模式: {movementData.analysis.pattern}
            </Text>
            <Text style={styles.debugText}>
              一致性: {movementData.analysis.consistency}%
            </Text>
            <Text style={styles.debugText}>
              平均强度: {movementData.analysis.averageIntensity}
            </Text>
            <Text style={styles.debugText}>
              运动阶段: {movementData.analysis.phase}
            </Text>
            <Text style={styles.debugText}>
              AI 信心度: {movementData.analysis.aiConfidence}%
            </Text>
            <Text style={styles.debugText}>
              AI建议: {movementData.analysis.recommendation}
            </Text>
          </View>
        )}
      </View>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[
            styles.controlButton,
            { backgroundColor: isDetecting ? '#FF5722' : '#4CAF50' }
          ]}
          onPress={toggleDetection}
        >
          <Ionicons 
            name={isDetecting ? "stop" : "play"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.controlButtonText}>
            {isDetecting ? '停止检测' : '开始检测'}
          </Text>
        </TouchableOpacity>

        {showDebugInfo && (
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: '#2196F3' }]}
            onPress={triggerManualTest}
            disabled={!isDetecting}
          >
            <Ionicons name="flash" size={24} color="white" />
            <Text style={styles.controlButtonText}>手动测试</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 状态说明 */}
      <View style={styles.statusPanel}>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.statusLabel}>AI检测器: 已就绪</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="tv" size={16} color="#2196F3" />
          <Text style={styles.statusLabel}>模式: 智能模拟</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="analytics" size={16} color="#FF9800" />
          <Text style={styles.statusLabel}>
            样本: {detectorStatus.historyLength || 0}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },

  // 状态指示器
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 运动强度条
  intensityContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  intensityLabel: {
    color: '#333',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  intensityBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  intensityValue: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 调试信息
  debugInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  debugTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  debugText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },

  // 控制按钮
  controls: {
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 160,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // 状态面板
  statusPanel: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 15,
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
    marginVertical: 3,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});

export default SimpleCameraDetectorSafe;