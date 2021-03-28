(function (window) {
  var l = 42, // 滑块边长42 const l = 42,
    r = 10, // 滑块半径10
    w = 350, // canvas宽度350,411 240
    h = 50, // canvas高度50,411 30
    PI = Math.PI
	var viewportWidth = document.documentElement.clientWidth;//屏幕宽度
	if(viewportWidth<=520 && viewportWidth>=410){//测试
		w=280;
		h=30;	
	}else if(viewportWidth<410 && viewportWidth>=360){//测试
		w=230;
		h=30;	
	}else if(viewportWidth<360 && viewportWidth>=320){//测试
		w=190;
		h=30;	
	}else if(viewportWidth<320){//测试
		w=100;
		h=30;	
	}
  const L = l + r * 2 // 滑块实际边长

  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  function createCanvas(width, height) {
    const canvas = createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  function createImg(onload) {
    const img = createElement('img')
    img.crossOrigin = "Anonymous"
    img.onload = onload
    img.onerror = () => {
      img.src = getRandomImg()
    }
    img.src = getRandomImg()
    return img
  }
  
  function createElement(tagName) {
    return document.createElement(tagName)
  }

  function addClass(tag, className) {
    tag.classList.add(className)
  }

  function removeClass(tag, className) {
    tag.classList.remove(className)
  }
  
  function getRandomImg() {
    return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 100)
	/* return 'https://picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 100) */
  }

  function draw(ctx, operation, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + l / 2, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
    ctx.lineTo(x + l / 2, y)
    ctx.lineTo(x + l, y)
    ctx.lineTo(x + l, y + l / 2)
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
    ctx.lineTo(x + l, y + l / 2)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.lineTo(x, y)
    ctx.fillStyle = '#fff'
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }

  function sum(x, y) {
    return x + y
  }

  function square(x) {
    return x * x
  }

  class jigsaw {
    constructor(el, success, fail) {
      this.el = el
      this.success = success
      this.fail = fail
    }

    init() {
      this.initDOM()
      this.initImg()
      this.draw()
      this.bindEvents()
    }

    initDOM() {
      const canvas = createCanvas(w, h) // 画布
      const block = canvas.cloneNode(true) // 滑块
      const sliderContainer = createElement('div')
      const refreshIcon = createElement('div')
      const sliderMask = createElement('div')
      const slider = createElement('div')
      const sliderIcon = createElement('span')
      const text = createElement('span')
	  
	  //测试
	  //const canvasRight= createElement('div')

      block.className = 'block'
      sliderContainer.className = 'sliderContainer'
      refreshIcon.className = 'refreshIcon'
      sliderMask.className = 'sliderMask'
      slider.className = 'slider'
      sliderIcon.className = 'sliderIcon'
      text.innerHTML = '向右滑动滑块填充拼图'
	  if(viewportWidth<410){//测试
	  		  text.innerHTML = '滑动填充'
	  }
      text.className = 'sliderText'

      const el = this.el
	  /* el.appendChild("<div>") */
      el.appendChild(canvas)
	  //el.appendChild(canvasRight)
      el.appendChild(refreshIcon)
      el.appendChild(block)
      slider.appendChild(sliderIcon)
      sliderMask.appendChild(slider)
      sliderContainer.appendChild(sliderMask)
      sliderContainer.appendChild(text)
      el.appendChild(sliderContainer)

      Object.assign(this, {
        canvas,
        block,
        sliderContainer,
        refreshIcon,
        slider,
        sliderMask,
        sliderIcon,
        text,
        canvasCtx: canvas.getContext('2d'),
        blockCtx: block.getContext('2d')
      })
    }

    initImg() {
      const img = createImg(() => {
        this.canvasCtx.drawImage(img, 0, 0, w, h)
        this.blockCtx.drawImage(img, 0, 0, w, h)
        const y = this.y - r * 2 + 2
        const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, y)
      })
      this.img = img
    }

    draw() {
      // 随机创建滑块的位置
      this.x = getRandomNumberByRange(L + 10, w - (L + 10))
      this.y = getRandomNumberByRange(10 + r * 2, h - (L + 10))
      draw(this.canvasCtx, 'fill', this.x, this.y)
      draw(this.blockCtx, 'clip', this.x, this.y)
    }

    clean() {
      this.canvasCtx.clearRect(0, 0, w, h)
      this.blockCtx.clearRect(0, 0, w, h)
      this.block.width = w
    }

    bindEvents() {
      this.el.onselectstart = () => false
      this.refreshIcon.onclick = () => {
        this.reset()
		var show_s=document.getElementById("show_success")//新加
		show_s.parentNode.removeChild(show_s)
		//getElementsByClassName("sliderMask")
	  }

      let originX, originY, trail = [], isMouseDown = false
	  /* this.slider.addEventListener('click', function (e) {
	    alert("test")
	  }) */
      this.slider.addEventListener('mousedown', function (e) {
		  //alert("e.x:"+e.x)
        originX = e.x, originY = e.y
        isMouseDown = true
      })
      document.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return false
        const moveX = e.x - originX
        const moveY = e.y - originY
        if (moveX < 0 || moveX + 38 >= w) return false
        this.slider.style.left = moveX + 'px'
        var blockLeft = (w - 40 - 20) / (w - 40) * moveX
        this.block.style.left = blockLeft + 'px'

        addClass(this.sliderContainer, 'sliderContainer_active')
        this.sliderMask.style.width = moveX + 'px'
        trail.push(moveY)
      })
      document.addEventListener('mouseup', (e) => {		
        if (!isMouseDown) return false
        isMouseDown = false
        if (e.x == originX) return false
        removeClass(this.sliderContainer, 'sliderContainer_active')
        this.trail = trail
        const {spliced, TuringTest} = this.verify()
        if (spliced) {
          if (TuringTest) {
            addClass(this.sliderContainer, 'sliderContainer_success')
            this.success && this.success()
          } else {
            addClass(this.sliderContainer, 'sliderContainer_fail')
            this.text.innerHTML = '再试一次'
            this.reset()
          }
        } else {
          addClass(this.sliderContainer, 'sliderContainer_fail')
          this.fail && this.fail()
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      })
	  //移动端
	  let touchX, touchY, trail_touch = [], isTouchmove = false
	  this.slider.addEventListener('touchstart', function (e) {
	    //alert("test2"+e.touches[0].clientX)
		touchX = e.touches[0].clientX, touchY = e.touches[0].clientY
		isTouchmove = true
	  })
	  document.addEventListener('touchmove', (e) => {
	    if (!isTouchmove) return false
	    const moveX = e.touches[0].clientX - touchX
	    const moveY = e.touches[0].clientY - touchY
	    if (moveX < 0 || moveX + 38 >= w) return false
	    this.slider.style.left = moveX + 'px'
	    var blockLeft = (w - 40 - 20) / (w - 40) * moveX
	    this.block.style.left = blockLeft + 'px'
	  
	    addClass(this.sliderContainer, 'sliderContainer_active')
	    this.sliderMask.style.width = moveX + 'px'
	    trail_touch.push(moveY)
	  })
	  
	  document.addEventListener('touchend', (e) => {
	    if (!isTouchmove) return false
	    isTouchmove = false
	    //if (e.changedTouches[0].clientX == touchX) return false
		if (e.changedTouches[0].clientX == touchX) return false
	    removeClass(this.sliderContainer, 'sliderContainer_active')
	    this.trail_touch = trail_touch
	    const {spliced, TuringTest} = this.verify_Touch()
	    if (spliced) {
	      if (TuringTest) {
	        addClass(this.sliderContainer, 'sliderContainer_success')
	        this.success && this.success()
	      } else {
	        addClass(this.sliderContainer, 'sliderContainer_fail')
	        this.text.innerHTML = '再试一次'
	        this.reset()
	      }
	    } else {
	      addClass(this.sliderContainer, 'sliderContainer_fail')
	      this.fail && this.fail()
	      setTimeout(() => {
	        this.reset()
	      }, 1000)
	    }
	  })
	  //touchstart touchmove touchend兼容移动端
	  //还有一点要注意的是在PC端获取当前鼠标的坐标是：event.clientX和event.clientY，在移动端获取坐标位置则是：event.touches[0].clientX和event.touches[0].clientY。
		
	}
	
	verify_Touch() {
	  const arr = this.trail_touch // 拖动时y轴的移动距离
	  const average = arr.reduce(sum) / arr.length // 平均值
	  const deviations = arr.map(x => x - average) // 偏差数组
	  const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // 标准差
	  const left = parseInt(this.block.style.left)
	  return {
	    spliced: Math.abs(left - this.x) < 10,
	    TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
	  }
	}
    verify() {
      const arr = this.trail // 拖动时y轴的移动距离
      const average = arr.reduce(sum) / arr.length // 平均值
      const deviations = arr.map(x => x - average) // 偏差数组
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // 标准差
      const left = parseInt(this.block.style.left)
      return {
        spliced: Math.abs(left - this.x) < 10,
        TuringTest: average !== stddev, // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
      }
    }

    reset() {
      this.sliderContainer.className = 'sliderContainer'
      this.slider.style.left = 0
      this.block.style.left = 0
      this.sliderMask.style.width = 0
      this.clean()
      this.img.src = getRandomImg()
      this.draw()
    }

  }

  window.jigsaw = {
    init: function (element, success, fail) {
      new jigsaw(element, success, fail).init()
    }
  }
}(window))