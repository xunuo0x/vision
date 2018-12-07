//index.js
//获取应用实例
import * as event from '../../utils/event.js'
const app = getApp()
const touchStarting = {
  clientX: 0,
  clientY: 0
}
const windowHeight = wx.getSystemInfoSync().windowHeight;

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
    playState: true,
    animationShow: true,
    videos: [
      {
        videoUrl: "http://v.kandian.qq.com/shg_753067649_1047_04b4dd8dc4b646e6a88aaa66dad2vide.f20.mp4?dis_k=a613a086491dc11011c995dfed9800e1&dis_t=1544012470",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-43EA9FAEE70685E641983C69711ECD58_vsmcut/600"
      },
      {
        videoUrl: "http://v.kd1.qq.com/shg_321_1116_5X00000000000000000000000002Dxan.f822.mp4?dis_k=c4d1d9d7ea4238b0ecb8484fb46111a6&dis_t=1544187088",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-5F65D00D480EB888EEF0E4451E8EEED1_vsmcut/600"
      },
      {
        videoUrl: "http://v.kd1.qq.com/shg_321_1116_5X0000000000000000000000000D4Vzo.f822.mp4?dis_k=d327905a47374786078f81fe4e830724&dis_t=1544185708",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-40401D133F806549B490F75821C0AEDC_vsmcut/600"
      }
    ],
    srcList: [
      "http://v.kandian.qq.com/shg_753067649_1047_04b4dd8dc4b646e6a88aaa66dad2vide.f20.mp4?dis_k=a613a086491dc11011c995dfed9800e1&dis_t=1544012470",
      "http://v.kd1.qq.com/shg_321_1116_6X000000000000000000000000r5CNnE.f822.mp4?dis_k=6f0206b7c0c286a102fb43f494bd4331&dis_t=1544152873",
      "http://v.kd1.qq.com/shg_321_1116_6X000000000000000000000000tjvfuC.f822.mp4?dis_k=92fb699912070692e3420c62f8c49f83&dis_t=1544153942"
    ],
    videoIndex: 0,
    objectFit: "contain"
  },
  bindplay: function() {
  },
  onLoad: function () {
    this.vvideo = wx.createVideoContext("kdvideo", this)
    this.videoChange = throttle(this.touchMoveHandler, 200)
    // 绑定updateVideoIndex事件，更新当前播放视频index
    event.on('updateVideoIndex', this, function (index) {
      console.log('event updateVideoIndex:', index)
      setTimeout(() => {
        this.animation.translateY(0).step()
        this.setData({
          animationShow: true,
          animation: this.animation.export(),
          animationImage1: '',
          animationImage2: '',
          animationPre: false
        })
      }, 800)
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 500,
      transformOrigin: '0 0 0'
    })
  },
  videoPlay: function(index) {
    this.vvideo.play()
    let playState = !this.data.playState
    if (playState === true) {
      vvideo.play()
    } else {
      vvideo.pause()
    }
    this.setData({
      playState: playState
    })
  },
  changePlayStatus() {
    let playState = !this.data.playState
    if (playState) {
      this.vvideo.play()
    } else {
      this.vvideo.pause()
    }
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
    // this.videoChange(e)
  },
  touchEndHandler(e) {
    if (index === 0 || index === this.data.videos.length - 1) {
      return
    }
    let deltaY = e.changedTouches[0].clientY - touchStarting.clientY
    console.log('deltaY ',deltaY)

    let index = this.data.videoIndex
    if (deltaY > 100 && index !== 0) {
      // 更早地设置 animationShow
      this.setData({
        animationPre: true,
        animationShow: false
      }, () => {
        console.log('-1 切换')
        this.createAnimation(1, index).then((res) => {
          this.animation.translateY(res.direction * windowHeight).step()
          this.setData({
            animation: this.animation.export()
          })
          event.emit('updateVideoIndex', res.index)
        })
      })
    } else if (deltaY < -100 && index !== (this.data.srcList.length - 1)) {
      this.setData({
        animationShow: false
      })
      console.log('+1 切换')
      this.createAnimation(-1, index).then((res) => {
        console.log(res.direction)
        this.animation.translateY(res.direction * windowHeight).step()
        this.setData({
          animation: this.animation.export()
        })
        event.emit('updateVideoIndex', res.index)
      })
    }
  },
  touchEnd(e) {
    console.log('------touchEnd------')
    this.touchEndHandler(e)
  },
  touchCancel(e) {
    console.log('------touchCancel------')
    console.log(e)
  },
  createAnimation(direction, index) {
    // direction为-1，向上滑动，animationImage1为(index)的poster，animationImage2为(index+1)的poster
    // direction为1，向下滑动，animationImage1为(index-1)的poster，animationImage2为(index)的poster
    let videos = this.data.videos
    let animationImage1 = ''
    let animationImage2 = ''
    console.log('direction ', direction)
    console.log('index ', index)
    if (direction > 0) {
      // 向下滑
      animationImage1 = videos[index - 1].poster
      animationImage2 = videos[index].poster
      index -= 1
    } else {
      // 向上滑
      animationImage1 = videos[index].poster
      animationImage2 = videos[index + 1].poster
      index += 1
    }
    this.setData({
      animationImage1: animationImage1,
      animationImage2: animationImage2,
      videoIndex: index
    })
    return Promise.resolve({
      index: index,
      direction: direction
    })
  }
})
function throttle (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}