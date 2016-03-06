/**
 * Created by  ozkan gokturk on 25.02.2016.
 */

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name app.directive:preventMaxMin
     * @restrict 'A'
     * @element input
     * @description
     *
     *
     * ## Example:
     ``` html
     <input prevent-max min="0" max="100" decimals="1" />
     ```
     *
     *
     * @param {number} max Input prevents entering a value that exceeds this maximum value
     * @param {number} min If this value is negative, input prevents entering a value that falls below this minimum value
     * @param {number} decimal The number of decimals can be set.
     *
     */
    angular.module('preventMaxMin', []).directive('preventMaxMin', PreventMaxMin);

    PreventMaxMin.$inject = [];

    function PreventMaxMin() {

        function _postLink(scope, el, attrs, ngModelCtrl) {

            var REGEXP = "^\\s*(\\-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$";
            var regex = new RegExp(REGEXP);

            var max;
            var min;
            var decimals=0;

            scope.$watch(attrs.min, onMinChanged);
            scope.$watch(attrs.max, onMaxChanged);
            scope.$watch(attrs.decimals, onDecimalsChanged);

            ngModelCtrl.$parsers.push(parseViewValue);

            var lastValue;

            function onMinChanged(value) {
                if (!angular.isUndefined(value)) {
                    min = parseFloat(value);
                    lastValue = ngModelCtrl.$modelValue;
                }
            }

            function onMaxChanged(value) {
                if (!angular.isUndefined(value)) {
                    max = parseFloat(value);
                    lastValue = ngModelCtrl.$modelValue;
                }
            }

            function onDecimalsChanged(value) {
                if (!angular.isUndefined(value)) {
                    decimals = parseFloat(value);
                    lastValue = ngModelCtrl.$modelValue;
                }
            }

            if (decimals > -1) {
                ngModelCtrl.$formatters.push(function (value) {
                    return (value) ? formatPrecision(value) : value;
                });
            }

            function formatPrecision(value) {
                if (!(value || value === 0)) {
                    return '';
                }
                var formattedValue = parseFloat(value).toFixed(decimals);
                return formattedValue;
            }

            function formatViewValue(value) {
                return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
            }

            function parseViewValue(value) {
                if (angular.isUndefined(value)) {
                    value = '';
                }
                value = value.toString();

                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }

                if (value.indexOf('-') === 0) {
                    if (min >= 0) {
                        value = null;
                        ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                        ngModelCtrl.$render();
                    }
                    else if (value === '-') {
                        value = '';
                    }
                }

                var empty = ngModelCtrl.$isEmpty(value);
                if (empty) {
                    lastValue = '';
                }
                else {
                    if (value.indexOf('.') != -1 && value.length - value.indexOf('.') - 1 > decimals) {
                        ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                        ngModelCtrl.$render();
                    }
                    else if (regex.test(value)) {
                        if (value > max) {
                            ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                            ngModelCtrl.$render();
                        }
                        else if (value < min) {
                            ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                            ngModelCtrl.$render();
                        }
                        else {
                            if (decimals === 0 && value.endsWith('.')) {
                                ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                                ngModelCtrl.$render();
                            } else {
                                lastValue = (value === '') ? null : parseFloat(value);
                            }
                        }
                    }
                    else {
                        ngModelCtrl.$setViewValue(formatViewValue(lastValue));
                        ngModelCtrl.$render();
                    }
                }
                return lastValue;
            }

        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: _postLink
        };
    }
})();
