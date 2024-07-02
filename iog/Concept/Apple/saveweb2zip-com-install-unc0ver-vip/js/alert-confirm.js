(function ($) {
  'use strict'
  
  function AlertConfirm(element, options) {
    this.$body = $(document.body)
    this.$element = $(element)
    // this.$alertHeader = this.$element.find('.ms-alert-header')
    // this.$alertContent = this.$element.find('.ms-alert-content')
    this.$alertButtons = this.$element.find('.ms-alert-buttons')
    this.$confirmButton = this.$alertButtons.find('.ms-alert-button.confirm')
    this.$cancelButton = this.$alertButtons.find('.ms-alert-button.cancel')
    this.hasCancelButton = !!this.$cancelButton.length
    this.options = options
    this.isShown = false
    
    this.$confirmButton
        .on('click', this.confirm.bind(this))
    this.hasCancelButton && this.$cancelButton
                                .on('click', this.cancel.bind(this))
  }
  
  AlertConfirm.VERSION = '0.0.1'
  
  AlertConfirm.DEFAULTS = {
    showFunction: function (alertObj) {
      this.appendTo(alertObj.$body)
    },
    hideFunction: function () {
      this.detach()
    }
  }
  
  AlertConfirm.prototype.show = function () {
    if (this.$body.data('ms.alert') || this.isShown) return
    
    this.$element.trigger('show.ms.alert')
    this.options.showFunction.call(this.$element, this)
    this.$element.trigger('shown.ms.alert')
    
    this.isShown = true
    this.$body.data('ms.alert', true)
  }
  
  AlertConfirm.prototype.hide = function () {
    if (!this.isShown) return
    
    this.$element.trigger('hide.ms.alert')
    this.options.hideFunction.call(this.$element, this)
    this.$element.trigger('hidden.ms.alert')
    
    this.isShown = false
    this.$body.data('ms.alert', false)
  }
  
  AlertConfirm.prototype.confirm = function (e) {
    var event = $.Event('confirm.ms.alert')
    this.$element.trigger(event)
    
    if (event.isDefaultPrevented()) return
    
    this.hide()
  }
  
  AlertConfirm.prototype.cancel = function (e) {
    var event = $.Event('cancel.ms.alert')
    this.$element.trigger(event)
    
    if (event.isDefaultPrevented()) return
    
    this.hide()
  }
  
  function Plugin(options) {
    return this.each(function () {
      var $this = $(this)
      var data = $this.data('ms.alert')
      var _options = $.extend({}, AlertConfirm.DEFAULTS, typeof options === 'object' ? options : null)
      
      if (!data) {
        $this.data('ms.alert', (data = new AlertConfirm(this, _options)))
      }
      
      if (typeof options === 'string') {
        data[options]()
      }
    })
  }
  
  var _old = $.fn.alertconfirm
  
  $.fn.alertconfirm = Plugin
  $.fn.alertconfirm.noConflict = function () {
    $.fn.alertconfirm = _old
    return this
  }
  var _oldAlert = $.alert
  var _oldConfirm = $.confirm
  var _template = '<div class="ms-alert">' +
                      '<div class="ms-alert-body">' +
                        '<div class="ms-alert-header"></div>' +
                        '<div class="ms-alert-content"></div>' +
                        '<div class="ms-alert-buttons">' +
                          '<div class="ms-alert-button confirm"></div>' +
                        '</div>' +
                      '</div>' +
                  '</div>'
  
  var _cancelButtonTemplate = '<div class="ms-alert-button cancel"></div>'
  var _defaults = {
    header: 'Title',
    content: ' ',
    confirmButtonText: 'Okey',
    cancelButtonText: 'Cancel',
    confirm: noop,
    cancel: noop
  }
  var _alertTemplate = null
  var _confirmTemplate = null
  function noop () {}
  
  $.alert = function (options, alertOptions) {
    var $template = _alertTemplate || (_alertTemplate = $(_template))
    var $alertHeader = $template.find('.ms-alert-header')
    var $alertContent = $template.find('.ms-alert-content')
    var $alertButtons = $template.find('.ms-alert-buttons')
    var $confirmButton = $template.find('.ms-alert-button.confirm')
    var _options = $.extend({}, _defaults, typeof options === 'object' ? options : null)
    
    if (typeof options === 'string') {
      _options.content = options
    }
    $alertHeader.text(_options.header)
    $alertContent.text(_options.content)
    $confirmButton.text(_options.confirmButtonText)
    
    $template
      .off('confirm.ms.alert')
      .on('confirm.ms.alert', _options.confirm)
    
    Plugin.call($template, 'show')
  }
  
  $.confirm = function (options) {
    if (!_confirmTemplate) {
      _confirmTemplate = $(_template)
      _confirmTemplate
        .find('.ms-alert-buttons')
        .append($(_cancelButtonTemplate))
    }
    
    var $template = _confirmTemplate
    var $alertHeader = $template.find('.ms-alert-header')
    var $alertContent = $template.find('.ms-alert-content')
    var $alertButtons = $template.find('.ms-alert-buttons')
    var $confirmButton = $template.find('.ms-alert-button.confirm')
    var $cancelButton = $template.find('.ms-alert-button.cancel')
    var _options = $.extend({}, _defaults, typeof options === 'object' ? options : null)
    
    if (typeof options === 'string') {
      _options.content = options
    }
    
    $alertHeader.text(_options.header)
    $alertContent.text(_options.content)
    $confirmButton.text(_options.confirmButtonText)
    $cancelButton.text(_options.cancelButtonText)
    
    $template
      .off('confirm.ms.alert')
      .on('confirm.ms.alert', _options.confirm)
    $template
      .off('cancel.ms.alert')
      .on('cancel.ms.alert', _options.cancel)
    
    Plugin.call($template, 'show')
  }
  
  $.alert.noConflict = function () {
    $.alert = _oldAlert
    return this
  }
  
  $.confirm.noConflict = function () {
    $.alert = _oldConfirm
    return this
  }
})(jQuery)