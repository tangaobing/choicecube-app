<template>
	<view class="result-page" :class="'theme-' + currentTheme">
		<!-- 根据主题动态显示相应的结果组件 -->
		<template v-if="currentTheme === 'divine'">
			<divine-result 
				:decision-question="store.state.decisionQuestion" 
				:result="decisionResult"
				@retry="tryAgain"
				@share="goToHome"
			/>
		</template>
		
		<template v-else-if="currentTheme === 'capsule'">
			<capsule-result 
				:decision-question="store.state.decisionQuestion"
				:result="decisionResult"
				@retry="tryAgain"
				@share="goToHome"
			/>
		</template>
		
		<template v-else-if="currentTheme === 'wheel'">
			<wheel-result 
				:decision-question="store.state.decisionQuestion" 
				:result="decisionResult"
				@retry="tryAgain"
				@share="goToHome"
			/>
		</template>
		
		<template v-else-if="currentTheme === 'pool'">
			<pool-result 
				:decision-question="store.state.decisionQuestion" 
				:result="decisionResult"
				@retry="tryAgain"
				@share="goToHome"
			/>
		</template>
		
		<!-- 分享面板，所有主题公用 -->
		<view class="share-panel" v-if="showSharePanel">
			<view class="share-panel-mask" @tap="closeSharePanel"></view>
			<view class="share-panel-content">
				<view class="share-panel-title">分享结果</view>
				<view class="share-methods">
					<view class="share-method" @tap="shareToWechat">
						<view class="share-icon wechat-icon">
							<text class="iconfont icon-wechat">微信</text>
						</view>
						<text class="share-name">微信</text>
					</view>
					<view class="share-method" @tap="shareToMoments">
						<view class="share-icon moments-icon">
							<text class="iconfont icon-moments">朋友圈</text>
						</view>
						<text class="share-name">朋友圈</text>
					</view>
					<view class="share-method" @tap="copyShareLink">
						<view class="share-icon link-icon">
							<text class="iconfont icon-link">链接</text>
						</view>
						<text class="share-name">复制链接</text>
					</view>
					<view class="share-method" @tap="saveResultImage">
						<view class="share-icon image-icon">
							<text class="iconfont icon-image">图片</text>
						</view>
						<text class="share-name">保存图片</text>
					</view>
				</view>
				<view class="share-cancel" @tap="closeSharePanel">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

// 导入各主题结果组件
import DivineResult from './components/divine/DivineResult.vue';
import CapsuleResult from './components/capsule/CapsuleResult.vue';
import WheelResult from './components/wheel/WheelResult.vue';
import PoolResult from './components/pool/PoolResult.vue';

export default {
	components: {
		DivineResult,
		CapsuleResult, 
		WheelResult,
		PoolResult
	},
	setup() {
		const store = useStore();
		
		// 获取vuex中的数据
		const options = computed(() => store.state.options);
		const decisionResult = computed(() => store.state.decisionResult);
		const seed = computed(() => store.state.seed);
		const currentTheme = computed(() => store.state.currentTheme);
		
		// 控制显示状态
		const showSharePanel = ref(false);
		
		// 初始化
		onMounted(() => {
			// 如果没有结果，返回首页
			if (!decisionResult.value) {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
			
			// 震动反馈
			if (store.getters.isVibrationEnabled) {
				uni.vibrateShort();
			}
		});
		
		// 再次尝试
		const tryAgain = () => {
			uni.navigateTo({
				url: '/pages/animation/index'
			});
		};
		
		// 分享结果
		const shareResult = () => {
			showSharePanel.value = true;
		};
		
		// 返回首页
		const goToHome = () => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		};
		
		// 关闭分享面板
		const closeSharePanel = () => {
			showSharePanel.value = false;
		};
		
		// 分享到微信
		const shareToWechat = () => {
			// 实际微信分享API调用
			uni.showToast({
				title: '分享到微信',
				icon: 'none'
			});
			closeSharePanel();
		};
		
		// 分享到朋友圈
		const shareToMoments = () => {
			// 实际分享到朋友圈API调用
			uni.showToast({
				title: '分享到朋友圈',
				icon: 'none'
			});
			closeSharePanel();
		};
		
		// 复制分享链接
		const copyShareLink = () => {
			// 生成分享链接内容
			const shareContent = `我用「决策魔方」做了一个决策：【${decisionResult.value}】\n\n全部选项：${options.value.join('、')}\n\n下载决策魔方App，体验高质量决策：https://example.com/choicecube`;
			
			uni.setClipboardData({
				data: shareContent,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'success'
					});
				}
			});
			closeSharePanel();
		};
		
		// 保存结果为图片
		const saveResultImage = () => {
			// 实际图片生成和保存
			uni.showToast({
				title: '图片保存功能开发中',
				icon: 'none'
			});
			closeSharePanel();
		};
		
		return {
			store,
			options,
			decisionResult,
			seed,
			currentTheme,
			showSharePanel,
			tryAgain,
			shareResult,
			goToHome,
			closeSharePanel,
			shareToWechat,
			shareToMoments,
			copyShareLink,
			saveResultImage
		};
	}
};
</script>

<style lang="scss">
.result-page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 30rpx;
	box-sizing: border-box;
	padding-top: calc(var(--status-bar-height) + 30rpx);
	
	/* 主题样式，支持背景图片 */
	&.theme-capsule {
		background: linear-gradient(135deg, #0F2027, #203A43, #2C5364);
		background-image: url('/static/images/backgrounds/capsule_result_bg.png');
		background-size: cover;
		background-position: center;
		background-blend-mode: soft-light;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--capsule-result-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.4;
			z-index: 0;
		}
	}
	
	&.theme-divine {
		background: linear-gradient(135deg, #1A0033, #3B0068, #5C00A3);
		background-image: url('/static/images/backgrounds/divine_result_bg.png');
		background-size: cover;
		background-position: center;
		background-blend-mode: soft-light;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--divine-result-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.4;
			z-index: 0;
		}
	}
	
	&.theme-wheel {
		background: linear-gradient(135deg, #1E293B, #334155, #475569);
		background-image: url('/static/images/backgrounds/wheel_result_bg.png');
		background-size: cover;
		background-position: center;
		background-blend-mode: soft-light;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--wheel-result-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.4;
			z-index: 0;
		}
	}
	
	&.theme-pool {
		background: linear-gradient(135deg, #0B3866, #105A9A, #1B6EBF);
		background-image: url('/static/images/backgrounds/pool_result_bg.png');
		background-size: cover;
		background-position: center;
		background-blend-mode: soft-light;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: var(--pool-result-bg-image, none);
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.4;
			z-index: 0;
		}
	}
	
	/* 确保所有内容在背景之上 */
	& > * {
		position: relative;
		z-index: 1;
	}
}

.share-panel {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;
	
	.share-panel-mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.share-panel-content {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: #ffffff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		
		.share-panel-title {
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
			color: #333;
		}
		
		.share-methods {
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx 0;
			
			.share-method {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 30rpx;
				
				.share-icon {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 10rpx;
					font-size: 28rpx;
					color: #ffffff;
				}
				
				.wechat-icon {
					background-color: #07c160;
				}
				
				.moments-icon {
					background-color: #207f4c;
				}
				
				.link-icon {
					background-color: #007aff;
				}
				
				.image-icon {
					background-color: #ff9900;
				}
				
				.share-name {
					font-size: 24rpx;
					color: #333;
				}
			}
		}
		
		.share-cancel {
			margin-top: 20rpx;
			text-align: center;
			padding: 20rpx 0;
			border-radius: 10rpx;
			background-color: #f5f5f5;
			font-size: 30rpx;
			color: #333;
		}
	}
}
</style> 