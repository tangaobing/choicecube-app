/**
 * 决策引擎
 * 提供随机选择和决策算法
 */

/**
 * Fisher-Yates 洗牌算法
 * @param {Array} array 需要打乱的数组
 * @returns {Array} 打乱后的数组
 */
export function shuffleArray(array) {
  const result = [...array];
  let currentIndex = result.length;
  let randomIndex;
  
  // 当还剩余元素未洗牌时
  while (currentIndex !== 0) {
    // 选择一个剩余元素
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // 与当前元素交换
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }
  
  return result;
}

/**
 * 根据种子生成伪随机数
 * @param {number} seed 随机种子
 * @returns {function} 返回生成随机数的函数
 */
export function seedRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * 从选项中随机选择一个结果
 * @param {Array} options 选项数组
 * @param {number} [seed] 可选的随机种子
 * @returns {string} 选中的选项
 */
export function randomSelect(options, seed = null) {
  if (!options || options.length === 0) {
    return null;
  }
  
  let random;
  
  // 如果提供了种子，使用种子随机数生成器
  if (seed !== null) {
    random = seedRandom(seed);
    const index = Math.floor(random() * options.length);
    return options[index];
  } else {
    // 否则使用标准Math.random
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }
}

/**
 * 获取当前时间戳作为随机种子
 * @returns {number} 时间戳
 */
export function getTimeSeed() {
  return Date.now();
}

/**
 * 使用设备传感器数据增强随机性
 * @returns {Promise<number>} 随机种子值
 */
export async function enhanceRandomness() {
  let seed = getTimeSeed();

  return new Promise((resolve) => {
      let timeoutId = null;
      let listenerRegistered = false; // 标志位，确保清理只执行一次

      // 定义回调函数
      const accelerometerCallback = (res) => {
          // 如果监听器已被移除或处理过，则不再执行
          if (!listenerRegistered) return;
          listenerRegistered = false; // 标记为已处理

          clearTimeout(timeoutId); // 清除超时定时器
          uni.offAccelerometerChange(accelerometerCallback); // 移除当前监听器
          uni.stopAccelerometer({ // 停止监听
              fail: (err) => console.error('Failed to stop accelerometer:', err)
          });

          // 使用加速度数据调整种子
          seed += (res.x * 1000000) + (res.y * 10000) + (res.z * 100);
          console.log('Accelerometer data received, enhanced seed:', seed);
          resolve(seed); // 解析Promise，返回增强后的种子
      };

      // 注册监听器
      uni.onAccelerometerChange(accelerometerCallback);
      listenerRegistered = true; // 标记监听器已注册

      // 启动加速度计
      uni.startAccelerometer({
          interval: 'game',
          success: () => {
              console.log('Accelerometer started successfully.');
              // 成功启动后设置超时
              timeoutId = setTimeout(() => {
                  // 如果超时触发时监听器已被处理，则不再执行
                  if (!listenerRegistered) return;
                  listenerRegistered = false; // 标记为已处理

                  console.log('Accelerometer timeout, using default time seed.');
                  uni.offAccelerometerChange(accelerometerCallback); // 移除监听器
                  uni.stopAccelerometer({ // 停止监听
                      fail: (err) => console.error('Failed to stop accelerometer on timeout:', err)
                  });
                  resolve(seed); // 解析Promise，返回原始时间种子
              }, 500); // 设置500毫秒超时
          },
          fail: (err) => {
              console.error('Failed to start accelerometer:', err);
              // 启动失败也需要清理可能已注册的监听器
              if (listenerRegistered) {
                  listenerRegistered = false;
                  uni.offAccelerometerChange(accelerometerCallback);
              }
              resolve(seed); // 解析Promise，返回原始时间种子
          }
      });
  }).catch(e => {
      // 捕获 Promise 构造函数或执行中的潜在错误
      console.error("Error within enhanceRandomness promise:", e);
      // 尝试进行最后的清理
      try {
          uni.stopAccelerometer({ fail: () => {} });
          uni.offAccelerometerChange(()=>{}); // 尝试移除任何可能的监听器
      } catch (cleanupError) {
          console.error("Error during enhanceRandomness cleanup:", cleanupError);
      }
      return seed; // 返回默认种子作为后备
  });
}

/**
 * 执行决策过程
 * @param {Array} options 选项数组
 * @param {boolean} useEnhancedRandomness 是否使用增强随机性
 * @returns {Promise<{result: string, seed: number}>} 决策结果和使用的种子
 */
export async function makeDecision(options, useEnhancedRandomness = false) {
  if (!options || options.length === 0) {
    return { result: null, seed: 0 };
  }
  
  let seed;
  
  if (useEnhancedRandomness) {
    seed = await enhanceRandomness();
  } else {
    seed = getTimeSeed();
  }
  
  const result = randomSelect(options, seed);
  
  return {
    result,
    seed
  };
}

/**
 * 根据相同的种子重现决策结果
 * @param {Array} options 选项数组
 * @param {number} seed 随机种子
 * @returns {string} 重现的决策结果
 */
export function replayDecision(options, seed) {
  return randomSelect(options, seed);
}

export default {
  shuffleArray,
  seedRandom,
  randomSelect,
  getTimeSeed,
  enhanceRandomness,
  makeDecision,
  replayDecision
}; 