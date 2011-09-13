/*
 * Danda Javascript Library v0.1
 * http://www.dandamoore.com
 * 
 * Copyright 2011, Dustin Moore
 * 
 * This library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * To receive a copy of the GNU Lesser General Public License see
 * <http://www.gnu.org/copyleft/lgpl.html>
 */
var danda = { ui : {} };

danda.ui.ImageGallery = function(_id) {

  $.tmpl(
       '<div id="${id}_disabled_layer" class="danda-ui-image-gallery-disabled-layer"></div>'
     + '<div id="${id}_pop_up" class="danda-ui-image-gallery-pop-up">'
     + '  <img />'
     + '  <div class="danda-ui-image-gallery-controls">'
     + '    <a class="danda-ui-image-gallery-close" href="#${id}">Close</a></div>'
     + '  </div>'
     + '</div>', { id: _id }).hide().appendTo('body');

  var $img_gallery = $('#' + _id);
  var _$previous_control = $('<div class="danda-ui-image-gallery-previous-control"></div>').prependTo($img_gallery);
  var _$next_control = $('<div class="danda-ui-image-gallery-next-control"></div>').appendTo($img_gallery);
  var _$disabled_layer = $('#' + _id + '_disabled_layer');
  var _$pop_up = $('#' + _id + '_pop_up');
  var _$img_anchors = $img_gallery.find('a');
  var _$img = _$pop_up.find('img');

  var _pop_up_orig_height = 0;
  var _pop_up_orig_width = 0;
  var _img_aspect_ratio = 0;
  var _index = 0;

  $img_gallery.find('a:gt(0)').hide();
  _$img_anchors.each(function() {
    $(this).data('large-image-url', this.href);
    this.href = '#' + _id;
    $(this).click(popUp);
  });
  $img_gallery.children().css('float', 'left');
  _$previous_control.addClass('danda-ui-image-gallery-no-control');

  _$previous_control.click(previous);
  _$next_control.click(next);
  _$pop_up.find('.danda-ui-image-gallery-controls .danda-ui-image-gallery-close').click(popDown); 
  _$img.load(onImgLoad);

  function previous() {
    if (_index > 0) {
      _$img_anchors.eq(_index).hide();
      _index--;
      _$img_anchors.eq(_index).show();
    }

    if (_index < _$img_anchors.length - 1)
      _$next_control.removeClass('danda-ui-image-gallery-no-control');

    if (_index <= 0)
      _$previous_control.addClass('danda-ui-image-gallery-no-control');
  }

  function next() {
    if (_index < _$img_anchors.length - 1) {
      _$img_anchors.eq(_index).hide();
      _index++;
      _$img_anchors.eq(_index).show();
    }

    if (_index >= _$img_anchors.length - 1)
      _$next_control.addClass('danda-ui-image-gallery-no-control');

    if (_index > 0)
      _$previous_control.removeClass('danda-ui-image-gallery-no-control');
  }

  function popUp() {
    _$disabled_layer.show();
    _$pop_up.show();
    _$img.attr('src', $(this).data('large-image-url'));
    $(window).resize(resize);
  }
  
  function popDown() {
    _$pop_up.hide();
    _$disabled_layer.hide();
    $(window).unbind('resize');
  }

  function onImgLoad() {
    _pop_up_orig_height = _pop_up_orig_height || _$pop_up.height();
    _pop_up_orig_width = _pop_up_orig_width || _$pop_up.width();
  
    _img_aspect_ratio = _img_aspect_ratio || (_$img.height() / _$img.width());
  
    resize();
  }
  
  function resize() {
    var window_height = $(window).height();
    var window_width = $(window).width();
  
    var height_diff = window_height - _pop_up_orig_height;
    var width_diff = window_width - _pop_up_orig_width;
  
    var height_offset = height_diff / 2;
    var width_offset = width_diff / 2;
  
    if (height_offset < 0 || width_offset < 0) {
      if (height_diff < width_diff) {
        var new_height = window_height - 35;
        var new_width = new_height / _img_aspect_ratio;
        _$img.height(new_height)
            .width(new_width);
        
      } else {
        var new_width = window_width - 10;
        var new_height = _img_aspect_ratio * new_width;
        _$img.height(new_height)
            .width(new_width);
      }
  
      height_offset = (window_height - new_height - 35) / 2;
      width_offset = (window_width - new_width - 10) / 2;
    }
  
    _$pop_up.css('top', height_offset);
    _$pop_up.css('left', width_offset);
  }
  return {};
};
