/**
 * Created by  ozkan gokturk on 25.02.2016.
 */

(function () {
    'use strict';

    angular.module('preventMaxMin', []).directive('preventMaxMin', PreventMaxMin);

    PreventMaxMin.$inject = [];

    function PreventMaxMin() {

        function _postLink(scope, el, attrs, ngModelCtrl) {

            var REGEXP = "^\\s*(\\-|\\+)?(\\d+|(\\d*(\\.\\d*)))\\s*$";
            var regex = new RegExp(REGEXP);

            var max = parseFloat(scope.max);
            var min = parseFloat(scope.min);
            var decimals = parseFloat(scope.decimals);
            var lastValue;

            ngModelCtrl.$parsers.push(parseViewValue);

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
            scope: {
                'min': '@',
                'max': '@',
                'decimals': '@'
            },
            link: _postLink
        };
    }
})();
