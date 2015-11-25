/*
 * Library: FooPicker
 * Description: Pure JavaScript date picker
 * Author: Yogasaikrishna
 * License: MIT
 * URL: https://github.com/yogasaikrishna/foopicker
 */

(function ($this) {
  'use strict';

  $this.FooPicker = function() {

    var defaults = {
      className: 'foopicker',
      dateFormat: 'dd-MM-yyyy'
    };

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendOptions(defaults, arguments[0]);
    }

    buildPicker(this);
  };

  // Show date picker on click
  FooPicker.prototype.showPicker = function(picker) {
    addDateListeners(picker);
    var datepicker = document.getElementById(picker.options.id);
    var left = datepicker.offsetLeft;
    var top = datepicker.offsetTop + datepicker.offsetHeight;
    var pickerDiv = document.getElementById('foopicker-' + picker.options.id);
    var foopicker = document.querySelector('.foopicker');
    pickerDiv.appendChild(foopicker);
    pickerDiv.classList.add('visible');
    pickerDiv.style.position = 'absolute';
    pickerDiv.style.top = top + 'px';
    pickerDiv.style.left = left + 'px';
    foopicker.style.display = 'block';
  };

  // Hide date picker
  FooPicker.prototype.hidePicker = function(picker) {
    removeDateListeners(picker);
    var foopicker = document.querySelector('.foopicker');
    foopicker.style.display = 'none';
  };

  // Select date
  FooPicker.prototype.selectDate = function(event, picker) {
    //event.stopPropagation();
    console.log(event);
    console.log(picker);
  };

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

  // Build the date picker
  function buildPicker(picker) {
    var pickerDiv = document.createElement('div');
    pickerDiv.id = 'foopicker-' + picker.options.id;
    if (!hasPicker()) {
      var fragment, datepicker, calendar;
      fragment = document.createDocumentFragment();
      datepicker = document.createElement('div');
      // Add default class name
      datepicker.className = picker.options.className;
      datepicker.style.display = 'none';

      // Build calendar
      calendar = buildCalendar();

      // Add calendar to datepicker
      datepicker.innerHTML = calendar;
      // Append picker to fragment and add fragment to DOM
      fragment.appendChild(datepicker);
      document.body.appendChild(fragment);
    }
    document.body.appendChild(pickerDiv);
    addEventListeners(picker);
  }

  function buildCalendar() {
    var date = new Date();
    var today = date.getDate();
    var year = date.getFullYear();
    var month = getMonths(date.getMonth());
    var daysInMonth = getDaysInMonth(date.getMonth());
    var startWeekDay = getWeekDay(1, date.getMonth(), date.getFullYear());
    var weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
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

  // Add click event to date picker
  function addEventListeners(picker) {
    var element = document.getElementById(picker.options.id);
    element.addEventListener('click', picker.showPicker.bind(null, picker));
    element.addEventListener('blur', picker.hidePicker.bind(null, picker));
  }

  function addDateListeners(picker) {
    var el = document.getElementsByClassName('foopicker__day');
    for (var count = 0; count < el.length; count++) {
      el[count].addEventListener('click', picker.selectDate.bind(event, picker));
    }
  }

  function removeDateListeners(picker) {
    var el = document.getElementsByClassName('foopicker__day');
    for (var count = 0; count < el.length; count++) {
      el[count].removeEventListener('click', picker.selectDate.bind(event, picker));
    }
  }

}(this));
