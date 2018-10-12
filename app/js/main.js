
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
      SLID.tabs.init()
      SLID.pageSettings.init()
      SLID.basicElements.init()
      SLID.navbar.init()
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

  // # Tabs
  // ============================================================================= //
  SLID.tabs = {
    init() {
      this.$control =           $('[data-tabs]')
      this.control =            '.mp-tabs-control'
      this.controlItemActive =  'mp-tabs-control__item--active'
      this.controlItem =        '.mp-tabs-control__item'
      this.tabItemActive =      'mp-tabs__item--active'
      this.tabItem =            '.mp-tabs__item'

      this.click()
      this.hash()
    },
    click() {

      this.$control.on('click', (e) => {
        const $this =             $(e.currentTarget)
        const isPrevented =       $this.is("[data-tabs-not-prevent]")
        const target =            $this.is('[href*="#"]:not([href="#"])') ? $this.attr("href") : $this.data("tabs-target")
        const $contentItem =      $(target)

        if ($this.prop("disabled")) return

        $this
          .closest(this.controlItem)
          .toggleClass(this.controlItemActive)
          .siblings(this.controlItem)
          .removeClass(this.controlItemActive)
          .find("[data-tabs-not-prevent]").prop("checked", false)

        $contentItem
          .closest(this.tabItem)
          .toggleClass(this.tabItemActive)
          .siblings(this.tabItem)
          .removeClass(this.tabItemActive)

        // reset compare items
        $this.is("[data-compare-reset-control") &&
          $("[data-compare-reset]").prop("checked", false)

        !isPrevented && e.preventDefault()
      })
    },
    hash() {
      const hash =           location.hash

      this.$control.each(function(id, el){
        const $this =      $(el)
        const tabHash =    $this.data('tabs-target')

        if(hash == tabHash) {
          $this.click()
          $('html, body').animate({
            scrollTop: $this.offset().top - 15
          }, 667)
        }
      })
    },
  }

  // # Navbar Collapse
  // ============================================================================= //
  SLID.navbar = {
    init: function() {
      this.$toggler =             $('[data-toggler]')
      this.target =               this.$toggler.data('toggler')
      this.$navbar =              $(this.target)
      this.$backdrop =            this.$navbar.find('.mp-menu__backdrop')
      this.$navbarLink =          this.$navbar.find('a.menu__link[href*="#"]:not([href="#"])')
      this.$close =               this.$navbar.find(".mp-menu__close")
      this.navbarTogglerOpen =    "nav-toggler--open"
      this.navbarOpen =           "mp-menu--open"
      this.$nav =                 $(".nav")
      this.navOpen =              "nav--open"
      const self =                this
      
      this.$toggler.on('click').on('click', function() {
        $(this).toggleClass(self.navbarTogglerOpen)
        if (self.$navbar.hasClass(self.navbarOpen)) {
          self.showNavbar('hide')
        } else {
          self.showNavbar('show')
        }
      })

      $(".sm-nav__link--dropdown").on("click", function(e) {
        const $this = $(this)
        const activeDropdown = 'sm-nav__link--active'
        const isOpen = $this.is(`.${activeDropdown}`) ? true : false
        const $dropdown = $this.siblings(".sm-nav")

        if (isOpen) {
          $this.removeClass(activeDropdown)
          $dropdown.clearQueue().finish().slideUp()
        } else {
          $this.addClass(activeDropdown)
          $dropdown.clearQueue().finish().slideDown()
        }
        e.preventDefault()
      })


      this.$backdrop.on('click').on('click', function() {
        self.showNavbar('hide')
      })

      this.$close.on('click').on('click', function() {
        self.showNavbar('hide')
      })
    },
    showNavbar: function(status) {
      if (status === 'hide') {
        this.$toggler.removeClass(this.navbarTogglerOpen)
        this.$navbar.removeClass(this.navbarOpen)
        this.$nav.removeClass(this.navOpen)
      } else if (status === 'show') {
        this.$toggler.addClass(this.navbarTogglerOpen)
        this.$navbar.addClass(this.navbarOpen)
        this.$nav.addClass(this.navOpen)
      }
    },
    navbarSticky: function() {
      var $nav =         $(".js-sticky")
      var target =       $nav.data('nav-target')
      var $header =      $(target)
      var triggerTop =   $header.height()

      if (triggerTop === undefined) {
        return
      }

      if (triggerTop < $(window).scrollTop() ) {
        $nav.addClass("nav--shrink")
        return
      } 
      $nav.removeClass("nav--shrink")
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
    init(fieldsetId, controlButtonId) {
      this.svgPolifill()
      this.generateNewAlert()
      this.demographicToggle()
      this.triggerFormControl(fieldsetId, controlButtonId)
      this.toggleContent()
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
    triggerFormControl(fieldsetId, controlButtonId) {
      const $btnControl =      $(`#${controlButtonId}`)
      const $contents =        $(`#${fieldsetId}`)
      const toggleClassName =  'pl-info__add--decline btn-info btn-default'
      const isContentsErrors = $contents.is('.has-errors')

      if($contents.length) 
        isContentsErrors ? $contents.show() : $contents.hide()

      if(!$btnControl.length) return false

      $btnControl.on("click", function(e) {
        const $this = $(this)
        const toggleHtml =       $this.data("form-control-toggle")
        const currentHtml =      $this.html()
        const $toggleContent =   $(`#${fieldsetId}`)

        const $form =            $this.closest('.js-block-form')
        const $toggleBtnSubmit = $form.find('.js-form-submit')

        const $showIcon =        $this.find('.js-show-icon')
        const $hasErrorData =    $this.find('.js-has-error-icon')
        const templateIcon =     $this.parent().find('.js-template-icon').html()

        const isHideShownIcon = $showIcon.is('.hide')

        let toggleButtonText

        if (isHideShownIcon && $hasErrorData.length && !$(toggleHtml).length)
          toggleButtonText = templateIcon + toggleButtonText


        $this.html(toggleHtml)
        $this.data("form-control-toggle", currentHtml)
        $this.toggleClass(toggleClassName)
        $this.blur()

        $toggleContent.clearQueue().finish().slideToggle(() => {

          if ($toggleContent.is(':visible')) {
            let $control = $('input[type=text]:visible', $form).first();

            ($control.is('[data-krajee-typeahead]')) ?
              $control = $control.next() :
              null

            $control.focus()

            $toggleBtnSubmit.show()
          }
          else {
            $toggleBtnSubmit.hide()
            $form[0].reset()
          }
        })

        e.preventDefault()
      })

    },
    toggleContent() {
      const $control =  $("[data-card-toggle-control]")
      const $contents = $("[data-card-toggle-content]")

      $contents.hide()

      $control.on("click", function(e) {
        e.preventDefault()
        const $this =           $(this)
        const $card =           $this.closest("[data-card-toggle]")
        const $currentContent = $card.find("[data-card-toggle-content]")

        if ( $currentContent.is(":visible") ) return false

        $contents.filter(":visible").not($currentContent).slideUp()
        $currentContent.stop().slideDown()

      })
    },
  }


  // # Basic Elements
  // ============================================================================= //
  SLID.basicElements = {
    init() {
      this.dropdown()
    },
    dropdown() {
      $(document).on('click', '[data-dropdown-toggle]', e => {
        e.preventDefault()

        const $this =            $(e.currentTarget)
        const target =           $this.data('dropdown-toggle')
        const $dropdown =        $(target)
        const controlActive =    ($this.is('[data-dropdown-toggle-class]')) ? $this.data('dropdown-toggle-class') : null
        const dropdownActive =   ($this.is('[data-dropdown-toggle-target-class]')) ? $this.data('dropdown-toggle-target-class') : null
        const isOnce =           ($this.is('[data-dropdown-toggle-once]')) ? true : false
        const isScroll =         ($this.is('[data-dropdown-toggle-scroll]')) ? true : false
        const scroll =           $(window).scrollTop()
        const afterSlide =       () => {
          if (isScroll && $dropdown.is(":visible")) { 
            $('html, body').animate({
              scrollTop: $dropdown.offset().top - 15
            }, 333)
          }
        }


        if (!$dropdown.length) return

        $this.toggleClass(controlActive)
        $dropdown.toggleClass(dropdownActive)

        if (isOnce && $dropdown.is(":visible")) 
          afterSlide()
        else 
          $dropdown.stop().slideToggle(afterSlide)
      })
    },
  }


  $(document).ready(() => { SLID.documentReady.init() })
  $(window).smartresize(() => { SLID.documentResize.init() })
  $(window).on('load', () => { SLID.documentLoad.init() })
  $(window).on('scroll', () => { SLID.documentScroll.init() })
}))(jQuery)
