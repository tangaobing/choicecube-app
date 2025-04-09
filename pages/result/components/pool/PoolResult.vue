<template>
	<view class="pool-result">
		<!-- 决策问题 -->
		<view class="decision-question">
			<text>决策问题：{{ decisionQuestion }}</text>
		</view>
		
		<!-- 气运池标题 -->
		<view class="pool-header">
			<text class="pool-icon">🌊</text>
			<text class="header-text">气运池解析结果</text>
		</view>
		
		<!-- 结果内容 -->
		<view class="result-content">
			<text class="result-text">{{ result }}</text>
		</view>
		
		<!-- 分析指标 -->
		<view class="analysis-metrics">
			<view class="metric-item">
				<text class="metric-icon">🔍</text>
				<text class="metric-label">运势探测度：</text>
				<text class="metric-value">100%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">📊</text>
				<text class="metric-label">气运匹配度：</text>
				<text class="metric-value">98.7%</text>
			</view>
			<view class="metric-item">
				<text class="metric-icon">✨</text>
				<text class="metric-label">吉凶指数：</text>
				<text class="metric-value">★★★★★</text>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="action-buttons">
			<view class="action-button retry" @tap="onRetry">
				<text class="action-text">重抽气运</text>
			</view>
			<view class="action-button home" @tap="onShare">
				<text class="action-text">返回首页</text>
			</view>
		</view>
		
		<!-- 气泡装饰 -->
		<view class="bubbles">
			<view class="bubble" v-for="n in 10" :key="n" 
				:style="{
					left: `${n * 10}%`,
					animationDuration: `${3 + Math.random() * 4}s`,
					animationDelay: `${Math.random() * 2}s`,
					width: `${20 + Math.random() * 20}rpx`,
					height: `${20 + Math.random() * 20}rpx`,
					opacity: 0.1 + Math.random() * 0.4
				}">
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PoolResult',
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
.pool-result {
	width: 100%;
	max-width: 650rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(135deg, #204165 0%, #1a365d 100%);
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
	position: relative;
	overflow: hidden;
	color: #ffffff;
}

.decision-question {
	padding: 15rpx 30rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	font-size: 28rpx;
	text-align: center;
	width: 100%;
	box-sizing: border-box;
}

.pool-header {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
	
	.pool-icon {
		font-size: 36rpx;
		margin-right: 10rpx;
	}
	
	.header-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #4fc3f7;
		text-shadow: 0 0 10rpx rgba(79, 195, 247, 0.3);
	}
}

.result-content {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 20rpx 0 30rpx;
	position: relative;
	z-index: 10;
	
	.result-text {
		font-size: 72rpx;
		font-weight: bold;
		color: #4fc3f7;
		text-shadow: 0 0 15rpx rgba(79, 195, 247, 0.5);
	}
}

.analysis-metrics {
	width: 100%;
	margin-top: 30rpx;
	position: relative;
	z-index: 10;
	
	.metric-item {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		
		.metric-icon {
			font-size: 26rpx;
			margin-right: 10rpx;
			color: #4fc3f7;
		}
		
		.metric-label {
			color: #e1f5fe;
			font-size: 28rpx;
		}
		
		.metric-value {
			color: #4fc3f7;
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
	position: relative;
	z-index: 10;
	
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
		background: linear-gradient(135deg, #0288d1 0%, #0277bd 100%);
		box-shadow: 0 4rpx 10rpx rgba(2, 136, 209, 0.3);
	}
	
	.home {
		background-color: #1a365d;
		border: 1px solid #4fc3f7;
	}
}

.bubbles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	pointer-events: none;
	
	.bubble {
		position: absolute;
		bottom: -50rpx;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		animation: float linear infinite;
	}
}

@keyframes float {
	0% {
		transform: translateY(0) scale(1);
	}
	100% {
		transform: translateY(-500rpx) scale(1.5);
	}
}
</style> 