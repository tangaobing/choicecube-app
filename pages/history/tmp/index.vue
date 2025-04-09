<template>
	<view class="history-page">
		<view class="navbar">
			<view class="navbar-left" @tap="goBack">
				<text>返回</text>
			</view>
			<view class="navbar-title">历史记录</view>
		</view>
		
		<view class="content">
			<text>历史记录页面</text>
			
			<view v-if="historyList.length === 0" class="empty">
				<text>暂无历史记录</text>
				<button @tap="startNewDecision">开始第一次决策</button>
			</view>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		const historyList = ref([]);
		
		const goBack = () => {
			uni.navigateBack();
		};
		
		const startNewDecision = () => {
			uni.navigateTo({
				url: '/pages/option-input/index'
			});
		};
		
		return {
			historyList,
			goBack,
			startNewDecision
		};
	}
};
</script>

<style>
.history-page {
	min-height: 100vh;
	padding: 20px;
}

.navbar {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}

.navbar-left {
	width: 60px;
}

.navbar-title {
	flex: 1;
	text-align: center;
	font-weight: bold;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px 0;
}

.empty {
	margin-top: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.empty button {
	margin-top: 20px;
	background-color: #3f7ef2;
	color: white;
	padding: 10px 20px;
	border-radius: 5px;
}
</style> 