<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 全局共享样式 */
	@import './uni.scss';

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
