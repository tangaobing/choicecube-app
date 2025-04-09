<template>
	<view class="option-page">
		<!-- 顶部导航栏 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="nav-bar">
			<view class="nav-left" @tap="goBack">
				<text class="back-text">返回</text>
			</view>
			<view class="nav-title">输入决策选项</view>
		</view>
		
		<!-- 内容区域 -->
		<scroll-view class="content-scroll" scroll-y>
			<!-- 问题输入卡片 -->
			<view class="question-card">
				<view class="question-label">您的决策问题是什么？</view>
				<input 
					class="question-input" 
					v-model="decisionQuestion" 
					placeholder="请输入您的选择项"
					@confirm="focusOptionInput"
				/>
			</view>
			
			<!-- 选项区域 -->
			<view class="options-card">
				<view class="options-label">添加决策选项 (至少2个)</view>
				
				<!-- 选项输入框 -->
				<view class="option-input-box">
					<input 
						class="option-input" 
						v-model="newOption" 
						placeholder="输入一个选项..."
						@confirm="addOption"
						confirm-type="done"
						ref="optionInput"
					/>
					<view class="add-btn" @tap="addOption">+</view>
				</view>
				
				<!-- 选项列表 -->
				<view class="options-list">
					<view class="option-item" v-for="(item, index) in options" :key="index">
						<view class="option-color-bar"></view>
						<view class="option-text">{{ item }}</view>
						<view class="option-delete" @tap="removeOption(index)">×</view>
					</view>
				</view>
				
				<!-- 选项计数/提示 -->
				<view class="option-count-tip" v-if="options.length > 0 && options.length < 2">
					已添加{{options.length}}个选项，至少需要2个选项
				</view>
				<view class="option-count-tip success" v-else-if="options.length >= 2">
					已添加{{options.length}}个选项
				</view>
				<view class="empty-tip" v-else>
					还没有添加选项哦
				</view>
			</view>
		</scroll-view>

		<!-- 确认按钮 -->
		<view class="confirm-button" @tap="continueIfValid" :class="{ 'disabled': !hasValidOptions }">
			<text>确认</text><text class="confirm-icon">✓</text>
		</view>
	</view>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { saveTempOptions } from '@/utils/storage';

export default {
	setup() {
		const store = useStore();
		const newOption = ref('');
		const decisionQuestion = ref('');
		const optionInput = ref(null);
		const statusBarHeight = ref(20);
		
		// 获取状态栏高度
		onMounted(() => {
			const systemInfo = uni.getSystemInfoSync();
			statusBarHeight.value = systemInfo.statusBarHeight || 20;
			
			// 获取Store中已有的决策问题
			const storeQuestion = store.state.decisionQuestion;
			if (storeQuestion) {
				decisionQuestion.value = storeQuestion;
			}
		});
		
		// 从store获取选项列表
		const options = computed(() => store.state.options);
		
		// 选项是否有效（至少2个）
		const hasValidOptions = computed(() => store.getters.hasValidOptions);
		
		// 当前主题
		const currentTheme = computed(() => store.getters.currentThemeId);
		
		// 添加选项
		const addOption = () => {
			if (newOption.value.trim()) {
				store.commit('ADD_OPTION', newOption.value.trim());
				newOption.value = ''; // 清空输入框
				
				// 震动反馈
				if (store.getters.isVibrationEnabled) {
					uni.vibrateShort();
				}
				
				// 添加成功提示
				uni.showToast({
					title: '添加成功',
					icon: 'none',
					duration: 500,
					position: 'bottom'
				});
			}
		};
		
		// 聚焦到选项输入框
		const focusOptionInput = () => {
			nextTick(() => {
				if (optionInput.value) {
					optionInput.value.focus();
				}
			});
		};
		
		// 删除选项
		const removeOption = (index) => {
			// 震动反馈
			if (store.getters.isVibrationEnabled) {
				uni.vibrateShort();
			}
			store.commit('REMOVE_OPTION', index);
		};
		
		// 返回上一页
		const goBack = () => {
			// 如果有选项，先临时保存
			if (options.value.length > 0) {
				saveTempOptions(options.value);
			}
			uni.navigateBack();
		};
		
		// 继续到主题选择页
		const continueIfValid = () => {
			if (hasValidOptions.value) {
				// 保存决策问题
				if (decisionQuestion.value.trim()) {
					store.commit('SET_DECISION_QUESTION', decisionQuestion.value.trim());
				}
				
				uni.navigateTo({
					url: '/pages/theme-select/index'
				});
			} else {
				uni.showToast({
					title: '请至少添加2个选项',
					icon: 'none'
				});
			}
		};
		
		// 导航到首页
		const navigateToHome = () => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		};
		
		return {
			newOption,
			decisionQuestion,
			optionInput,
			options,
			hasValidOptions,
			currentTheme,
			statusBarHeight,
			addOption,
			focusOptionInput,
			removeOption,
			goBack,
			continueIfValid,
			navigateToHome
		};
	}
};
</script>

<style lang="scss">
.option-page {
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: linear-gradient(135deg, #fcfcfc, #f0f5ff);
	background-image: url('/static/images/backgrounds/option_input_bg.png');
	background-size: cover;
	background-position: center;
	background-blend-mode: soft-light;
	position: relative;
	
	/* 背景图片支持 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: var(--option-input-bg-image, none);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0.15; /* 较低的透明度确保表单内容可见 */
		z-index: 0;
	}
	
	/* 确保所有内容在背景之上 */
	& > * {
		position: relative;
		z-index: 1;
	}
}

/* 状态栏 */
.status-bar {
	width: 100%;
	background-color: #ffffff;
}

/* 导航栏样式 */
.nav-bar {
	width: 100%;
	height: 44px;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #f0f0f0;
	padding: 0 15px;
	position: relative;
	z-index: 100;
}

.nav-left {
	position: absolute;
	left: 15px;
	width: 70px;
	display: flex;
	align-items: center;
}

.back-text {
	font-size: 16px;
	color: #333333;
	font-weight: 500;
}

.nav-title {
	flex: 1;
	text-align: center;
	font-size: 17px;
	font-weight: 500;
	color: #333333;
}

.nav-right {
	font-size: 15px;
	color: #3f7ef2;
	
	&.disabled {
		color: #999999;
	}
}

/* 内容区滚动容器 */
.content-scroll {
	flex: 1;
	background-color: transparent;
	padding: 12px;
}

/* 问题卡片样式 */
.question-card {
	background-color: #ffffff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.question-label {
	font-size: 15px;
	font-weight: 500;
	color: #333333;
	margin-bottom: 12px;
}

.question-input {
	width: 100%;
	height: 44px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	padding: 0 12px;
	font-size: 15px;
}

/* 选项卡片样式 */
.options-card {
	background-color: #ffffff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 80px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.options-label {
	font-size: 15px;
	font-weight: 500;
	color: #333333;
	margin-bottom: 12px;
}

/* 选项输入框 */
.option-input-box {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
}

.option-input {
	flex: 1;
	height: 44px;
	border: 1px solid #e0e0e0;
	border-radius: 22px;
	padding: 0 16px;
	font-size: 15px;
	background-color: #f9f9f9;
}

.add-btn {
	width: 36px;
	height: 36px;
	line-height: 36px;
	margin-left: 12px;
	background: linear-gradient(135deg, #3f7ef2, #1a56db);
	color: #ffffff;
	font-size: 22px;
	text-align: center;
	border-radius: 50%;
	box-shadow: 0 2px 8px rgba(31, 86, 242, 0.3);
	transition: all 0.3s;
	
	&:active {
		transform: scale(0.9);
	}
}

/* 选项列表 */
.options-list {
	margin-bottom: 16px;
}

.option-item {
	display: flex;
	align-items: center;
	padding: 12px;
	background-color: #ffffff;
	border-radius: 6px;
	margin-bottom: 10px;
	border: 1px solid #f0f0f0;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	transition: all 0.3s;
	animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.option-color-bar {
	width: 4px;
	height: 20px;
	background-color: #3f7ef2;
	border-radius: 2px;
	margin-right: 10px;
}

.option-text {
	flex: 1;
	font-size: 15px;
	color: #333333;
}

.option-delete {
	width: 28px;
	height: 28px;
	line-height: 28px;
	text-align: center;
	font-size: 20px;
	color: #ff5a5f;
}

/* 提示文本 */
.option-count-tip {
	font-size: 13px;
	color: #666666;
	text-align: center;
	background-color: rgba(63, 126, 242, 0.1);
	padding: 8px;
	border-radius: 20px;
	margin-top: 10px;
	
	&.success {
		background-color: rgba(76, 175, 80, 0.1);
		color: #4CAF50;
	}
}

.empty-tip {
	text-align: center;
	padding: 20px 0;
	font-size: 14px;
	color: #999999;
}

/* 确认按钮样式 */
.confirm-button {
	position: fixed;
	right: 20px;
	bottom: 30px;
	width: auto;
	height: 50px;
	background: linear-gradient(135deg, #3f7ef2, #1a56db);
	color: #ffffff;
	border-radius: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 10px rgba(31, 86, 242, 0.4);
	z-index: 100;
	transition: all 0.3s;
	padding: 0 20px;
	font-size: 16px;
	font-weight: 500;
	
	&.disabled {
		background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}
	
	&:active {
		transform: scale(0.95);
	}
}

.confirm-icon {
	font-size: 18px;
	font-weight: bold;
	margin-left: 5px;
}
</style> 