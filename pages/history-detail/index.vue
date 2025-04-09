<template>
	<view class="detail-page" :class="'theme-' + historyItem.theme">
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
import { ref, reactive } from 'vue';
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
		
		return {
			historyItem,
			isLoading,
			notFound,
			goBack,
			formatDate,
			getThemeName,
			replayDecision,
			restoreOptions,
			loadHistoryItem
		};
	}
};
</script>

<style lang="scss">
.detail-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
	
	&.theme-capsule {
		background-color: #f0f9ff;
		
		.navbar {
			background-color: #0077b6;
			color: #ffffff;
		}
		
		.result-card {
			background-color: #ffffff;
			color: #333333;
			border-top: 8rpx solid #0077b6;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #caf0f8, #ade8f4);
			color: #03045e;
		}
		
		.section-title {
			color: #0077b6;
		}
		
		.option-item.selected {
			background-color: #caf0f8;
			border-left: 4rpx solid #0077b6;
		}
		
		.action-button {
			background-color: #0077b6;
		}
	}
	
	&.theme-divine {
		background-color: #f8f0ff;
		
		.navbar {
			background-color: #8b5cf6;
			color: #ffffff;
		}
		
		.result-card {
			background-color: #ffffff;
			color: #333333;
			border-top: 8rpx solid #8b5cf6;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #e9d5ff, #d8b4fe);
			color: #4c1d95;
		}
		
		.section-title {
			color: #8b5cf6;
		}
		
		.option-item.selected {
			background-color: #e9d5ff;
			border-left: 4rpx solid #8b5cf6;
		}
		
		.action-button {
			background-color: #8b5cf6;
		}
	}
	
	&.theme-wheel {
		background-color: #fffbeb;
		
		.navbar {
			background-color: #a47e3b;
			color: #ffffff;
		}
		
		.result-card {
			background-color: #ffffff;
			color: #333333;
			border-top: 8rpx solid #a47e3b;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #fef3c7, #fde68a);
			color: #78350f;
		}
		
		.section-title {
			color: #a47e3b;
		}
		
		.option-item.selected {
			background-color: #fef3c7;
			border-left: 4rpx solid #a47e3b;
		}
		
		.action-button {
			background-color: #a47e3b;
		}
	}
	
	&.theme-pool {
		background-color: #ecfeff;
		
		.navbar {
			background-color: #0ea5e9;
			color: #ffffff;
		}
		
		.result-card {
			background-color: #ffffff;
			color: #333333;
			border-top: 8rpx solid #0ea5e9;
		}
		
		.result-text-container {
			background: linear-gradient(135deg, #bae6fd, #7dd3fc);
			color: #075985;
		}
		
		.section-title {
			color: #0ea5e9;
		}
		
		.option-item.selected {
			background-color: #bae6fd;
			border-left: 4rpx solid #0ea5e9;
		}
		
		.action-button {
			background-color: #0ea5e9;
		}
	}
}

.navbar {
	padding: 12px 16px;
	display: flex;
	align-items: center;
	position: relative;
	z-index: 100;
	
	.navbar-left {
		width: 70px;
		display: flex;
		align-items: center;
		
		.back-text {
			font-size: 16px;
			color: #333333;
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
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
	overflow: hidden;
	
	/* 标题区域 */
	.result-header {
		padding: 24rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		.result-title {
			font-size: 32rpx;
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
			font-size: 26rpx;
			font-weight: 500;
			margin-bottom: 16rpx;
			color: #666666;
		}
		
		.result-text-container {
			padding: 30rpx;
			border-radius: 12rpx;
			text-align: center;
			margin-bottom: 10rpx;
		}
		
		.result-text {
			font-size: 40rpx;
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
			margin-bottom: 20rpx;
		}
		
		.options-container {
			display: flex;
			flex-direction: column;
			gap: 12rpx;
		}
		
		.option-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 20rpx;
			border-radius: 8rpx;
			background-color: #f9f9f9;
			font-size: 28rpx;
			
			&.selected {
				font-weight: 500;
				padding-left: 16rpx;
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
			margin-bottom: 20rpx;
		}
		
		.info-table {
			background-color: #f9f9f9;
			border-radius: 8rpx;
			overflow: hidden;
		}
		
		.info-row {
			display: flex;
			padding: 16rpx 20rpx;
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

/* 新版操作按钮 */
.action-buttons {
	display: flex;
	justify-content: space-around;
	padding: 20rpx;
	margin: 20rpx;
	
	.action-button {
		flex: 1;
		max-width: 300rpx;
		height: 80rpx;
		margin: 0 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		border-radius: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
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
		background-color: #007aff;
		color: #ffffff;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}
</style> 