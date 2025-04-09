import { createStore } from 'vuex';
import { getSettings, saveSettings } from '@/utils/storage';
import { getRandomTheme } from '@/utils/theme-config';

const store = createStore({
  state: {
    // 决策相关
    options: [],  // 当前决策的选项列表
    decisionQuestion: '', // 决策问题
    decisionResult: null, // 最终的决策结果
    decisionSeed: 0,      // 用于生成决策结果的随机种子
    
    // 主题相关
    currentTheme: 'capsule', // 当前主题
    
    // 应用设置
    settings: {
      animationEnabled: true,   // 动画开关
      vibrationEnabled: true,   // 振动开关
      soundEnabled: true,       // 音效开关
      defaultTheme: 'capsule',  // 默认主题
      useSensorData: true       // 使用传感器数据增强随机性
    },
    
    // 应用状态
    isAnimating: false, // 是否正在播放动画
  },
  
  mutations: {
    /**
     * 设置选项列表
     * @param {Object} state Vuex状态
     * @param {Array} options 选项数组
     */
    SET_OPTIONS(state, options) {
      state.options = options;
    },
    
    /**
     * 添加单个选项
     * @param {Object} state Vuex状态
     * @param {string} option 选项内容
     */
    ADD_OPTION(state, option) {
      if (option && !state.options.includes(option)) {
        state.options.push(option);
      }
    },
    
    /**
     * 删除选项
     * @param {Object} state Vuex状态
     * @param {number} index 选项索引
     */
    REMOVE_OPTION(state, index) {
      if (index >= 0 && index < state.options.length) {
        state.options.splice(index, 1);
      }
    },
    
    /**
     * 清空选项列表
     * @param {Object} state Vuex状态
     */
    CLEAR_OPTIONS(state) {
      state.options = [];
    },
    
    /**
     * 设置决策结果
     * @param {Object} state Vuex状态
     * @param {Object} payload 包含result和seed的对象
     */
    SET_DECISION_RESULT(state, { result, seed }) {
      state.decisionResult = result;
      state.decisionSeed = seed;
    },
    
    /**
     * 设置当前主题
     * @param {Object} state Vuex状态
     * @param {string} themeId 主题ID
     */
    SET_THEME(state, themeId) {
      state.currentTheme = themeId;
    },
    
    /**
     * 设置动画状态
     * @param {Object} state Vuex状态
     * @param {boolean} isAnimating 是否正在播放动画
     */
    SET_ANIMATING(state, isAnimating) {
      state.isAnimating = isAnimating;
    },
    
    /**
     * 更新应用设置
     * @param {Object} state Vuex状态
     * @param {Object} settings 设置对象
     */
    UPDATE_SETTINGS(state, settings) {
      state.settings = { ...state.settings, ...settings };
      // 保存到本地存储
      saveSettings(state.settings);
    },
    
    /**
     * 初始化应用设置
     * @param {Object} state Vuex状态
     */
    INIT_SETTINGS(state) {
      const savedSettings = getSettings();
      state.settings = savedSettings;
      // 同步当前主题为默认主题
      state.currentTheme = savedSettings.defaultTheme;
    },
    
    /**
     * 设置决策问题
     * @param {Object} state Vuex状态
     * @param {string} question 决策问题
     */
    SET_DECISION_QUESTION(state, question) {
      state.decisionQuestion = question;
    },
    
    /**
     * 清空决策数据
     * @param {Object} state Vuex状态
     */
    CLEAR_DECISION_DATA(state) {
      state.options = [];
      state.decisionQuestion = '';
      state.decisionResult = null;
      state.decisionSeed = 0;
    }
  },
  
  actions: {
    /**
     * 初始化应用
     * @param {Object} context Vuex上下文
     */
    initApp({ commit }) {
      commit('INIT_SETTINGS');
    },
    
    /**
     * 选择随机主题
     * @param {Object} context Vuex上下文
     * @returns {string} 选中的主题ID
     */
    selectRandomTheme({ commit }) {
      const randomThemeId = getRandomTheme();
      commit('SET_THEME', randomThemeId);
      return randomThemeId;
    },
    
    /**
     * 根据结果更新状态
     * @param {Object} context Vuex上下文
     * @param {Object} payload 包含result和seed的对象
     */
    updateDecisionResult({ commit }, { result, seed }) {
      commit('SET_DECISION_RESULT', { result, seed });
    }
  },
  
  getters: {
    /**
     * 选项列表是否有效(至少2个选项)
     * @param {Object} state Vuex状态
     * @returns {boolean} 是否有效
     */
    hasValidOptions: (state) => {
      return state.options.length >= 2;
    },
    
    /**
     * 获取当前主题ID
     * @param {Object} state Vuex状态
     * @returns {string} 主题ID
     */
    currentThemeId: (state) => {
      return state.currentTheme;
    },
    
    /**
     * 获取动画是否启用
     * @param {Object} state Vuex状态
     * @returns {boolean} 是否启用动画
     */
    isAnimationEnabled: (state) => {
      return state.settings.animationEnabled;
    },
    
    /**
     * 获取振动是否启用
     * @param {Object} state Vuex状态
     * @returns {boolean} 是否启用振动
     */
    isVibrationEnabled: (state) => {
      return state.settings.vibrationEnabled;
    }
  }
});

export default store; 