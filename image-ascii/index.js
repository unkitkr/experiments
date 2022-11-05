class videoStreamCanvasComponent {
  canvasVideoHeight
  canvasVideoWidth
  constructor(videoHeight = 180, videoWidth = 360) {
    this.canvasVideoWidth = videoWidth
    this.canvasVideoHeight = videoHeight
  }
  canvas = document.createElement('canvas')
  context = this.canvas.getContext('2d', { willReadFrequently: true })

  getCanvasResized = () => {
    this.canvas.width = this.canvasVideoWidth
    this.canvas.height = this.canvasVideoHeight
    return {
      canvasElement: this.canvas,
      context: this.context,
    }
  }
}

class videoComponent {
  constraints = {
    audio: false,
    video: true,
  }
  video = document.getElementById('main-video-stream')
  handleVideoElementStartError = (error) => {
    console.log(
      'navigator.MediaDevices.getUserMedia error: ',
      error.message,
      error.name
    )
  }
  handleVideoElementStartSuccess = (stream) => {
    window.stream = stream // make stream available to browser console
    this.video.srcObject = stream
    this.video.onloadedmetadata = () => {
      this.video.play()
    }
  }
  startVideo = () => {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(this.handleVideoElementStartSuccess)
      .catch(this.handleVideoElementStartError)
    return this.video
  }
}

class fontHelper {
  fontString
  fontSize
  fontName
  fontStringLength
  constructor(fontName) {
    this.fontName = fontName
    this.getFont()
  }
  fonts = {
    randomized:
      '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~i!lI;:,"^`".\xa0',
    randomizedSetTwo: `¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,'.\`\xa0`,
  }
  getFont = () => {
    this.fontString = this.fonts[this.fontName]
    this.fontStringLength = this.fonts[this.fontName].length
  }

  bestChar = (val) =>
    this.fontString[Math.ceil(((this.fontStringLength - 1) * val) / 255)]
}

const starterFunction = ({
  video,
  context,
  streamFontSize,
  streamFont,
  streamSize,
}) => {
  const fontHelpers = new fontHelper(streamFont)
  const p = document.getElementById('text-stream')
  p.style.fontSize = streamFontSize
  video.addEventListener('play', function () {
    setInterval(() => {
      context.drawImage(video, 0, 0, streamSize.width, streamSize.height)
      const data = context.getImageData(
        0,
        0,
        streamSize.width,
        streamSize.height
      )
      const arr = []
      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i]
        const g = data.data[i + 1]
        const b = data.data[i + 2]
        const grey = 0.21 * r + 0.72 * g + 0.07 * b
        data.data[i + 1] = data.data[i] = data.data[i + 2] = grey
        arr.push(grey)
      }
      let text = ''

      for (let i = 0; i < arr.length; i++) {
        const charVal = fontHelpers.bestChar(arr[i])
        text += charVal
        if ((i + 1) % data.width === 0) {
          text += '\n'
        }
      }
      p.innerHTML = text
    }, 1)
  })
}

const video = new videoComponent().startVideo()
const cv = new videoStreamCanvasComponent().getCanvasResized()
starterFunction({
  video,
  context: cv.context,
  streamFontSize: '6px',
  streamFont: 'randomizedSetTwo',
  streamSize: {
    width: 280,
    height: 80,
  },
})
