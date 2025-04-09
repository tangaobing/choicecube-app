<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			
			// 检查背景图片是否存在并设置CSS变量
			this.checkAndSetBackgroundImages();
		},
		onShow: function() {
			console.log('App Show');
			// App显示时尝试应用背景图片
			this.applyBackgroundImagesFromStorage();
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
					{ path: '/static/images/backgrounds/history_bg.png', cssVar: '--history-bg-image' },
					{ path: '/static/images/backgrounds/history_detail_bg.png', cssVar: '--history-detail-bg-image' },
					{ path: '/static/images/backgrounds/capsule_animation_bg.png', cssVar: '--capsule-animation-bg-image' },
					{ path: '/static/images/backgrounds/divine_animation_bg.png', cssVar: '--divine-animation-bg-image' },
					{ path: '/static/images/backgrounds/wheel_animation_bg.png', cssVar: '--wheel-animation-bg-image' },
					{ path: '/static/images/backgrounds/pool_animation_bg.png', cssVar: '--pool-animation-bg-image' },
					{ path: '/static/images/backgrounds/capsule_result_bg.png', cssVar: '--capsule-result-bg-image' },
					{ path: '/static/images/backgrounds/divine_result_bg.png', cssVar: '--divine-result-bg-image' },
					{ path: '/static/images/backgrounds/wheel_result_bg.png', cssVar: '--wheel-result-bg-image' },
					{ path: '/static/images/backgrounds/pool_result_bg.png', cssVar: '--pool-result-bg-image' }
				];
				
				// 在非H5环境中
				// #ifndef H5
				try {
					// 获取系统信息
					const systemInfo = uni.getSystemInfoSync();
					console.log('当前平台:', systemInfo.platform);
					
					// 循环检查每个图片是否存在
					imagesToCheck.forEach(item => {
						try {
							// 使用Uni-App兼容的路径处理方式
							let imageUrl = '';
							
							// #ifdef APP-PLUS
							// 对于APP环境，使用应用内静态资源
							// 获取不带前导斜杠的路径
							const appPath = item.path.replace(/^\//, '');
							// 获取APP运行路径下的资源
							imageUrl = plus.io.convertLocalFileSystemURL(appPath);
							// 如果路径无效，尝试直接使用相对路径
							if (!imageUrl || imageUrl.includes('file://')) {
								// 使用相对路径尝试直接引用
								imageUrl = appPath;
							}
							console.log('APP环境处理后的图片路径:', imageUrl);
							// #endif
							
							// #ifdef H5
							// 对于H5环境，直接使用相对路径
							imageUrl = item.path.startsWith('/') ? item.path : '/' + item.path;
							// #endif
							
							// #ifdef MP
							// 对于小程序环境，使用相对路径
							imageUrl = item.path.replace(/^\//, '');
							// #endif
							
							console.log('处理后的图片路径:', imageUrl);
							
							// 使用uni.getImageInfo替代getFileInfo检查图片是否存在
							uni.getImageInfo({
								src: imageUrl,
								success: (res) => {
									console.log(`图片存在: ${imageUrl}, 宽度: ${res.width}, 高度: ${res.height}`);
									
									// 设置CSS变量
									// #ifdef APP-PLUS
									// 在APP环境中，通过本地存储记录图片路径
									try {
										// 存储图片路径到本地存储
										uni.setStorageSync(`bg_image_${item.cssVar.replace('--', '')}`, imageUrl);
										console.log(`已在本地存储中记录背景图片路径: ${item.cssVar} = ${imageUrl}`);
										
										// 触发样式应用
										this.applyBackgroundImagesFromStorage();
									} catch (e) {
										console.error(`APP环境设置背景图片变量失败: ${e.message}`);
									}
									// #endif
									
									// #ifdef H5
									// 在H5环境下直接设置CSS变量
									document.documentElement.style.setProperty(
										item.cssVar, 
										`url(${imageUrl})`
									);
									console.log(`已设置CSS变量 ${item.cssVar} 为 ${imageUrl}`);
									// #endif
									
									// #ifdef MP
									// 小程序环境中通过setStorage记录，依赖样式表引用
									uni.setStorageSync(`bg_image_${item.cssVar.slice(2)}`, imageUrl);
									console.log(`已在小程序存储中设置 ${item.cssVar} 为 ${imageUrl}`);
									// #endif
								},
								fail: (err) => {
									console.log(`图片不存在或无法访问: ${imageUrl}`, err);
								}
							});
						} catch (e) {
							console.error(`处理图片路径失败: ${item.path}`, e);
						}
					});
				} catch (error) {
					console.error('系统信息获取失败:', error);
				}
				// #endif
				
				// 如果运行在H5环境，可以使用document
				// #ifdef H5
				try {
					// 检查每个图片
					imagesToCheck.forEach(item => {
						try {
							// 创建Image对象检查图片是否可加载
							const img = new Image();
							img.onload = function() {
								console.log(`图片加载成功: ${item.path}`);
								// 设置CSS变量
								document.documentElement.style.setProperty(
									item.cssVar, 
									`url(${item.path})`
								);
							};
							img.onerror = function() {
								console.log(`图片加载失败: ${item.path}`);
							};
							// 获取图片的本地绝对路径
							const imageUrl = item.path.startsWith('/') ? item.path : '/' + item.path;
							img.src = imageUrl;
						} catch (e) {
							console.error(`检查图片失败: ${item.path}`, e);
						}
					});
				} catch (error) {
					console.error('设置背景图片失败:', error);
				}
				// #endif
			},
			// 从存储中获取并应用背景图片
			applyBackgroundImagesFromStorage() {
				// #ifdef APP-PLUS
				try {
					console.log('从存储加载背景图片');
					
					// 创建可直接应用的背景样式对象
					const bgStyleCache = {};
					
					// 循环所有可能的背景图片变量
					const cssVars = [
						'home-bg-image',
						'option-input-bg-image',
						'theme-select-bg-image',
						'history-bg-image',
						'history-detail-bg-image',
						'capsule-animation-bg-image',
						'divine-animation-bg-image',
						'wheel-animation-bg-image',
						'pool-animation-bg-image',
						'capsule-result-bg-image',
						'divine-result-bg-image',
						'wheel-result-bg-image',
						'pool-result-bg-image'
					];
					
					// 创建动态样式字符串
					let dynamicStyles = '';
					
					cssVars.forEach(varName => {
						try {
							// 从存储中读取图片路径
							const storedPath = uni.getStorageSync(`bg_image_${varName}`);
							if (storedPath) {
								console.log(`找到存储的背景图片: ${varName} = ${storedPath}`);
								// 添加到样式字符串
								dynamicStyles += `--${varName}: url(${storedPath});`;
								// 缓存背景图片路径供直接应用
								bgStyleCache[varName] = storedPath;
							}
						} catch (e) {
							console.error(`读取背景图片路径失败: ${varName}`, e);
						}
					});
					
					// 如果有样式需要应用
					if (dynamicStyles) {
						// 创建动态样式表并应用到页面
						if (plus && plus.webview) {
							const currentWebview = plus.webview.currentWebview();
							if (currentWebview && currentWebview.evalJS) {
								// 修改为WebView安全的CSS注入方式
								try {
									// 直接生成样式表内容
									let cssContent = '';
									
									// 直接生成需要的CSS规则
									if (bgStyleCache['home-bg-image']) {
										cssContent += `.home-container::before { background-image: url("${bgStyleCache['home-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['option-input-bg-image']) {
										cssContent += `.option-page::before { background-image: url("${bgStyleCache['option-input-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['theme-select-bg-image']) {
										cssContent += `.theme-select-page::before { background-image: url("${bgStyleCache['theme-select-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['history-bg-image']) {
										cssContent += `.history-page::before { background-image: url("${bgStyleCache['history-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['history-detail-bg-image']) {
										cssContent += `.detail-page::before { background-image: url("${bgStyleCache['history-detail-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['capsule-animation-bg-image']) {
										cssContent += `.animation-page.theme-capsule::before { background-image: url("${bgStyleCache['capsule-animation-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['divine-animation-bg-image']) {
										cssContent += `.animation-page.theme-divine::before { background-image: url("${bgStyleCache['divine-animation-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['wheel-animation-bg-image']) {
										cssContent += `.animation-page.theme-wheel::before { background-image: url("${bgStyleCache['wheel-animation-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['pool-animation-bg-image']) {
										cssContent += `.animation-page.theme-pool::before { background-image: url("${bgStyleCache['pool-animation-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['capsule-result-bg-image']) {
										cssContent += `.result-page.theme-capsule::before { background-image: url("${bgStyleCache['capsule-result-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['divine-result-bg-image']) {
										cssContent += `.result-page.theme-divine::before { background-image: url("${bgStyleCache['divine-result-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['wheel-result-bg-image']) {
										cssContent += `.result-page.theme-wheel::before { background-image: url("${bgStyleCache['wheel-result-bg-image']}") !important; }\n`;
									}
									if (bgStyleCache['pool-result-bg-image']) {
										cssContent += `.result-page.theme-pool::before { background-image: url("${bgStyleCache['pool-result-bg-image']}") !important; }\n`;
									}
									
									// 同时添加CSS变量定义到根节点
									cssContent += `:root { ${dynamicStyles} }\n`;
									
									// 转义双引号和反斜杠等字符，避免evalJS执行时出错
									const escapedCss = cssContent.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
									
									// 使用evalJS注入样式表
									const jsCode = `
										try {
											// 创建或获取样式元素
											var styleId = 'background-image-styles';
											var styleEl = document.getElementById(styleId);
											
											if (!styleEl) {
												// 如果样式元素不存在，则创建
												styleEl = document.createElement('style');
												styleEl.id = styleId;
												styleEl.type = 'text/css';
												document.head.appendChild(styleEl);
												console.log('创建了新的样式表元素');
											}
											
											// 设置样式内容
											styleEl.textContent = "${escapedCss}";
											console.log('已注入背景图片样式表 - 样式长度:', ${cssContent.length});
											
											// 额外方法：直接应用背景图到现有元素
											function applyBackgrounds() {
												var selectors = {
													'home-bg-image': '.home-container::before',
													'option-input-bg-image': '.option-page::before',
													'theme-select-bg-image': '.theme-select-page::before',
													'history-bg-image': '.history-page::before',
													'history-detail-bg-image': '.detail-page::before',
													'capsule-animation-bg-image': '.animation-page.theme-capsule::before',
													'divine-animation-bg-image': '.animation-page.theme-divine::before',
													'wheel-animation-bg-image': '.animation-page.theme-wheel::before',
													'pool-animation-bg-image': '.animation-page.theme-pool::before',
													'capsule-result-bg-image': '.result-page.theme-capsule::before',
													'divine-result-bg-image': '.result-page.theme-divine::before',
													'wheel-result-bg-image': '.result-page.theme-wheel::before',
													'pool-result-bg-image': '.result-page.theme-pool::before'
												};
												
												// 尝试直接应用背景到页面上已有的元素
												for (var key in selectors) {
													try {
														var elements = document.querySelectorAll(selectors[key].split('::before')[0]);
														if (elements && elements.length > 0) {
															for (var i = 0; i < elements.length; i++) {
																// 添加伪元素的父容器需要设置为相对定位
																elements[i].style.position = 'relative';
																console.log('找到元素应用背景:', selectors[key]);
															}
														}
													} catch (e) {
														console.error('应用背景到元素失败:', e);
													}
												}
											}
											
											// 立即尝试应用一次
											applyBackgrounds();
											
											// 在页面加载完成后再次尝试应用
											window.addEventListener('DOMContentLoaded', applyBackgrounds);
											window.addEventListener('load', applyBackgrounds);
										} catch(e) {
											console.error('应用背景样式失败: ' + e.message);
										}
									`;
									
									// 执行脚本
									currentWebview.evalJS(jsCode);
									console.log('已执行样式注入脚本, CSS长度:', cssContent.length);
								} catch (e) {
									console.error('执行evalJS时出错:', e);
								}
							}
						}
						
						console.log('背景图片动态样式已生成');
					}
				} catch (error) {
					console.error('应用背景图片失败:', error);
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	/* 全局共享样式 */
	@import './uni.scss';

	/* 背景图片CSS变量，默认为none，以下为实际使用的路径 */
	:root {
		--home-bg-image: url('/static/images/backgrounds/home_bg.png');
		--option-input-bg-image: url('/static/images/backgrounds/option_input_bg.png');
		--theme-select-bg-image: url('/static/images/backgrounds/theme_select_bg.png');
		--history-bg-image: url('/static/images/backgrounds/history_bg.png');
		--history-detail-bg-image: url('/static/images/backgrounds/history_detail_bg.png');
		--capsule-animation-bg-image: url('/static/images/backgrounds/capsule_animation_bg.png');
		--divine-animation-bg-image: url('/static/images/backgrounds/divine_animation_bg.png');
		--wheel-animation-bg-image: url('/static/images/backgrounds/wheel_animation_bg.png');
		--pool-animation-bg-image: url('/static/images/backgrounds/pool_animation_bg.png');
		--capsule-result-bg-image: url('/static/images/backgrounds/capsule_result_bg.png');
		--divine-result-bg-image: url('/static/images/backgrounds/divine_result_bg.png');
		--wheel-result-bg-image: url('/static/images/backgrounds/wheel_result_bg.png');
		--pool-result-bg-image: url('/static/images/backgrounds/pool_result_bg.png');
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
