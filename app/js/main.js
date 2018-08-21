
(($, sr) => {

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  const debounce = (func, threshold, execAsap) => {
    let timeout

    return function debounced () {
      const obj =    this
      const args =   arguments
      function delayed () {
        if (!execAsap) {
          func.apply(obj, args)
        }

        timeout = null
      }

      if (timeout) {
        clearTimeout(timeout)
      } else if (execAsap) {
        func.apply(obj, args)
      }

      timeout = setTimeout(delayed, threshold || 100)
    }
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr) }

})(jQuery,'smartresize')

// ================================================================================== //

  // # Document on Ready
  // # Document on Resize
  // # Document on Scroll
  // # Document on Load

  // # Page Settings
  // # Basic Elements

// ================================================================================== //


const SLID = SLID || {};


(($ => {
  // # Document on Ready
  // ============================================================================= //
  SLID.documentReady = {
    init() {
      SLID.outlineJS.init()
      SLID.medicalProfile.init()
      SLID.pageSettings.init()
      SLID.basicElements.init()
    }
  }

  // # Document on Resize
  // ============================================================================= //
  SLID.documentResize = {
    init() {

    }
  }

  // # Document on Scroll
  // ============================================================================= //
  SLID.documentScroll = {
    init() {

    }
  }

  // # Document on Load
  // ============================================================================= //
  SLID.documentLoad = {
    init() {

    }
  }

  // # Remove outline on focus
  // ============================================================================= //
  SLID.outlineJS = {
    init() {
      const self =           this

      this.styleElement =    document.createElement('STYLE'),
      this.domEvents =       'addEventListener' in document

      document.getElementsByTagName('HEAD')[0].appendChild(this.styleElement)

      // Using mousedown instead of mouseover, so that previously focused elements don't lose focus ring on mouse move
      this.eventListner('mousedown', () => {
        self.setCss(':focus{outline:0 !important}')
      })

      this.eventListner('keydown', () => {
        self.setCss('')
      })
    },
    setCss(css_text) {
      // Handle setting of <style> element contents in IE8
      !!this.styleElement.styleSheet ? this.styleElement.styleSheet.cssText = css_text : this.styleElement.innerHTML = css_text
    },
    eventListner(type, callback) {
      // Basic cross-browser event handling
      if (this.domEvents) {
        document.addEventListener(type, callback)
      } else {
        document.attachEvent(`on${type}`, callback)
      }
    }
  }


  // # Check window size in range
  // ============================================================================= //
  SLID.isWindowSize = {
    init(min = undefined, max = undefined) {
      let media

      if (min !== undefined && max !== undefined) {
        media = matchMedia(`only screen and (min-width: ${min}px) and (max-width: ${max}px)`)
      } else if (min !== undefined && max === undefined) {
        media = matchMedia(`only screen and (min-width: ${min}px)`)
      } else if (min === undefined && max !== undefined) {
        media = matchMedia(`only screen and (max-width: ${max}px)`)
      } else {
        return true
      }

      return media.matches

    }
  }

  // # Page Medical Profile
  // ============================================================================= //
  SLID.medicalProfile = {
    init() {
      this.$tabsControl =                   $('[data-tabs-control-id]')
      this.control =                  '.mp-list'
      this.controlItem =              '.mp-list__item'
      this.controlActiveClassName =   'mp-list__item--active'
      this.tabItemActive =            'mp-content__item--active'
      this.tabItem =                  '.mp-content__item'

      this.tabs()
      this.navigate()
    },
    tabs() {
      this.$tabsControl.on('click', (e) => {
        const $this =           $(e.currentTarget)
        const target =          $this.data('tabs-control-id')
        const $contentItem =    $(`[data-tabs-content-id="${target}"]`)

        $this
          .closest(this.controlItem)
          .addClass(this.controlActiveClassName)
          .siblings(this.controlItem)
          .removeClass(this.controlActiveClassName)

        $contentItem
          .closest(this.tabItem)
          .addClass(this.tabItemActive)
          .siblings(this.tabItem)
          .removeClass(this.tabItemActive)

        this.changeProfileSelect(target)
      })
    },
    navigate() {
      const $navigate =           $("[data-tabs-navigation]")

      $navigate.on("click", (e) => {
        const $this =              $(e.currentTarget)
        const navigateControlVal = $this.data("tabs-navigation")
        const $activeControl =     this.$tabsControl.filter('.' + this.controlActiveClassName)

        let indexActiveControl =   $activeControl.index()
        let $featureControl
        let featureControlTarget
        let $featureContentItem

        switch(navigateControlVal) {
          case 'next':
            indexActiveControl += 1
            break;
          case 'prev':
            indexActiveControl -= 1
            break;
        }

        // Index of feature tab shouldn't be bigger or less exited tabs

        if (indexActiveControl < 0 || indexActiveControl > this.$tabsControl.length - 1) return 

        $featureControl = this.$tabsControl.eq(indexActiveControl)

        featureControlTarget = $featureControl.data('tabs-control-id')
        $featureContentItem = $(`[data-tabs-content-id="${featureControlTarget}"]`)

        $featureControl
          .addClass(this.controlActiveClassName)
          .siblings(this.controlItem)
          .removeClass(this.controlActiveClassName)

        $featureContentItem
          .addClass(this.tabItemActive)
          .siblings(this.tabItem)
          .removeClass(this.tabItemActive)

        this.changeProfileSelect(featureControlTarget)
        e.preventDefault()
      })
    },
    changeProfileSelect(target) {
      const selectTarget = '#md-profile-select'
      const $selectControl = $(selectTarget)
      
      // Select option
      $(`${selectTarget} option`)
        .filter(function() {
          return $(this).data('tabs-id') == target
        })
        .prop('selected', true)
      $selectControl.trigger('change')
    },
  }

  // # Page Settings
  // ============================================================================= //
  SLID.pageSettings = {
    init() {
      this.svgPolifill()
      this.generateNewAlert()
      this.demographicToggle()
      this.triggerFormControl()
    },
    svgPolifill() {
      svg4everybody()
    },
    generateNewAlert() {
      const $btn =            $("[data-new-alert-control]")
      const $control =        $btn.siblings(".ah-fieldset__control")
      const $content =        $("[data-new-alert-content]")
      const errorClassName =  'ah-fieldset__control--error'

      $control.on("keyup", function(e) {
        if (e.keyCode === 13) {
          $btn.click()
        }
      })

      $btn.on('click', function(e) {
        const $this =         $(this)
        const controlValue =  $.trim($control.val())
        const contentLength = $content.children().length
        const nextContentID = contentLength + 1
        let html = ''

        if (controlValue == '') {
          $control.addClass(errorClassName)
          return false
        }

        $control.removeClass(errorClassName)

        html += `<div class="ah-chkbox-btn ah-chkbox-group__item">`
        html += `  <input id="ah-chkbox-1.${nextContentID}" type="checkbox" name="ah-chkbox">`
        html += `  <label for="ah-chkbox-1.${nextContentID}">${controlValue}</label>`
        html += `</div>`

        $content.append(html)
        $control.val('')

        e.preventDefault()
      })
    },
    demographicToggle() {
      const $btn =            $("[data-demographic-toggle]")
      const activeClassName = "pl-btn-toggle--active"

      $btn.on("click", function() {
        $(this).toggleClass(activeClassName)
      })
    },
    triggerFormControl() {
      const $btnControl =      $("[data-form-control]")
      const toggleClassName =  'btn--secondary'
      const $contents =        $("[data-form-toggle]")

      $contents.hide()

      $btnControl.on("click", function(e) {
        const $this = $(this)
        const toggleHtml =       $this.data("form-control-toggle")
        const currentHtml =      $this.html()
        const $toggleContent =   $this.closest("[data-form]").find("[data-form-toggle]")

        $this.html(toggleHtml)
        $this.data("form-control-toggle", currentHtml)
        $this.toggleClass(toggleClassName)
        $toggleContent.stop().slideToggle()

        e.preventDefault()
      })

    }
  }


  // # Basic Elements
  // ============================================================================= //
  SLID.basicElements = {
    init() {
    },
  }


  $(document).ready(() => { SLID.documentReady.init() })
  $(window).smartresize(() => { SLID.documentResize.init() })
  $(window).on('load', () => { SLID.documentLoad.init() })
  $(window).on('scroll', () => { SLID.documentScroll.init() })
}))(jQuery)
