<template>
  <div class="timepicker">
    <div class="timepicker-header" @click-stop="">
      <div @click="view = 'hours'" class="timepicker-header-label" :class="{ active: view === 'hours' }">{{formattedHours}}</div>
      <div class="timepicker-header-separator">:</div>
      <div @click="view = 'minutes'" class="timepicker-header-label" :class="{ active: view === 'minutes' }">{{formattedMinutes}}</div>
    </div>
    <div class="hours-wrap" v-el:hours-wrap @click="handleHoursClick($event)" v-show="view === 'hours'">
      <div class="timepicker-indicator" :class="{ inner: dragging ? dragInside : (hours > 12 || hours < 1) }" :style="{ transform: 'rotateZ(' + (hours * 30) + 'deg)' }">
        <div></div>
      </div>
      <div class="hour-labels">
        <div class="timepicker-label">12</div>
        <div class="timepicker-label">1</div>
        <div class="timepicker-label">2</div>
        <div class="timepicker-label">3</div>
        <div class="timepicker-label">4</div>
        <div class="timepicker-label">5</div>
        <div class="timepicker-label">6</div>
        <div class="timepicker-label">7</div>
        <div class="timepicker-label">8</div>
        <div class="timepicker-label">9</div>
        <div class="timepicker-label">10</div>
        <div class="timepicker-label">11</div>
      </div>
      <div class="hour-labels inner">
        <div class="timepicker-label">0</div>
        <div class="timepicker-label">13</div>
        <div class="timepicker-label">14</div>
        <div class="timepicker-label">15</div>
        <div class="timepicker-label">16</div>
        <div class="timepicker-label">17</div>
        <div class="timepicker-label">18</div>
        <div class="timepicker-label">19</div>
        <div class="timepicker-label">20</div>
        <div class="timepicker-label">21</div>
        <div class="timepicker-label">22</div>
        <div class="timepicker-label">23</div>
      </div>
    </div>

    <div class="minutes-wrap" v-el:minutes-wrap @click="handleMinutesClick($event)" v-show="view === 'minutes'">
      <div class="timepicker-indicator" :class="{ small: minutes % 5 !== 0 }" :style="{ transform: 'rotateZ(' + (minutes * 6) + 'deg)' }">
        <div></div>
      </div>
      <div class="minute-labels">
        <div class="timepicker-label">0</div>
        <div class="timepicker-label">5</div>
        <div class="timepicker-label">10</div>
        <div class="timepicker-label">15</div>
        <div class="timepicker-label">20</div>
        <div class="timepicker-label">25</div>
        <div class="timepicker-label">30</div>
        <div class="timepicker-label">35</div>
        <div class="timepicker-label">40</div>
        <div class="timepicker-label">45</div>
        <div class="timepicker-label">50</div>
        <div class="timepicker-label">55</div>
      </div>
    </div>
    <div class="button-group">
      <div class="btn btn-primary" @click="handleConfirm">确定</div>
      <div class="btn btn-default" @click="handleClose">取消</div>
    </div>
  </div>
</template>

<style>
  .timepicker {
    padding: 15px 10px 5px 10px;
    width: 260px;
    user-select: none;
    position: absolute;
    left: 0;
    top: 45px;
    border: 1px solid #CCC;
    background-color: #fff;
    z-index: 100;
  }

  .timepicker-header {
    text-align: center;
    color: #333;
    margin-top: -10px;
  }

  .timepicker-header-label {
    cursor: pointer;

    display: inline-block;
    line-height: 30px;
    height: 30px;
    font-size: 20px;
  }

  .timepicker-header-label.active {
    color: #00a7ff;
  }

  .timepicker-header-confirm, .timepicker-header-close {
    float: right;
    line-height: 20px;
    width: 80px;
    height: 20px;
    margin-top: 4px;
    cursor: pointer;
  }

  .timepicker-header > div {
    display: inline-block;
  }

  .hours-wrap, .minutes-wrap {
    position: relative;
    width: 260px;
    height: 260px;
    background: #fff;
  }

  .timepicker-label {
    position: absolute;
    font-size: 14px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    transform: translate(-50%, -50%);
  }

  .timepicker-header-separator {
    font-size: 20px;
    vertical-align: text-bottom;
  }

  .timepicker-indicator {
    position: absolute;
    height: 110px;
    width: 2px;
    left: 50%;
    bottom: 50%;
    transform-origin: 50% bottom 0px;
    pointer-events: none;
    background: #00a7ff;
  }

  .timepicker-indicator > * {
    position: absolute;
    background: #ffffff;
    border: 4px solid #00a7ff;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    border-radius: 100%;
  }

  .hours-wrap .timepicker-indicator.inner {
    height: 78px;
  }

  .timepicker-indicator.small > * {
    width: 8px;
    height: 8px;
  }
  .button-group {
    text-align: right;
    border-top: 1px solid #DDD;
    padding-top: 8px;
  }
  .button-group div {
      margin: 0 3px;
  }
</style>

<script type="text/ecmascript-6">
  var RADIUS = 130;
  var getPosition = function(degree, radius) {
    var x = RADIUS + radius * Math.cos(degree / 180 * Math.PI);
    var y = RADIUS + radius * Math.sin(degree / 180 * Math.PI);

    return {
      left: Math.round(x),
      top: Math.round(y)
    };
  };

  import { default as draggable } from '../util/draggable';

  var getMousePosition = function(event, element) {
    var rect = element.getBoundingClientRect();

    return {
      left: event.clientX - rect.left,
      top: event.clientY - rect.top
    };
  };

  var getAngle = function(point) {
    var radius = RADIUS;
    var angle = Math.atan2(point.top - radius, point.left - radius) / Math.PI * 180;

    if (angle < 0) angle += 360;

    return (angle + 90) % 360;
  };

  var getEventAngle = function(event, el, degreeUnit) {
    var position = getMousePosition(event, el);
    var angle = Math.round(getAngle(position));
    degreeUnit = degreeUnit || 30;

    return Math.round(angle / degreeUnit) * degreeUnit % 360;
  };

  var getEventRadius = function(event, el) {
    var position = getMousePosition(event, el);

    return Math.sqrt((position.left - RADIUS) * (position.left - RADIUS) + (position.top - RADIUS) * (position.top - RADIUS));
  };

  export default {
    props: {
      hours: {
        type: Number,
        default: 12
      },

      minutes: {
        type: Number,
        default: 0
      }
    },

    computed: {
      formattedHours() {
        return this.hours < 10 ? '0' + this.hours : this.hours;
      },
      formattedMinutes() {
        return this.minutes < 10 ? '0' + this.minutes : this.minutes;
      }
    },

    ready() {
      this.initLabels('.hour-labels .timepicker-label', 110);
      this.initLabels('.hour-labels.inner .timepicker-label', 80);
      this.initLabels('.minute-labels .timepicker-label', 110);

      draggable(this.$els.hoursWrap, {
        drag: (event) => {
          this.dragging = true;
          this.setHours(event);
        },
        end: (event) => {
          this.dragging = false;
          this.dragInside = false;
          setTimeout(() => {
            // this.view = 'minutes';
          });
        }
      });

      draggable(this.$els.minutesWrap, {
        drag: (event) => {
          this.setMinutes(event);
        }
      });
    },

    data() {
      return {
        dragging: false,
        dragInside: false,
        view: 'hours'
      };
    },

    created () {
        var self = this;
        $(document).on('click', function () {
            self.$dispatch('timepickerclose', this);
        });
    },

    methods: {
      initLabels: function(selector, radius) {
        var innerHourLabels = this.$el.querySelectorAll(selector);

        [].forEach.call(innerHourLabels, function(element, index) {
          var degree = 30 * (index - 3);

          var position = getPosition(degree, radius);
          element.style.left = position.left + 'px';
          element.style.top = position.top + 'px';
        });
      },

      setMinutes(event) {
        var el = this.$els.minutesWrap;
        var angle = getEventAngle(event, el, 6);

        this.minutes = Math.round(angle / 6);
      },

      setHours(event) {
        var el = this.$els.hoursWrap;
        var angle = getEventAngle(event, el, 30);
        var radius = getEventRadius(event, el);

        var hours = radius < 100 ? Math.round(angle / 30) + 12 : Math.round(angle / 30);
        if (hours === 12 || hours === 0) {
          hours = radius < 100 ? 0 : 12;
        }
        this.hours = hours;

        if (this.dragging) {
          this.dragInside = radius < 100;
        }
      },

      handleHoursClick(event) {
        this.setHours(event);
        // setTimeout(() => {
        //   this.view = 'minutes';
        // }, 100);
      },

      handleMinutesClick(event) {
        this.setMinutes(event);
      },

      handleConfirm() {
        this.$dispatch('timepickerchange', this);
      },

      handleClose() {
        this.$dispatch('timepickerclose', this);
      }
    }
  };
</script>