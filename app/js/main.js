
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


const GRVE = GRVE || {};


(($ => {
  // # Document on Ready
  // ============================================================================= //
  GRVE.documentReady = {
    init() {
      GRVE.outlineJS.init()
      GRVE.pageSettings.init()
      GRVE.basicElements.init()
    }
  }

  // # Document on Resize
  // ============================================================================= //
  GRVE.documentResize = {
    init() {

    }
  }

  // # Document on Scroll
  // ============================================================================= //
  GRVE.documentScroll = {
    init() {

    }
  }

  // # Document on Load
  // ============================================================================= //
  GRVE.documentLoad = {
    init() {

    }
  }

  // # Remove outline on focus
  // ============================================================================= //
  GRVE.outlineJS = {
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
  GRVE.isWindowSize = {
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

  // # Page Settings
  // ============================================================================= //
  GRVE.pageSettings = {
    init() {
      this.svgPolifill()
      this.medicalProfile()
    },
    svgPolifill() {
      svg4everybody()
    },
    medicalProfile() {
      const $items =              $('[data-tabs-control-id]')
      const $navigate =           $("[data-tabs-navigation]")
      const control =             '.mp-list'
      const controlItemActive =   'mp-list__item--active'
      const controlItem =         '.mp-list__item'
      const tabItemActive =       'mp-content__item--active'
      const tabItem =             '.mp-content__item'

      $navigate.on("click", function(e) {
        const $this =           $(this)
        const value =           $this.data("tabs-navigation")
 
        const $activeControl =  $items.filter('.' + controlItemActive)
        let indexControl =      $activeControl.index()
        let $currentControl
        let currentControlTarget
        let $contentItem

        switch(value) {
          case 'next':
            indexControl += 1
            break;
          case 'prev':
            indexControl -= 1
            break;
        }

        if (indexControl < 0 || indexControl > $items.length - 1) return 

        $currentControl = $items.eq(indexControl)

        currentControlTarget = $currentControl.data('tabs-control-id')
        $contentItem = $(`[data-tabs-content-id="${currentControlTarget}"]`)

        console.log(currentControlTarget)

        $currentControl
          .addClass(controlItemActive)
          .siblings(controlItem)
          .removeClass(controlItemActive)

        $contentItem
          .eq(indexControl)
          .addClass(tabItemActive)
          .siblings(tabItem)
          .removeClass(tabItemActive)

        changeProfileSelect(currentControlTarget)
        e.preventDefault()
      })

      $items.on('click', function() {
        const $this = $(this)
        const target = $this.data('tabs-control-id')
        const $contentItem = $(`[data-tabs-content-id="${target}"]`)

        $this
          .closest(controlItem)
          .addClass(controlItemActive)
          .siblings(controlItem)
          .removeClass(controlItemActive)

        $contentItem
          .closest(tabItem)
          .addClass(tabItemActive)
          .siblings(tabItem)
          .removeClass(tabItemActive)

        changeProfileSelect(target)
      })

      function changeProfileSelect(target) {
        const selectTarget = '#md-profile-select'
        const $selectControl = $(selectTarget)

        // Select option
        $(`${selectTarget} option`)
          .filter(function() {
            return $(this).data('tabs-content-id') == target
          })
          .prop('selected', true);
        $selectControl.trigger('change')
      }
    }
  }


  // # Basic Elements
  // ============================================================================= //
  GRVE.basicElements = {
    init() {
    },
  }


  $(document).ready(() => { GRVE.documentReady.init() })
  $(window).smartresize(() => { GRVE.documentResize.init() })
  $(window).on('load', () => { GRVE.documentLoad.init() })
  $(window).on('scroll', () => { GRVE.documentScroll.init() })
}))(jQuery)
