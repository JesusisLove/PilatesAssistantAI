// src/services/VideoLibraryService.js
// 简化版视频库服务 - YouTube + 小红书

class VideoLibraryService {
  constructor() {
    // 精选视频库 - 手工筛选的优质内容
    this.videoLibrary = [
      // YouTube 视频
      {
        id: 'yt_001',
        title: '10分钟初学者普拉提 - 全身基础训练',
        platform: 'youtube',
        videoId: 'VPV2ylz3TbA', // POP Pilates - 10 Min Beginner Pilates
        thumbnail: 'https://img.youtube.com/vi/VPV2ylz3TbA/maxresdefault.jpg',
        duration: 600, // 10分钟
        level: 1, // 1=初学者, 2=进阶, 3=高级
        target: 'full', // abs=腹部, legs=腿部, arms=手臂, full=全身
        gender: 'any', // male/female/any
        ageGroup: 'young', // young=18-35, middle=36-50, senior=50+
        instructor: 'Cassey Ho',
        language: 'english',
        description: '适合初学者的全身普拉提训练，无需器械',
        tags: ['beginner', 'full-body', 'no-equipment']
      },
      {
        id: 'yt_002',
        title: '15分钟腹部核心训练 - 马甲线养成',
        platform: 'youtube',
        videoId: 'MMV3v4ap2vU', // POP Pilates - Abs
        thumbnail: 'https://img.youtube.com/vi/MMV3v4ap2vU/maxresdefault.jpg',
        duration: 900,
        level: 2,
        target: 'abs',
        gender: 'female',
        ageGroup: 'young',
        instructor: 'Cassey Ho',
        language: 'english',
        description: '专注腹部训练，打造马甲线',
        tags: ['abs', 'core', 'muffin-top']
      },
      {
        id: 'yt_003',
        title: '温和普拉提 - 适合初学者和中年人',
        platform: 'youtube',
        videoId: 'GLy2rYHwUqY', // Yoga with Adriene - Gentle Pilates
        thumbnail: 'https://img.youtube.com/vi/GLy2rYHwUqY/maxresdefault.jpg',
        duration: 1200, // 20分钟
        level: 1,
        target: 'full',
        gender: 'any',
        ageGroup: 'middle',
        instructor: 'Adriene',
        language: 'english',
        description: '温和的普拉提练习，适合所有年龄段',
        tags: ['gentle', 'beginner', 'relaxing']
      },
      {
        id: 'yt_004',
        title: '5分钟快速腹部燃脂',
        platform: 'youtube',
        videoId: 'DHD1-2P94DI', // MadFit - 5 Min Ab Workout
        thumbnail: 'https://img.youtube.com/vi/DHD1-2P94DI/maxresdefault.jpg',
        duration: 300,
        level: 2,
        target: 'abs',
        gender: 'any',
        ageGroup: 'young',
        instructor: 'MadFit',
        language: 'english',
        description: '快速高效的腹部训练，忙碌人士的最佳选择',
        tags: ['quick', 'intense', 'abs']
      },
      {
        id: 'yt_005',
        title: '普拉提臀腿训练 - 蜜桃臀养成',
        platform: 'youtube',
        videoId: 'SZ_A9WZjEzk', // 臀腿训练
        thumbnail: 'https://img.youtube.com/vi/SZ_A9WZjEzk/maxresdefault.jpg',
        duration: 900,
        level: 2,
        target: 'legs',
        gender: 'female',
        ageGroup: 'young',
        instructor: 'Various',
        language: 'english',
        description: '专注臀腿塑形，打造完美曲线',
        tags: ['glutes', 'legs', 'booty']
      },

      // 小红书风格视频 (模拟数据，实际需要替换为真实链接)
      {
        id: 'xhs_001',
        title: '周六野10分钟马甲线训练',
        platform: 'xiaohongshu',
        videoUrl: 'https://www.xiaohongshu.com/explore/周六野普拉提',
        thumbnail: 'https://via.placeholder.com/300x200?text=周六野普拉提',
        duration: 600,
        level: 1,
        target: 'abs',
        gender: 'female',
        ageGroup: 'young',
        instructor: '周六野',
        language: 'chinese',
        description: '中文指导，适合国内女性的腹部训练',
        tags: ['chinese', 'abs', 'popular']
      },
      {
        id: 'xhs_002',
        title: '帕梅拉15分钟燃脂普拉提',
        platform: 'xiaohongshu',
        videoUrl: 'https://www.xiaohongshu.com/explore/帕梅拉训练',
        thumbnail: 'https://via.placeholder.com/300x200?text=帕梅拉训练',
        duration: 900,
        level: 3,
        target: 'full',
        gender: 'female',
        ageGroup: 'young',
        instructor: '帕梅拉',
        language: 'chinese',
        description: '高强度全身燃脂训练，挑战你的极限',
        tags: ['intense', 'fat-burn', 'chinese']
      },
      {
        id: 'xhs_003',
        title: '美丽芭蕾天鹅臂',
        platform: 'xiaohongshu',
        videoUrl: 'https://www.xiaohongshu.com/explore/美丽芭蕾',
        thumbnail: 'https://via.placeholder.com/300x200?text=美丽芭蕾',
        duration: 480, // 8分钟
        level: 1,
        target: 'arms',
        gender: 'female',
        ageGroup: 'any',
        instructor: '美丽芭蕾',
        language: 'chinese',
        description: '优雅的手臂塑形训练，让你拥有天鹅般的美臂',
        tags: ['arms', 'elegant', 'chinese']
      },
      {
        id: 'xhs_004',
        title: '产后恢复普拉提 - 温和版',
        platform: 'xiaohongshu',
        videoUrl: 'https://www.xiaohongshu.com/explore/产后普拉提',
        thumbnail: 'https://via.placeholder.com/300x200?text=产后恢复',
        duration: 900,
        level: 1,
        target: 'full',
        gender: 'female',
        ageGroup: 'middle',
        instructor: '专业教练',
        language: 'chinese',
        description: '专为产后妈妈设计的温和恢复训练',
        tags: ['postpartum', 'gentle', 'recovery']
      },
      {
        id: 'xhs_005',
        title: '办公室普拉提 - 久坐族必练',
        platform: 'xiaohongshu',
        videoUrl: 'https://www.xiaohongshu.com/explore/办公室普拉提',
        thumbnail: 'https://via.placeholder.com/300x200?text=办公室普拉提',
        duration: 600,
        level: 1,
        target: 'back',
        gender: 'any',
        ageGroup: 'middle',
        instructor: '健身教练',
        language: 'chinese',
        description: '缓解久坐带来的腰背不适，办公室也能练',
        tags: ['office', 'back-pain', 'gentle']
      }
    ];
  }

  // 获取所有视频
  getAllVideos() {
    return this.videoLibrary;
  }

  // 根据用户画像推荐视频
  getRecommendedVideos(userProfile) {
    const { age, gender, experience, language, timePreference } = userProfile;
    
    // 确定年龄组
    let ageGroup;
    if (age < 35) ageGroup = 'young';
    else if (age < 50) ageGroup = 'middle';
    else ageGroup = 'senior';
    
    // 确定难度等级
    let maxLevel;
    if (experience === '新手') maxLevel = 1;
    else if (experience === '有基础') maxLevel = 2;
    else maxLevel = 3;
    
    // 确定时长偏好 (秒)
    let maxDuration;
    if (timePreference === '10分钟以内') maxDuration = 600;
    else if (timePreference === '15分钟以内') maxDuration = 900;
    else maxDuration = 1800; // 30分钟
    
    // 过滤和评分
    const scoredVideos = this.videoLibrary
      .filter(video => {
        // 基础过滤条件
        return (
          video.level <= maxLevel && // 难度适合
          video.duration <= maxDuration && // 时长适合
          (video.gender === gender || video.gender === 'any') && // 性别适合
          (video.ageGroup === ageGroup || video.ageGroup === 'any') // 年龄适合
        );
      })
      .map(video => {
        let score = 0;
        
        // 语言偏好加分
        if (language === 'chinese' && video.language === 'chinese') score += 20;
        else if (language === 'english' && video.language === 'english') score += 20;
        else if (language === 'both') score += 10; // 中英文都可以
        
        // 难度匹配加分
        if (video.level === maxLevel) score += 15;
        
        // 时长偏好加分
        const durationScore = Math.max(0, 10 - Math.abs(video.duration - (maxDuration * 0.8)) / 60);
        score += durationScore;
        
        // 年龄组完全匹配加分
        if (video.ageGroup === ageGroup) score += 10;
        
        // 性别完全匹配加分
        if (video.gender === gender) score += 10;
        
        return { ...video, score };
      })
      .sort((a, b) => b.score - a.score); // 按分数排序
    
    // 返回前5个推荐，确保多样性
    const recommendations = [];
    const usedTargets = new Set();
    
    for (const video of scoredVideos) {
      if (recommendations.length >= 5) break;
      
      // 确保身体部位多样性
      if (!usedTargets.has(video.target) || recommendations.length < 3) {
        recommendations.push(video);
        usedTargets.add(video.target);
      }
    }
    
    return recommendations;
  }

  // 根据目标部位获取视频
  getVideosByTarget(target, userProfile = null) {
    let videos = this.videoLibrary.filter(video => video.target === target);
    
    if (userProfile) {
      // 根据用户画像进一步筛选
      const { experience } = userProfile;
      let maxLevel = experience === '新手' ? 1 : experience === '有基础' ? 2 : 3;
      videos = videos.filter(video => video.level <= maxLevel);
    }
    
    return videos.sort((a, b) => a.level - b.level); // 按难度排序
  }

  // 根据难度获取视频
  getVideosByLevel(level) {
    return this.videoLibrary.filter(video => video.level === level);
  }

  // 根据时长获取视频
  getVideosByDuration(maxDuration) {
    return this.videoLibrary
      .filter(video => video.duration <= maxDuration)
      .sort((a, b) => a.duration - b.duration);
  }

  // 获取热门推荐 (简单版)
  getPopularVideos() {
    // 模拟热门视频 - 实际可以根据用户完成率等数据
    const popularIds = ['yt_001', 'xhs_001', 'yt_002', 'xhs_003', 'yt_003'];
    return popularIds
      .map(id => this.videoLibrary.find(video => video.id === id))
      .filter(Boolean);
  }

  // 搜索视频
  searchVideos(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return this.videoLibrary.filter(video => 
      video.title.toLowerCase().includes(lowerKeyword) ||
      video.description.toLowerCase().includes(lowerKeyword) ||
      video.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      video.instructor.toLowerCase().includes(lowerKeyword)
    );
  }

  // 获取视频详情
  getVideoById(id) {
    return this.videoLibrary.find(video => video.id === id);
  }

  // 获取推荐的下一个视频 (基于刚完成的视频)
  getNextVideo(completedVideoId, userProfile) {
    const completedVideo = this.getVideoById(completedVideoId);
    if (!completedVideo) return null;
    
    // 寻找相似但稍难一点的视频
    const candidates = this.videoLibrary.filter(video => {
      return (
        video.id !== completedVideoId &&
        video.target === completedVideo.target && // 相同目标部位
        video.level >= completedVideo.level && // 难度不低于当前
        video.level <= completedVideo.level + 1 && // 但不会太难
        Math.abs(video.duration - completedVideo.duration) <= 300 // 时长相近
      );
    });
    
    if (candidates.length === 0) {
      // 如果没找到，就从推荐列表中选择
      const recommendations = this.getRecommendedVideos(userProfile);
      return recommendations.find(video => video.id !== completedVideoId) || null;
    }
    
    // 返回最匹配的候选视频
    return candidates[0];
  }

  // 获取统计信息
  getLibraryStats() {
    const totalVideos = this.videoLibrary.length;
    const platforms = [...new Set(this.videoLibrary.map(v => v.platform))];
    const levels = [...new Set(this.videoLibrary.map(v => v.level))];
    const targets = [...new Set(this.videoLibrary.map(v => v.target))];
    const totalDuration = this.videoLibrary.reduce((sum, v) => sum + v.duration, 0);
    
    return {
      totalVideos,
      platforms: platforms.length,
      levels: levels.length,
      targets: targets.length,
      totalDuration: Math.round(totalDuration / 60), // 分钟
      averageDuration: Math.round(totalDuration / totalVideos / 60) // 平均时长（分钟）
    };
  }
}

// 创建单例实例
const videoLibraryService = new VideoLibraryService();

export default videoLibraryService;