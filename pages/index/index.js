//index.js
//获取应用实例
const app = getApp()
const touchStarting = {
  clientX: 0,
  clientY: 0
}
const touchState = {
  touchEnd: false
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    controls: false,
    showFullscreenBtn: false,
    showPlayBtn: false,
    showFullscreenBtn: false,
    showCenterPlayBtn: false,
    enableProgressGesture: false,
    showProgress: false,
    playState: false,
    srcList: [
      "http://v.kandian.qq.com/shg_753067649_1047_04b4dd8dc4b646e6a88aaa66dad2vide.f20.mp4?dis_k=a613a086491dc11011c995dfed9800e1&dis_t=1544012470",
      "http://v.kandian.qq.com/shg_843086474_1047_23bf79851f9a4c7f9f405a9519f9vide.f20.mp4?dis_k=e1e62116af0b871e17522831bdcec25f&dis_t=1544011923",
      "http://v.kd1.qq.com/shg_321_1116_5X00000000000000000000000002Dxan.f822.mp4?dis_k=f0b289a306c49555caf2b1934355ce31&dis_t=1544013599"
    ],
    videoIndex: 0,
    objectFit: "contain"
  },
  bindplay: function() {
    this.setData({
      playState: true
    })
    touchState.touchEnd = false
  },
  onLoad: function () {
  },
  videoPlay: function() {
    let vvideo = wx.createVideoContext("kdvideo", this)
    let playState = !this.data.playState
    if (playState === true) {
      vvideo.play()
    } else {
      vvideo.pause()
    }
    touchState.touchEnd = false
    this.setData({
      playState: playState
    })
  },
  touchStart(e) {
    console.log('------touchStart------')
    touchStarting.clientX = e.touches[0].clientX
    touchStarting.clientY = e.touches[0].clientY
    console.log(touchStarting)
  },
  touchMove(e) {
    if (touchState.touchEnd) {
      return
    }
    console.log('------touchMove------')
    console.log(e)
    let deltaY = e.touches[0].clientY - touchStarting.clientY
    console.log(deltaY)
    let index = this.data.videoIndex
    if (deltaY > 100) {
      console.log('-1 切换')
      index -= 1
      this.setData({
        videoIndex: index
      })
      touchState.touchEnd = true
    } else if (deltaY < -100) {
      console.log('+1 切换')
      index += 1
      this.setData({
        videoIndex: index
      })
      touchState.touchEnd = true
    }
    console.log('index ', index)
  },
  touchEnd(e) {
    console.log('------touchEnd------')
    console.log(e)
  },
  touchCancel(e) {
    console.log('------touchCancel------')
    console.log(e)
  }
})
