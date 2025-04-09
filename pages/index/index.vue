<template>
	<view class="home-container">
		<!-- 历史记录按钮 -->
		<view class="history-btn" @tap="navigateToHistory">
			<text class="iconfont icon-history"></text>
			<text class="history-text">历史</text>
		</view>
		
		<!-- 内容区域 -->
		<view class="content">
			<view class="logo-container">
				<!-- 3D魔方 - 使用图片背景 -->
				<view class="cube-3d" :class="{ 'active-rotate': isRotating }" @tap="previewThemes">
					<view class="cube-face front" :style="getThemeImageStyle('divine')">
						<text class="face-text">神选</text>
					</view>
					<view class="cube-face back" :style="getThemeImageStyle('capsule')">
						<text class="face-text">胶囊</text>
					</view>
					<view class="cube-face right" :style="getThemeImageStyle('wheel')">
						<text class="face-text">天机</text>
					</view>
					<view class="cube-face left" :style="getThemeImageStyle('pool')">
						<text class="face-text">气运</text>
					</view>
					<view class="cube-face top">
						<text class="iconfont icon-lightbulb"></text>
					</view>
					<view class="cube-face bottom">
						<text class="iconfont icon-check"></text>
					</view>
				</view>
				<view class="app-title">决策魔方</view>
				<view class="app-subtitle">让选择变得简单而有趣</view>
			</view>
			
			<!-- 新建决策按钮 -->
			<view class="new-decision-btn" @tap="navigateToNewDecision">
				<text class="btn-icon"><text class="iconfont icon-plus"></text></text>
				<text class="btn-text">新建决策</text>
			</view>
		</view>
		
		<!-- 页脚 -->
		<view class="footer">
			<text>© 2025 决策魔方 - 您的个人决策助手</text>
		</view>
		
		<!-- 主题预览弹窗 -->
		<view class="theme-preview" v-if="showThemePreview">
			<view class="theme-preview-content">
				<view class="theme-preview-title">选择主题</view>
				<view class="theme-preview-list">
					<view 
						v-for="theme in themes" 
						:key="theme.id" 
						class="theme-preview-item"
						@tap="selectThemeAndStart(theme.id)"
					>
						<view class="theme-preview-name">{{ theme.name }}</view>
						<view class="theme-preview-desc">{{ theme.description }}</view>
					</view>
				</view>
				<button class="btn-secondary" @tap="closeThemePreview">关闭</button>
			</view>
		</view>
	</view>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { themes } from '@/utils/theme-config';

export default {
	setup() {
		const store = useStore();
		// 魔方旋转状态
		const isRotating = ref(false);
		// 主题预览显示状态
		const showThemePreview = ref(false);
		// 当前主题
		const currentTheme = ref(null);

		// 初始化设置
		onMounted(() => {
			// 初始化Vuex状态
			store.dispatch('initApp');
			// 获取当前主题
			currentTheme.value = store.state.theme || 'divine';
			// 启动魔方旋转动画
			startCubeRotation();
		});

		// 启动魔方旋转动画 - 持续旋转
		const startCubeRotation = () => {
			// 始终保持旋转状态
			isRotating.value = true;
		};
		
		// 显示主题预览
		const previewThemes = () => {
			showThemePreview.value = true;
		};
		
		// 关闭主题预览
		const closeThemePreview = () => {
			showThemePreview.value = false;
		};
		
		// 选择主题并开始
		const selectThemeAndStart = (themeId) => {
			// 更新当前主题
			currentTheme.value = themeId;
			store.commit('SET_THEME', themeId);
			navigateToNewDecision();
		};
		
		// 根据面和当前主题返回对应的图标
		const getFaceIcon = (face) => {
			// 定义主题对应的图标映射
			const themeIcons = {
				divine: {
					front: 'icon-star',
					back: 'icon-magic',
					right: 'icon-feather',
					left: 'icon-diamond'
				},
				capsule: {
					front: 'icon-lab',
					back: 'icon-pill',
					right: 'icon-test-tube',
					left: 'icon-flask'
				},
				wheel: {
					front: 'icon-dice',
					back: 'icon-yin-yang',
					right: 'icon-compass',
					left: 'icon-bagua'
				},
				pool: {
					front: 'icon-water',
					back: 'icon-droplet',
					right: 'icon-wave',
					left: 'icon-ripple'
				}
			};
			
			// 默认图标映射
			const defaultIcons = {
				front: 'icon-dice',
				back: 'icon-random',
				right: 'icon-question',
				left: 'icon-magic'
			};
			
			// 如果有对应主题的图标，返回主题图标，否则返回默认图标
			return themeIcons[currentTheme.value]?.[face] || defaultIcons[face];
		};
		
		// 开始随机决策
		const startRandomDecision = () => {
			const randomTheme = themes[Math.floor(Math.random() * themes.length)];
			selectThemeAndStart(randomTheme.id);
		};
		
		// 导航到新建决策页面
		const navigateToNewDecision = () => {
			console.log('导航到新建决策页面');
			// 先清空之前的所有选项数据
			store.commit('CLEAR_DECISION_DATA');
			uni.navigateTo({
				url: '/pages/option-input/index'
			});
		};
		
		// 导航到历史记录页面
		const navigateToHistory = () => {
			uni.navigateTo({
				url: '/pages/history/index'
			});
		};
		
		// 获取主题图片样式
		const getThemeImageStyle = (theme) => {
			// 主题图片路径映射 - 使用实际存在的文件名
			const themeImages = {
				divine: '../../static/images/themes/divine_preview.png',
				capsule: '../../static/images/themes/capsule_preview.png',
				wheel: '../../static/images/themes/wheel_preview.png',
				pool: '../../static/images/themes/pool_preview.png'
			};
			
			// 获取当前主题的图片
			const imagePath = themeImages[theme] || themeImages.divine;
			
			// 返回带背景图的样式对象
			return {
				'background-image': `url(${imagePath})`,
				'background-size': 'cover',
				'background-position': 'center',
				'display': 'flex', 
				'justify-content': 'center',
				'align-items': 'center'
			};
		};
		
		return {
			themes,
			isRotating,
			showThemePreview,
			previewThemes,
			closeThemePreview,
			selectThemeAndStart,
			startRandomDecision,
			navigateToNewDecision,
			navigateToHistory,
			currentTheme,
			getFaceIcon,
			getThemeImageStyle
		};
	}
};
</script>

<style lang="scss">
.home-container {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-image: url('../../static/images/background.jpg');
	background-size: cover;
	background-position: center;
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1;
	}
}

.history-btn {
	position: absolute;
	top: 20px;
	right: 20px;
	background-color: rgba(255, 255, 255, 0.3);
	backdrop-filter: blur(10px);
	color: white;
	padding: 8px 15px;
	border-radius: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	z-index: 10;
	transition: all 0.3s ease;
	
	.iconfont {
		font-size: 18px;
		margin-right: 5px;
	}
	
	.history-text {
		font-size: 14px;
		font-weight: 500;
	}
	
	&:active {
		background-color: rgba(255, 255, 255, 0.4);
		transform: scale(1.05);
	}
}

.content {
	position: relative;
	z-index: 2;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 20px;
}

.logo-container {
	margin-bottom: 40px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.app-title {
	color: white;
	font-size: 28px;
	font-weight: bold;
	margin-top: 35px;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.app-subtitle {
	color: rgba(255, 255, 255, 0.8);
	font-size: 16px;
	margin-top: 5px;
	text-align: center;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.new-decision-btn {
	background: linear-gradient(135deg, #6366F1, #8B5CF6);
	color: white;
	font-size: 18px;
	font-weight: 500;
	padding: 16px 32px;
	border-radius: 50px;
	margin-top: 40px;
	box-shadow: 0 4px 20px rgba(107, 70, 193, 0.5);
	display: flex;
	align-items: center;
	transition: all 0.3s ease;
	
	.btn-icon {
		margin-right: 10px;
	}
	
	&:active {
		transform: translateY(-3px);
		box-shadow: 0 6px 25px rgba(107, 70, 193, 0.6);
	}
}

.footer {
	position: relative;
	z-index: 2;
	padding: 20px;
	text-align: center;
	color: rgba(255, 255, 255, 0.6);
	font-size: 12px;
}

/* 3D魔方样式 */
.cube-3d {
	width: 150px;
	height: 150px;
	position: relative;
	transform-style: preserve-3d;
	transform: rotateX(-30deg) rotateY(45deg);
	animation: float 3s ease-in-out infinite;
}

.active-rotate {
	animation: rotate 20s linear infinite;
}

.cube-face {
	position: absolute;
	width: 150px;
	height: 150px;
	background: rgba(99, 102, 241, 0.8);
	border: 2px solid rgba(255, 255, 255, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
	box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
	
	.iconfont {
		font-size: 50px;
	}
}

.front {
	transform: translateZ(75px);
}

.back {
	transform: translateZ(-75px) rotateY(180deg);
}

.right {
	transform: translateX(75px) rotateY(90deg);
}

.left {
	transform: translateX(-75px) rotateY(-90deg);
}

.top {
	transform: translateY(-75px) rotateX(90deg);
}

.bottom {
	transform: translateY(75px) rotateX(-90deg);
}

/* 主题预览弹窗 */
.theme-preview {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
}

.theme-preview-content {
	width: 80%;
	max-width: 600px;
	background-color: white;
	border-radius: 10px;
	padding: 20px;
	max-height: 80vh;
	overflow-y: auto;
}

.theme-preview-title {
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	margin-bottom: 20px;
}

.theme-preview-list {
	margin-bottom: 20px;
}

.theme-preview-item {
	padding: 15px;
	border-bottom: 1px solid #eee;
	
	&:last-child {
		border-bottom: none;
	}
}

.theme-preview-name {
	font-weight: bold;
	font-size: 16px;
	margin-bottom: 5px;
}

.theme-preview-desc {
	font-size: 14px;
	color: #666;
}

.btn-secondary {
	background-color: #6B7280;
	color: white;
	padding: 10px 20px;
	border-radius: 5px;
	width: 100%;
}

@keyframes float {
	0% { transform: rotateX(-30deg) rotateY(45deg) translateY(0px); }
	50% { transform: rotateX(-30deg) rotateY(45deg) translateY(-10px); }
	100% { transform: rotateX(-30deg) rotateY(45deg) translateY(0px); }
}

@keyframes rotate {
	0% { transform: rotateX(-30deg) rotateY(0deg); }
	100% { transform: rotateX(-30deg) rotateY(360deg); }
}

/* 主题特定的魔方面样式 */
.divine-face {
	background: linear-gradient(135deg, rgba(138, 43, 226, 0.8), rgba(75, 0, 130, 0.8)) !important;
	border-color: rgba(218, 165, 32, 0.8) !important;
	box-shadow: 0 0 20px rgba(138, 43, 226, 0.6) !important;
}

.capsule-face {
	background: linear-gradient(135deg, rgba(0, 255, 255, 0.8), rgba(0, 128, 128, 0.8)) !important;
	border-color: rgba(255, 255, 255, 0.8) !important;
	box-shadow: 0 0 20px rgba(0, 255, 255, 0.6) !important;
}

.wheel-face {
	background: linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 67, 33, 0.8)) !important;
	border-color: rgba(255, 215, 0, 0.8) !important;
	box-shadow: 0 0 20px rgba(139, 69, 19, 0.6) !important;
}

.pool-face {
	background: linear-gradient(135deg, rgba(0, 119, 190, 0.8), rgba(30, 144, 255, 0.8)) !important;
	border-color: rgba(135, 206, 250, 0.8) !important;
	box-shadow: 0 0 20px rgba(30, 144, 255, 0.6) !important;
}

/* 魔方面文字样式 */
.face-text {
	position: absolute;
	bottom: 10px;
	right: 10px;
	color: white;
	font-size: 20px;
	font-weight: bold;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
	background-color: rgba(0, 0, 0, 0.5);
	padding: 4px 8px;
	border-radius: 4px;
	backdrop-filter: blur(3px);
}
</style>

