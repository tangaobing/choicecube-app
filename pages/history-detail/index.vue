<template>
	<view class="detail-page" :class="'theme-' + historyItem.theme">
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @tap="goBack">
				<text class="back-text">返回</text>
			</view>
			<view class="navbar-title">记录详情</view>
			<view class="navbar-right"></view>
		</view>
		
		<template v-if="historyItem.id">
			<!-- 结果卡片 - 改进版 -->
			<view class="result-card">
				<!-- 标题区域 -->
				<view class="result-header">
					<view class="result-title">{{ historyItem.title }}</view>
					<view class="result-time">{{ formatDate(historyItem.time) }}</view>
				</view>
				
				<!-- 主结果区域 -->
				<view class="result-content">
					<view class="result-label">决策结果</view>
					<view class="result-text-container">
						<text class="result-text">{{ historyItem.result }}</text>
					</view>
				</view>
				
				<!-- 选项区域 -->
				<view class="options-section">
					<view class="section-title">所有选项</view>
					<view class="options-container">
						<view 
							class="option-item" 
							v-for="(option, index) in historyItem.options" 
							:key="index"
							:class="{'selected': option === historyItem.result}"
						>
							<text class="option-text">{{ option }}</text>
							<text v-if="option === historyItem.result" class="selected-icon">✓</text>
						</view>
					</view>
				</view>
				
				<!-- 其他信息区域 -->
				<view class="details-section">
					<view class="section-title">详细信息</view>
					<view class="info-table">
						<view class="info-row">
							<view class="info-label">使用主题</view>
							<view class="info-value theme-value">{{ getThemeName(historyItem.theme) }}</view>
						</view>
						<view class="info-row">
							<view class="info-label">随机种子</view>
							<view class="info-value seed-value">{{ historyItem.seed }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 操作按钮 -->
			<view class="action-buttons">
				<view class="action-button" @tap="replayDecision">
					<text class="iconfont icon-replay">🔄</text>
					<text class="button-text">重现结果</text>
				</view>
				<view class="action-button" @tap="restoreOptions">
					<text class="iconfont icon-revert">📝</text>
					<text class="button-text">恢复选项</text>
				</view>
			</view>
		</template>
		
		<!-- 加载中 -->
		<view class="loading-container" v-if="isLoading">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 记录不存在 -->
		<view class="not-found" v-if="notFound">
			<image class="not-found-image" src="/static/images/not-found.png" mode="aspectFit"></image>
			<text class="not-found-text">记录不存在或已被删除</text>
			<button class="back-btn" @tap="goBack">返回</button>
		</view>
	</view>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getDecisionById, deleteDecision } from '@/utils/storage';
import { getThemeById } from '@/utils/theme-config';

export default {
	onLoad(query) {
		// 使用onLoad钩子代替onMounted，直接获取页面参数
		try {
			this.isLoading = true;
			console.log('历史详情页面已加载，参数:', query);
			
			// 获取记录ID
			const id = query?.id;
			
			if (id) {
				console.log('获取到记录ID:', id);
				this.loadHistoryItem(id);
			} else {
				console.error('URL参数中未找到ID');
				this.isLoading = false;
				this.notFound = true;
			}
		} catch (error) {
			console.error('onLoad执行错误:', error);
			this.isLoading = false;
			this.notFound = true;
		}
	},
	
	setup() {
		const store = useStore();
		
		// 页面状态
		const historyItem = reactive({
			id: '',
			title: '',
			options: [],
			result: '',
			seed: '',
			theme: 'capsule',
			time: 0
		});
		
		const isLoading = ref(true);
		const notFound = ref(false);
		const statusBarHeight = ref(20); // 默认状态栏高度
		
		// 加载历史记录
		const loadHistoryItem = (id) => {
			try {
				console.log('开始加载历史记录，ID:', id);
				isLoading.value = true;
				notFound.value = false;
				
				// 直接从storage读取历史记录
				try {
					const data = uni.getStorageSync('decision_history');
					console.log('读取历史记录数据:', data ? '成功' : '空');
					
					if (!data) {
						isLoading.value = false;
						notFound.value = true;
						return;
					}
					
					const history = JSON.parse(data);
					console.log(`历史记录长度: ${history.length}`);
					
					// 查找匹配的记录
					const record = history.find(item => item.id === id);
					
					if (record) {
						console.log('找到历史记录:', record);
						// 安全复制属性
						historyItem.id = record.id || '';
						historyItem.title = record.title || '未命名决策';
						historyItem.options = record.options || [];
						historyItem.result = record.result || '';
						historyItem.seed = record.seed || '';
						historyItem.theme = record.theme || 'capsule';
						historyItem.time = record.timestamp || record.time || Date.now();
						
						isLoading.value = false;
					} else {
						console.log(`未找到ID为${id}的记录`);
						isLoading.value = false;
						notFound.value = true;
					}
				} catch (storageError) {
					console.error('读取存储失败:', storageError);
					isLoading.value = false;
					notFound.value = true;
				}
			} catch (error) {
				console.error('加载历史记录失败', error);
				isLoading.value = false;
				notFound.value = true;
			}
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 格式化日期
		const formatDate = (timestamp) => {
			if (!timestamp) return '';
			
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const hour = date.getHours().toString().padStart(2, '0');
			const minute = date.getMinutes().toString().padStart(2, '0');
			const second = date.getSeconds().toString().padStart(2, '0');
			
			return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		};
		
		// 获取主题名称
		const getThemeName = (themeId) => {
			const themeMap = {
				'capsule': '命运胶囊',
				'divine': '神选时刻',
				'wheel': '天机轮',
				'pool': '气运池'
			};
			
			return themeMap[themeId] || themeId;
		};
		
		// 重现决策
		const replayDecision = () => {
			// 设置选项和主题
			store.commit('SET_OPTIONS', historyItem.options);
			store.commit('SET_THEME', historyItem.theme);
			
			// 跳转到动画页面，但携带seed以便重现
			uni.navigateTo({
				url: `/pages/animation/index?replaySeed=${historyItem.seed}`
			});
		};
		
		// 恢复选项
		const restoreOptions = () => {
			// 设置选项
			store.commit('SET_OPTIONS', historyItem.options);
			
			// 设置决策问题
			if (historyItem.title) {
				store.commit('SET_DECISION_QUESTION', historyItem.title);
			}
			
			// 跳转到选项输入页
			uni.navigateTo({
				url: '/pages/option-input/index'
			});
		};
		
		// 组件挂载时获取状态栏高度
		onMounted(() => {
			// 获取状态栏高度
			try {
				const systemInfo = uni.getSystemInfoSync();
				statusBarHeight.value = systemInfo.statusBarHeight || 20;
			} catch (e) {
				console.error('获取系统信息失败', e);
			}
		});
		
		return {
			historyItem,
			isLoading,
			notFound,
			statusBarHeight,
			loadHistoryItem,
			goBack,
			formatDate,
			getThemeName,
			replayDecision,
			restoreOptions
		};
	}
};
</script>

<style lang="scss">
/* 状态栏样式 */
.status-bar {
	width: 100%;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
}

.detail-page {
	min-height: 100vh;
	background-color: #f6f7f9;
	background-image: url('/static/images/backgrounds/history_detail_bg.png');
	background-size: cover;
	background-position: center;
	background-blend-mode: soft-light;
	padding-bottom: 40rpx;
	position: relative;
	
	/* 背景图片支持 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: var(--history-detail-bg-image, none);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0.15; /* 降低透明度确保内容可见 */
		z-index: 0;
	}
	
	/* 确保所有内容在背景之上 */
	& > * {
		position: relative;
		z-index: 1;
	}
	
	/* 主题特定样式 */
	&.theme-capsule {
		background: linear-gradient(135deg, #f0f7ff, #e6f2ff);
		
		.navbar {
			background: linear-gradient(to right, rgba(0, 119, 182, 0.9), rgba(3, 4, 94, 0.8));
			color: #ffffff;
		}
		
		.result-card {
			background-color: rgba(255, 255, 255, 0.95);
			color: #333333;
			border-top: 8rpx solid #0077b6;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #caf0f8, #ade8f4);
			color: #03045e;
			box-shadow: 0 4rpx 15rpx rgba(0, 119, 182, 0.2);
		}
		
		.section-title {
			color: #0077b6;
			border-left: 6rpx solid #0077b6;
			padding-left: 12rpx;
		}
		
		.option-item.selected {
			background-color: #e0f7fa;
			border-left: 4rpx solid #0077b6;
		}
		
		.action-button {
			background: linear-gradient(to right, #0077b6, #023e8a);
		}
	}
	
	&.theme-divine {
		background: linear-gradient(135deg, #f5f0ff, #efebff);
		
		.navbar {
			background: linear-gradient(to right, rgba(139, 92, 246, 0.9), rgba(76, 29, 149, 0.8));
			color: #ffffff;
		}
		
		.result-card {
			background-color: rgba(255, 255, 255, 0.95);
			color: #333333;
			border-top: 8rpx solid #8b5cf6;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #e9d5ff, #d8b4fe);
			color: #4c1d95;
			box-shadow: 0 4rpx 15rpx rgba(139, 92, 246, 0.2);
		}
		
		.section-title {
			color: #8b5cf6;
			border-left: 6rpx solid #8b5cf6;
			padding-left: 12rpx;
		}
		
		.option-item.selected {
			background-color: #f3e8ff;
			border-left: 4rpx solid #8b5cf6;
		}
		
		.action-button {
			background: linear-gradient(to right, #8b5cf6, #6d28d9);
		}
	}
	
	&.theme-wheel {
		background: linear-gradient(135deg, #fffbf0, #fff7e6);
		
		.navbar {
			background: linear-gradient(to right, rgba(164, 126, 59, 0.9), rgba(120, 53, 15, 0.8));
			color: #ffffff;
		}
		
		.result-card {
			background-color: rgba(255, 255, 255, 0.95);
			color: #333333;
			border-top: 8rpx solid #a47e3b;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #fef3c7, #fde68a);
			color: #78350f;
			box-shadow: 0 4rpx 15rpx rgba(164, 126, 59, 0.2);
		}
		
		.section-title {
			color: #a47e3b;
			border-left: 6rpx solid #a47e3b;
			padding-left: 12rpx;
		}
		
		.option-item.selected {
			background-color: #fef9c3;
			border-left: 4rpx solid #a47e3b;
		}
		
		.action-button {
			background: linear-gradient(to right, #a47e3b, #92400e);
		}
	}
	
	&.theme-pool {
		background: linear-gradient(135deg, #f0f7fa, #e6f5ff);
		
		.navbar {
			background: linear-gradient(to right, rgba(14, 165, 233, 0.9), rgba(7, 89, 133, 0.8));
			color: #ffffff;
		}
		
		.result-card {
			background-color: rgba(255, 255, 255, 0.95);
			color: #333333;
			border-top: 8rpx solid #0ea5e9;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #bae6fd, #7dd3fc);
			color: #075985;
			box-shadow: 0 4rpx 15rpx rgba(14, 165, 233, 0.2);
		}
		
		.section-title {
			color: #0ea5e9;
			border-left: 6rpx solid #0ea5e9;
			padding-left: 12rpx;
		}
		
		.option-item.selected {
			background-color: #e0f2fe;
			border-left: 4rpx solid #0ea5e9;
		}
		
		.action-button {
			background: linear-gradient(to right, #0ea5e9, #0369a1);
		}
	}
}

.navbar {
	padding: 12px 16px;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 100;
	backdrop-filter: blur(10px);
	
	.navbar-left {
		width: 70px;
		display: flex;
		align-items: center;
		
		.back-text {
			font-size: 16px;
			color: #ffffff;
			font-weight: 500;
		}
	}
	
	.navbar-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}
}

.result-card {
	margin: 20rpx;
	padding: 0;
	border-radius: 16rpx;
	background-color: #ffffff;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);
	overflow: hidden;
	backdrop-filter: blur(5px);
	
	/* 标题区域 */
	.result-header {
		padding: 24rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.result-title {
			font-size: 34rpx;
			font-weight: 600;
			margin-bottom: 8rpx;
			color: #333333;
		}
		
		.result-time {
			font-size: 24rpx;
			color: #999999;
		}
	}
	
	/* 主结果区域 */
	.result-content {
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.result-label {
			font-size: 28rpx;
			font-weight: 500;
			margin-bottom: 20rpx;
			color: #666666;
		}
		
		.result-text-container {
			padding: 36rpx;
			border-radius: 12rpx;
			text-align: center;
			margin-bottom: 10rpx;
			transition: all 0.3s;
			
			&:active {
				transform: scale(0.98);
			}
		}
		
		.result-text {
			font-size: 44rpx;
			font-weight: 600;
			line-height: 1.3;
		}
	}
	
	/* 选项区域 */
	.options-section {
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.section-title {
			font-size: 28rpx;
			font-weight: 600;
			margin-bottom: 24rpx;
		}
		
		.options-container {
			display: flex;
			flex-direction: column;
			gap: 16rpx;
		}
		
		.option-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 24rpx;
			border-radius: 10rpx;
			background-color: #f9f9f9;
			font-size: 28rpx;
			transition: all 0.2s;
			
			&.selected {
				font-weight: 500;
				padding-left: 20rpx;
				transform: translateX(4rpx);
			}
			
			.selected-icon {
				font-size: 32rpx;
				color: #00aa00;
			}
		}
	}
	
	/* 详细信息区域 */
	.details-section {
		padding: 30rpx;
		
		.section-title {
			font-size: 28rpx;
			font-weight: 600;
			margin-bottom: 24rpx;
		}
		
		.info-table {
			background-color: #f9f9f9;
			border-radius: 10rpx;
			overflow: hidden;
		}
		
		.info-row {
			display: flex;
			padding: 20rpx 24rpx;
			border-bottom: 1rpx solid #eaeaea;
			
			&:last-child {
				border-bottom: none;
			}
			
			.info-label {
				width: 160rpx;
				font-size: 26rpx;
				color: #666666;
			}
			
			.info-value {
				flex: 1;
				font-size: 26rpx;
				color: #333333;
				word-break: break-all;
			}
			
			.seed-value {
				font-family: monospace;
				font-size: 24rpx;
			}
		}
	}
}

/* 操作按钮 */
.action-buttons {
	display: flex;
	justify-content: space-around;
	padding: 30rpx 20rpx;
	margin: 20rpx;
	
	.action-button {
		flex: 1;
		max-width: 300rpx;
		height: 88rpx;
		margin: 0 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		border-radius: 44rpx;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.2);
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.95);
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		}
		
		.iconfont {
			font-size: 32rpx;
			margin-right: 10rpx;
		}
		
		.button-text {
			font-size: 28rpx;
			font-weight: 500;
		}
	}
}

.loading-container {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(5px);
	
	.loading-spinner {
		width: 80rpx;
		height: 80rpx;
		border: 6rpx solid #f3f3f3;
		border-top: 6rpx solid #007aff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	.loading-text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #333333;
	}
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.not-found {
	padding: 100rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.not-found-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 30rpx;
	}
	
	.not-found-text {
		font-size: 28rpx;
		color: #999999;
		margin-bottom: 30rpx;
	}
	
	.back-btn {
		width: 200rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: linear-gradient(to right, #007aff, #0056b3);
		color: #ffffff;
		border-radius: 40rpx;
		font-size: 28rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
	}
}
</style> 