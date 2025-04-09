<template>
	<view class="theme-select-page">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="back-text">返回</text>
			</view>
			<view class="nav-title">选择一个主题风格</view>
			<view class="nav-right"></view>
		</view>
		
		<!-- 主题卡片网格 -->
		<view class="theme-grid">
			<!-- 命运胶囊主题 -->
			<view 
				class="theme-card capsule-theme" 
				:class="{'active': selectedTheme === 'capsule', 'recommended': recommendedTheme === 'capsule'}"
				@tap="selectTheme('capsule')"
			>
				<view class="theme-preview">
					<image class="theme-image" src="/static/images/themes/capsule_preview.png" mode="aspectFill"></image>
				</view>
				<view class="theme-name">命运胶囊</view>
			</view>
			
			<!-- 神选时刻主题 -->
			<view 
				class="theme-card divine-theme" 
				:class="{'active': selectedTheme === 'divine', 'recommended': recommendedTheme === 'divine'}"
				@tap="selectTheme('divine')"
			>
				<view class="theme-preview">
					<image class="theme-image" src="/static/images/themes/divine_preview.png" mode="aspectFill"></image>
				</view>
				<view class="theme-name">神选时刻</view>
			</view>
			
			<!-- 天机轮主题 -->
			<view 
				class="theme-card wheel-theme" 
				:class="{'active': selectedTheme === 'wheel', 'recommended': recommendedTheme === 'wheel'}"
				@tap="selectTheme('wheel')"
			>
				<view class="theme-preview">
					<image class="theme-image" src="/static/images/themes/wheel_preview.png" mode="aspectFill"></image>
				</view>
				<view class="theme-name">天机轮</view>
			</view>
			
			<!-- 气运池主题 -->
			<view 
				class="theme-card pool-theme" 
				:class="{'active': selectedTheme === 'pool', 'recommended': recommendedTheme === 'pool'}"
				@tap="selectTheme('pool')"
			>
				<view class="theme-preview">
					<image class="theme-image" src="/static/images/themes/pool_preview.png" mode="aspectFill"></image>
				</view>
				<view class="theme-name">气运池</view>
			</view>
		</view>
		
		<!-- 开始决策按钮 -->
		<view class="decision-btn-container">
			<view class="start-btn" @tap="startDecision" :class="{ 'disabled': !selectedTheme }">
				开始决策
			</view>
		</view>
	</view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { themes, recommendTheme } from '@/utils/theme-config';

export default {
	setup() {
		const store = useStore();
		
		// 选中的主题
		const selectedTheme = ref('');
		
		// 推荐的主题
		const recommendedTheme = ref('');
		
		// 选项列表
		const options = computed(() => store.state.options);
		
		// 初始化
		onMounted(() => {
			// 获取推荐主题
			if (options.value.length >= 2) {
				recommendedTheme.value = recommendTheme(options.value);
				// 默认选中推荐主题
				selectedTheme.value = recommendedTheme.value;
				// 设置当前主题
				store.commit('SET_THEME', selectedTheme.value);
			}
		});
		
		// 选择主题
		const selectTheme = (themeId) => {
			selectedTheme.value = themeId;
			store.commit('SET_THEME', themeId);
			
			// 震动反馈
			if (store.getters.isVibrationEnabled) {
				uni.vibrateShort();
			}
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 开始决策
		const startDecision = () => {
			if (selectedTheme.value) {
				uni.navigateTo({
					url: '/pages/animation/index'
				});
			} else {
				uni.showToast({
					title: '请选择一个主题',
					icon: 'none'
				});
			}
		};
		
		return {
			selectedTheme,
			recommendedTheme,
			themes,
			selectTheme,
			goBack,
			startDecision
		};
	}
};
</script>

<style lang="scss">
.theme-select-page {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: linear-gradient(135deg, #ffffff, #f7f9fc);
	background-image: url('/static/images/backgrounds/theme_select_bg.png');
	background-size: cover;
	background-position: center;
	background-blend-mode: soft-light;
	position: relative;
	
	/* 背景图片支持 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: var(--theme-select-bg-image, none);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0.25; /* 适当透明度，保持主题卡片突出 */
		z-index: 0;
	}
	
	/* 确保所有内容在背景之上 */
	& > * {
		position: relative;
		z-index: 1;
	}
}

/* 导航栏样式 */
.nav-bar {
	width: 100%;
	height: 44px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	background-color: #ffffff;
	border-bottom: 1px solid #f0f0f0;
	margin-top: var(--status-bar-height);
}

.nav-left {
	width: 70px;
	height: 100%;
	display: flex;
	align-items: center;
}

.back-text {
	font-size: 16px;
	color: #333333;
	font-weight: 500;
}

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 17px;
	font-weight: bold;
	color: #333333;
}

.nav-right {
	width: 30px;
}

/* 主题网格布局 */
.theme-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 10px;
	flex: 1;
}

/* 主题卡片样式 */
.theme-card {
	width: calc(50% - 8px);
	height: calc(40vh - 60px); 
	margin-bottom: 16px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s, box-shadow 0.2s;
	
	&.active {
		transform: scale(1.03);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		border: 2px solid #ffffff;
		outline: 1px solid #3f7ef2;
	}
	
	&.recommended::after {
		content: '推荐';
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 3px 8px;
		background-color: rgba(255, 255, 255, 0.8);
		color: #ff6b00;
		border-radius: 30px;
		font-size: 12px;
		font-weight: bold;
		z-index: 2;
	}
	
	/* 调整下方的卡片位置，上移减少间距 */
	&:nth-child(3), &:nth-child(4) {
		margin-top: -50px;
	}
	
	.theme-preview {
		width: 100%;
		height: 80%;
		position: relative;
		overflow: hidden;
	}
	
	.theme-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.theme-name {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}
}

/* 各主题卡片特定样式 */
.capsule-theme {
	background-color: #0050FF;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom right, #0050FF, #00BFFF);
		z-index: 0;
	}
}

.divine-theme {
	background-color: #8A2BE2;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom right, #8A2BE2, #FFD700);
		z-index: 0;
	}
}

.wheel-theme {
	background-color: #1e293b;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom right, #1e293b, #475569);
		z-index: 0;
	}
}

.pool-theme {
	background-color: #4FAFD9;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom right, #4FAFD9, #8CDDCD);
		z-index: 0;
	}
}

/* 底部区域样式 */
.decision-btn-container {
	position: absolute;
	bottom: 40px;
	left: 0;
	right: 0;
	padding: 0 30px;
	z-index: 10;
}

.start-btn {
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to right, #a0a0a0, #cccccc); /* 默认为灰色 */
	color: #ffffff;
	border-radius: 25px;
	font-size: 18px;
	font-weight: bold;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
	
	&:not(.disabled) {
		background: linear-gradient(to right, #3f7ef2, #5c9df5); /* 选中后为蓝色 */
		box-shadow: 0 4px 15px rgba(63, 126, 242, 0.4);
	}
	
	&.disabled {
		opacity: 0.8;
	}
}
</style>