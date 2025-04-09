<template>
	<view class="wheel-animation">
		<!-- 纸张纹理背景 -->
		<view class="paper-texture"></view>
		
		<!-- 决策问题卷轴 -->
		<view class="decision-question">
			<view class="question-scroll">
				<text class="question-text">
					【天机揭示】请解：<text class="highlight">{{ decisionQuestion || '未设置决策问题' }}</text>
				</text>
				<view class="ink-mark">问</view>
			</view>
		</view>
		
		<!-- 天机八卦轮 -->
		<view class="bagua-wheel" :style="wheelStyle">
			<view class="bagua-center"></view>
			<!-- 使用v-for渲染八卦符号 -->
			<view 
				v-for="trigram in trigramElements" 
				:key="trigram.id"
				class="trigram"
				:style="trigram.style"
			>
				{{ trigram.symbol }}
			</view>
		</view>
		
		<!-- 水墨效果 - 使用v-for渲染 -->
		<view class="ink-drops">
			<view 
				v-for="drop in inkDrops" 
				:key="drop.id"
				class="ink-drop"
				:style="drop.style"
			></view>
		</view>
		
		<!-- 加载文本 -->
		<view class="loading-text">{{ currentLoadingText }}</view>
		
		<!-- 选项容器 -->
		<view class="options-container">
			<view class="options-grid">
				<view
					v-for="(option, index) in options"
					:key="index"
					class="option"
					:class="{'selected': selectedOption === option}"
					@tap="selectOption(option)"
					:style="{animationDelay: `${(index + 1) * 0.5}s`}"
				>
					{{ option }}
				</view>
			</view>
		</view>
		
		<!-- 印章 -->
		<view class="seal">天机</view>
		
		<!-- 跳过按钮 -->
		<view class="skip-button" @tap="skipAnimation">
			<text class="skip-icon">⚛</text> 揭示天机
		</view>
	</view>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
	name: 'WheelAnimation',
	props: {
		decisionQuestion: {
			type: String,
			required: true,
			default: '未设置决策问题'
		},
		options: {
			type: Array,
			required: true,
			default: () => []
		},
		loadingText: {
			type: String,
			required: true,
			default: '天机演算中...'
		}
	},
	emits: ['select-option', 'skip'],
	setup(props, { emit }) {
		const selectedOption = ref(null);
		const wheelRotation = ref(0);
		const currentLoadingText = ref(props.loadingText || '天机正在演算...');
		const trigramElements = ref([]);
		const inkDrops = ref([]);
		
		// 计算轮盘旋转样式
		const wheelStyle = computed(() => {
			return {
				transform: `rotate(${wheelRotation.value}deg)`
			};
		});
		
		// 定时器引用
		let rotationInterval = null;
		let loadingTextInterval = null;
		let inkDropInterval = null;
		
		const baguaSymbols = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
		const loadingTexts = [
			'天机正在演算...',
			'八卦轮转...',
			'卜算命理...',
			'推演天象...',
			'解读天机...'
		];
		
		// 创建八卦符号 - 使用响应式数据
		const createBaguaSymbols = () => {
			trigramElements.value = baguaSymbols.map((symbol, index) => {
				const angle = index * 45;
				return {
					id: `trigram-${index}`,
					symbol: symbol,
					style: {
						transform: `rotate(${angle}deg) translateY(-120px)`
					}
				};
			});
		};
		
		// 创建水墨效果 - 使用响应式数据
		const createInkEffect = () => {
			inkDropInterval = setInterval(() => {
				const newDrop = {
					id: `ink-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
					style: {
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${20 + Math.random() * 30}rpx`,
						height: `${20 + Math.random() * 30}rpx`
					}
				};
				
				inkDrops.value.push(newDrop);
				
				// 设置定时器移除该墨水滴
				setTimeout(() => {
					const index = inkDrops.value.findIndex(drop => drop.id === newDrop.id);
					if (index !== -1) {
						inkDrops.value.splice(index, 1);
					}
				}, 3000);
			}, 500);
		};
		
		// 更新加载文本
		const updateLoadingText = () => {
			let currentIndex = 0;
			loadingTextInterval = setInterval(() => {
				currentIndex = (currentIndex + 1) % loadingTexts.length;
				currentLoadingText.value = loadingTexts[currentIndex];
			}, 2000);
		};
		
		// 旋转八卦轮
		const rotateWheel = () => {
			rotationInterval = setInterval(() => {
				wheelRotation.value = (wheelRotation.value + 1) % 360;
			}, 50);
		};
		
		// 选择选项
		const selectOption = (option) => {
			if (!option) {
				console.error('天机轮：尝试选择无效选项');
				return;
			}
			
			console.log('天机轮选择选项:', option);
			selectedOption.value = option;
			
			// 使用震动反馈
			try {
				uni.vibrateShort();
			} catch (e) {
				console.error('震动反馈失败', e);
			}
			
			// 立即发送选项事件
			emit('select-option', option);
		};
		
		// 跳过动画
		const skipAnimation = () => {
			console.log('天机轮：跳过动画');
			emit('skip');
		};
		
		onMounted(() => {
			console.log('天机轮组件已挂载，决策问题:', props.decisionQuestion);
			console.log('选项列表:', props.options);
			
			// 创建八卦符号
			createBaguaSymbols();
			
			// 创建水墨效果
			createInkEffect();
			
			// 更新加载文本
			updateLoadingText();
			
			// 旋转八卦轮
			rotateWheel();
		});
		
		onBeforeUnmount(() => {
			// 清理所有定时器
			if (rotationInterval) clearInterval(rotationInterval);
			if (loadingTextInterval) clearInterval(loadingTextInterval);
			if (inkDropInterval) clearInterval(inkDropInterval);
		});
		
		return {
			selectedOption,
			wheelStyle,
			currentLoadingText,
			trigramElements,
			inkDrops,
			selectOption,
			skipAnimation
		};
	}
};
</script>

<style lang="scss" scoped>
/* 变量定义 */
$ink-dark: #1a1a1a;
$ink-light: #4a4a4a;
$paper: #f5e6d3;
$red-seal: #8b0000;

.wheel-animation {
	position: relative;
	width: 100%;
	height: 100vh;
	font-family: 'Noto Serif SC', serif;
	background: $paper;
	color: $ink-dark;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 80px;
	/* 背景图片配置 - 后续可替换 */
	background-image: url('https://picsum.photos/seed/paper/1200/800');
}

/* 纸张纹理 */
.paper-texture {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(245, 230, 211, 0.3);
	pointer-events: none;
	z-index: 2;
}

/* 决策问题 */
.decision-question {
	position: relative;
	text-align: center;
	margin-bottom: 40px;
	padding: 20px;
	animation: inkReveal 1.5s ease-out;
	z-index: 5;
}

.question-scroll {
	position: relative;
	display: inline-block;
	padding: 20px 40px;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 4px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0.1;
		background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
						  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
						  linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
						  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
}

.question-text {
	font-size: 24px;
	color: #111827;
	margin: 0;
	position: relative;
	z-index: 1;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
	letter-spacing: 2px;
	line-height: 1.6;
	
	.highlight {
		color: #dc2626;
		font-weight: 700;
	}
}

.ink-mark {
	position: absolute;
	right: -20px;
	bottom: -20px;
	width: 40px;
	height: 40px;
	background: #dc2626;
	border-radius: 4px;
	transform: rotate(15deg);
	opacity: 0.8;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 20px;
}

/* 八卦轮 */
.bagua-wheel {
	position: relative;
	width: 300px;
	height: 300px;
	z-index: 5;
	transition: transform 0.05s linear;
}

.bagua-center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100px;
	height: 100px;
	background: linear-gradient(45deg, #000 50%, #fff 50%);
	border-radius: 50%;
	animation: taijiFade 3s ease-in-out infinite;
	z-index: 6;
}

.trigram {
	position: absolute;
	font-size: 30px;
	top: 50%;
	left: 50%;
	transform-origin: center center;
	color: rgba(0, 0, 0, 0.4);
}

/* 水墨效果 */
.ink-drops {
	position: absolute;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 3;
}

.ink-drop {
	position: absolute;
	background: $ink-dark;
	border-radius: 50%;
	opacity: 0;
	animation: inkSpread 3s ease-out forwards;
}

/* 加载文本 */
.loading-text {
	margin-top: 30px;
	font-size: 24px;
	text-align: center;
	opacity: 0;
	animation: textFade 2s ease-in-out infinite;
	z-index: 5;
}

/* 选项容器 */
.options-container {
	margin-top: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	z-index: 5;
}

.options-grid {
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
	justify-content: center;
}

.option {
	padding: 10px 20px;
	background: rgba(255, 255, 255, 0.1);
	border: 2px solid $ink-dark;
	font-size: 20px;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&.selected {
		background: $ink-dark;
		color: $paper;
	}
}

/* 印章 */
.seal {
	position: absolute;
	width: 80px;
	height: 80px;
	background: $red-seal;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: $paper;
	font-size: 24px;
	opacity: 0;
	animation: sealStamp 1s ease-out forwards;
	z-index: 5;
}

/* 跳过按钮 */
.skip-button {
	position: absolute;
	bottom: 20px;
	right: 20px;
	padding: 10px 20px;
	background: transparent;
	border: 2px solid $ink-dark;
	color: $ink-dark;
	font-size: 18px;
	cursor: pointer;
	transition: all 0.3s ease;
	z-index: 10;
	
	.skip-icon {
		margin-right: 5px;
	}
	
	&:active {
		background: $ink-dark;
		color: $paper;
	}
}

/* 动画定义 */
@keyframes taijiFade {
	0%, 100% { opacity: 0.8; }
	50% { opacity: 1; }
}

@keyframes inkSpread {
	0% {
		transform: scale(0);
		opacity: 0.8;
	}
	100% {
		transform: scale(1);
		opacity: 0;
	}
}

@keyframes textFade {
	0%, 100% { opacity: 0.6; }
	50% { opacity: 1; }
}

@keyframes sealStamp {
	0% {
		transform: scale(1.5);
		opacity: 0;
	}
	50% {
		transform: scale(0.8);
		opacity: 0.8;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes inkReveal {
	0% {
		opacity: 0;
		transform: translateY(20px) scale(0.95);
		filter: blur(10px);
	}
	50% {
		filter: blur(5px);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
	}
}
</style> 