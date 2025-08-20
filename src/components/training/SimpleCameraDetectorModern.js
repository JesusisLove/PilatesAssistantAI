// src/components/training/SimpleCameraDetectorModern.js
// 使用最新 expo-camera API 的 PilatesAI 检测组件

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import SimpleMovementDetector from '../../services/SimpleMovementDetector';

const { width, height } = Dimensions.get('window');

const SimpleCameraDetectorModern = React.memo(({ 
  onMovementDetected, 
  onAnalysisUpdate,
  isActive = false,
  showDebugInfo = false 
}) => {
  // 使用新的 useCameraPermissions hook
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [facing, setFacing] = useState('front'); // 使用 'front' 或 'back'
  
  // 检测数据状态
  const [movementData, setMovementData] = useState({
    isMoving: false,
    intensity: 0,
    analysis: null
  });
  
  const [detectorStatus, setDetectorStatus] = useState({
    isInitialized: false,
    simulationMode: false // 真实摄像头模式
  });

  // 组件引用
  const cameraRef = useRef(null);

  // 初始化
  useEffect(() => {
    initializeDetector();
    
    return () => {
      cleanup();
    };
  }, []);

  // 当检测状态改变时，启动或停止检测
  useEffect(() => {
    if (isActive && detectorStatus.isInitialized && permission?.granted) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [isActive, detectorStatus.isInitialized, permission?.granted]);

  // 初始化运动检测器
  const initializeDetector = async () => {
    try {
      console.log('🎯 初始化 PilatesAI 运动检测器（摄像头模式）...');
      const success = await SimpleMovementDetector.initialize();
      
      const status = SimpleMovementDetector.getDetectionStatus();
      setDetectorStatus({
        ...status,
        simulationMode: false // 真实摄像头模式
      });
      
      if (success) {
        console.log('✅ PilatesAI 检测器初始化成功');
      }
    } catch (error) {
      console.error('❌ 检测器初始化失败:', error);
    }
  };

  // 开始检测
  const startDetection = () => {
    if (isDetecting || !permission?.granted) return;
    
    console.log('🎬 开始摄像头运动检测...');
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
    
    console.log('⏹️ 停止摄像头检测...');
    setIsDetecting(false);
    
    SimpleMovementDetector.stopDetection();
  };

  // 清理资源
  const cleanup = () => {
    stopDetection();
  };

  // 摄像头准备就绪
  const onCameraReady = () => {
    setCameraReady(true);
    console.log('📷 摄像头准备就绪');
  };

  // 切换检测开关
  const toggleDetection = () => {
    if (isDetecting) {
      stopDetection();
    } else if (detectorStatus.isInitialized && permission?.granted) {
      startDetection();
    }
  };

  // 切换摄像头前后
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // 手动触发测试
  const triggerManualTest = () => {
    SimpleMovementDetector.triggerManualDetection(true, Math.floor(Math.random() * 100));
  };

  // 权限检查和请求
  if (!permission) {
    // 权限还在加载中
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <Ionicons name="camera" size={50} color="#666" />
        <Text style={styles.loadingText}>正在检查摄像头权限...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // 权限未授予
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.permissionContent}>
          <Ionicons name="camera-off" size={80} color="#FF5722" />
          <Text style={styles.permissionTitle}>需要摄像头权限</Text>
          <Text style={styles.permissionText}>
            PilatesAI 需要使用摄像头来实时检测你的运动状态，提供专业的普拉提指导。
          </Text>
          
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.permissionButtonText}>授权摄像头</Text>
          </TouchableOpacity>
          
          <Text style={styles.permissionNote}>
            你的隐私很重要，我们不会保存或上传任何视频数据
          </Text>
        </View>
      </View>
    );
  }

  // 有摄像头权限的情况 - 显示摄像头预览
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {/* 摄像头预览 */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={onCameraReady}
          mode="picture"
          enableTorch={false}
        >
          {/* 检测状态覆盖层 */}
          <View style={styles.overlay}>
            
            {/* 顶部状态栏 */}
            <View style={styles.topBar}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: movementData.isMoving ? '#4CAF50' : '#FF9800' }
                ]} />
                <Text style={styles.statusText}>
                  {isDetecting ? 
                    (movementData.isMoving ? '运动中' : '静止') : 
                    '检测已停止'
                  }
                </Text>
              </View>

              {/* 切换摄像头按钮 */}
              <TouchableOpacity 
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* 中间运动强度显示 */}
            {isDetecting && (
              <View style={styles.centerContent}>
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

                {/* 普拉提动作显示 */}
                {movementData.analysis && (
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseTitle}>
                      {movementData.analysis.pattern}
                    </Text>
                    <Text style={styles.exerciseSubtitle}>
                      一致性: {movementData.analysis.consistency}%
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 调试信息 */}
            {showDebugInfo && movementData.analysis && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>🔍 实时分析</Text>
                <Text style={styles.debugText}>
                  模式: {movementData.analysis.pattern}
                </Text>
                <Text style={styles.debugText}>
                  阶段: {movementData.analysis.phase}
                </Text>
                <Text style={styles.debugText}>
                  AI信心度: {movementData.analysis.aiConfidence}%
                </Text>
                <Text style={styles.debugText}>
                  建议: {movementData.analysis.recommendation}
                </Text>
              </View>
            )}

            {/* 底部控制按钮 */}
            <View style={styles.bottomControls}>
              <TouchableOpacity 
                style={[
                  styles.controlButton,
                  { backgroundColor: isDetecting ? '#FF5722' : '#4CAF50' }
                ]}
                onPress={toggleDetection}
                disabled={!detectorStatus.isInitialized || !cameraReady}
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
                  <Ionicons name="flash" size={20} color="white" />
                  <Text style={styles.controlButtonText}>测试</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </CameraView>
      </View>

      {/* 检测器状态信息 */}
      <View style={styles.statusPanel}>
        <View style={styles.statusItem}>
          <Ionicons 
            name={detectorStatus.isInitialized ? "checkmark-circle" : "close-circle"} 
            size={16} 
            color={detectorStatus.isInitialized ? "#4CAF50" : "#FF5722"} 
          />
          <Text style={styles.statusLabel}>
            AI检测器: {detectorStatus.isInitialized ? '已就绪' : '未就绪'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons name="videocam" size={16} color="#2196F3" />
          <Text style={styles.statusLabel}>模式: 摄像头检测</Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons 
            name={cameraReady ? "checkmark-circle" : "close-circle"} 
            size={16} 
            color={cameraReady ? "#4CAF50" : "#FF5722"} 
          />
          <Text style={styles.statusLabel}>
            摄像头: {cameraReady ? '已就绪' : '未就绪'}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // 加载状态
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  
  // 权限请求
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : (StatusBar.currentHeight || 24) + 20,
  },
  permissionContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  permissionNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // 摄像头相关样式
  cameraContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    margin: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    padding: 20,
  },

  // 顶部状态栏
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    padding: 10,
  },

  // 状态指示器
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // 中间内容
  centerContent: {
    alignItems: 'center',
  },

  // 运动强度条
  intensityContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 200,
    marginBottom: 15,
  },
  intensityLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '600',
  },
  intensityBar: {
    width: 150,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  intensityValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // 运动信息
  exerciseInfo: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  exerciseTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseSubtitle: {
    color: 'white',
    fontSize: 14,
  },

  // 调试信息
  debugInfo: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    top: 80,
    right: 20,
    minWidth: 200,
  },
  debugTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 14,
  },

  // 底部控制
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // 状态面板
  statusPanel: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
    marginVertical: 2,
  },
  statusLabel: {
    fontSize: 11,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
});

export default SimpleCameraDetectorModern;