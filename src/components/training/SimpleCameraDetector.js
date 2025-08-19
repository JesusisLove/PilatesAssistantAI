// src/components/training/SimpleCameraDetector.js
// 修复后的简化版摄像头检测组件

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import SimpleMovementDetector from '../../services/SimpleMovementDetector';

const { width, height } = Dimensions.get('window');

// 修复：使用React.memo包装确保组件正确识别
const SimpleCameraDetector = React.memo(({ 
  onMovementDetected, 
  onAnalysisUpdate,
  isActive = false,
  showDebugInfo = false 
}) => {
  // 摄像头状态
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
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

  // 组件引用
  const cameraRef = useRef(null);

  // 初始化
  useEffect(() => {
    initializeCamera();
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

  // 初始化摄像头
  const initializeCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          '需要摄像头权限',
          'PilatesAI需要使用摄像头来检测你的运动状态。如果不开启，将使用模拟检测模式。',
          [
            { text: '确定', onPress: () => {} },
            { text: '重试', onPress: () => initializeCamera() }
          ]
        );
      }
    } catch (error) {
      console.error('摄像头初始化失败:', error);
    }
  };

  // 初始化运动检测器
  const initializeDetector = async () => {
    try {
      console.log('初始化简化版运动检测器...');
      const success = await SimpleMovementDetector.initialize();
      
      const status = SimpleMovementDetector.getDetectionStatus();
      setDetectorStatus(status);
      
      if (success) {
        console.log('运动检测器初始化成功');
      } else {
        console.log('运动检测器初始化失败');
      }
    } catch (error) {
      console.error('运动检测器初始化失败:', error);
    }
  };

  // 开始检测
  const startDetection = () => {
    if (isDetecting) return;
    
    console.log('开始运动检测...');
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

  // 摄像头准备就绪
  const onCameraReady = () => {
    setCameraReady(true);
    console.log('摄像头准备就绪');
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

  // 如果没有摄像头权限，显示模拟模式
  if (hasPermission === false) {
    return (
      <View style={styles.simulationContainer}>
        <View style={styles.simulationHeader}>
          <Ionicons name="tv" size={50} color="#4CAF50" />
          <Text style={styles.simulationTitle}>模拟检测模式</Text>
          <Text style={styles.simulationSubtext}>
            摄像头权限未开启，使用AI模拟检测演示效果
          </Text>
        </View>
        
        {/* 模拟运动显示 */}
        <View style={styles.simulationDisplay}>
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
              <Text style={styles.debugTitle}>🔍 检测详情</Text>
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
  }

  // 有摄像头权限的情况
  return (
    <View style={styles.container}>
      {/* 摄像头预览 */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants?.Type?.front || 'front'}
          onCameraReady={onCameraReady}
          ratio="16:9"
        >
          {/* 检测状态覆盖层 */}
          <View style={styles.overlay}>
            
            {/* 运动状态指示器 */}
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

            {/* 运动强度条 */}
            {isDetecting && (
              <View style={styles.intensityContainer}>
                <Text style={styles.intensityLabel}>强度</Text>
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
                <Text style={styles.debugTitle}>🔍 实时分析</Text>
                <Text style={styles.debugText}>
                  模式: {movementData.analysis.pattern}
                </Text>
                <Text style={styles.debugText}>
                  一致性: {movementData.analysis.consistency}%
                </Text>
                <Text style={styles.debugText}>
                  建议: {movementData.analysis.recommendation}
                </Text>
              </View>
            )}

            {/* 控制按钮 */}
            <View style={styles.controls}>
              <TouchableOpacity 
                style={[
                  styles.controlButton,
                  { backgroundColor: isDetecting ? '#FF5722' : '#4CAF50' }
                ]}
                onPress={toggleDetection}
                disabled={!detectorStatus.isInitialized}
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
            </View>

          </View>
        </Camera>
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
            检测器: {detectorStatus.isInitialized ? '已就绪' : '未就绪'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <Ionicons name="tv" size={16} color="#2196F3" />
          <Text style={styles.statusLabel}>模式: 简化检测</Text>
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
  
  // 模拟模式样式
  simulationContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  simulationHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  simulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  simulationSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  simulationDisplay: {
    flex: 1,
    justifyContent: 'center',
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

  // 状态指示器
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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

  // 运动强度条
  intensityContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  intensityLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  intensityBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  intensityValue: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 调试信息
  debugInfo: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  debugTitle: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },

  // 控制按钮
  controls: {
    alignItems: 'center',
    gap: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
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

// 修复：确保正确导出组件
export default SimpleCameraDetector;