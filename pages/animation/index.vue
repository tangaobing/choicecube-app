<template>
	<view class="animation-page" :class="'theme-' + currentTheme">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="back-text">返回</text>
			</view>
			<view class="nav-title">{{ getThemeTitle() }}</view>
			<view class="nav-right"></view>
		</view>
		
		<!-- 进度条 -->
		<view class="progress-bar">
			<view class="progress" :style="{width: progress + '%'}"></view>
		</view>
		
		<!-- 主题动画容器 -->
		<view class="animation-container">
			<!-- 根据主题动态显示相应的动画组件 -->
			<template v-if="currentTheme === 'divine'">
				<divine-animation 
					:decision-question="decisionQuestion"
					:options="options"
					:loading-text="currentLoadingText"
					@select-option="selectDivineOption"
				/>
			</template>
			
			<template v-else-if="currentTheme === 'capsule'">
				<capsule-animation 
					:decision-question="decisionQuestion"
					:options="options"
					:loading-text="currentLoadingText"
					@select-option="selectCapsuleOption"
				/>
			</template>
			
			<template v-else-if="currentTheme === 'wheel'">
				<wheel-animation 
					:decision-question="decisionQuestion"
					:options="options"
					:loading-text="currentLoadingText"
					@select-option="selectWheelOption"
					@skip="skipAnimation"
				/>
			</template>
			
			<template v-else-if="currentTheme === 'pool'">
				<pool-animation 
					:decision-question="decisionQuestion"
					:options="options"
					:loading-text="currentLoadingText"
					@select-option="selectFinalResult"
				/>
			</template>
		</view>
		
		<!-- 加载文本 -->
		<view class="loading-text">
			{{ currentLoadingText }}
		</view>
	</view>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { saveDecision } from '@/utils/storage';

// 导入各主题动画组件
import DivineAnimation from './components/divine/DivineAnimation.vue';
import CapsuleAnimation from './components/capsule/CapsuleAnimation.vue';
import WheelAnimation from './components/wheel/WheelAnimation.vue';
import PoolAnimation from './components/pool/PoolAnimation.vue';

export default {
	components: {
		DivineAnimation,
		CapsuleAnimation,
		WheelAnimation,
		PoolAnimation
	},
	setup() {
		const store = useStore();
		
		// 获取并监听选项和主题
		const options = computed(() => store.state.options);
		const currentTheme = computed(() => store.state.currentTheme);
		const decisionQuestion = computed(() => store.state.decisionQuestion || '未设置决策问题');
		
		// 进度和加载文本状态
		const progress = ref(0);
		const currentLoadingText = ref('分析中...');
		
		// 选项选择状态
		const selectedWheelOption = ref(null);
		
		// 定时器引用
		let progressTimer = null;
		let loadingTextTimer = null;
		
		// 加载文本列表
		const loadingTexts = {
			divine: [
				'解读神谕中...',
				'聆听天机指引...',
				'捕捉命运轨迹...',
				'预示未来方向...',
				'揭示神意指向...'
			],
			capsule: [
				'扫描量子波动...',
				'解析决策矩阵...',
				'计算最优路径...',
				'模拟未来概率...',
				'评估成功机率...'
			],
			wheel: [
				'八卦演算中...',
				'解读天机轨迹...',
				'计算卦象能量...',
				'凝聚阴阳之力...',
				'卦象推演之中...'
			],
			pool: [
				'探测气运流向...',
				'凝聚运势之力...',
				'捕捉命运轨迹...',
				'聚集气运能量...',
				'解析运势走向...'
			]
		};
		
		// 初始化
		onMounted(() => {
			// 振动反馈
			if (store.getters.isVibrationEnabled) {
				uni.vibrateShort();
			}
			
			// 更新加载文本动画
			updateLoadingText();
			
			// 进度条更新定时器
			startProgressUpdate();
			
			// 初始化加速度计观察
			initAccelerometer();
		});
		
		// 组件销毁前清理
		onBeforeUnmount(() => {
			console.log('执行组件清理操作');
			try {
				// 清理定时器
				if (progressTimer) {
					clearInterval(progressTimer);
					progressTimer = null;
				}
				
				if (loadingTextTimer) {
					clearInterval(loadingTextTimer);
					loadingTextTimer = null;
				}
				
				// 停止监听加速度
				try {
					uni.stopAccelerometer({
						success: () => console.log('加速度计停止成功'),
						fail: (err) => console.error('加速度计停止失败', err),
						complete: () => console.log('加速度计停止完成')
					});
				} catch (e) {
					console.error('停止加速度计失败', e);
				}
			} catch (e) {
				console.error('组件清理过程中发生错误', e);
			}
		});
		
		// 开始更新进度条
		const startProgressUpdate = () => {
			// 每150ms更新一次进度，每次增加2-6之间的随机数，大幅提高速度
			progressTimer = setInterval(() => {
				if (progress.value < 100) {
					progress.value += 2 + Math.random() * 4;
					// 当进度达到100时，停止更新并自动跳转到结果页
					if (progress.value >= 100) {
						progress.value = 100;
						clearInterval(progressTimer);
						console.log('进度条达到100%，准备跳转');
						
						// 根据当前主题随机选择一个选项
						const randomIndex = Math.floor(Math.random() * options.value.length);
						const selectedOption = options.value[randomIndex];
						console.log('随机选择结果:', selectedOption);
						
						// 确保DOM更新后再播放特效
						setTimeout(() => {
							// 播放对应主题的特效，然后跳转
							playThemeCompletionEffect().then(() => {
								selectFinalResult(selectedOption);
							}).catch(err => {
								console.error('特效播放失败:', err);
								// 发生错误时仍然跳转
								selectFinalResult(selectedOption);
							});
						}, 100);
					}
				}
			}, 150);
		};
		
		// 播放主题完成时的特效
		const playThemeCompletionEffect = () => {
			return new Promise((resolve) => {
				console.log('播放主题特效，当前主题:', currentTheme.value);
				// 根据不同主题播放不同的完成特效
				if (currentTheme.value === 'divine') {
					playDivineCompletionEffect(resolve);
				} else if (currentTheme.value === 'capsule') {
					playCapsuleCompletionEffect(resolve);
				} else if (currentTheme.value === 'wheel') {
					playWheelCompletionEffect(resolve);
				} else if (currentTheme.value === 'pool') {
					playPoolCompletionEffect(resolve);
				} else {
					// 如果没有对应的特效，直接完成
					console.log('无法识别主题，默认完成');
					resolve();
				}
			});
		};
		
		// 神选时刻完成特效
		const playDivineCompletionEffect = (callback) => {
			console.log('开始播放神选时刻特效');
			
			// 简化特效，使用uni-app API
			uni.showToast({
				title: '✨ 神谕已定 ✨',
				icon: 'none',
				duration: 1500
			});
			
			// 震动反馈
			try {
				uni.vibrateShort();
			} catch (e) {
				console.error('震动失败:', e);
			}
			
			// 延迟后回调
			setTimeout(() => {
				console.log('神选时刻特效完成，准备跳转');
				callback();
			}, 1500);
		};
		
		// 命运胶囊完成特效
		const playCapsuleCompletionEffect = (callback) => {
			// 简化效果，使用uni-app API
			uni.showToast({
				title: '🧪 胶囊已锁定 🧪',
				icon: 'none',
				duration: 1500
			});
			
			// 震动反馈（连续两次短震动）
			uni.vibrateShort();
			setTimeout(() => {
				uni.vibrateShort();
			}, 300);
			
			// 延迟后回调
			setTimeout(() => {
				callback();
			}, 1500);
		};
		
		// 天机轮完成特效
		const playWheelCompletionEffect = (callback) => {
			console.log('播放天机轮完成特效');
			try {
				// 震动反馈（长震动）
				try {
					uni.vibrateLong();
				} catch (e) {
					console.error('震动失败:', e);
				}
				
				// 显示提示
				uni.showToast({
					title: '天机已显，命运已定',
					icon: 'none',
					duration: 2000,
					success: () => {
						console.log('天机轮提示显示成功');
					},
					fail: (err) => {
						console.error('天机轮提示显示失败:', err);
					}
				});
				
				// 延迟后回调
				setTimeout(() => {
					console.log('天机轮特效完成，准备回调');
					try {
						if (typeof callback === 'function') {
							callback();
						} else {
							console.error('回调不是一个函数:', callback);
						}
					} catch (e) {
						console.error('执行回调失败:', e);
					}
				}, 2000);
			} catch (e) {
				console.error('播放天机轮特效失败:', e);
				// 降级为更简单的回调方式
				setTimeout(() => {
					if (typeof callback === 'function') {
						callback();
					}
				}, 500);
			}
		};
		
		// 气运池完成特效
		const playPoolCompletionEffect = (callback) => {
			// 简化效果，使用uni-app API
			uni.showToast({
				title: '🌊 气运涌现 🌊',
				icon: 'none',
				duration: 1500
			});
			
			// 震动反馈（三次短震动）
			uni.vibrateShort();
			setTimeout(() => {
				uni.vibrateShort();
				setTimeout(() => {
					uni.vibrateShort();
				}, 200);
			}, 200);
			
			// 延迟后回调
			setTimeout(() => {
				callback();
			}, 1500);
		};
		
		// 更新加载文本
		const updateLoadingText = () => {
			loadingTextTimer = setInterval(() => {
				// 如果有多个加载文本，则随机选择一个
				const texts = loadingTexts[currentTheme.value] || loadingTexts.divine;
				const randomIndex = Math.floor(Math.random() * texts.length);
				currentLoadingText.value = texts[randomIndex];
			}, 1500);
		};
		
		// 初始化加速度计监听
		const initAccelerometer = () => {
			uni.startAccelerometer({
				interval: 'normal'
			});
			
			uni.onAccelerometerChange((res) => {
				// 检测剧烈晃动
				const shakeThreshold = 1.5;
				const { x, y, z } = res;
				const acceleration = Math.sqrt(x * x + y * y + z * z);
				
				if (acceleration > shakeThreshold) {
					// 根据主题选择不同的晃动响应
					if (currentTheme.value === 'divine') {
						// 神选时刻效果
					} else if (currentTheme.value === 'capsule') {
						// 命运胶囊效果
					} else if (currentTheme.value === 'wheel') {
						// 天机轮效果
					} else if (currentTheme.value === 'pool') {
						// 气运池效果
					}
				}
			});
		};
		
		// 跳过动画，直接显示结果
		const skipAnimation = () => {
			progress.value = 100;
			
			// 暂停所有正在运行的定时器
			if (progressTimer) clearInterval(progressTimer);
			if (loadingTextTimer) clearInterval(loadingTextTimer);
			
			// 随机选择一个选项作为结果
			const randomIndex = Math.floor(Math.random() * options.value.length);
			const selectedOption = options.value[randomIndex];
			
			// 立即提交结果
			store.commit('SET_DECISION_RESULT', { 
				result: selectedOption, 
				seed: Math.random().toString(36).substring(2, 15)
			});
			
			// 立即跳转，不使用selectFinalResult减少额外延迟
			uni.redirectTo({
				url: '../result/index'
			});
		};
		
		// 神选时刻主题选择选项
		const selectDivineOption = (option) => {
			if (!option) {
				console.error('神选时刻：尝试选择无效选项');
				return;
			}
			console.log('神选时刻选择选项:', option);
			selectFinalResult(option);
		};
		
		// 命运胶囊主题选择选项
		const selectCapsuleOption = (option) => {
			if (!option) {
				console.error('命运胶囊：尝试选择无效选项');
				return;
			}
			console.log('命运胶囊选择选项:', option);
			selectFinalResult(option);
		};
		
		// 天机轮主题选择选项
		const selectWheelOption = (option) => {
			selectedWheelOption.value = option;
		};
		
		// 天机轮确认选择
		const confirmWheelSelection = () => {
			if (selectedWheelOption.value) {
				selectFinalResult(selectedWheelOption.value);
			}
		};
		
		// 最终选择结果并跳转结果页 - 完全重写的版本
		const selectFinalResult = (option) => {
			console.log('Final option selected:', option);
			
			// 检查选项是否有效
			if (!option) {
				console.error('选项无效，无法设置结果');
				return;
			}
			
			// 生成随机种子
			const seed = Math.random().toString(36).substring(2, 15);
			
			// 设置选中结果
			store.commit('SET_DECISION_RESULT', { 
				result: option, 
				seed: seed
			});
			
			// 保存到历史记录
			try {
				// 创建决策记录对象
				const decisionRecord = {
					title: decisionQuestion.value,
					options: options.value,
					result: option,
					theme: currentTheme.value,
					seed: seed
				};
				
				// 保存决策记录
				const savedId = saveDecision(decisionRecord);
				console.log('保存决策记录成功，ID:', savedId);
			} catch (e) {
				console.error('保存历史记录失败:', e);
			}
			
			// 震动反馈
			if (store.getters.isVibrationEnabled) {
				try {
					uni.vibrateShort();
				} catch (e) {
					console.error('震动反馈失败', e);
				}
			}
			
			// 清理所有动画和定时器
			try {
				if (progressTimer) {
					clearInterval(progressTimer);
					progressTimer = null;
				}
				if (loadingTextTimer) {
					clearInterval(loadingTextTimer);
					loadingTextTimer = null;
				}
				try {
					uni.offAccelerometerChange();
				} catch (e) {
					console.error('停止加速度计失败, 忽略此错误', e);
				}
			} catch (e) {
				console.error('清理资源失败', e);
			}
			
			// 记录决策时间
			const timestamp = Date.now();
			console.log('记录决策时间:', timestamp);
			
			// 显示简单提示
			uni.showToast({
				title: '获取结果中...',
				icon: 'none',
				duration: 300
			});
			
			// 确保跳转成功
			setTimeout(function() {
				console.log('跳转到结果页...');
				try {
					uni.redirectTo({
						url: '../result/index',
						fail: function(err) {
							console.error('跳转失败，尝试使用reLaunch', err);
							uni.reLaunch({
								url: '../result/index'
							});
						}
					});
				} catch (e) {
					console.error('跳转异常，使用备用方法', e);
					uni.reLaunch({
						url: '../result/index'
					});
				}
			}, 300);
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 获取主题标题
		const getThemeTitle = () => {
			const themeNames = {
				'divine': '神选时刻',
				'capsule': '命运胶囊',
				'wheel': '天机轮',
				'pool': '气运池'
			};
			return themeNames[currentTheme.value] || '正在为您决策';
		};
		
		return {
			options,
			currentTheme,
			decisionQuestion,
			progress,
			currentLoadingText,
			selectedWheelOption,
			skipAnimation,
			selectDivineOption,
			selectCapsuleOption,
			selectWheelOption,
			confirmWheelSelection,
			selectFinalResult,
			goBack,
			getThemeTitle
		};
	}
};
</script>

<style lang="scss">
.animation-page {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
	
	/* 根据不同主题使用不同的背景图片 */
	&.theme-capsule {
		background: linear-gradient(135deg, #0F2027, #203A43, #2C5364);
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--capsule-animation-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.6;
			z-index: 0;
		}
	}
	
	&.theme-divine {
		background: linear-gradient(135deg, #1A0033, #3B0068, #5C00A3);
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--divine-animation-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.6;
			z-index: 0;
		}
	}
	
	&.theme-wheel {
		background: linear-gradient(135deg, #1E293B, #334155, #475569);
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--wheel-animation-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.6;
			z-index: 0;
		}
	}
	
	&.theme-pool {
		background: linear-gradient(135deg, #0B3866, #105A9A, #1B6EBF);
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--pool-animation-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.6;
			z-index: 0;
		}
	}
	
	/* 确保所有内容在背景之上 */
	& > * {
		position: relative;
		z-index: 1;
	}
	
	.progress-bar {
		position: absolute;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		height: 10rpx;
		background-color: rgba(255, 255, 255, 0.3);
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		
		.progress {
			height: 100%;
			transition: width 0.2s ease;
		}
	}

	/* 为每个主题定制进度条样式 */
	.theme-divine .progress-bar {
		background-color: rgba(179, 136, 255, 0.2);
		
		.progress {
			background: linear-gradient(to right, #9d4edd, #c77dff);
			box-shadow: 0 0 10px rgba(157, 78, 221, 0.5);
		}
	}

	.theme-capsule .progress-bar {
		background-color: rgba(165, 216, 255, 0.2);
		
		.progress {
			background: linear-gradient(to right, #0077b6, #90e0ef);
			box-shadow: 0 0 10px rgba(0, 119, 182, 0.5);
		}
	}

	.theme-wheel .progress-bar {
		background-color: rgba(199, 140, 67, 0.15);
		
		.progress {
			background: linear-gradient(to right, #a47e3b, #e6b325);
			box-shadow: 0 0 10px rgba(164, 126, 59, 0.5);
		}
	}

	.theme-pool .progress-bar {
		background-color: rgba(41, 182, 246, 0.2);
		
		.progress {
			background: linear-gradient(to right, #0288d1, #29b6f6);
			box-shadow: 0 0 10px rgba(41, 182, 246, 0.5);
		}
	}

	.animation-container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		box-sizing: border-box;
		padding-top: calc(var(--status-bar-height) + 40rpx);
	}

	.loading-text {
		position: absolute;
		bottom: 60rpx;
		left: 0;
		width: 100%;
		text-align: center;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 主题完成特效通用样式 */
	.divine-completion-effect,
	.capsule-completion-effect,
	.wheel-completion-effect,
	.pool-completion-effect {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		pointer-events: none;
		transition: opacity 0.5s ease;
	}

	.fade-out {
		opacity: 0;
	}

	/* 神选时刻完成特效 */
	.divine-completion-effect {
		background-color: rgba(45, 27, 78, 0.7);
	}

	.divine-ray {
		position: absolute;
		width: 3rpx;
		height: 0;
		background: linear-gradient(to top, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0));
		transform-origin: bottom;
		animation: rayGrow 1.5s ease-out forwards;
	}

	.divine-halo {
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(138, 43, 226, 0) 70%);
		animation: haloGlow 1.5s ease-in-out infinite alternate;
	}

	@keyframes rayGrow {
		0% {
			height: 0;
			opacity: 0;
		}
		100% {
			height: 50vh;
			opacity: 1;
		}
	}

	@keyframes haloGlow {
		0% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		100% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	/* 命运胶囊完成特效 */
	.capsule-completion-effect {
		background-color: rgba(10, 25, 41, 0.7);
	}

	.capsule-particle {
		position: absolute;
		width: 10rpx;
		height: 10rpx;
		background-color: #7dd3fc;
		border-radius: 50%;
		animation: particleFloat 1s ease-out forwards;
	}

	@keyframes particleFloat {
		0% {
			transform: scale(0) translateY(0);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: scale(1) translateY(-100rpx);
			opacity: 0;
		}
	}

	/* 天机轮完成特效 */
	.wheel-completion-effect {
		background-color: rgba(245, 242, 233, 0.7);
	}

	.wheel-bagua {
		font-size: 120rpx;
		color: #8d6e63;
		animation: rotate 3s linear infinite;
	}

	.wheel-symbol {
		position: absolute;
		font-size: 40rpx;
		color: #8d6e63;
		transform-origin: center center;
		animation: symbolFade 1.5s ease-in-out forwards;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes symbolFade {
		0% {
			opacity: 0;
			transform: scale(0) rotate(0deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(360deg) translateY(-120rpx);
		}
	}

	/* 气运池完成特效 */
	.pool-completion-effect {
		background-color: rgba(10, 25, 41, 0.7);
	}

	.pool-ripple {
		position: absolute;
		width: 100rpx;
		height: 100rpx;
		border: 5rpx solid #4fc3f7;
		border-radius: 50%;
		animation: ripple 2s ease-out infinite;
	}

	.pool-splash {
		position: absolute;
		width: 8rpx;
		height: 20rpx;
		background-color: #4fc3f7;
		border-radius: 50%;
		animation: splash 1s ease-out forwards;
	}

	@keyframes ripple {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		100% {
			transform: scale(5);
			opacity: 0;
		}
	}

	@keyframes splash {
		0% {
			transform: scale(0) translateY(0);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			transform: scale(1) translateY(-50rpx);
			opacity: 0;
		}
	}

	/* 天机轮完成特效样式 */
	.wheel-completion-seal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-15deg);
		color: #f44336;
		font-size: 120rpx;
		font-weight: bold;
		text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
		opacity: 0;
		z-index: 999;
		animation: sealAppear 2s forwards;
		font-family: "楷体", KaiTi, sans-serif;
		border: 8rpx solid #f44336;
		padding: 20rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 20px rgba(244, 67, 54, 0.7);
	}

	.bagua-symbol-animated {
		position: fixed;
		font-size: 60rpx;
		color: #000;
		z-index: 998;
		opacity: 0;
		animation: symbolFly 2s forwards;
	}

	.wheel-ink-drop {
		position: fixed;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.8);
		z-index: 997;
		opacity: 0;
		animation: inkDrop 1.5s forwards;
	}

	@keyframes sealAppear {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.2) rotate(-45deg);
		}
		20% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.2) rotate(-15deg);
		}
		40% {
			transform: translate(-50%, -50%) scale(0.9) rotate(-5deg);
		}
		60% {
			transform: translate(-50%, -50%) scale(1) rotate(-10deg);
		}
		80% {
			transform: translate(-50%, -50%) scale(1) rotate(-5deg);
		}
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1) rotate(-8deg);
		}
	}

	@keyframes symbolFly {
		0% {
			opacity: 0;
			top: 120%;
			left: 50%;
			transform: scale(0.5) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: scale(1.5) rotate(180deg);
		}
		100% {
			opacity: 0;
			transform: scale(0.7) rotate(360deg);
		}
	}

	@keyframes inkDrop {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		40% {
			opacity: 0.8;
			transform: scale(1);
		}
		80% {
			opacity: 0.6;
		}
		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}

	/* 导航栏样式 */
	.nav-bar {
		width: 100%;
		height: 44px;
		display: flex;
		align-items: center;
		padding: 0 15px;
		background-color: rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		z-index: 100;
		position: relative;
	}

	.nav-left {
		width: 70px;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.back-text {
		font-size: 16px;
		color: #ffffff;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.nav-title {
		flex: 1;
		text-align: center;
		font-size: 17px;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.nav-right {
		width: 30px;
	}
}
</style>