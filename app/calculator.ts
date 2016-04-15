(function() {
    'use strict';

    angular
        .module('calculator')
        .directive('calcDir', calcDir);

    function calcDir() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: calculatorController,
            templateUrl: 'app/calculator.html',
            controllerAs: 'calc',
            link: link,
            restrict: 'AE',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {
        }
    }
    /* @ngInject */
    function calculatorController () {
            var vm = this;

    // Bound to the output display
    vm.output = "0";

    // Used to evaluate whether to start a new number
    // in the display and when to concatenate
    vm.newNumber = true;

    // Holds the pending operation so calculate knows
    // what to do
    vm.pendingOperation = null;

    // Bound to the view to display a token indicating
    // the current operation
    vm.operationToken = "";

    // Holds the running total as numbers are added/subtracted
    vm.runningTotal = null;

    // Holds the number value of the string in the display output
    vm.pendingValue = null;

    // Tells calculate what to do when the equals buttons is clicked repeatedly
    vm.lastOperation = null;

    // Constants
    var ADD = "adding";
    var SUBTRACT = "subtracting";
    var ADD_TOKEN = "+";
    var SUBTRACT_TOKEN = "-";

    /*
     * Runs every time a number button is clicked.
     * Updates the output display and sets 
     * newNumber flag
     */
    vm.updateOutput = function (btn) {
        if (vm.output == "0" || vm.newNumber) {
            vm.output = btn;
            vm.newNumber = false;
        } else {
            vm.output += String(btn);
        }
        vm.pendingValue = vm.toNumber(vm.output);
    };

    /*
     * Runs every time the add button is clicked.
     * If a number has been entered before the add
     * button was clicked we set the number as a pendingValue,
     * set ADD as a pendingOperation, and set the token. 
     * If no number was entered but an existing calculated
     * number is in the output display we add the last added
     * value on to the total again.
     */
    vm.add = function () {
        if (vm.pendingValue) {
            if (vm.runningTotal && vm.pendingOperation == ADD) {
                vm.runningTotal += vm.pendingValue;
            } else if (vm.runningTotal && vm.pendingOperation == SUBTRACT) {
                vm.runningTotal -= vm.pendingValue;
            } else {
                vm.runningTotal = vm.pendingValue;
            }
        }
        vm.setOperationToken(ADD);
        vm.setOutput(String(vm.runningTotal));
        vm.pendingOperation = ADD;
        vm.newNumber = true;
        vm.pendingValue = null;
    };

    /*
     * Runs every time the subtract button is clicked.
     * If a number has been entered before the subtract
     * button was clicked we set the number as a pendingValue,
     * set subtract as a pendingOperation, and set the token. 
     * If no number was entered but an existing calculated
     * number is in the output display we subtract the last added
     * value from the total.
     */
    vm.subtract = function () {
        if (vm.pendingValue) {
            if (vm.runningTotal && (vm.pendingOperation == SUBTRACT)) {
                vm.runningTotal -= vm.pendingValue;
            } else if (vm.runningTotal && vm.pendingOperation == ADD) {
                vm.runningTotal += vm.pendingValue;
            } else {
                vm.runningTotal = vm.pendingValue;
            }
        }
        vm.setOperationToken(SUBTRACT);
        vm.setOutput(String(vm.runningTotal));
        vm.pendingOperation = SUBTRACT;
        vm.newNumber = true;
        vm.pendingValue = null;
    };

    /*
     * Runs when the equals (=) button is clicked.
     * If a number has been entered before the equals
     * button was clicked we perform the calculation
     * based on the pendingOperation.
     * If no number was entered but an existing calculated
     * number is in the output display we repeat the last
     * operation. For example, if 8+2 was entered we will
     * continue to add 2 every time the equals button is clicked.
     */
    vm.calculate = function () {
        if (!vm.newNumber) {
            vm.pendingValue = vm.toNumber(vm.output);
            vm.lastValue = vm.pendingValue;
        }
        if (vm.pendingOperation == ADD) {
            vm.runningTotal += vm.pendingValue;
            vm.lastOperation = ADD;
        } else if (vm.pendingOperation == SUBTRACT) {
            vm.runningTotal -= vm.pendingValue;
            vm.lastOperation = SUBTRACT;
        } else {
            if (vm.lastOperation) {
                if (vm.lastOperation == ADD) {
                    if (vm.runningTotal) {
                        vm.runningTotal += vm.lastValue;
                    } else {
                        vm.runningTotal = 0;
                    }
                } else if (vm.lastOperation == SUBTRACT) {
                    if (vm.runningTotal) {
                        vm.runningTotal -= vm.lastValue;
                    } else {
                        vm.runningTotal = 0;
                    }
                }
            } else {
                vm.runningTotal = 0;
            }
        }
        vm.setOutput(vm.runningTotal);
        vm.setOperationToken();
        vm.pendingOperation = null;
        vm.pendingValue = null;
    };

    /* 
     * Initializes the appropriate values
     * when the clear button is clicked.
     */
    vm.clear = function () {
        vm.runningTotal = null;
        vm.pendingValue = null;
        vm.pendingOperation = null;
        vm.setOutput("0");
    };

    /* 
     * Updates the display output and resets the
     * newNumber flag.
     */
    vm.setOutput = function (outputString) {
        vm.output = outputString;
        vm.newNumber = true;
    };

    /* 
     * Sets the operation token to let the user know
     * what the pendingOperation is
     */
    vm.setOperationToken = function (operation) {
        if (operation == ADD) {
            vm.operationToken = ADD_TOKEN;
        } else if (operation == SUBTRACT) {
            vm.operationToken = SUBTRACT_TOKEN;
        } else {
            vm.operationToken = "";
        }
    };

    /* Converts a string to a number so we can
     * perform calculations. Simply multiplies
     * by one to do so
     */
    vm.toNumber = function (numberString) {
        var result = 0;
        if (numberString) {
            result = numberString * 1;
        }
        return result;
    };

    }
})();