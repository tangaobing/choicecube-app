<template>
	<view class="divine-animation">
		<view class="mystical-overlay"></view>
		<view class="divine-particles" id="particles"></view>
		
		<!-- 决策问题 -->
		<view class="decision-question divine-decision-question">
			<view class="question-scroll">
				<text class="question-text">
					【神谕启示】汝当何去何从：<text class="highlight">{{ decisionQuestion }}</text>
				</text>
			</view>
		</view>
		
		<!-- 神圣动画容器 -->
		<view class="divine-center-container">
			<!-- 神秘符文 -->
			<view class="mystical-symbols" id="symbols">
				<view class="symbol" v-for="n in 20" :key="n"
					:style="{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						animationDelay: `${Math.random() * 2}s`
					}">
					{{ mysticSymbols[n % mysticSymbols.length] }}
				</view>
			</view>
			
			<!-- 神圣光环 -->
			<view class="divine-circle"></view>
			<view class="divine-circle" style="width: 160rpx; height: 160rpx; animation-duration: 8s;"></view>
			<view class="divine-circle" style="width: 120rpx; height: 120rpx; animation-duration: 6s;"></view>
			
			<!-- 羽毛笔 -->
			<view class="feather-pen">
				<text class="icon-text">✒️</text>
			</view>
		</view>
		
		<!-- 加载文本 -->
		<view class="loading-text divine-loading-text">{{ loadingText }}</view>
		
		<!-- 选项容器 -->
		<view class="options-container divine-options-container">
			<view 
				v-for="(option, index) in options" 
				:key="index" 
				class="option divine-option"
				:class="{'selected': selectedOption === option}"
				@tap="selectOption(option)"
				:style="{
					animationDelay: `${0.5 + index * 0.2}s`
				}"
			>
				{{ option }}
			</view>
		</view>

		<!-- 金色粒子 -->
		<view class="golden-particles">
			<view class="particle" v-for="n in 50" :key="n"
				:style="{
					left: `${Math.random() * 100}%`,
					animationDelay: `${Math.random() * 3}s`
				}">
			</view>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'DivineAnimation',
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
		
		const mysticSymbols = [
			'✧', '✦', '☽', '☼', '♆', '♇', '⚝', '⚜', '♱', '♰', '✴',
			'✵', '✶', '✷', '✸', '✹', '✺', '♔', '♕', '♖', '♗', '♘', '♙'
		];
		
		const selectOption = (option) => {
			// 确保选项有效
			if (option) {
				console.log('神选时刻组件: 选择了选项', option);
				selectedOption.value = option;
				emit('select-option', option);
			} else {
				console.error('神选时刻组件: 尝试选择无效选项');
			}
		};
		
		return {
			selectedOption,
			mysticSymbols,
			selectOption
		};
	}
};
</script>

<style lang="scss" scoped>
.divine-animation {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.mystical-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, rgba(72, 52, 117, 0.7) 0%, rgba(95, 58, 148, 0.7) 100%);
	z-index: 1;
}

.divine-particles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.divine-decision-question {
	position: relative;
	z-index: 5;
	width: 90%;
	max-width: 600rpx;
	margin-bottom: 40rpx;
	
	.question-scroll {
		position: relative;
		background: rgba(139, 92, 246, 0.15);
		backdrop-filter: blur(5px);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 10rpx;
		padding: 20rpx;
		
		&::before, &::after {
			content: '';
			position: absolute;
			top: 0;
			width: 30rpx;
			height: 100%;
			background: rgba(139, 92, 246, 0.3);
			z-index: -1;
		}
		
		&::before {
			left: -10rpx;
			transform: rotate(-5deg);
		}
		
		&::after {
			right: -10rpx;
			transform: rotate(5deg);
		}
		
		.question-text {
			color: #ffffff;
			font-size: 32rpx;
			text-align: center;
			display: block;
			
			.highlight {
				color: #ffd700;
				font-weight: bold;
				text-shadow: 0 0 10rpx rgba(255, 215, 0, 0.5);
			}
		}
	}
}

.divine-center-container {
	position: relative;
	width: 300rpx;
	height: 300rpx;
	margin: 30rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 5;
}

.mystical-symbols {
	position: absolute;
	width: 100%;
	height: 100%;
	
	.symbol {
		position: absolute;
		font-size: 36rpx;
		color: rgba(255, 215, 0, 0.7);
		animation: symbolFade 4s infinite;
	}
}

.divine-circle {
	position: absolute;
	width: 200rpx;
	height: 200rpx;
	border: 3px solid rgba(255, 215, 0, 0.7);
	border-radius: 50%;
	animation: rotate 10s linear infinite;
}

.feather-pen {
	position: relative;
	z-index: 10;
	animation: floatPen 3s ease-in-out infinite;
	
	.icon-text {
		font-size: 60rpx;
	}
}

.divine-loading-text {
	color: #ffd700;
	font-size: 28rpx;
	margin: 20rpx 0;
	text-align: center;
	text-shadow: 0 0 10rpx rgba(255, 215, 0, 0.5);
	animation: textPulse 2s infinite;
	position: relative;
	z-index: 5;
}

.divine-options-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180rpx, 1fr));
	gap: 30rpx;
	width: 90%;
	max-width: 600rpx;
	margin-top: 40rpx;
	position: relative;
	z-index: 5;
}

.divine-option {
	background: rgba(139, 92, 246, 0.2);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(139, 92, 246, 0.3);
	border-radius: 10rpx;
	padding: 20rpx;
	text-align: center;
	color: #ffffff;
	font-size: 28rpx;
	transition: all 0.3s;
	animation: optionAppear 0.5s forwards;
	opacity: 0;
	transform: translateY(20rpx);
	
	&.selected {
		background: rgba(255, 215, 0, 0.3);
		border-color: rgba(255, 215, 0, 0.6);
		color: #ffd700;
		font-weight: bold;
		box-shadow: 0 0 20rpx rgba(255, 215, 0, 0.3);
	}
	
	&:active {
		transform: scale(0.95);
	}
}

.golden-particles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
	
	.particle {
		position: absolute;
		top: 0;
		width: 6rpx;
		height: 6rpx;
		background-color: rgba(255, 215, 0, 0.6);
		border-radius: 50%;
		animation: fall 3s linear infinite;
	}
}

@keyframes symbolFade {
	0%, 100% { opacity: 0.2; }
	50% { opacity: 0.8; }
}

@keyframes rotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

@keyframes floatPen {
	0%, 100% { transform: translateY(0) rotate(-10deg); }
	50% { transform: translateY(-10rpx) rotate(5deg); }
}

@keyframes textPulse {
	0%, 100% { opacity: 0.7; }
	50% { opacity: 1; }
}

@keyframes optionAppear {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fall {
	0% {
		transform: translateY(0) scale(1);
		opacity: 0.8;
	}
	100% {
		transform: translateY(100vh) scale(0.5);
		opacity: 0;
	}
}
</style> 