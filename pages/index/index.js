// pages/index/index.js
const app = getApp()
var numsSample = [1, 2, 3, 4, 5, 6, 7, 8, 0]
var timer = {}
var palying = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    listFriends:[],
    mediaWidth: "330",
    boxWidth: "121",
    nums: [1, 2, 3, 4, 5, 6, 7, 8],
    isOver: false,
    showTime: 0,
    modalFlag: true,
    isMaxScore: false,
    maxScore: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData()
  },

  /**初始化页面数据 */
  initData: function() {
    var widowWidth = wx.getSystemInfoSync().windowWidth
    var tem = Math.floor((widowWidth - 40) / 3)
    // 初始化尺寸
    this.setData({
      mediaWidth: tem * 3,
      boxWidth: tem - 2
    })
    // 初始化数组，并打乱数组顺序
    this.disOrderArray([1, 2, 3, 4, 5, 6, 7, 8])
  },

  /**打乱数组顺序 */
  disOrderArray: function(arr) {
    // 用于零时存储打乱顺序的数组
    var disOrderArray = [];
    // 存储生成的随机数
    var randomNum = 0;
    // 利用循环 将原数组的元素依次存储到临时数组中国年
    for (var i = 0; arr.length > 0; i++) {
      // 随机生成小标
      randomNum = Math.floor(Math.random() * arr.length + 1) - 1;
      // 将随机生成的小标对应的元素添加到临时数组中
      disOrderArray.push(arr[randomNum])
      // 删除原数组中对应元素
      arr.splice(randomNum, 1)
    }
    // 数组的序列数为计数，不可复原，将第一个和第二个交换位置
    if (this.inverseNum(disOrderArray) % 2 === 1) {
      var swap = disOrderArray[0]
      disOrderArray[0] = disOrderArray[1]
      disOrderArray[1] = swap
    }
    // 游戏开始时，右下角默认为空白格
    disOrderArray.push(0)
    this.setData({
      nums: disOrderArray
    })
  },
  // 计算打乱后的随机数组的 逆序数 只有逆序数为偶数时，才能复原
  inverseNum: function(arr) {
    var n = 0
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i; j < arr.length - 1; j++) {
        if (arr[i] > arr[j + 1]) {
          n++
        }
      }
    }
    return n
  },
  /**点击切换 */
  clickSquare: function(obj) {
    // 不在游戏中时，点击无反应
    if (!palying) {
      return
    }
    // 获取点击方块的对应data-id
    var iSquare = obj.target.dataset.id
    // 临时存储元素
    var tem = '';
    var this_ = this
    // 点击的方块上方为空白格
    if (iSquare - 3 >= 0 && this.data.nums[iSquare - 3] === 0) {
      tem = this.data.nums[iSquare - 3]
      this.data.nums[iSquare - 3] = this.data.nums[iSquare]
      this.data.nums[iSquare] = tem
      this.setData({
        nums: this.data.nums
      })
      // 点击的方块上方为空白格
    } else if (iSquare * 1 + 3 <= 8 && this.data.nums[iSquare * 1 + 3] === 0) {
      tem = this.data.nums[iSquare * 1 + 3]
      this.data.nums[iSquare * 1 + 3] = this.data.nums[iSquare]
      this.data.nums[iSquare] = tem
      this.setData({
        nums: this.data.nums
      })
      // 点击的方块上方为空白格
    } else if (iSquare - 1 >= 0 && this.data.nums[iSquare - 1] === 0) {
      tem = this.data.nums[iSquare - 1]
      this.data.nums[iSquare - 1] = this.data.nums[iSquare]
      this.data.nums[iSquare] = tem
      this.setData({
        nums: this.data.nums
      })
      // 点击的方块上方为空白格
    } else if (iSquare * 1 + 1 <= 8 && this.data.nums[iSquare * 1 + 1] === 0) {
      tem = this.data.nums[iSquare * 1 + 1]
      this.data.nums[iSquare * 1 + 1] = this.data.nums[iSquare]
      this.data.nums[iSquare] = tem
      this.setData({
        nums: this.data.nums
      })
    }
    // 每次点击移动一个方块的顺序后都要判断游戏是否已经结束
    this.gameOver()
  },
  /**判断游戏是否结束 */
  gameOver: function() {
    // 当数组中的数顺序为 numsSample 的顺序时，即为游戏结束
    if (this.data.nums.toString() === numsSample.toString()) {
      // console.log("游戏结束")
      this.setData({
        isOver: true
      })
      // 游戏结束，结束计时，清楚定时器
      clearInterval(timer)
      // 判断本次是否打破纪录
      this.isBreakRecord()
      // 获取用户信息
      this.getFriends()
      // 弹出模态框，显示成绩
      this.showScore()
    }
  },
  // 拉去好友列表
  getFriends:function(){
    if(app.globalData.userInfo){
      this.setData({
        userName: app.globalData.userInfo.nickName
      })
    }else{
      app.userInfoReadyCallback = res =>{
        this.setData({
          userName: res.userInfo.nickName
        })
      }
    }
  },
  /**弹出模态框显示 成绩 */
  showScore: function() {
    var this_ = this
    wx.getStorage({
      key: 'jigsaw-maxscore',
      success: function(res) {
        this_.setData({
          modalFlag: false,
          maxScore: res.data
        })
      },
      fail: function() {
        console.log('fail')
      }
    })
  },

  /**开始游戏 */
  startGame: function() {
    // 开始游戏
    palying = true
    this.setData({
      isMaxScore: false
    })
    var this_ = this
    // 先直接加1s，避免给人反应迟钝的感觉
    this_.setData({
      showTime: 1
    })
    // 利用定时器，每隔一秒加1，实现计时
    timer = setInterval(function() {
      this_.setData({
        showTime: this_.data.showTime + 1
      })
      if (this_.data.showTime > 1200) {
        clearInterval(timer)
      }
    }, 1000)
  },

  /**结束游戏 */
  endGame: function() {
    palying = false
    // 初始化数组，并打乱数组顺序
    this.disOrderArray([1, 2, 3, 4, 5, 6, 7, 8])
    // 清除定时器
    clearInterval(timer)
    // 页面显示归0
    this.setData({
      showTime: 0
    })
  },
  /**如果这个分数为历史最高分，则更新历史最高分 */
  isBreakRecord: function() {
    console.log('333')
    var score = this.data.showTime
    var this_ = this
    wx.getStorage({
      key: 'jigsaw-maxscore',
      success: function(res) {
        // 时间越小，成绩越好
        if (score < res.data) {
          this_.saveScore(score)
        }
      },
      // 还没有记录，第一次玩，本次即为最高记录
      fail: function() {
        this_.saveScore(score)
      },
    })
  },

  // 存储分数
  saveScore: function(score) {
    // 获取微信 用户openid
    wx.getUserInfo({
      
    })
    wx.request({
      url: 'http://localhost:8080/saveScore',
      data: {
        'WXName': this.userName,
        'WXNum': '222',
        'score': score
      },
      success: function(res) {
        wx.setStorage({
          key: 'jigsaw-maxscore',
          data: score,
        })
      }
    })
    this.setData({
      isMaxScore: true
    })
  },

  // 好友列表
  listFrieds: function() {

  },

  //再来一把
  modalOk: function() {
    this.setData({
      modalFlag: true
    })
  },
  // 不玩了
  modalCancel: function() {
    this.setData({
      modalFlag: true
    })
    wx.navigateBack({
      delta: 2
    })
  },
  // 退出小程序
  onUnload: function() {
    // 清楚定时器
    clearInterval(timer)
  }
})