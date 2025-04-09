<template>
	<view class="wheel-result">
		<!-- 天机轮标题 -->
		<view class="wheel-header">
			<text class="header-text">天机轮解析</text>
		</view>
		
		<!-- 八卦装饰 -->
		<view class="bagua-decoration">
			<view class="bagua-symbol">☰</view>
			<view class="bagua-symbol">☱</view>
			<view class="bagua-symbol">☲</view>
			<view class="bagua-symbol">☳</view>
		</view>
		
		<!-- 决策问题 -->
		<view class="decision-question">
			<text>【天机启示】 {{ decisionQuestion }}</text>
		</view>
		
		<!-- 结果内容 -->
		<view class="result-content">
			<text class="result-text">{{ result }}</text>
		</view>
		
		<!-- 分析指标 -->
		<view class="analysis-metrics">
			<view class="metric-item">
				<text class="metric-icon">☯</text>
				<text class="metric-label">卦象融合度：</text>
				<text class="metric-value">100%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">⚖️</text>
				<text class="metric-label">阴阳平衡度：</text>
				<text class="metric-value">98.7%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">🔄</text>
				<text class="metric-label">风水评级：</text>
				<text class="metric-value">★★★★★</text>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="action-buttons">
			<view class="action-button retry" @tap="onRetry">
				<text class="action-text">再次占卦</text>
			</view>
			<view class="action-button home" @tap="onShare">
				<text class="action-text">返回首页</text>
			</view>
		</view>
		
		<!-- 文字水印 -->
		<view class="ink-watermark">
			<text>天意</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'WheelResult',
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
.wheel-result {
	width: 100%;
	max-width: 650rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #f8f4e8;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
	position: relative;
	overflow: hidden;
	color: #5e4b3a;
}

.wheel-header {
	margin-bottom: 30rpx;
	
	.header-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #8d6e63;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	}
}

.bagua-decoration {
	display: flex;
	justify-content: space-around;
	width: 100%;
	margin-bottom: 20rpx;
	
	.bagua-symbol {
		font-size: 36rpx;
		opacity: 0.6;
		color: #8d6e63;
	}
}

.decision-question {
	padding: 15rpx 30rpx;
	background: rgba(141, 110, 99, 0.1);
	border: 1px solid rgba(141, 110, 99, 0.2);
	border-radius: 10rpx;
	margin-bottom: 40rpx;
	font-size: 30rpx;
	text-align: center;
}

.result-content {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 20rpx 0 30rpx;
	
	.result-text {
		font-size: 72rpx;
		font-weight: bold;
		color: #8d6e63;
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
			color: #8d6e63;
		}
		
		.metric-label {
			color: #5e4b3a;
			font-size: 28rpx;
		}
		
		.metric-value {
			color: #8d6e63;
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
		background: #a1887f;
		box-shadow: 0 4rpx 10rpx rgba(161, 136, 127, 0.3);
	}
	
	.home {
		background-color: rgba(141, 110, 99, 0.15);
		border: 1px solid rgba(141, 110, 99, 0.3);
	}
}

.ink-watermark {
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	opacity: 0.1;
	transform: rotate(-15deg);
	font-size: 80rpx;
	font-weight: bold;
	color: #5e4b3a;
}
</style> 