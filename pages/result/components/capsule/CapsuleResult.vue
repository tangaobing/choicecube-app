<template>
	<view class="capsule-result">
		<!-- 决策问题 -->
		<view class="decision-question" v-if="decisionQuestion">
			<text>决策问题：{{ decisionQuestion }}</text>
		</view>
		
		<!-- 胶囊图标和标题 -->
		<view class="result-header">
			<text class="capsule-icon">🧪</text>
			<text class="result-title">命运胶囊分析结果</text>
		</view>
		
		<!-- 结果内容 -->
		<view class="result-content">
			<text class="result-text">{{ result }}</text>
		</view>
		
		<!-- 分析指标 -->
		<view class="analysis-metrics">
			<view class="metric-item">
				<text class="metric-label">AI分析完成度：</text>
				<text class="metric-value">100%</text>
			</view>
			<view class="metric-item">
				<text class="metric-label">决策可信度：</text>
				<text class="metric-value">98.7%</text>
			</view>
			<view class="metric-item">
				<text class="metric-label">建议指数：</text>
				<text class="metric-value">★★★★★</text>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="action-buttons">
			<view class="action-button retry" @tap="onRetry">
				<text class="button-icon">⟳</text>
				<text class="action-text">重新选择</text>
			</view>
			<view class="action-button home" @tap="onShare">
				<text class="button-icon">⌂</text>
				<text class="action-text">返回首页</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CapsuleResult',
	props: {
		decisionQuestion: {
			type: String,
			default: '未设置决策问题'
		},
		result: {
			type: String,
			required: true
		}
	},
	emits: ['retry', 'share'],
	setup(props, { emit }) {
		const onRetry = () => {
			emit('retry');
		};
		
		const onShare = () => {
			emit('share');
		};
		
		return {
			onRetry,
			onShare
		};
	}
};
</script>

<style lang="scss" scoped>
.capsule-result {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 40rpx;
	backdrop-filter: blur(10px);
}

.decision-question {
	padding: 15rpx 30rpx;
	background: rgba(14, 165, 233, 0.15);
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	width: 100%;
	text-align: center;
	box-sizing: border-box;
	
	text {
		font-size: 28rpx;
		color: #a5f3fc;
	}
}

.result-header {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
	
	.capsule-icon {
		font-size: 40rpx;
		margin-right: 10rpx;
	}
	
	.result-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #7dd3fc;
	}
}

.result-content {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	
	.result-text {
		font-size: 80rpx;
		font-weight: bold;
		color: #7dd3fc;
		text-shadow: 0 0 15rpx rgba(125, 211, 252, 0.5);
	}
}

.analysis-metrics {
	width: 100%;
	margin-top: 60rpx;
	
	.metric-item {
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
		
		.metric-label {
			color: #ffffff;
			font-size: 30rpx;
		}
		
		.metric-value {
			color: #7dd3fc;
			font-size: 30rpx;
			font-weight: bold;
		}
	}
}

.action-buttons {
	display: flex;
	justify-content: space-around;
	margin-top: 50rpx;
	width: 100%;
	
	.action-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: rgba(14, 165, 233, 0.2);
		border: 1px solid rgba(14, 165, 233, 0.4);
		padding: 20rpx 40rpx;
		border-radius: 10rpx;
		width: 40%;
		
		.button-icon {
			font-size: 40rpx;
			margin-bottom: 10rpx;
		}
		
		.action-text {
			font-size: 28rpx;
		}
	}
	
	.retry {
		background: rgba(14, 165, 233, 0.2);
	}
	
	.home {
		background: rgba(59, 130, 246, 0.2);
	}
}
</style> 