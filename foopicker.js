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
      var datepicker = document.getElementById(_id);
      var left = datepicker.offsetLeft;
      var top = datepicker.offsetTop + datepicker.offsetHeight - 7;
      var pickerDiv = document.getElementById('foopicker-' + _id);
      pickerDiv.style.position = 'absolute';
      pickerDiv.style.top = top + 'px';
      pickerDiv.style.left = left + 'px';
    };

    // Hide date picker
    _self.hidePicker = function() {
      setTimeout(function() {
        if (!_self.monthChange) {
          _self.removeListeners(_id);
          var pickerDiv = document.getElementById('foopicker-' + _id);
          pickerDiv.innerHTML = '';
        }
      }, 210);
    };

    // Select date
    _self.selectDate = function() {
      _self.monthChange = false;
      var el = document.getElementById(event.target.id);
      el.classList.add('foopicker__day--selected');
      var date = el.dataset.day + '/' + el.dataset.month + '/' + el.dataset.year;
      _self.selectedDate = date;
      _self.selectedDay = parseInt(el.dataset.day);
      _self.selectedMonth = parseInt(el.dataset.month);
      _self.selectedYear = parseInt(el.dataset.year);
      document.getElementById(_id).value = date;
      _self.hidePicker();
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
      var className = event.target.className, positive = false;
      if (className.indexOf('foopicker__arrow--next') !== -1) {
        positive = true;
      }
      _self.monthChange = true;
      var day = _self.currentDate;
      var month = positive ? _self.currentMonth + 1 : _self.currentMonth - 1;
      var year = _self.currentYear;
      _self.currentMonth = month;
      Calendar.date = new Date(year, month , day);
      var pickerDiv = document.getElementById('foopicker-' + _id);
      var datepicker = pickerDiv.querySelector('.foopicker');
      datepicker.innerHTML = Calendar.buildHeader() + Calendar.buildCalendar();
      Calendar.addListeners(_self);
    };

    _self.buildPicker = function() {
      var pickerDiv = document.getElementById('foopicker-' + _id);
      if (!hasPicker(pickerDiv)) {
        var fragment, datepicker, calendar;
        fragment = document.createDocumentFragment();
        datepicker = document.createElement('div');
        // Add default class name
        datepicker.className = _self.options.className;

        // Build calendar
        var date;
        if (_self.currentDate) {
          date = new Date(_self.currentYear, _self.currentMonth, _self.currentDate);
        } else {
          date = new Date();
        }
        Calendar.date = date;

        // Add calendar to datepicker
        datepicker.innerHTML = Calendar.buildHeader() + Calendar.buildCalendar();
        // Append picker to fragment and add fragment to DOM
        fragment.appendChild(datepicker);
        pickerDiv.appendChild(fragment);

        Calendar.addListeners(_self);
      }
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

  // Build Calendar
  var Calendar = {
    // Get current date
    date: new Date(),

    // Get day of the week
    day: function() {
      return this.date.getDay();
    },

    // Get today day
    today: function() {
      return this.date.getDate();
    },

    // Get current month
    month: function() {
      return this.date.getMonth();
    },

    // Get current year
    year: function() {
      return this.date.getFullYear();
    },

    rowPadding: function() {
      var startWeekDay = getWeekDay(1, this.month(), this.year());
      return [6, 0, 1, 2, 3, 4, 5][startWeekDay];
    },

    // Build calendar header
    buildHeader: function() {
      return '<div class="foopicker__header">' +
        '<div class="foopicker__arrow foopicker__arrow--prev"></div>' +
        '<div class="foopicker__month">' + getMonths(this.month()) +
        '&nbsp;&nbsp;' + this.year() + '</div>' +
        '<div class="foopicker__arrow foopicker__arrow--next"></div></div>';
    },

    // Build calendar body
    buildCalendar: function() {
      var index;
      var daysInMonth = getDaysInMonth(this.year(), this.month());
      var template = '<div class="foopicker__calendar"><table><tr>';
      for (index = 0; index < weeks.length; index++) {
        template += '<td><div class="foopicker__week">' + weeks[index] + '</div></td>';
      }
      template += '</tr><tr>';
      var columnIndex = 0, dayClass = '';
      var day = 0 - this.rowPadding();
      for (; day < daysInMonth; day++) {
        if (day < 0) {
          template += '<td></td>';
        } else {
          // dayClass = day === (this.today() - 1) ? 'foopicker__day--today' : '';
          template += '<td><div class="foopicker__day ' + dayClass + '" ';
          template += 'data-day="' + (day + 1) + '" data-month="' + (this.month() + 1);
          template += '" data-year="' + this.year() + '" ';
          template += '>' + (day + 1) + '</div></td>';
        }
        columnIndex++;
        if (columnIndex % 7 === 0) {
          columnIndex = 0;
          template += '</tr><tr>';
        }
      }
      template += '</tr></table></div>';
      return template;
    },

    // Header click listeners
    addListeners: function(instance) {
      var id = instance.options.id;
      var picker = document.getElementById('foopicker-' + id);
      var prevBtn = picker.getElementsByClassName('foopicker__arrow--prev')[0];
      var nextBtn = picker.getElementsByClassName('foopicker__arrow--next')[0];
      addEvent(prevBtn, 'click', instance.changeMonth, false);
      addEvent(nextBtn, 'click', instance.changeMonth, false);

      this.modifyDateClass(instance);

      var el = picker.getElementsByClassName('foopicker__day');
      for (var count = 0; count < el.length; count++) {
        if (typeof el[count].onclick !== "function") {
          var elem = document.getElementById(id + '-foopicker__day--' + (count + 1));
          addEvent(elem, 'click', instance.selectDate, false);
        }
      }

      this.changeInstanceDate(instance);
    },

    modifyDateClass: function(instance) {
      var id = instance.options.id, day = instance.selectedDay,
        month = instance.selectedMonth - 1, year = instance.selectedYear;
      var picker = document.getElementById('foopicker-' + id);
      var el = picker.getElementsByClassName('foopicker__day');
      for (var count = 0; count < el.length; count++) {
        if ((count + 1) === day && this.month() === month &&
          this.year() === year) {
          el[count].className = 'foopicker__day foopicker__day--selected';
        } else {
          el[count].className = 'foopicker__day';
        }
        if ((count + 1) === instance.currentDate &&
          this.month() === instance.currentMonth - 1 &&
          this.year() === instance.currentYear) {
          el[count].classList.add('foopicker__day--today');
        }
        el[count].id = id + '-foopicker__day--' + (count + 1);
      }
    },

    // Change date in instance
    changeInstanceDate: function(instance) {
      instance.currentDay = this.day();
      instance.currentDate = this.today();
      instance.currentMonth = this.month();
      instance.currentYear = this.year();
    }
  };

  function buildCalendar(instance, date) {
    Calendar.date = date;
    var template = Calendar.buildHeader() + Calendar.buildCalendar();
    return Calendar.buildHeader() + Calendar.buildCalendar();
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

  function getDaysInMonth(year, month) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  function getWeekDay(date, month, year) {
    return new Date(year, month, date).getDay();
  }

  // Check if current year is leap year
  function isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 ? true : false : year % 4 === 0;
  }

  // Check if foopicker is already built and added to DOM
  function hasPicker(el) {
    return el.querySelector('.foopicker') ? true : false;
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
