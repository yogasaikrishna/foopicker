/*
 * Library: FooPicker
 * Description: Pure JavaScript date picker
 * Author: Yogasaikrishna
 * License: MIT
 * URL: https://github.com/yogasaikrishna/foopicker
 */

var FooPicker = (function () {
  'use strict';

  var hasEventListener = window.addEventListener;
  var weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  function FooPicker() {
    var _self = this;
    var _id;

    var defaults = {
      className: 'foopicker',
      dateFormat: 'dd-MM-yyyy'
    };

    if (arguments[0] && typeof arguments[0] === "object") {
      _self.options = extendOptions(defaults, arguments[0]);
      _id = _self.options.id;
    }

    // Show date picker on click
    _self.showPicker = function() {
      _self.buildPicker();
      changeDayId(_self);
      _self.addListeners(_id);
      var datepicker = document.getElementById(_id);
      var left = datepicker.offsetLeft;
      var top = datepicker.offsetTop + datepicker.offsetHeight - 7;
      var pickerDiv = document.getElementById('foopicker-' + _id);
      pickerDiv.style.position = 'absolute';
      pickerDiv.style.top = top + 'px';
      pickerDiv.style.left = left + 'px';
    };

    // Hide date picker
    _self.hidePicker = function(event) {
      setTimeout(function() {
        if (!_self.monthChange) {
          _self.removeListeners(_id);
          var pickerDiv = document.getElementById('foopicker-' + _id);
          pickerDiv.innerHTML = null;
        }
      }, 150);
    };

    // Select date
    _self.selectDate = function() {
      _self.monthChange = false;
      var el = document.getElementById(event.target.id);
      el.classList.add('foopicker__day--selected');
      var date = el.dataset.day + '/' + el.dataset.month + '/' + el.dataset.year;
      _self.selectedDate = date;
      _self.selectedDay = el.dataset.day;
      _self.selectedMonth = el.dataset.month;
      _self.selectedYear = el.dataset.year;
      document.getElementById(_id).value = date;
    };

    _self.addListeners = function(id) {
      var picker = document.getElementById('foopicker-' + id);
      var el = picker.getElementsByClassName('foopicker__day');
      for (var count = 0; count < el.length; count++) {
        if (typeof el[count].onclick !== "function") {
          var elem = document.getElementById(id + '-foopicker__day--' + (count + 1));
          addEvent(elem, 'click', _self.selectDate, false);
        }
      }
      var prevBtn = picker.getElementsByClassName('foopicker__arrow--prev')[0];
      var nextBtn = picker.getElementsByClassName('foopicker__arrow--next')[0];
      addEvent(prevBtn, 'click', _self.changeMonth, false);
      addEvent(nextBtn, 'click', _self.changeMonth, false);
    };

    _self.removeListeners = function(id) {
      var picker = document.getElementById(id);
      var el = picker.getElementsByClassName('foopicker__day');
      for (var count = 0; count < el.length; count++) {
        if (typeof el[count].onclick === "function") {
          var elem = document.getElementById(id + '-foopicker__day--' + (count + 1));
          removeEvent(elem, 'click', _self.selectDate, false);
        }
      }
    };

    _self.changeMonth = function(event) {
      var className = event.target.className, positive;
      if (className.indexOf('foopicker__arrow--next') !== -1) {
        positive = true;
      }
      _self.monthChange = true;
      var day = _self.currentDate;
      var month = positive ? _self.currentMonth + 1 : _self.currentMonth - 1;
      var year = _self.currentYear;
      var date = new Date(year, month , day);
      var pickerDiv = document.getElementById('foopicker-' + _id);
      var datepicker = pickerDiv.querySelector('.foopicker');
      datepicker.innerHTML = buildCalendar(date);
    };

    _self.buildPicker = function() {
      var pickerDiv = document.getElementById('foopicker-' + _id);
      var fragment, datepicker, calendar;
      fragment = document.createDocumentFragment();
      datepicker = document.createElement('div');
      // Add default class name
      datepicker.className = _self.options.className;

      // Build calendar
      var date = new Date();
      _self.currentDate = date.getDate();
      _self.currentDay = date.getDay();
      _self.currentMonth = date.getMonth();
      _self.currentYear = date.getFullYear();
      calendar = buildCalendar(date);

      // Add calendar to datepicker
      datepicker.innerHTML = calendar;
      // Append picker to fragment and add fragment to DOM
      fragment.appendChild(datepicker);
      pickerDiv.appendChild(fragment);
    };

    _self.buildTemplate = function() {
      var pickerDiv = document.createElement('div');
      pickerDiv.id = 'foopicker-' + _id;
      document.body.appendChild(pickerDiv);
      addListeners(_self);
    };

    _self.buildTemplate();
  }

  // Extend default options
  function extendOptions(defaults, options) {
    var property;
    for (property in options) {
      if (options.hasOwnProperty(property)) {
        defaults[property] = options[property];
      }
    }
    return defaults;
  }

  function buildCalendar(date) {
    var today = date.getDate();
    var year = date.getFullYear();
    var month = getMonths(date.getMonth());
    var daysInMonth = getDaysInMonth(date.getMonth());
    var startWeekDay = getWeekDay(1, date.getMonth(), date.getFullYear());
    var padding = [6, 0, 1, 2, 3, 4, 5][startWeekDay];
    var calendar = '<div class="foopicker__header"><table><tr><td>';
    calendar += '<div class="foopicker__arrow foopicker__arrow--prev"></div></td><td>';
    calendar += '<div class="foopicker__month">' + month + '&nbsp;&nbsp;' + year + '</div>';
    calendar += '</td><td><div class="foopicker__arrow foopicker__arrow--next">';
    calendar += '</div></td></tr></table></div>';
    calendar += '<div class="foopicker__calendar"><table><tr>';
    for (var week = 0; week < weeks.length; week++) {
      calendar += '<td><div class="foopicker__week">' + weeks[week] + '</div></td>';
    }
    calendar += '</tr><tr>';
    var columnIndex = 0, dayClass;
    for (var day = 0 - padding; day < daysInMonth; day++) {
      if (day < 0) {
        calendar += '<td></td>';
      } else {
        dayClass = day === (today - 1) ? 'foopicker__day--today' : '';
        calendar += '<td><div class="foopicker__day ' + dayClass + '" ';
        calendar += 'data-day="' + (day + 1) + '" data-month="' + (date.getMonth() + 1);
        calendar += '" data-year="' + year + '" ';
        calendar += '>' + (day + 1) + '</div></td>';
      }
      columnIndex++;
      if (columnIndex % 7 === 0) {
        columnIndex = 0;
        calendar += '</tr><tr>';
      }
    }
    calendar += '</tr></table></div>';
    return calendar;
  }

  function addListeners(picker) {
    var el = document.getElementById(picker.options.id);
    addEvent(el, 'click', picker.showPicker, false);
    addEvent(el, 'blur', picker.hidePicker, false);
  }

  function getMonths(month) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    return month >= 0 ? months[month] : months;
  }

  function getDaysInMonth(month) {
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  function getWeekDay(date, month, year) {
    return new Date(year, month, date).getDay();
  }

  // Check if foopicker is already built and added to DOM
  function hasPicker() {
    return document.querySelector('.foopicker') ? true : false;
  }

  // Function to add events
  function addEvent(el, type, callback, capture) {
    if (hasEventListener) {
      el.addEventListener(type, callback, capture);
    } else {
      el.attachEvent('on' + type, callback);
    }
  }

  // Function to remove events
  function removeEvent(el , type, callback, capture) {
    if (hasEventListener) {
      el.removeEventListener(type, callback, capture);
    } else {
      el.detachEvent('on' + type, callback);
    }
  }

  function changeDayId(instance) {
    var id = instance.options.id;
    var day = parseInt(instance.selectedDay);
    var picker = document.getElementById('foopicker-' + id);
    var el = picker.getElementsByClassName('foopicker__day');
    for (var count = 0; count < el.length; count++) {
      if ((count + 1) === day) {
        el[count].className = 'foopicker__day foopicker__day--selected';
      } else {
        el[count].className = 'foopicker__day';
      }
      if ((count + 1) === instance.currentDate) {
        el[count].classList.add('foopicker__day--today');
      }
      el[count].id = id + '-foopicker__day--' + (count + 1);
    }
  }

  return FooPicker;
})();
