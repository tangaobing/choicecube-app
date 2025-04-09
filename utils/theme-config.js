/**
 * 决策魔方主题系统配置
 * 定义四种主题：命运胶囊、神选时刻、天机轮、气运池
 */

export const themes = [
  {
    id: 'capsule',
    name: '命运胶囊',
    description: '科技风格，未来感十足的决策体验',
    previewImage: '/static/images/themes/capsule_preview.png',
    colors: {
      primary: '#0050FF',
      secondary: '#00BFFF',
      background: '#121212',
      text: '#FFFFFF',
      accent: '#00F7FF'
    },
    // 关键词匹配，用于主题推荐
    keywords: ['科技', '未来', '电子', '数码', '程序', '代码', '机器', '软件']
  },
  {
    id: 'divine',
    name: '神选时刻',
    description: '神圣风格，庄严神秘的决策体验',
    previewImage: '/static/images/themes/divine_preview.png',
    colors: {
      primary: '#FFD700',
      secondary: '#8A2BE2',
      background: '#1A0033',
      text: '#FFFFFF',
      accent: '#FFA500'
    },
    // 关键词匹配，用于主题推荐
    keywords: ['神圣', '神秘', '宗教', '命运', '神话', '传说', '信仰', '魔法']
  },
  {
    id: 'wheel',
    name: '天机轮',
    description: '东方玄学风格，传统韵味的决策体验',
    previewImage: '/static/images/themes/wheel_preview.png',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      background: '#F2F2F2',
      text: '#000000',
      accent: '#C41E3A'
    },
    // 关键词匹配，用于主题推荐
    keywords: ['中国', '东方', '传统', '国学', '玄学', '八卦', '易经', '风水']
  },
  {
    id: 'pool',
    name: '气运池',
    description: '流体风格，轻松舒适的决策体验',
    previewImage: '/static/images/themes/pool_preview.png',
    colors: {
      primary: '#4FAFD9',
      secondary: '#8CDDCD',
      background: '#F0F8FF',
      text: '#333333',
      accent: '#1E90FF'
    },
    // 关键词匹配，用于主题推荐
    keywords: ['水', '流体', '舒适', '轻松', '休闲', '清新', '自然', '放松']
  }
];

/**
 * 获取单个主题配置
 * @param {string} themeId 主题ID
 * @returns {Object|null} 主题配置对象
 */
export function getThemeById(themeId) {
  return themes.find(theme => theme.id === themeId) || null;
}

/**
 * 根据选项内容推荐主题
 * @param {Array} options 选项数组
 * @returns {string} 推荐主题ID
 */
export function recommendTheme(options) {
  // 如果没有选项或选项少于2个，返回默认主题
  if (!options || options.length < 2) {
    return 'capsule'; // 默认主题
  }
  
  // 将所有选项内容合并为一个字符串
  const content = options.join(' ');
  
  // 各主题的匹配分数
  const scores = {
    capsule: 0,
    divine: 0, 
    wheel: 0,
    pool: 0
  };
  
  // 遍历所有主题，检查关键词匹配情况
  themes.forEach(theme => {
    theme.keywords.forEach(keyword => {
      // 检查每个选项中是否包含关键词，不区分大小写
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        scores[theme.id]++;
      }
    });
  });
  
  // 查找得分最高的主题
  let highestScore = 0;
  let recommendedTheme = 'capsule'; // 默认主题
  
  Object.keys(scores).forEach(themeId => {
    if (scores[themeId] > highestScore) {
      highestScore = scores[themeId];
      recommendedTheme = themeId;
    }
  });
  
  return recommendedTheme;
}

/**
 * 获取随机主题
 * @returns {string} 随机主题ID
 */
export function getRandomTheme() {
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex].id;
}

export default {
  themes,
  getThemeById,
  recommendTheme,
  getRandomTheme
}; 