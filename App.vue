<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			
			// 检查背景图片是否存在并设置CSS变量
			this.checkAndSetBackgroundImages();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			// 检查背景图片是否存在并设置CSS变量
			checkAndSetBackgroundImages() {
				// 定义需要检查的图片路径和对应的CSS变量
				const imagesToCheck = [
					{ path: '/static/images/backgrounds/home_bg.png', cssVar: '--home-bg-image' },
					{ path: '/static/images/backgrounds/option_input_bg.png', cssVar: '--option-input-bg-image' },
					{ path: '/static/images/backgrounds/theme_select_bg.png', cssVar: '--theme-select-bg-image' },
					{ path: '/static/images/backgrounds/capsule_animation_bg.png', cssVar: '--capsule-animation-bg-image' },
					{ path: '/static/images/backgrounds/divine_animation_bg.png', cssVar: '--divine-animation-bg-image' },
					{ path: '/static/images/backgrounds/wheel_animation_bg.png', cssVar: '--wheel-animation-bg-image' },
					{ path: '/static/images/backgrounds/pool_animation_bg.png', cssVar: '--pool-animation-bg-image' },
					{ path: '/static/images/backgrounds/capsule_result_bg.png', cssVar: '--capsule-result-bg-image' },
					{ path: '/static/images/backgrounds/divine_result_bg.png', cssVar: '--divine-result-bg-image' },
					{ path: '/static/images/backgrounds/wheel_result_bg.png', cssVar: '--wheel-result-bg-image' },
					{ path: '/static/images/backgrounds/pool_result_bg.png', cssVar: '--pool-result-bg-image' }
				];
				
				// 如果运行在H5环境，可以使用document
				// #ifdef H5
				try {
					// 检查每个图片
					imagesToCheck.forEach(item => {
						try {
							// 获取图片的本地绝对路径
							const imageUrl = item.path.startsWith('/') ? item.path : '/' + item.path;
							
							// 设置CSS变量
							document.documentElement.style.setProperty(
								item.cssVar, 
								`url(${imageUrl})`
							);
							
							console.log(`设置${item.cssVar}为${imageUrl}`);
						} catch (e) {
							console.error(`检查图片失败: ${item.path}`, e);
						}
					});
				} catch (error) {
					console.error('设置背景图片失败:', error);
				}
				// #endif
				
				// 在非H5环境中
				// #ifndef H5
				try {
					// 获取系统信息
					const systemInfo = uni.getSystemInfoSync();
					console.log('当前平台:', systemInfo.platform);
					
					// 在非H5环境下，简单地记录图片路径
					// 由于无法直接设置CSS变量，依赖CSS中的默认逻辑处理
					imagesToCheck.forEach(item => {
						try {
							console.log(`检查图片: ${item.path} (非H5环境仅记录路径)`);
							// 非H5环境不做特殊处理，依赖CSS样式中的默认值
						} catch (e) {
							console.error(`处理图片路径失败: ${item.path}`, e);
						}
					});
				} catch (error) {
					console.error('系统信息获取失败:', error);
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	/* 全局共享样式 */
	@import './uni.scss';

	/* 背景图片CSS变量，默认为none */
	:root {
		--home-bg-image: none;
		--option-input-bg-image: none;
		--theme-select-bg-image: none;
		--capsule-animation-bg-image: none;
		--divine-animation-bg-image: none;
		--wheel-animation-bg-image: none;
		--pool-animation-bg-image: none;
		--capsule-result-bg-image: none;
		--divine-result-bg-image: none;
		--wheel-result-bg-image: none;
		--pool-result-bg-image: none;
	}

	/* 重置样式 */
	page {
		font-size: $uni-font-size-base;
		color: $text-color;
		box-sizing: border-box;
		background-color: #f5f5f5;
	}

	view, text, navigator, input, textarea, button {
		box-sizing: border-box;
	}

	/* 按钮样式 */
	.btn-primary {
		background: linear-gradient(45deg, $uni-color-primary, lighten($uni-color-primary, 10%));
		color: #fff;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border-radius: $border-radius;
		border: none;
		box-shadow: $shadow;
		text-align: center;
		margin: 20rpx 0;
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.9);
		color: $uni-color-primary;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border-radius: $border-radius;
		border: 1px solid $uni-color-primary;
		text-align: center;
		margin: 20rpx 0;
	}

	/* 主题相关样式 */
	.theme-capsule {
		--theme-primary: var(--capsule-primary);
		--theme-secondary: var(--capsule-secondary);
		--theme-bg: var(--capsule-bg);
		--theme-text: var(--capsule-text);
		--theme-accent: var(--capsule-accent);
	}

	.theme-divine {
		--theme-primary: var(--divine-primary);
		--theme-secondary: var(--divine-secondary);
		--theme-bg: var(--divine-bg);
		--theme-text: var(--divine-text);
		--theme-accent: var(--divine-accent);
	}

	.theme-wheel {
		--theme-primary: var(--wheel-primary);
		--theme-secondary: var(--wheel-secondary);
		--theme-bg: var(--wheel-bg);
		--theme-text: var(--wheel-text);
		--theme-accent: var(--wheel-accent);
	}

	.theme-pool {
		--theme-primary: var(--pool-primary);
		--theme-secondary: var(--pool-secondary);
		--theme-bg: var(--pool-bg);
		--theme-text: var(--pool-text);
		--theme-accent: var(--pool-accent);
	}

	/* 动画通用样式 */
	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scale-in {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	@keyframes slide-up {
		from { transform: translateY(30px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	/* 工具类 */
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.text-center {
		text-align: center;
	}

	.mt-10 {
		margin-top: 10rpx;
	}

	.mt-20 {
		margin-top: 20rpx;
	}

	.mt-30 {
		margin-top: 30rpx;
	}

	.mb-10 {
		margin-bottom: 10rpx;
	}

	.mb-20 {
		margin-bottom: 20rpx;
	}

	.mb-30 {
		margin-bottom: 30rpx;
	}

	.py-20 {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.px-20 {
		padding-left: 20rpx;
		padding-right: 20rpx;
	}
</style>
