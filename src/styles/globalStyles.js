// src/styles/globalStyles.js
// 全局样式定义

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 颜色定义
export const Colors = {
  // 主题色
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  
  // 辅助色
  secondary: '#FF9800',
  accent: '#2196F3',
  warning: '#FF5722',
  error: '#F44336',
  success: '#4CAF50',
  
  // 灰度色
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  
  // 透明色
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
  
  // 功能色
  online: '#4CAF50',
  offline: '#FF9800',
  inactive: '#CCCCCC'
};

// 字体大小
export const FontSizes = {
  tiny: 10,
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  huge: 24,
  title: 28,
  hero: 36
};

// 间距
export const Spacing = {
  tiny: 4,
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  xxlarge: 24,
  huge: 32,
  massive: 48
};

// 圆角
export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 25,
  circle: 50
};

// 阴影
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  }
};

// 全局样式
export const GlobalStyles = StyleSheet.create({
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20, // 状态栏高度
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // 卡片样式
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.large,
    ...Shadows.medium,
  },
  
  // 按钮样式
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xlarge,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xlarge,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 文字样式
  titleText: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    color: Colors.text,
  },
  
  subtitleText: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.text,
  },
  
  bodyText: {
    fontSize: FontSizes.medium,
    color: Colors.text,
    lineHeight: 20,
  },
  
  captionText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  
  // 输入框样式
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    fontSize: FontSizes.medium,
    color: Colors.text,
  },
  
  // 分隔符
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.medium,
  },
  
  // 页面内边距
  screenPadding: {
    paddingHorizontal: Spacing.large,
  },
  
  // Flex布局
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // 状态样式
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xlarge,
  },
  
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.large,
    padding: Spacing.xlarge,
    margin: Spacing.xlarge,
    width: width * 0.9,
    maxWidth: 400,
    ...Shadows.large,
  },
});

// 屏幕尺寸
export const Screen = {
  width,
  height,
  isSmall: width < 350,
  isMedium: width >= 350 && width < 414,
  isLarge: width >= 414,
};

// 动画时长
export const AnimationDuration = {
  fast: 200,
  medium: 300,
  slow: 500,
};

export default GlobalStyles;