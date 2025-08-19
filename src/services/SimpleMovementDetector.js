// src/services/SimpleMovementDetector.js
// PilatesAI 简化版运动检测服务

class SimpleMovementDetector {
  constructor() {
    this.isInitialized = false;
    this.isDetecting = false;
    this.detectionCallback = null;
    this.detectionInterval = null;
    this.simulationMode = true;
    
    // 检测历史数据
    this.movementHistory = [];
    this.maxHistoryLength = 50;
    
    // 模拟普拉提动作模式
    this.pilatesPatterns = [
      {
        name: '呼吸练习',
        intensity: { min: 10, max: 30 },
        duration: 8000,
        consistency: { min: 85, max: 95 },
        recommendation: '保持深呼吸节奏，专注核心收紧'
      },
      {
        name: '卷腹运动', 
        intensity: { min: 40, max: 70 },
        duration: 12000,
        consistency: { min: 70, max: 85 },
        recommendation: '控制速度，感受腹部肌肉收缩'
      },
      {
        name: '侧卧抬腿',
        intensity: { min: 30, max: 60 },
        duration: 10000, 
        consistency: { min: 75, max: 90 },
        recommendation: '保持身体稳定，腿部动作要标准'
      },
      {
        name: '平板支撑',
        intensity: { min: 60, max: 85 },
        duration: 15000,
        consistency: { min: 80, max: 95 },
        recommendation: '保持身体一条直线，核心持续收紧'
      },
      {
        name: '普拉提百次',
        intensity: { min: 45, max: 75 },
        duration: 20000,
        consistency: { min: 85, max: 95 },
        recommendation: '手臂快速摆动，配合呼吸节奏'
      }
    ];
    
    // 当前模拟状态
    this.currentPattern = null;
    this.patternStartTime = null;
    this.baseIntensity = 0;
    this.movementPhase = 'rest'; // rest, warmup, exercise, cooldown
  }

  // 初始化检测器
  async initialize() {
    try {
      console.log('🎯 初始化 PilatesAI 运动检测器...');
      
      // 模拟初始化延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isInitialized = true;
      this.simulationMode = true;
      
      console.log('✅ PilatesAI 检测器初始化成功 (模拟模式)');
      return true;
    } catch (error) {
      console.error('❌ 检测器初始化失败:', error);
      return false;
    }
  }

  // 获取检测器状态
  getDetectionStatus() {
    return {
      isInitialized: this.isInitialized,
      simulationMode: this.simulationMode,
      isDetecting: this.isDetecting,
      historyLength: this.movementHistory.length,
      currentPattern: this.currentPattern?.name || '待检测'
    };
  }

  // 开始检测
  startDetection(callback) {
    if (!this.isInitialized) {
      console.error('❌ 检测器未初始化');
      return false;
    }

    if (this.isDetecting) {
      console.log('⚠️ 检测已在进行中');
      return false;
    }

    console.log('🎬 开始 PilatesAI 运动检测...');
    this.isDetecting = true;
    this.detectionCallback = callback;
    this.movementPhase = 'warmup';
    
    // 启动模拟检测循环
    this.startSimulationLoop();
    
    return true;
  }

  // 停止检测
  stopDetection() {
    if (!this.isDetecting) {
      return false;
    }

    console.log('⏹️ 停止 PilatesAI 运动检测');
    this.isDetecting = false;
    this.detectionCallback = null;
    this.movementPhase = 'rest';
    this.currentPattern = null;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    return true;
  }

  // 启动模拟检测循环
  startSimulationLoop() {
    const updateInterval = 500; // 每500ms更新一次
    
    this.detectionInterval = setInterval(() => {
      if (!this.isDetecting) {
        clearInterval(this.detectionInterval);
        return;
      }
      
      const movementData = this.generateSimulatedMovement();
      this.updateMovementHistory(movementData);
      
      if (this.detectionCallback) {
        this.detectionCallback(movementData);
      }
    }, updateInterval);
  }

  // 生成模拟运动数据
  generateSimulatedMovement() {
    const now = Date.now();
    
    // 阶段切换逻辑
    this.updateMovementPhase(now);
    
    let isMoving = false;
    let intensity = 0;
    let pattern = '静止状态';
    let consistency = 0;
    let recommendation = '准备开始运动';

    switch (this.movementPhase) {
      case 'warmup':
        isMoving = Math.random() > 0.3;
        intensity = Math.floor(Math.random() * 25) + 5; // 5-30
        pattern = '热身阶段';
        consistency = Math.floor(Math.random() * 20) + 60; // 60-80
        recommendation = '缓慢开始，让身体适应运动';
        break;
        
      case 'exercise':
        if (!this.currentPattern) {
          this.selectNewPattern();
        }
        
        const patternData = this.simulatePatternMovement();
        isMoving = patternData.isMoving;
        intensity = patternData.intensity;
        pattern = this.currentPattern.name;
        consistency = patternData.consistency;
        recommendation = this.currentPattern.recommendation;
        break;
        
      case 'cooldown':
        isMoving = Math.random() > 0.5;
        intensity = Math.floor(Math.random() * 20) + 5; // 5-25
        pattern = '放松阶段';
        consistency = Math.floor(Math.random() * 15) + 75; // 75-90
        recommendation = '缓慢伸展，让肌肉放松';
        break;
        
      default: // rest
        isMoving = Math.random() > 0.8;
        intensity = Math.floor(Math.random() * 10); // 0-10
        pattern = '静止状态';
        consistency = 95;
        recommendation = '保持放松，准备下一个动作';
    }

    return {
      isMoving,
      intensity,
      timestamp: now,
      analysis: {
        pattern,
        consistency,
        averageIntensity: this.calculateAverageIntensity(),
        recommendation,
        phase: this.movementPhase,
        aiConfidence: Math.floor(Math.random() * 15) + 85 // 85-100
      }
    };
  }

  // 更新运动阶段
  updateMovementPhase(now) {
    if (!this.phaseStartTime) {
      this.phaseStartTime = now;
    }
    
    const phaseElapsed = now - this.phaseStartTime;
    
    switch (this.movementPhase) {
      case 'warmup':
        if (phaseElapsed > 8000) { // 8秒热身
          this.movementPhase = 'exercise';
          this.phaseStartTime = now;
        }
        break;
        
      case 'exercise':
        if (phaseElapsed > 25000) { // 25秒运动
          this.movementPhase = 'cooldown';
          this.phaseStartTime = now;
          this.currentPattern = null;
        }
        break;
        
      case 'cooldown':
        if (phaseElapsed > 10000) { // 10秒放松
          this.movementPhase = 'rest';
          this.phaseStartTime = now;
        }
        break;
        
      case 'rest':
        if (phaseElapsed > 5000) { // 5秒休息
          this.movementPhase = 'warmup';
          this.phaseStartTime = now;
        }
        break;
    }
  }

  // 选择新的普拉提动作模式
  selectNewPattern() {
    const randomIndex = Math.floor(Math.random() * this.pilatesPatterns.length);
    this.currentPattern = this.pilatesPatterns[randomIndex];
    this.patternStartTime = Date.now();
    
    console.log(`🧘‍♀️ 开始检测: ${this.currentPattern.name}`);
  }

  // 模拟动作模式的运动数据
  simulatePatternMovement() {
    if (!this.currentPattern) {
      return { isMoving: false, intensity: 0, consistency: 0 };
    }

    const elapsed = Date.now() - this.patternStartTime;
    const progress = Math.min(elapsed / this.currentPattern.duration, 1);
    
    // 模拟动作强度曲线 (开始低，中间高，结束低)
    let intensityMultiplier;
    if (progress < 0.2) {
      intensityMultiplier = progress / 0.2 * 0.7; // 渐入
    } else if (progress < 0.8) {
      intensityMultiplier = 0.7 + Math.sin((progress - 0.2) * Math.PI / 0.6) * 0.3; // 主要阶段
    } else {
      intensityMultiplier = 0.7 * (1 - (progress - 0.8) / 0.2); // 渐出
    }
    
    const baseIntensity = this.currentPattern.intensity.min + 
      (this.currentPattern.intensity.max - this.currentPattern.intensity.min) * intensityMultiplier;
    
    // 添加随机波动
    const noise = (Math.random() - 0.5) * 20;
    const finalIntensity = Math.max(0, Math.min(100, baseIntensity + noise));
    
    const isMoving = finalIntensity > 15;
    
    // 计算一致性 (动作越标准，一致性越高)
    const baseConsistency = this.currentPattern.consistency.min + 
      (this.currentPattern.consistency.max - this.currentPattern.consistency.min) * (1 - Math.abs(noise) / 20);
    
    return {
      isMoving,
      intensity: Math.floor(finalIntensity),
      consistency: Math.floor(baseConsistency)
    };
  }

  // 计算平均强度
  calculateAverageIntensity() {
    if (this.movementHistory.length === 0) return 0;
    
    const recentHistory = this.movementHistory.slice(-10); // 最近10个数据点
    const sum = recentHistory.reduce((acc, data) => acc + data.intensity, 0);
    return Math.floor(sum / recentHistory.length);
  }

  // 更新运动历史
  updateMovementHistory(data) {
    this.movementHistory.push({
      timestamp: data.timestamp,
      intensity: data.intensity,
      isMoving: data.isMoving
    });
    
    // 限制历史记录长度
    if (this.movementHistory.length > this.maxHistoryLength) {
      this.movementHistory.shift();
    }
  }

  // 手动触发检测 (用于测试)
  triggerManualDetection(isMoving = true, intensity = 50) {
    if (!this.isDetecting) return;
    
    console.log('🔧 手动触发检测测试');
    
    const manualData = {
      isMoving,
      intensity,
      timestamp: Date.now(),
      analysis: {
        pattern: '手动测试',
        consistency: 90,
        averageIntensity: intensity,
        recommendation: '这是一个手动触发的测试数据',
        phase: 'test',
        aiConfidence: 100
      }
    };
    
    if (this.detectionCallback) {
      this.detectionCallback(manualData);
    }
  }

  // 获取运动统计
  getMovementStats() {
    if (this.movementHistory.length === 0) {
      return {
        totalSamples: 0,
        averageIntensity: 0,
        movementPercentage: 0,
        maxIntensity: 0
      };
    }
    
    const totalSamples = this.movementHistory.length;
    const movingCount = this.movementHistory.filter(data => data.isMoving).length;
    const intensities = this.movementHistory.map(data => data.intensity);
    
    return {
      totalSamples,
      averageIntensity: Math.floor(intensities.reduce((a, b) => a + b, 0) / totalSamples),
      movementPercentage: Math.floor((movingCount / totalSamples) * 100),
      maxIntensity: Math.max(...intensities)
    };
  }

  // 重置检测器
  reset() {
    this.stopDetection();
    this.movementHistory = [];
    this.currentPattern = null;
    this.patternStartTime = null;
    this.movementPhase = 'rest';
    
    console.log('🔄 PilatesAI 检测器已重置');
  }
}

// 创建单例实例
const simpleMovementDetector = new SimpleMovementDetector();

// 导出单例实例
export default simpleMovementDetector;