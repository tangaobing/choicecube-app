<template>
	<view class="divine-result">
		<!-- 神选时刻标题 -->
		<view class="divine-header">
			<text class="divine-icon">✧</text>
			<text class="crown-icon">👑</text>
			<text class="divine-title">神选时刻</text>
			<text class="divine-icon">✧</text>
		</view>
		
		<!-- 中央图标 -->
		<view class="divine-circle">
			<text class="divine-symbol">🏷️</text>
		</view>
		
		<!-- 决策问题 -->
		<view class="decision-question">
			<text>{{ decisionQuestion }}</text>
		</view>
		
		<!-- 结果内容 -->
		<view class="result-content">
			<text class="result-text">{{ result }}</text>
		</view>
		
		<!-- 分析指标 -->
		<view class="analysis-metrics">
			<view class="metric-item">
				<text class="metric-icon">✨</text>
				<text class="metric-label">神谕指引度：</text>
				<text class="metric-value">100%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">🔮</text>
				<text class="metric-label">命运契合度：</text>
				<text class="metric-value">98.7%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">🌟</text>
				<text class="metric-label">祝福评级：</text>
				<text class="metric-value">★★★★★</text>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="action-buttons">
			<view class="action-button retry" @tap="onRetry">
				<text class="action-text">重新占卜</text>
			</view>
			<view class="action-button home" @tap="onShare">
				<text class="action-text">返回首页</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'DivineResult',
	props: {
		decisionQuestion: {
			type: String,
			required: true
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
.divine-result {
	width: 100%;
	max-width: 650rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(135deg, #d8c5f2 0%, #c4a6e9 100%);
	border-radius: 30rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 10rpx 30rpx rgba(138, 43, 226, 0.2);
}

.divine-header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 30rpx;
	
	.divine-icon {
		font-size: 40rpx;
		color: #8e44ad;
		margin: 0 15rpx;
	}
	
	.crown-icon {
		font-size: 40rpx;
		margin: 0 10rpx;
	}
	
	.divine-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffd700;
		margin: 0 10rpx;
		text-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.3);
	}
}

.divine-circle {
	width: 150rpx;
	height: 150rpx;
	background: #8e44ad;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 30rpx;
	box-shadow: 0 0 20rpx rgba(142, 68, 173, 0.6);
	
	.divine-symbol {
		font-size: 70rpx;
	}
}

.decision-question {
	padding: 15rpx 30rpx;
	background: #5e2c8a;
	border-radius: 10rpx;
	margin-bottom: 40rpx;
	font-size: 30rpx;
	color: #ffffff;
	text-align: center;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2);
	border: 1px solid #8e44ad;
}

.result-content {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 20rpx 0 30rpx;
	
	.result-text {
		font-size: 80rpx;
		font-weight: bold;
		color: #a269c6;
		text-shadow: 0 0 15rpx rgba(162, 105, 198, 0.3);
	}
}

.analysis-metrics {
	width: 100%;
	margin-top: 20rpx;
	
	.metric-item {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		
		.metric-icon {
			font-size: 24rpx;
			margin-right: 10rpx;
			color: #8e44ad;
		}
		
		.metric-label {
			color: #5e2c8a;
			font-size: 28rpx;
		}
		
		.metric-value {
			color: #8e44ad;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
}

.action-buttons {
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-top: 40rpx;
	
	.action-button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
		border-radius: 10rpx;
		width: 40%;
		
		.action-text {
			font-size: 30rpx;
			font-weight: bold;
			color: #ffffff;
		}
	}
	
	.retry {
		background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
		box-shadow: 0 4rpx 10rpx rgba(231, 76, 60, 0.3);
	}
	
	.home {
		background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
		border: 1px solid #7d3c98;
	}
}
</style> 