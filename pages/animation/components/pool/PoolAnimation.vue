<template>
	<view class="pool-animation">
		<view class="water-overlay"></view>
		<view class="bubbles-container">
			<view 
				v-for="bubble in backgroundBubbles" 
				:key="bubble.id"
				class="background-bubble"
				:style="{
					width: bubble.size,
					height: bubble.size,
					left: bubble.left,
					bottom: bubble.bottom,
					animationDuration: bubble.duration,
					animationDelay: bubble.delay
				}"
			></view>
		</view>
		
		<!-- 决策问题 -->
		<view class="decision-question pool-decision-question">
			<view class="question-box">
				<text class="question-text">
					【气运占卜】问题：<text class="highlight">{{ decisionQuestion }}</text>
				</text>
			</view>
		</view>
		
		<!-- 气运池动画容器 -->
		<view class="pool-center-container">
			<view class="ripple-effect"></view>
			<view class="ripple-effect" style="animation-delay: 1s;"></view>
			<view class="ripple-effect" style="animation-delay: 2s;"></view>
		</view>
		
		<!-- 加载文本 -->
		<view class="loading-text pool-loading-text">{{ loadingText }}</view>
		
		<!-- 选项容器 -->
		<view class="options-container pool-options-container">
			<view 
				v-for="(option, index) in options" 
				:key="index" 
				class="option pool-option"
				:class="{'selected': selectedOption === option}"
				@tap="selectOption(option)"
				:style="getRandomBubbleStyle(index)"
			>
				{{ option }}
			</view>
		</view>
	</view>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
	name: 'PoolAnimation',
	props: {
		decisionQuestion: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true
		},
		loadingText: {
			type: String,
			required: true
		}
	},
	emits: ['select-option'],
	setup(props, { emit }) {
		const selectedOption = ref(null);
		const backgroundBubbles = ref([]);
		let bubblesTimer = null;
		
		// 预定义的气泡样式，避免使用动态计算
		const bubbleStyles = [
			{
				top: '10%',
				left: '20%',
				animationDuration: '5s',
				animationDelay: '0.2s'
			},
			{
				top: '15%',
				left: '60%',
				animationDuration: '4s',
				animationDelay: '0.5s'
			},
			{
				top: '40%',
				left: '30%',
				animationDuration: '6s',
				animationDelay: '0.3s'
			},
			{
				top: '35%',
				left: '70%',
				animationDuration: '5.5s',
				animationDelay: '0.7s'
			},
			{
				top: '60%',
				left: '25%',
				animationDuration: '4.5s',
				animationDelay: '0.4s'
			},
			{
				top: '55%',
				left: '65%',
				animationDuration: '5.2s',
				animationDelay: '0.6s'
			},
			{
				top: '20%',
				left: '45%',
				animationDuration: '4.7s',
				animationDelay: '0.8s'
			},
			{
				top: '70%',
				left: '50%',
				animationDuration: '5.7s',
				animationDelay: '0.1s'
			}
		];
		
		const getRandomBubbleStyle = (index) => {
			// 从预定义样式中选择，如果超出范围则循环使用
			const style = bubbleStyles[index % bubbleStyles.length];
			return style;
		};
		
		const createBackgroundBubbles = () => {
			console.log('创建气泡动画');
			
			// 从预定义样式中选择，不依赖DOM操作
			for (let i = 0; i < 15; i++) {
				backgroundBubbles.value.push({
					id: `bubble-${Date.now()}-${i}`,
					size: `${10 + Math.random() * 25}px`,
					left: `${Math.random() * 100}%`,
					bottom: `-${10 + Math.random() * 25}px`,
					duration: `${3 + Math.random() * 4}s`,
					delay: `${Math.random() * 5}s`,
				});
			}
		};
		
		const removeBackgroundBubbles = () => {
			backgroundBubbles.value = [];
		};
		
		const refreshBubbles = () => {
			removeBackgroundBubbles();
			createBackgroundBubbles();
		};
		
		onMounted(() => {
			createBackgroundBubbles();
			bubblesTimer = setInterval(refreshBubbles, 10000);
		});
		
		onBeforeUnmount(() => {
			if (bubblesTimer) {
				clearInterval(bubblesTimer);
			}
		});
		
		const selectOption = (option) => {
			selectedOption.value = option;
			emit('select-option', option);
		};
		
		return {
			selectedOption,
			backgroundBubbles,
			selectOption,
			getRandomBubbleStyle
		};
	}
};
</script>

<style lang="scss" scoped>
.pool-animation {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding-top: 100rpx;
}

.water-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #0a1929 0%, #1e88e5 100%);
	opacity: 0.9;
	z-index: 1;
}

.bubbles-container {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	pointer-events: none;
	
	.background-bubble {
		position: absolute;
		border-radius: 50%;
		background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1));
		animation: rise linear forwards;
		pointer-events: none;
	}
}

.pool-decision-question {
	position: relative;
	z-index: 5;
	width: 90%;
	max-width: 600rpx;
	margin-bottom: 40rpx;
	
	.question-box {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 15rpx;
		padding: 25rpx;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		
		.question-text {
			color: #ffffff;
			font-size: 32rpx;
			text-align: center;
			display: block;
			
			.highlight {
				color: #4fc3f7;
				font-weight: bold;
				text-shadow: 0 0 5px rgba(79, 195, 247, 0.6);
			}
		}
	}
}

.pool-center-container {
	position: relative;
	width: 200rpx;
	height: 200rpx;
	margin: 40rpx 0;
	z-index: 5;
	display: flex;
	justify-content: center;
	align-items: center;
}

.ripple-effect {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	border: 2px solid rgba(255, 255, 255, 0.3);
	animation: ripple 3s ease-out infinite;
}

.pool-loading-text {
	color: #4fc3f7;
	font-size: 28rpx;
	margin: 20rpx 0;
	text-align: center;
	text-shadow: 0 0 10rpx rgba(79, 195, 247, 0.5);
	animation: glow 2s infinite;
	position: relative;
	z-index: 5;
}

.pool-options-container {
	position: relative;
	width: 100%;
	height: 400rpx;
	margin-top: 40rpx;
	z-index: 5;
}

.pool-option {
	position: absolute;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	width: 130rpx;
	height: 130rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #ffffff;
	font-size: 26rpx;
	text-align: center;
	animation: float 4s ease-in-out infinite;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	
	&.selected {
		background: rgba(79, 195, 247, 0.4);
		border-color: rgba(79, 195, 247, 0.8);
		color: #ffffff;
		font-weight: bold;
		box-shadow: 0 0 20rpx rgba(79, 195, 247, 0.6);
	}
	
	&:active {
		transform: scale(0.95);
	}
}

@keyframes ripple {
	0% {
		transform: scale(0.3);
		opacity: 0.8;
	}
	100% {
		transform: scale(1.2);
		opacity: 0;
	}
}

@keyframes glow {
	0%, 100% { opacity: 0.7; text-shadow: 0 0 5px rgba(79, 195, 247, 0.3); }
	50% { opacity: 1; text-shadow: 0 0 15px rgba(79, 195, 247, 0.7); }
}

@keyframes float {
	0%, 100% { transform: translateY(0) translateX(0); }
	25% { transform: translateY(-10rpx) translateX(5rpx); }
	50% { transform: translateY(0) translateX(10rpx); }
	75% { transform: translateY(10rpx) translateX(5rpx); }
}

@keyframes rise {
	0% {
		transform: translateY(0);
		opacity: 0.7;
	}
	100% {
		transform: translateY(-1000px);
		opacity: 0;
	}
}
</style> 