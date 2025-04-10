/**
 * 存储管理工具
 * 负责历史记录的存储、读取和管理
 */

// 存储键名常量
const STORAGE_KEYS = {
  HISTORY: 'decision_history',
  TEMP_OPTIONS: 'temp_decision_options',
  SETTINGS: 'app_settings',
};

// 最大历史记录数量
const MAX_HISTORY = 10;

/**
 * 保存决策记录到历史
 * @param {Object} decision 决策记录对象，包含options、result、theme等
 * @returns {string} 生成的决策ID
 */
export function saveDecision(decision) {
  try {
    const history = getHistory();
    const id = Date.now().toString();
    
    // 创建新的决策记录
    const newDecision = {
      id,
      title: decision.title || '未命名决策',
      options: decision.options || [],
      result: decision.result,
      timestamp: Date.now(),
      theme: decision.theme,
      seed: decision.seed
    };
    
    // 添加到历史开头
    history.unshift(newDecision);
    
    // 限制历史记录数量
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }
    
    // 保存到本地存储
    uni.setStorageSync(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    
    return id;
  } catch (e) {
    console.error('保存决策记录失败', e);
    return null;
  }
}

/**
 * 获取历史记录列表
 * @param {number} [start=0] 起始索引
 * @param {number} [count=20] 获取数量
 * @returns {Array} 历史记录数组
 */
export function getHistory(start = 0, count = 20) {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.HISTORY);
    const history = data ? JSON.parse(data) : [];
    
    // 如果请求全部历史，返回完整数组
    if (start === 0 && count >= history.length) {
      return history;
    }
    
    // 否则返回指定范围的子数组
    return history.slice(start, start + count);
  } catch (e) {
    console.error('获取历史记录失败', e);
    return [];
  }
}

/**
 * 获取历史记录总数
 * @returns {number} 历史记录数量
 */
export function getHistoryCount() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.HISTORY);
    const history = data ? JSON.parse(data) : [];
    return history.length;
  } catch (e) {
    console.error('获取历史记录数量失败', e);
    return 0;
  }
}

/**
 * 根据ID获取单个历史记录
 * @param {string} id 决策ID
 * @returns {Object|null} 决策记录对象
 */
export function getDecisionById(id) {
  try {
    console.log(`正在查找ID为${id}的历史记录`);
    
    // 确保ID有效
    if (!id) {
      console.error('无效的决策ID:', id);
      return null;
    }
    
    // 获取所有历史记录
    const data = uni.getStorageSync('decision_history');
    const history = data ? JSON.parse(data) : [];
    console.log(`加载了${history.length}条历史记录`);
    
    // 查找匹配记录
    const record = history.find(item => item.id === id);
    
    if (record) {
      console.log('成功找到记录:', record);
    } else {
      console.log(`未找到ID为${id}的记录`);
    }
    
    return record || null;
  } catch (e) {
    console.error('获取决策记录失败', e);
    return null;
  }
}

/**
 * 删除指定的历史记录
 * @param {string} id 决策ID
 * @returns {boolean} 删除是否成功
 */
export function deleteDecision(id) {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.HISTORY);
    let history = data ? JSON.parse(data) : [];
    
    // 找到并删除指定记录
    const index = history.findIndex(item => item.id === id);
    if (index !== -1) {
      history.splice(index, 1);
      uni.setStorageSync(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    }
    
    return false;
  } catch (e) {
    console.error('删除决策记录失败', e);
    return false;
  }
}

/**
 * 清空所有历史记录
 * @returns {boolean} 清空是否成功
 */
export function clearHistory() {
  try {
    uni.setStorageSync(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    return true;
  } catch (e) {
    console.error('清空历史记录失败', e);
    return false;
  }
}

/**
 * 搜索历史记录
 * @param {string} keyword 搜索关键词
 * @returns {Array} 匹配的历史记录
 */
export function searchHistory(keyword) {
  if (!keyword) return [];
  
  try {
    const history = getHistory(0, MAX_HISTORY);
    const lowerKeyword = keyword.toLowerCase();
    
    return history.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerKeyword);
      const resultMatch = item.result.toLowerCase().includes(lowerKeyword);
      const optionsMatch = item.options.some(option => 
        option.toLowerCase().includes(lowerKeyword)
      );
      
      return titleMatch || resultMatch || optionsMatch;
    });
  } catch (e) {
    console.error('搜索历史记录失败', e);
    return [];
  }
}

/**
 * 临时保存选项列表
 * @param {Array} options 选项列表
 * @returns {boolean} 保存是否成功
 */
export function saveTempOptions(options) {
  try {
    uni.setStorageSync(STORAGE_KEYS.TEMP_OPTIONS, JSON.stringify(options));
    return true;
  } catch (e) {
    console.error('保存临时选项失败', e);
    return false;
  }
}

/**
 * 获取临时保存的选项列表
 * @returns {Array} 选项列表
 */
export function getTempOptions() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.TEMP_OPTIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('获取临时选项失败', e);
    return [];
  }
}

/**
 * 清除临时选项
 */
export function clearTempOptions() {
  try {
    uni.removeStorageSync(STORAGE_KEYS.TEMP_OPTIONS);
  } catch (e) {
    console.error('清除临时选项失败', e);
  }
}

/**
 * 保存应用设置
 * @param {Object} settings 设置对象
 * @returns {boolean} 保存是否成功
 */
export function saveSettings(settings) {
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    uni.setStorageSync(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return true;
  } catch (e) {
    console.error('保存设置失败', e);
    return false;
  }
}

/**
 * 获取应用设置
 * @returns {Object} 设置对象
 */
export function getSettings() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      // 默认设置
      animationEnabled: true,
      vibrationEnabled: true,
      soundEnabled: true,
      defaultTheme: 'capsule',
      useSensorData: true
    };
  } catch (e) {
    console.error('获取设置失败', e);
    return {
      // 默认设置
      animationEnabled: true,
      vibrationEnabled: true,
      soundEnabled: true,
      defaultTheme: 'capsule',
      useSensorData: true
    };
  }
}

export default {
  saveDecision,
  getHistory,
  getHistoryCount,
  getDecisionById,
  deleteDecision,
  clearHistory,
  searchHistory,
  saveTempOptions,
  getTempOptions,
  clearTempOptions,
  saveSettings,
  getSettings,
  MAX_HISTORY
}; 