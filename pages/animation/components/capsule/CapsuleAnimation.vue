<template>
	<view class="capsule-animation">
		<view class="tech-overlay"></view>
		<view class="hex-grid"></view>
		
		<!-- 决策问题 -->
		<view class="decision-question capsule-decision-question">
			<view class="question-capsule">
				<text class="question-text">
					【AI分析】决策问题：<text class="highlight">{{ decisionQuestion }}</text>
				</text>
			</view>
		</view>
		
		<!-- 命运胶囊动画 -->
		<view class="capsule-container">
			<view class="capsule">
				<view class="dna-helix" id="dnaHelix">
					<view class="dna-strand" v-for="n in 20" :key="n" 
						:style="{ 
							left: `${Math.sin(n * Math.PI / 10) * 50 + 50}%`,
							top: `${(n / 20) * 100}%`,
							transform: `translateZ(${Math.cos(n * Math.PI / 10) * 30}px)`
						}">
					</view>
				</view>
			</view>
			<view class="scan-line"></view>
		</view>
		
		<!-- 加载文本 -->
		<view class="loading-text capsule-loading-text">{{ loadingText }}</view>
		
		<!-- 选项容器 -->
		<view class="options-container capsule-options-container">
			<view 
				v-for="(option, index) in options" 
				:key="index" 
				class="option capsule-option"
				:class="{'selected': selectedOption === option}"
				@tap="selectOption(option)"
				:style="{
					top: `${30 + Math.sin(index * Math.PI / (options.length - 1 || 1)) * 40}%`,
					left: `${20 + (index * 60 / (options.length - 1 || 1))}%`,
					animationDelay: `${index * 0.2}s`
				}"
			>
				<text>{{ option }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'CapsuleAnimation',
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
		
		const selectOption = (option) => {
			// 确保选项有效
			if (option) {
				console.log('命运胶囊组件: 选择了选项 ->', option);
				selectedOption.value = option;
				emit('select-option', option);
			} else {
				console.error('命运胶囊组件: 尝试选择无效选项');
			}
		};
		
		return {
			selectedOption,
			selectOption
		};
	}
};
</script>

<style lang="scss" scoped>
.capsule-animation {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tech-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(29, 78, 216, 0.4) 100%);
	z-index: 1;
}

.hex-grid {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-image: radial-gradient(rgba(59, 130, 246, 0.2) 2px, transparent 2px);
	background-size: 30px 30px;
	z-index: 2;
	opacity: 0.3;
}

.capsule-decision-question {
	position: relative;
	z-index: 5;
	width: 90%;
	max-width: 600rpx;
	margin-bottom: 40rpx;
	
	.question-capsule {
		background: rgba(14, 165, 233, 0.2);
		border: 1px solid rgba(14, 165, 233, 0.4);
		backdrop-filter: blur(5px);
		border-radius: 10rpx;
		padding: 20rpx;
		
		.question-text {
			color: #ffffff;
			font-size: 30rpx;
			text-align: center;
			display: block;
			
			.highlight {
				color: #38bdf8;
				font-weight: bold;
			}
		}
	}
}

.capsule-container {
	position: relative;
	width: 200rpx;
	height: 300rpx;
	margin: 40rpx 0;
	z-index: 5;
	
	.capsule {
		position: relative;
		width: 100%;
		height: 100%;
		background: rgba(14, 165, 233, 0.2);
		border: 2px solid rgba(14, 165, 233, 0.6);
		border-radius: 100rpx;
		overflow: hidden;
		transform-style: preserve-3d;
		perspective: 800px;
		box-shadow: 0 0 30rpx rgba(14, 165, 233, 0.4);
	}
	
	.dna-helix {
		position: absolute;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		animation: rotate 8s linear infinite;
		
		.dna-strand {
			position: absolute;
			width: 8rpx;
			height: 8rpx;
			background-color: rgba(56, 189, 248, 0.8);
			border-radius: 50%;
			box-shadow: 0 0 10rpx rgba(56, 189, 248, 0.8);
		}
	}
	
	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 10rpx;
		background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent);
		z-index: 10;
		animation: scan 2s linear infinite;
	}
}

.capsule-loading-text {
	color: #38bdf8;
	font-size: 28rpx;
	margin: 20rpx 0;
	text-align: center;
	text-shadow: 0 0 10rpx rgba(56, 189, 248, 0.5);
	animation: pulse 2s infinite;
	position: relative;
	z-index: 5;
}

.capsule-options-container {
	position: relative;
	width: 100%;
	height: 300rpx;
	margin-top: 40rpx;
	z-index: 5;
}

.capsule-option {
	position: absolute;
	background: rgba(14, 165, 233, 0.2);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(14, 165, 233, 0.4);
	border-radius: 50%;
	width: 120rpx;
	height: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #ffffff;
	font-size: 26rpx;
	text-align: center;
	animation: float 3s ease-in-out infinite;
	transform: scale(0);
	animation: appear 0.5s forwards;
	
	&.selected {
		background: rgba(56, 189, 248, 0.3);
		border-color: rgba(56, 189, 248, 0.8);
		color: #38bdf8;
		font-weight: bold;
		box-shadow: 0 0 20rpx rgba(56, 189, 248, 0.4);
	}
}

@keyframes rotate {
	0% { transform: rotateY(0deg); }
	100% { transform: rotateY(360deg); }
}

@keyframes scan {
	0% { top: 0; }
	100% { top: 100%; }
}

@keyframes pulse {
	0%, 100% { opacity: 0.7; }
	50% { opacity: 1; }
}

@keyframes float {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-15rpx); }
}

@keyframes appear {
	0% { transform: scale(0); }
	50% { transform: scale(1.1); }
	100% { transform: scale(1); }
}
</style> 