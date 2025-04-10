<template>
	<view class="settings-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @tap="goBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="navbar-title">设置</view>
			<view class="navbar-right">
				<text class="iconfont icon-help" @tap="showHelp"></text>
			</view>
		</view>
		
		<!-- 设置列表 -->
		<view class="settings-list">
			<!-- 用户体验 -->
			<view class="settings-group">
				<view class="group-title">用户体验</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-animation"></text>
						<text>动画效果</text>
					</view>
					<switch 
						:checked="settings.enableAnimation" 
						@change="toggleSetting('enableAnimation')"
						color="#007aff"
					/>
				</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-vibrate"></text>
						<text>振动反馈</text>
					</view>
					<switch 
						:checked="settings.enableVibration" 
						@change="toggleSetting('enableVibration')"
						color="#007aff"
					/>
				</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-sound"></text>
						<text>声音效果</text>
					</view>
					<switch 
						:checked="settings.enableSound" 
						@change="toggleSetting('enableSound')"
						color="#007aff"
					/>
				</view>
			</view>
			
			<!-- 决策引擎 -->
			<view class="settings-group">
				<view class="group-title">决策引擎</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-sensor"></text>
						<text>使用设备传感器增强随机性</text>
					</view>
					<switch 
						:checked="settings.useSensorData" 
						@change="toggleSetting('useSensorData')"
						color="#007aff"
					/>
				</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-history"></text>
						<text>历史记录数量限制</text>
					</view>
					<picker 
						:value="limitOptions.indexOf(settings.historyLimit.toString())" 
						:range="limitOptions"
						@change="onHistoryLimitChange"
					>
						<view class="picker-value">
							{{ settings.historyLimit }} 条
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</picker>
				</view>
			</view>
			
			<!-- 主题相关 -->
			<view class="settings-group">
				<view class="group-title">主题设置</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-theme"></text>
						<text>默认主题</text>
					</view>
					<picker 
						:value="getThemeIndex(settings.defaultTheme)" 
						:range="themeNames"
						@change="onDefaultThemeChange"
					>
						<view class="picker-value">
							{{ getThemeName(settings.defaultTheme) }}
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</picker>
				</view>
				
				<view class="setting-item">
					<view class="setting-label">
						<text class="iconfont icon-random"></text>
						<text>随机推荐主题</text>
					</view>
					<switch 
						:checked="settings.enableRandomTheme" 
						@change="toggleSetting('enableRandomTheme')"
						color="#007aff"
					/>
				</view>
			</view>
			
			<!-- 数据管理 -->
			<view class="settings-group">
				<view class="group-title">数据管理</view>
				
				<view class="setting-item" @tap="clearHistory">
					<view class="setting-label">
						<text class="iconfont icon-clear"></text>
						<text>清空历史记录</text>
					</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				
				<view class="setting-item" @tap="resetSettings">
					<view class="setting-label">
						<text class="iconfont icon-reset"></text>
						<text>恢复默认设置</text>
					</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				
				<view class="setting-item" @tap="exportData">
					<view class="setting-label">
						<text class="iconfont icon-export"></text>
						<text>导出所有数据</text>
					</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			
			<!-- 关于 -->
			<view class="settings-group">
				<view class="group-title">关于应用</view>
				
				<view class="setting-item" @tap="gotoAbout">
					<view class="setting-label">
						<text class="iconfont icon-info"></text>
						<text>关于决策魔方</text>
					</view>
					<text>v1.0.0</text>
				</view>
				
				<view class="setting-item" @tap="gotoPrivacy">
					<view class="setting-label">
						<text class="iconfont icon-privacy"></text>
						<text>隐私政策</text>
					</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				
				<view class="setting-item" @tap="feedback">
					<view class="setting-label">
						<text class="iconfont icon-feedback"></text>
						<text>反馈与建议</text>
					</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="footer-info">
			<text>决策魔方 v1.0.0</text>
			<text>© 2024 决策魔方团队</text>
		</view>
	</view>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getSettings, saveSettings, clearHistory } from '@/utils/storage';

export default {
	setup() {
		const store = useStore();
		
		// 设置数据
		const settings = reactive({
			enableAnimation: true,
			enableVibration: true,
			enableSound: false,
			useSensorData: true,
			historyLimit: 100,
			defaultTheme: 'capsule',
			enableRandomTheme: true
		});
		
		// 历史记录限制选项
		const limitOptions = ['10', '50', '100', '200', '500', '无限制'];
		
		// 主题选项
		const themes = [
			{ id: 'capsule', name: '命运胶囊' },
			{ id: 'divine', name: '神选时刻' },
			{ id: 'wheel', name: '天机轮' },
			{ id: 'pool', name: '气运池' }
		];
		
		const themeNames = themes.map(theme => theme.name);
		
		// 获取主题索引
		const getThemeIndex = (themeId) => {
			const index = themes.findIndex(item => item.id === themeId);
			return index >= 0 ? index : 0;
		};
		
		// 获取主题名称
		const getThemeName = (themeId) => {
			const theme = themes.find(item => item.id === themeId);
			return theme ? theme.name : themeId;
		};
		
		// 初始化
		onMounted(async () => {
			// 加载设置
			const savedSettings = await getSettings();
			Object.assign(settings, savedSettings);
			
			// 更新Vuex中的设置
			store.commit('INIT_SETTINGS', settings);
		});
		
		// 切换开关设置
		const toggleSetting = (key) => {
			settings[key] = !settings[key];
			saveSetting();
		};
		
		// 更改历史记录限制
		const onHistoryLimitChange = (e) => {
			const value = limitOptions[e.detail.value];
			settings.historyLimit = value === '无限制' ? -1 : parseInt(value);
			saveSetting();
		};
		
		// 更改默认主题
		const onDefaultThemeChange = (e) => {
			const index = e.detail.value;
			settings.defaultTheme = themes[index].id;
			saveSetting();
		};
		
		// 保存设置
		const saveSetting = async () => {
			try {
				await saveSettings(settings);
				store.commit('INIT_SETTINGS', settings);
				showToast('设置已保存');
			} catch (error) {
				console.error('保存设置失败', error);
				showToast('保存设置失败', 'none');
			}
		};
		
		// 清空历史记录
		const clearHistory = () => {
			uni.showModal({
				title: '清空确认',
				content: '确定要清空所有历史记录吗？此操作不可恢复！',
				success: async (res) => {
					if (res.confirm) {
						try {
							await clearHistory();
							showToast('历史记录已清空');
						} catch (error) {
							console.error('清空历史记录失败', error);
							showToast('清空历史记录失败', 'none');
						}
					}
				}
			});
		};
		
		// 重置设置
		const resetSettings = () => {
			uni.showModal({
				title: '重置确认',
				content: '确定要将所有设置恢复为默认值吗？',
				success: async (res) => {
					if (res.confirm) {
						Object.assign(settings, {
							enableAnimation: true,
							enableVibration: true,
							enableSound: false,
							useSensorData: true,
							historyLimit: 100,
							defaultTheme: 'capsule',
							enableRandomTheme: true
						});
						
						await saveSetting();
						showToast('设置已重置');
					}
				}
			});
		};
		
		// 导出数据
		const exportData = () => {
			showToast('导出功能开发中', 'none');
		};
		
		// 显示帮助
		const showHelp = () => {
			uni.showModal({
				title: '设置帮助',
				content: '在这里您可以自定义决策魔方的各项功能和外观。设置会自动保存并在下次启动应用时生效。',
				showCancel: false
			});
		};
		
		// 前往关于页面
		const gotoAbout = () => {
			showToast('关于页面开发中', 'none');
		};
		
		// 前往隐私政策
		const gotoPrivacy = () => {
			showToast('隐私政策页面开发中', 'none');
		};
		
		// 反馈与建议
		const feedback = () => {
			uni.showActionSheet({
				itemList: ['发送邮件', '在应用商店评价'],
				success: (res) => {
					if (res.tapIndex === 0) {
						// 发送邮件
						uni.showToast({
							title: '邮件功能开发中',
							icon: 'none'
						});
					} else if (res.tapIndex === 1) {
						// 商店评价
						uni.showToast({
							title: '跳转应用商店功能开发中',
							icon: 'none'
						});
					}
				}
			});
		};
		
		// 返回上一页
		const goBack = () => {
			uni.navigateBack();
		};
		
		// 显示提示
		const showToast = (title, icon = 'success') => {
			uni.showToast({
				title,
				icon
			});
		};
		
		return {
			settings,
			limitOptions,
			themeNames,
			getThemeIndex,
			getThemeName,
			toggleSetting,
			onHistoryLimitChange,
			onDefaultThemeChange,
			clearHistory,
			resetSettings,
			exportData,
			showHelp,
			gotoAbout,
			gotoPrivacy,
			feedback,
			goBack
		};
	}
};
</script>

<style lang="scss">
.settings-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 30rpx;
}

.navbar {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding-top: var(--status-bar-height);
	padding-left: 30rpx;
	padding-right: 30rpx;
	background-color: #ffffff;
	
	.navbar-left, .navbar-right {
		width: 88rpx;
		height: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 44rpx;
	}
	
	.navbar-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
	}
}

.settings-list {
	padding: 20rpx;
}

.settings-group {
	margin-bottom: 20rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
	overflow: hidden;
	
	.group-title {
		padding: 20rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #666666;
		background-color: #f5f5f5;
	}
	
	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.setting-label {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			
			.iconfont {
				font-size: 40rpx;
				margin-right: 20rpx;
				color: #007aff;
			}
		}
		
		.picker-value {
			color: #666666;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			
			.iconfont {
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #999999;
			}
		}
		
		.iconfont.icon-arrow-right {
			font-size: 28rpx;
			color: #999999;
		}
	}
}

.footer-info {
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	text {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 10rpx;
	}
}
</style> 