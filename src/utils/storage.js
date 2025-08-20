// src/utils/storage.js
// 本地存储工具类 - 简化版

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageUtils {
  // 保存数据
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`💾 已保存: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ 保存失败 ${key}:`, error);
      return false;
    }
  }

  // 读取数据
  static async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
      return defaultValue;
    } catch (error) {
      console.error(`❌ 读取失败 ${key}:`, error);
      return defaultValue;
    }
  }

  // 删除数据
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ 已删除: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ 删除失败 ${key}:`, error);
      return false;
    }
  }

  // 清空所有数据
  static async clear() {
    try {
      await AsyncStorage.clear();
      console.log('🧹 已清空所有存储');
      return true;
    } catch (error) {
      console.error('❌ 清空失败:', error);
      return false;
    }
  }

  // 获取所有键名
  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('❌ 获取键名失败:', error);
      return [];
    }
  }
}

// 预定义的存储键名
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  PROFILE_SETUP_COMPLETE: 'profileSetupComplete',
  TRAINING_RECORDS: 'trainingRecords',
  APP_SETTINGS: 'appSettings',
  COACH_STYLE: 'coachStyle',
  LAST_TRAINING_DATE: 'lastTrainingDate',
  TOTAL_TRAINING_TIME: 'totalTrainingTime'
};

export default StorageUtils;