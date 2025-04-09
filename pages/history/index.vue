<template>
	<view class="history-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @tap="goBack">
				<text class="back-text">返回</text>
			</view>
			<view class="navbar-title">历史记录</view>
			<view class="navbar-right" v-if="historyList.length > 0" @tap="clearAllHistory">
				<text class="clear-all">清空</text>
			</view>
		</view>
		
		<!-- 主要内容 -->
		<view class="content">
			<!-- 历史记录列表 -->
			<view v-if="historyList.length > 0" class="history-list">
				<view 
					v-for="(item, index) in historyList" 
					:key="item.id" 
					class="history-item"
				>
					<view class="history-item-bg" :style="getThemeBgStyle(item.theme)">
						<view class="history-item-content">
							<view class="history-question">{{ item.title }}</view>
							<view class="history-result">结果: {{ item.result }}</view>
							<view class="history-time">{{ formatTime(item.timestamp) }}</view>
						</view>
					</view>
					
					<view class="history-actions">
						<view class="action-btn" @tap="viewDetail(item.id)">
							<text class="action-icon">🔍</text>
							<text class="action-text">查看详情</text>
						</view>
						<view class="action-btn" @tap="redoDecision(item)">
							<text class="action-icon">🔄</text>
							<text class="action-text">再次决策</text>
						</view>
						<view class="action-btn delete" @tap="deleteHistory(item.id, index)">
							<text class="action-icon">🗑️</text>
							<text class="action-text">删除</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-else class="empty-state">
				<image class="empty-image" src="/static/images/empty-history.png" mode="aspectFit"></image>
				<text class="empty-text">暂无历史记录</text>
				<button class="start-btn" @tap="startNewDecision">开始第一次决策</button>
			</view>
		</view>
	</view>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getHistory, deleteDecision, clearHistory } from '@/utils/storage';

export default {
	setup() {
		const store = useStore();
		const historyList = ref([]);
		
		// 获取历史记录
		const loadHistory = () => {
			const history = getHistory(0, 10); // 只加载最近10条
			historyList.value = history;
		};
		
		// 格式化时间戳
		const formatTime = (timestamp) => {
			const date = new Date(timestamp);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		};
		
		// 获取主题背景样式
		const getThemeBgStyle = (theme) => {
			const themeBgs = {
				divine: '../../static/images/themes/divine_preview.png',
				capsule: '../../static/images/themes/capsule_preview.png',
				wheel: '../../static/images/themes/wheel_preview.png',
				pool: '../../static/images/themes/pool_preview.png'
			};
			
			const bgUrl = themeBgs[theme] || themeBgs.divine;
			
			return {
				'background-image': `url(${bgUrl})`,
				'background-size': 'cover',
				'background-position': 'center',
			};
		};
		
		// 查看详情
		const viewDetail = (id) => {
			uni.navigateTo({
				url: `/pages/history-detail/index?id=${id}`
			});
		};
		
		// 再次决策
		const redoDecision = (item) => {
			// 设置选项
			store.commit('SET_OPTIONS', item.options);
			
			// 设置问题
			store.commit('SET_DECISION_QUESTION', item.title);
			
			// 设置主题
			store.commit('SET_THEME', item.theme);
			
			// 跳转到主题选择页面
			uni.navigateTo({
				url: '/pages/theme-select/index'
			});
		};
		
		// 删除历史记录
		const deleteHistory = (id, index) => {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条历史记录吗？',
				success: (res) => {
					if (res.confirm) {
						const success = deleteDecision(id);
						if (success) {
							historyList.value.splice(index, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						}
					}
				}
			});
		};
		
		// 清空所有历史
		const clearAllHistory = () => {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有历史记录吗？',
				success: (res) => {
					if (res.confirm) {
						const success = clearHistory();
						if (success) {
							historyList.value = [];
							uni.showToast({
								title: '已清空历史',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							});
						}
					}
				}
			});
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 开始新决策
		const startNewDecision = () => {
			uni.navigateTo({
				url: '/pages/option-input/index'
			});
		};
		
		// 组件挂载时加载历史
		onMounted(() => {
			loadHistory();
		});
		
		return {
			historyList,
			formatTime,
			getThemeBgStyle,
			viewDetail,
			redoDecision,
			deleteHistory,
			clearAllHistory,
			goBack,
			startNewDecision
		};
	}
};
</script>

<style lang="scss">
.history-page {
	min-height: 100vh;
	background-color: #f8f9fa;
	display: flex;
	flex-direction: column;
}

/* 导航栏样式 */
.navbar {
	padding: 12px 16px;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	position: relative;
	z-index: 10;
	
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
}

.navbar-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	font-weight: 600;
	color: #333333;
}

.navbar-right {
	width: 40px;
	display: flex;
	justify-content: flex-end;
	
	.clear-all {
		color: #ff5a5f;
		font-size: 14px;
	}
}

/* 内容区域 */
.content {
	flex: 1;
	padding: 16px;
}

/* 历史记录列表样式 */
.history-list {
	margin-bottom: 20px;
}

.history-item {
	margin-bottom: 20px;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	background-color: #ffffff;
}

.history-item-bg {
	height: 150px;
	position: relative;
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
		z-index: 1;
	}
}

.history-item-content {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 16px;
	color: #ffffff;
	z-index: 2;
}

.history-question {
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 8px;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.history-result {
	font-size: 14px;
	margin-bottom: 4px;
	opacity: 0.9;
}

.history-time {
	font-size: 12px;
	opacity: 0.7;
}

.history-actions {
	display: flex;
	padding: 12px;
	border-top: 1px solid #f0f0f0;
}

.action-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px 0;
	
	&.delete {
		color: #ff5a5f;
	}
}

.action-icon {
	font-size: 20px;
	margin-bottom: 4px;
}

.action-text {
	font-size: 12px;
}

/* 空状态样式 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	text-align: center;
}

.empty-image {
	width: 120px;
	height: 120px;
	margin-bottom: 20px;
	opacity: 0.7;
}

.empty-text {
	font-size: 16px;
	color: #999999;
	margin-bottom: 30px;
}

.start-btn {
	background: linear-gradient(135deg, #3f7ef2, #1a56db);
	color: #ffffff;
	font-size: 16px;
	padding: 12px 24px;
	border-radius: 30px;
	box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);
}
</style> 