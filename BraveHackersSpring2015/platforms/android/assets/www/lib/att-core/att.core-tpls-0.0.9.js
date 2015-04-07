angular.module("att.core", ["att.core.tpls", "att.core.HsiaProgressIcon","att.core.ProgressBar","att.core.angularCacheService","att.core.attAmount","att.core.attDateFormat","att.core.attFilterNumber","att.core.camelCase","att.core.convertToGB","att.core.coreforms","att.core.currencyConverter","att.core.currencyFormat","att.core.filters","att.core.footerContentFormat","att.core.formatSubscriberCTN","att.core.getCMSContent","att.core.gnsess","att.core.language","att.core.location","att.core.logging","att.core.mapNumIndexToMonth","att.core.content","att.core.navigation","att.core.parseContactNumber","att.core.parseErrorCode","att.core.priceFilter","att.core.processString","att.core.rangeFilter","att.core.replaceChar","att.core.restAPI","att.core.roundFloat","att.core.serviceDiscountCost","att.core.session","att.core.sessionTimeout","att.core.tel","att.core.truncName"]);
angular.module("att.core.tpls", ["template/navigation/navigation.html"]);
angular.module("att.core.HsiaProgressIcon", [])
.filter('getHSIAProgressIconClass',[
    function() {
        var getHSIAProgressIconClass = function(input,classType) {
            if (input === undefined) {
                return ("dss-empty-progress-bar");
            }
            if (input < 65) {
                if (classType == "icon") {
                    return ("hidden");
                }
                if (classType == "progress") {
                    if (input <= 0) {
                        return ("progress-success dss-empty-progress-bar");
                    }
                    return ("progress-success");
                }
            } else if (input >= 65 && input <100) {
                if (classType == "icon") {
                    return ("cssIcon-alert");
                } else if (classType == "progress") {
                    return ('progress-warning');
                }
            } else {
                if (classType == "icon") {
                    return ("cssIcon-error");
                } else if (classType == "progress") {
                    return ('progress-danger');
                }
            }
            return ('');
        };
        return(getHSIAProgressIconClass);
    }
])
.filter('getUsageBarIconClass',[
 function () {
    var getUsageBarIconClass = function (input) {
        if (input === undefined || input<90) {
            return ("hidden");
        }
        if (input >= 90 && input < 100) {
            return("cssIcon-alert");
        }
        return ("cssIcon-error");
    };
    return getUsageBarIconClass;
}])
.filter('getUsageProgressBarClass',[
 function () {
    var getUsageProgressBarClass = function (input,usageData) {
        if (input === undefined || input<=0) {
            return ("progress-success dss-empty-progress-bar");
        }
        if (input < 65) {
            return ("progress-success");
        } else if (input >= 65 && input < 100) {
            return ('progress-warning');
        }
        return ('progress-danger');
    };
    return getUsageProgressBarClass;
}]);




angular.module("att.core.ProgressBar", [])
.filter('getProgressBarClass',['$rootScope',function ($rootScope) {
    var getProgressBarClass = function (input, classType,usageData) {
        if (input === undefined) {
            return ("dss-empty-progress-bar");
        }
        //If condition for US28220 to keep the progress bar green for employer data
        if(classType=="progress" && angular.isDefined(usageData) && angular.isDefined(usageData.isToggle) && (usageData.isToggle==="true" || usageData.isToggle===true)) {
            if (input <= 0) {
                return ("progress-success dss-empty-progress-bar");
            }
            return ("progress-success");
        }
        if (input < 65) {
            if (classType == "icon") {
                return ("hidden");
            }
            if (classType == "progress") {
                if (input <= 0) {
                    return ("progress-success dss-empty-progress-bar");
                }
                return ("progress-success");
            }
        } else if (input >= 65 && input <100) {
            if (classType == "icon") {
                return ("cssIcon-alert");
            } else if (classType == "progress") {
                return ('progress-warning');
            }
        } else {
            if (classType == "icon") {
                return ("cssIcon-error");
            } else if (classType == "progress") {
                return ('progress-danger');
            }
        }
        return ('');
    };
    return getProgressBarClass;
}]);




angular.module('att.core.angularCacheService', ['jmdobry.angular-cache'])
.constant('defaultCacheConfig',{
    capacity:Number.MAX_VALUE,
    maxAge:null,
    deleteOnExpire:'none',
    onExpire:null,
    cacheFlushInterval:360000,
    recycleFreq:1000,
    storageMode:'none',
    storageImpl:null,
    verifyIntegrity:true
 })
.provider('AngularCacheService', function AngularCacheServiceProvider() {
    var cacheArray = [];
    var onExpireFunction;
    var storageImpl = {
        getItem: function(key) {
        },
        setItem: function(key, value) {
        },
        removeItem: function(key) {
        }
    };
    this.createCache = function(cacheConfigArray) {
       cacheArray = cacheConfigArray;
    };
    this.$get = ['$angularCacheFactory','defaultCacheConfig',
    function angularCacheServiceFactory($angularCacheFactory,defaultCacheConfig){
        var cacheObject = {};
        for (var i = 0; i < cacheArray.length; i++) {
        var cacheobject = cacheArray[i];
        for (var cacheId in cacheobject) {
            if (angular.isUndefined(cacheArray[i][cacheId].onExpireFn)) {
                onExpireFunction = defaultCacheConfig.onExpire;
            }
            else {
                var fun = cacheArray[i][cacheId].onExpireFn;
                var arg = cacheArray[i][cacheId].onExpireFnArg;
                var Fn = Function;//To make jshint happy
                onExpireFunction = new Fn([arg], fun);
            }
            if (angular.isUndefined(cacheArray[i][cacheId].capacity)) {
                cacheArray[i][cacheId].capacity = defaultCacheConfig.capacity;
            }
            if (angular.isUndefined(cacheArray[i][cacheId].maxAge)) {
                cacheArray[i][cacheId].maxAge = defaultCacheConfig.maxAge;
            }
            if (angular.isUndefined(cacheArray[i][cacheId].deleteOnExpire)) {
                cacheArray[i][cacheId].deleteOnExpire =defaultCacheConfig.deleteOnExpire;
            }
            if(angular.isUndefined(cacheArray[i][cacheId].cacheFlushInterval)){
                cacheArray[i][cacheId].cacheFlushInterval = defaultCacheConfig.cacheFlushInterval;
            }
            if (angular.isUndefined(cacheArray[i][cacheId].recycleFreq)) {
                cacheArray[i][cacheId].recycleFreq = defaultCacheConfig.recycleFreq;
            }
            if (angular.isUndefined(cacheArray[i][cacheId].storageMode)) {
                cacheArray[i][cacheId].storageMode = defaultCacheConfig.storageMode;
            }
            if (angular.isUndefined(cacheArray[i][cacheId].storageImpl)) {
                storageImpl = defaultCacheConfig.storageImpl;
            }
            else {
                  if (window.localStorage) {
                    storageImpl = defaultCacheConfig.storageImpl;
                 }                        
            }
            if (angular.isUndefined(cacheArray[i][cacheId].verifyIntegrity)) {
                cacheArray[i][cacheId].verifyIntegrity = defaultCacheConfig.verifyIntegrity;
            }
            cacheObject[cacheId] = $angularCacheFactory(cacheId, {
                capacity: cacheArray[i][cacheId].capacity,
                storageMode: cacheArray[i][cacheId].storageMode,
                deleteOnExpire: cacheArray[i][cacheId].deleteOnExpire,
                onExpire: onExpireFunction,
                maxAge: cacheArray[i][cacheId].maxAge,
                cacheFlushInterval: cacheArray[i][cacheId].cacheFlushInterval,
                recycleFreq: cacheArray[i][cacheId].recycleFreq,
                storageImpl: storageImpl,
                verifyIntegrity: cacheArray[i][cacheId].verifyIntegrity
            });
          }
       }
       return cacheObject;
   }
   ];
   });
angular.module("att.core.attAmount", []).filter('attAmount', ['$filter', function($filter) {
        return function(data, format) {
            var parseAmount = function(numValue) {
                var isCredit = false;
                if (numValue < 0) {
                    isCredit = true;
                    numValue *= -1;
                }
                var stringValue = '';
                if ((isCredit && 'SIGNED' == format) || 'CR' == format) {
                    stringValue += '-';
                }
                stringValue += '$' + $filter('number')(numValue, [2]);
                if (isCredit && 'SIGNED' != format) {
                    stringValue += 'CR';
                }
                return stringValue;
            };
            if (typeof data === 'string') {
                return parseAmount(Number(data.replace(/\$/, '')));
            } else if (typeof data === 'number') {
                return parseAmount(data);
            } else {
                return '';
            }
        };
    }]);
angular.module('att.core.attDateFormat',[])
        .filter('attDateFormat', ['$filter',
        function( $filter) {
            return function(data, format) {
                var parseDate = function(dateObject, format) {
                    var formattedDate;
                    var dateFormat;
                    switch(format) {
                        case 'MMMd':
                            dateFormat = 'MMM d';
                            break;
                        case 'yyyyMMdd':
                            dateFormat = 'yyyyMMdd';
                            break;
                        case 'MMDD':
                            dateFormat = 'MM/dd';
                            break;
                        case 'MMMddyy':
                            dateFormat = 'MMM d, y';
                            break;
                        case 'mmddyyyy':
                            dateFormat = 'MM/dd/yyyy';
                            break;
                        case 'YYYYMMdd':
                            dateFormat = 'yyyy-MM-dd';
                            break;
                        case 'EEEEMMMddyy':
                            dateFormat = 'EEEE, MMMM d, y';
                            break;
                        default:
                            dateFormat = '';
                    }

                    if(dateFormat) {
                        formattedDate = $filter('date')(dateObject, [dateFormat]);
                    } else {
                        formattedDate = $filter('date')(dateObject);
                    }

                    var SpanishMonths = {
                        "Jan": "Ene",
                        "Feb": "Feb",
                        "Mar": "Mar",
                        "Apr": "Abr",
                        "May": "May",
                        "Jun": "Jun",
                        "Jul": "Jul",
                        "Aug": "Ago",
                        "Sep": "Sep",
                        "Oct": "Oct",
                        "Nov": "Nov",
                        "Dec": "Dic"
                    };
                    var SpanishDays = {
                        "Monday": "Lunes",
                        "Tuesday": "Martes",
                        "Wednesday": "Miércoles",
                        "Thursday": "Jueves",
                        "Friday": "Viernes",
                        "Saturday": "Sábado",
                        "Sunday": "Domingo"
                    };
                    var localeId = '';
                    if(window && window.navigator){ 
                        localeId = window.navigator.userLanguage || window.navigator.language;
                    }
                    if (dateObject) {
                        if(dateObject !== formattedDate) {
                            var monthInYear = $filter('date')(dateObject,'MMM');
                            var fullMonthInYear = $filter('date')(dateObject,'MMMM');
                            var dayInDate = $filter('date')(dateObject,'EEEE');
                            if(monthInYear && formattedDate.indexOf(monthInYear) !== -1) {
                                if(formattedDate.indexOf(fullMonthInYear) !== -1){
                                    formattedDate = formattedDate.replace(fullMonthInYear,monthInYear);
                                }
                                if(localeId && 'ES' === localeId.toUpperCase()) {
                                    formattedDate = formattedDate.replace(monthInYear, SpanishMonths[monthInYear]);
                                }
                            }
                            if(dayInDate && formattedDate.indexOf(dayInDate) !== -1 && dateFormat === 'EEEE, MMMM d, y') {
                                if(localeId && 'ES' === localeId.toUpperCase()) {
                                    formattedDate = formattedDate.replace(dayInDate, SpanishDays[dayInDate]);
                                }
                            }
                        }
                        return formattedDate;
                    } else {
                        return '';
                    }
                };

                var preFormatDate;
                if(data) {
                    if (data instanceof Date) {
                        preFormatDate = data;
                    } else {
                        // Create a date object to be parsed correctly
                        preFormatDate = new Date($filter('date')(data));
                    }
                    if (preFormatDate instanceof Date) {
                        return parseDate(preFormatDate, format);
                    }
                }
                // Return empty string, in case the data cannot be converted to expected format
                return '';
            };
        }
    ]);
angular.module('att.core.attFilterNumber',[])
   .filter('attFilterNumber', [ '$log', function($log) {
        return function(data, format) {
            if(data && typeof data === 'string') {
                var matchingExpression = '';
                if(format === 'AMOUNT') {
                    matchingExpression = /[^\d.]/g;
                } else {
                    matchingExpression = /[^\d]/g;
                }
                return data.replace(matchingExpression, '');
            } else {
                return '';
            }
        };
    }]);
angular.module("att.core.camelCase", [])
.filter('camelCase',
        function() {
            var camelCaseValue = function(input) {
                var result = "";
                if (!input) {
                    result = "";
                } else {
                    var inputArray = input.split(" ");
                    for (var i = 0; i < inputArray.length; i++) {
                        var temp = inputArray[i];
                        if (temp.length > 1) {
                            temp = angular.lowercase(temp);
                            var firstChar = angular.uppercase(temp.substr(0, 1));
                            temp = firstChar + temp.substr(1);
                        } else if (temp.length == 1) {
                            temp = angular.uppercase(temp);
                        }

                        if (temp) {
                            if (i === 0) {
                                result = temp;
                            } else {
                                result += " " + temp;
                            }
                        }
                    }
                    return result;
                }
            };
            return (camelCaseValue);
});
angular.module("att.core.convertToGB", [])
        .filter('convertToGB', function(){
            return function(input){
                var convertToGBNumber;
                if (input === undefined) {
                    convertToGBNumber = "";
                }
                convertToGBNumber = parseFloat(input / 1024).toFixed(2);
                return(convertToGBNumber);
            };
        }); 
angular.module('att.core.coreforms', [])
        .constant("CoreFormsUiConfig", {
            phoneMask: '(___) ___-____'
        })
        .directive("attAllow", function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ngModelCtrl) {

                    var pattern;
                    attr.$observe("attAllow", function(val) {
                        pattern = new RegExp(val, "g");
                    });
                    //var pattern = new RegExp(attr.attAllow, "g");
                    elm.bind('input', function() {
                        scope.$apply(function() {
                            ngModelCtrl.$setViewValue(elm.val().replace(pattern, ''));
                            ngModelCtrl.$render();
                        });
                    });
                }

            };
        })
        .directive("attAllowOnly", function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ngModelCtrl) {

                    var pattern;
                    attr.$observe("attAllowOnly", function(val) {
                        pattern = new RegExp(val, "g");
                    });
                    function clean(inputValue){
                        var finalInput, returnValue;
                        while ((finalInput = pattern.exec(inputValue)) !== null && finalInput[0] !== ''){
                            if(finalInput[0] !== inputValue && finalInput[0] !== ''){
                                if(finalInput.index === 0){
                                    inputValue = inputValue.replace(inputValue.substring(finalInput.index,finalInput[0].length+1),finalInput[0]);
                                    pattern.lastIndex = 0;
                                }else{
                                    inputValue = inputValue.replace(inputValue.substring(0,finalInput[0].length+2),finalInput[0]);
                                    pattern.lastIndex = 0;
                                }
                            }
                        }
                        /*Again the below match to handle if we type character 
                         * that is not allowed by regex as
                         * first character*/
                        returnValue = inputValue.match(pattern);
                        return returnValue ? Array.prototype.join.call(returnValue,''):null;
                    }
                    elm.on('input',function(){
                        var inputVal = elm.val();
                        if(!inputVal){
                            return;
                        }
                        var cleanInput = clean(inputVal);
                        if(cleanInput !== inputVal){
                            var start = this.selectionStart ? this.selectionStart:0,
                                cleanInputLength = cleanInput ? cleanInput.length : 0,
                                inputValLength = inputVal ? inputVal.length : 0;
                            var end = this.selectionEnd ? this.selectionEnd:0 + cleanInputLength - inputValLength;
                            ngModelCtrl.$setViewValue(cleanInput);
                            ngModelCtrl.$render();
                            this.setSelectionRange(start, end);
                        }
                    });
                }
            };
        })
        .directive("attAutoScroll", ['$window', function($window) {
                return {
                    restrict: "AC",
                    link: function(scope, elm) {
                        elm.bind("click", function(e) {
                            $window.scrollTo(0, 0);
                        });
                    }
                };
            }])
        .directive('attPhoneMask', ['$parse', 'CoreFormsUiConfig', function($parse, CoreFormsUiConfig) {
                return {
                    require: 'ngModel',
                    link: function(scope, iElement, iAttrs, ctrl) {

                        var B = navigator.userAgent.toLowerCase(), C = B.indexOf("android") > -1;
                        var A = '';
                        if (C) {
                            A = "__________";

                        }
                        else {
                            A = CoreFormsUiConfig.phoneMask;
                        }
                        iElement.attr("maxlength", A.length);

                        var checkValidity = function(unmaskedValue) {
                            var valid = false;
                            if (unmaskedValue){
                                valid = (unmaskedValue.length === 10);}
                            ctrl.$setValidity("mask", valid);
                            return valid;
                        };

                        var doGetCaretPosition = function(C) {

                            var B = 0, A;
                            if (document.selection) {
                                A = document.selection.createRange();
                                if(C.value === null)
                                {                                   
                                    A.moveStart("character", 0);
                                }
                                else
                                {
                                    A.moveStart("character", C.value.length);
                                }
                                B = A.text.length;
                            }
                            else {
                                if (C.selectionStart || C.selectionStart === "0") {
                                    B = C.selectionStart;
                                }
                            }
                            return(B);

                        };

                        var setCaretPosition = function(B, C) {

                            if (B.setSelectionRange) {
                                B.setSelectionRange(C, C);
                            }
                            else {
                                if (B.createTextRange) {
                                    var A = B.createTextRange();
                                    A.collapse(true);
                                    A.moveEnd("character", C);
                                    A.moveStart("character", C);
                                    A.select();
                                }
                            }

                        };

                        var maskInput = function(unmaskedValue) {
                            var E, D = unmaskedValue;
                            if (!D.length) {
                                return "";
                            }
                            var H, L, K, G, J, I;
                            J = [];
                            G = A.split("");
                            I = G.length;
                            L = D.substring(0, A.length);
                            K = D.replace(/[^0-9]/g, "").split("");
                            for (E = 0; E < I; E++) {
                                J.push(G[E] === "_" ? K.shift() : G[E]);
                                if (K.length === 0) {
                                    break;
                                }
                            }
                            D = J.join("");
                            setCaretPosition(D, H + Math.abs(L.length - J.length));
                            return D;
                        };


                        var handleKeyup = function(e) {
                            var E, D = iElement.val();
                            if (!D.length) {
                                return;
                            }
                            var H, L, K, G, J, I;
                            J = [];
                            G = A.split("");
                            I = G.length;
                            H = doGetCaretPosition(iElement);
                            L = D.substring(0, A.length);
                            K = D.replace(/[^0-9]/g, "").split("");
                            for (E = 0; E < I; E++) {
                                J.push(G[E] === "_" ? K.shift() : G[E]);
                                if (K.length === 0) {
                                    break;
                                }
                            }
                            D = J.join("");
                            setCaretPosition(D, H + Math.abs(L.length - J.length));
                            if (D === '('){
                                D = '';}
                            ctrl.$setViewValue(D);
                            scope.$apply(ctrl.$render());
                        };


                        // since we are only allowing 0-9, why even let the keypress go forward?
                        // also added in delete... in case they want to delete :)
                        var handlePress = function(e) {
                            var event = e || {};
                            var whichevent = e.which;

                            if (e.which) {
                                if (e.which < 48 || e.which > 57) {

                                    if (e.which !== 8 && e.which !== 9 && e.which !== 46 && e.which !== 13 && e.which !== 37 && e.which !== 39){
                                        var temp = e.preventDefault ? e.preventDefault() : e.returnValue = false;}
                                }
                                /*else {
                                 var value = ctrl.$modelValue;
                                 if (value && value.length >= 10)
                                 {
                                 e.preventDefault ? e.preventDefault():e.returnValue = false;
                                 }
                                 }*/
                            }
                        };


                        // i moved this out because i thought i might need focus as well..
                        iElement.bind('keyup', handleKeyup);
                        iElement.bind('keydown', handlePress);


                        // to handle setting the model as the view changes
                        var parser = function(fromViewValue) {
                            var clean = "";
                            if (fromViewValue && fromViewValue.length > 0) {
                                clean = fromViewValue.replace(/[^0-9]/g, '');
                            }
                            checkValidity(clean);
                            return clean;
                        };

                        //to handle reading the model and formatting it
                        var formatter = function(fromModelView) {
                            var input = '';
                            checkValidity(fromModelView);
                            if (fromModelView){
                                input = maskInput(fromModelView);}
                            return input;
                        };

                        ctrl.$parsers.push(parser);
                        ctrl.$formatters.push(formatter);
                    }

                };

            }])
        .directive('attErrors', ['$log','$parse', function($log, $parse) {
                return {
                    require: ["ngModel", "^form"],
                    scope: {},
                    link: function(scope, elm, attrs, ctrls) {

                        var modelCtrl = ctrls[0];
                        var formCtrl = ctrls[1];
                        var attErrorsObj = {};
                        var err = '';
                        scope.attErrors = attrs.attErrors;                  
                            
                        scope.$on('clearMyForm', function(event) 
                        {                            
                            modelCtrl.$setViewValue('');
                            modelCtrl.$render();                       
                            formCtrl.onSuccess(scope.$id);
                        });

                        scope.$on('SubmitForm', function(event) {
                            if (attrs.type === "text") {
                                if (!!elm.val()) {
                                    modelCtrl.$setViewValue(elm.val().trim());
                                    modelCtrl.$render();
                                }
                            }
                            modelCtrl.validate();
                        });

                        modelCtrl.validate = function() {
                            var err = '';

                            for (var errorKey in modelCtrl.$error) {
                                if (modelCtrl.$error[errorKey]) {
                                    err = attErrorsObj[errorKey];
                                    $log.log('error : ' + errorKey + ' : ' + attErrorsObj[errorKey]);
                                    break;
                                }
                            }
                            //error class has been moved into validations directive
                            if (err) {
                                while (!(elm.hasClass('control-group')))
                                {
                                    elm = elm.parent();
                                }
                                elm.addClass('error');
                                formCtrl.onError(err, scope.$id);
                            } else {
                                while (!(elm.hasClass('control-group')))
                                {
                                    elm = elm.parent();
                                }
                                elm.removeClass('error');
                                formCtrl.onSuccess(scope.$id);
                            }

                        };
                        var parser = function(viewValue) {
                            if (scope.submitted){
                                modelCtrl.validate();}

                            return viewValue;
                        };

                        //interpolating the error content values
                        attrs.$observe('attErrors', function(newValue) {
                            attErrorsObj = angular.fromJson(newValue);
                            $log.log(attErrorsObj);
                        });

                        modelCtrl.$parsers.push(parser);
                        
                    }


                };
            }])
        .directive('attform', ['$log', function($log){
                //ng-repeat within the template
                return {
                    require: 'form',
                    scope:false,
                    transclude: true,
                    template: '<div ng-if="showErrBox" class="alert alert-error">'+
                            '<div id="errorIcon" class="mobileSprite bigBadIcon fLF"></div>'+
                            '<div style="margin-left: 0px !important; height: 38px; display: table;">'+
                            '<div class="fs12 text-error mL10 boldIt" style="vertical-align: middle; display: table-cell;">'+
                            'Please review and correct the following:</div></div>'+
                            '<ul style="list-style-type: disc;"> <li ng-repeat="error in errMessage"><span class="text-error">{{error}}</span></li></ul></div>'+
                            '<br ng-if="showErrBox">'+
                            '<div ng-transclude></div>',
                    link: function(scope, element, attrs, ctrl) {

                        scope.showErrBox = false;
                        scope.errMessage = [];
                        var errorBucket = [];
                        
                        //controllers APIs instead of broadcasting
                        ctrl.onError = function(msg, sId) {

                            var pushNewErr = true;

                            if (errorBucket.length === 0) {
                                errorBucket.push({
                                    scopeId: sId,
                                    show: true,
                                    errMsg: msg
                                });
                            } else {
                                for (var i in errorBucket) {
                                    if (errorBucket[i].scopeId === sId) {
                                        errorBucket[i].show = true;
                                        errorBucket[i].errMsg = msg;
                                        pushNewErr = false;
                                    }
                                }
                                if (pushNewErr) {
                                    errorBucket.push({
                                        scopeId: sId,
                                        show: true,
                                        errMsg: msg
                                    });
                                }
                            }

                            updateErrorMsgs();
                        };

                        //controllers APIs instead of broadcasting
                        ctrl.onSuccess = function(sId) {
                            if (errorBucket.length !== 0) {
                                for (var i in errorBucket) {
                                    if (errorBucket[i].scopeId === sId) {
                                        errorBucket[i].show = false;
                                    }
                                }
                            }

                            updateErrorMsgs();
                        };

                        this.updateErrorMsgs = function() {

                            scope.errMessage.length = 0;

                            for (var i in errorBucket) {
                                if (errorBucket[i].show && scope.errMessage.indexOf(errorBucket[i].errMsg) === -1) {
                                    scope.errMessage
                                            .push(errorBucket[i].errMsg);
                                }
                            }
                            scope.showErrBox = (scope.errMessage.length > 0);
                        };
                        //disabling the submit button within the directive
                        
                        scope.EnableSubmitButtonClass = function() {

                            return ctrl.$invalid;
                        };

                        scope.EnableCancelButtonClass = function() {
                            return ctrl.$pristine;

                        };

                        scope.$root.cancelCurrent = function() {
                            $log.log('cancelCurrent called');
                            scope.$root.$broadcast('clearMyForm');
                        };

                        scope.SubmitForm = function() {
                            $log.log('SubmitForm called');
                            scope.submitted = true;
                            scope.$root.$broadcast('SubmitForm');
                        };

                        scope.RadioSubmitForm = function() {
                            $log.log('RadioSubmitForm called');
                            if (scope.submitted){
                                scope.$root.$broadcast('SubmitForm');}
                        };

                        scope.resetErrorMessage = function() {
                            errorBucket = [];
                            scope.showErrBox = false;
                            scope.submitted = false;
                        };

                    }
                };
            }])        
        .directive('attEsn', ['$parse', 'CoreFormsUiConfig', '$log', function ($parse, CoreFormsUiConfig, $log) {
            return {
                require: 'ngModel',
                link: function (scope, iElement, iAttrs, ctrl) {

                    var checkValidity = function (fieldValue) {
                        var valid = false;
                        if (fieldValue) 
                        {
                            if (fieldValue.length === 11)
                            {                               
                                 valid = !isNaN(fieldValue);                                
                                 $log.log(valid + " 11 digit numeric ESN");
                            }
                            else if (fieldValue.length === 8)
                            {                                    
                                  valid = isNaN(fieldValue);  
                                  $log.log(valid + " 8 digit Alpha Numeric ESN");
                            }
                        }
                        ctrl.$setValidity("attEsn", valid);
                        scope.attEsnValid=(valid)?"valid":"Invalid";
                        return valid;
                    };

                    // to handle setting the model as the view changes
                    var parser = function (fromViewValue) {
                        checkValidity(fromViewValue);
                        return fromViewValue;
                    };

                    ctrl.$parsers.push(parser);
                }
                };
        }])
        .directive('attImei', ['$parse', 'CoreFormsUiConfig', '$log', function ($parse, CoreFormsUiConfig, $log) {
        return {
                require: 'ngModel',
                link: function (scope, iElement, iAttrs, ctrl) 
                {
                    var checkValidity = function (fieldValue) 
                    {
                        var valid = false;
                        if (fieldValue) 
                        {
                            if (!isNaN(fieldValue) && fieldValue.length === 15)
                            {
                                
                                var sumImeiVal = 0;	
                                var posIMEI = [];
                                for (var imeiIndex=0; imeiIndex<15; imeiIndex++)
                                {
                                    posIMEI[imeiIndex] =  parseInt(fieldValue.substring(imeiIndex,imeiIndex + 1),10);
                                    
                                    if (imeiIndex % 2 !== 0)
                                    {
                                        posIMEI[imeiIndex] = parseInt((posIMEI[imeiIndex] * 2),10);                                        
                                    }
                                    
                                    if (posIMEI[imeiIndex] > 9)
                                    {    
                                        posIMEI[imeiIndex] = parseInt((posIMEI[imeiIndex] % 10),10) + parseInt((posIMEI[imeiIndex] / 10),10);                                        
                                    }
                                    sumImeiVal=sumImeiVal+parseInt((posIMEI[imeiIndex]),10);
                                }
                                
                                if((sumImeiVal % 10) === 0)
                                {
                                    valid = true;
                                    $log.log("valid IMEI");
                                }
                                else
                                {
                                    valid = false;
                                    $log.log("Invalid valid IMEI");
                                }                                
                            }
                            else 
                            {
                                valid = false;
                                
                            }
                            
                        }
                        scope.attImeiValid=(valid)?"valid":"Invalid";                        
                        ctrl.$setValidity("imei", valid);                        
                        return valid;
                    
                    };

                    // to handle setting the model as the view changes
                    var parser = function (fromViewValue) 
                    {
                        checkValidity(fromViewValue);
                        return fromViewValue;
                    };

                    ctrl.$parsers.push(parser);
                }
                };
        }])
;



angular.module('att.core.currencyConverter',[])
    .filter('currencyConverter', [ '$log', function($log) {
        return function(amt,currencyParameter) {
            var convertedAmt="";
            if(currencyParameter === undefined || currencyParameter.trim() === ''){
                convertedAmt="$"+amt;
            }else if(currencyParameter === 'CR'){
                convertedAmt="-$"+amt;
            }
            return convertedAmt;
        };
    }]);

angular.module("att.core.currencyFormat", [])
.filter('currencyFormat', function() {   
    return function(num,decimal) 
    {        
        return parseFloat(num).toFixed(decimal);
    };  
});
angular.module("att.core.filters", [])
.filter("removeSplChar", function() {
                    return function(text) {
                        if(text){
                            text = text.replace(/,/g, '&#44;').replace(/\|/g, '&#124;').replace(/~/g, '&#126;');
                        }
                        return text;
                
                    };
                })
.filter("embedLink", function() {
    return function(content, maskContent, link) {
        if(content){
            content = content.replace(maskContent, link);
        }
        return content;

    };
})
.filter("titlecase", function () {
    return function (text) {
        if (text !== 'AT&amp;T') {
            text = text.toLowerCase();
            text = text.replace(/(?:^|\s)\w/g,
                function (match) {
                    return match.toUpperCase();
                });
            return text.replace(/At&amp;t/g, 'AT&amp;T');
        } else {
            return text;
        }
    };
})
.filter("phone", function () {
    return function (text) {
        if (text && text.length === 10) {
            return "(" + text.substring(0, 3) + ") " + text.substring(3, 6) + "-" + text.substring(6, 10);
        } else {
            return text;
        }
    };
})
.filter("unphone", function () {
    return function (text) {
        if (text && text.length === 14) {
            text = text.substring(1, 4) + text.substring(6, 9) + text.substring(10, 14);
        }
        return text;

    };
});
angular.module('att.core.footerContentFormat',[])
.filter('footerContentFormat',[ 
    '$rootScope',
    function ($rootScope) {
        var footerContentFormat = function (input, type) {
            if (input === undefined || input === "") {
            return ("");
            }
            var st = input.split('.');

            if (type == "remove") {
                return (st['0'] + ".");
            } else if (type == "keep") {
                return (st['1'] + ".");
            }
            return ("");
        };
        return (footerContentFormat);
}]);

angular.module("att.core.formatSubscriberCTN", ['ngSanitize'])
.filter('formatSubscriberCTNNumber', function(){
    var formatSubscriberCTNNumber = function(input){
        if (input === undefined) {
            return("");
        }
        return("(" + input.substr(0, 3) + ") " + input.substr(3, 3) + "-" + input.substr(6, 4));
    };
    return (formatSubscriberCTNNumber);
})
.filter('formatSubscriberCTNNumberPD', ['$sce', function($sce) {
    return function(input, className) {
        if (input === undefined || !input) {
            return ("");
        }
        //Remove non-numeric characters
        input = input.toString().replace(/[^0-9]+/g, '');
        if (!input || input === "") {
            return("");
        }
        /*
        * Since there is no country code prepended in the subscriber numbers
        */
        if (input.length > 10 && input.length !== 11) {
            input = input.slice(0, 10);
        }
        var country, city, number;
        switch (input.length) {
            case 7:
                country = 1;
                city = "";
                number = input.slice(0, 7);
                break;
            case 10:
                country = 1;
                city = input.slice(0, 3);
                number = input.slice(3, 10);
                break;
            case 11:
                country = input.substr(0, 1);
                city = input.slice(1, 4);
                number = input.slice(4, 11);
                break;
            default:
                return input;
        }

        if (country === 1) {
            country = "";
        }
        else {
            country = country + "&nbsp;";
        }
        if (city !== "") {
            city = "&#40;" + city + "&#41;&nbsp;";
        }
        if (className === undefined || className === "" || !className) {
            className = "pdtMobileNumber";
        }
        var output = "<span x-ms-format-detection='none' class='" + className + " displayInlineImportant' format-detection='no'>" + country + '' + city + "<span x-ms-format-detection='none' format-detection='no' class='displayInlineImportant'>" + number.slice(0, 3) + "</span>&#8209;<span x-ms-format-detection='none' format-detection='no' class='displayInlineImportant'>" + number.slice(3) + "</span></span>";

        return($sce.trustAsHtml(output));
    };
}])               
.filter('formatSubscriberCTNNumberDotted', function(){
        return function(input) {
            if (input === undefined) {
                return ("");
            }
            if (input.length > 10) {
                input = input.slice(0, 10);
            }
            return input.substr(0, 3) + "." + input.substr(3, 3) + "." + input.substr(6, 4);
        };
})        
.filter('formatSubscriberCTNNumberDT', ['$sce', function($sce){
        return function(input, className) {
            if (input === undefined) {
            return ("");
        }
        if (className === undefined || className === "") {
            className = "dtdMobileNumber";
        }
        var output = '<a href="tel:' + input + '" class="' + className + '" x-ms-format-detection="phone">';
        output = output + "(" + input.substr(0, 3) + ") " + input.substr(3, 3) + "-" + input.substr(6, 4);
        output = output + '</a>';
        return($sce.trustAsHtml(output));
        };
}]);
angular.module("att.core.getCMSContent", []).filter('getCMSContent', [
    '$rootScope',
    function ($rootScope) {
    /*
     * @input can be blank
     * @page_name: Name of the page
     * @section_name: Name of the section
     * @type: Can be section, label, link
     * @field_name: name of the field, can be sepearated by (.) in case of different field value required instead of Label
     * @content: CMS content
     * @replacers: json string
     */
    var getCMSContent = function (input,page_name, section_name, field_name, type, content, replacers) {
        var res = '';
        if (content === undefined || content === "") {
            return (res);
        }
        var labelField = "Label";

        if (field_name !== undefined && field_name.indexOf(".") !== -1) {
            var field_names = field_name.split(".");
            field_name = field_names['0'];
            labelField = field_names['1'];
        }

        if (content[page_name] !== undefined) {
            content = content[page_name];
        }
        if (content[section_name] !== undefined) {
            if (type.toLowerCase() === "section") {
                if (content[section_name][field_name] !== undefined) {
                    res = content[section_name][field_name];
                }
            } else if (type.toLowerCase() === "link") {
                if (content[section_name]['Links'] !== undefined && content[section_name]['Links'][field_name] !== undefined && content[section_name]['Links'][field_name][labelField] !== undefined) {
                    res = content[section_name]['Links'][field_name][labelField];
                }
            } else {
                if (content[section_name]['FieldLabels'] !== undefined && content[section_name]['FieldLabels'][field_name] !== undefined && content[section_name]['FieldLabels'][field_name][labelField] !== undefined) {
                    res = content[section_name]['FieldLabels'][field_name][labelField];
                }
            }
        }
        if (res !== '' && replacers !== undefined && replacers !== "") {
            try {
                var val = eval;
                replacers = val("(" + replacers + ")");
                for (var i in replacers) {
                    res = res.replace(i, replacers[i]);
                }
            } catch (e) {}
        }
        return (res);
    };

    return (getCMSContent);
}]);
angular.module("att.core.gnsess", [])

        .constant("GlobalNavSessionConfig", {settings: {cookieName: "GNSESS", domain: ".att.com"}})

        .service("GNSESS", ['GlobalNavSessionConfig', '$window', '$log', '$filter', function(GlobalNavSessionConfig, $window, $log, $filter) {
        var self = this;
        var settings = GlobalNavSessionConfig.settings;
        var local = {value: {}, raw: ""};
//    return{
        var _read = function()
        {
            var globalNavCookie = {"LOCALE": ['en_US']};
            var allCookies = $window.document.cookie.split('; ');
            for (var i = 0; i < allCookies.length; i++)
            {
                var cookiePair = allCookies[i].split('=');
                var cookieName = cookiePair[0];
                cookiePair.shift();
                var cookieValue = cookiePair.join('=');
                if (cookieName == GlobalNavSessionConfig.settings.cookieName)
                {
                    try
                    {
                        local.raw = cookieValue;
                        //globalNavCookie = new Function("return " + cookieValue)();
                        //globalNavCookie = eval(cookieValue);
                        //globalNavCookie = $eval("return " +cookieValue);
                        globalNavCookie = angular.toJson(cookieValue);
                        //console.log(globalNavCookie);
                        local.value = globalNavCookie;
                    }
                    catch (e)
                    {
                        local.value = {};
                        $log.error(e);
                    }
                }
            }
            return self;
        };

        var _save = function(value)
        {
            if (value)
            {
                local.raw = settings.cookieName + "=" + angular.toJson(value) + ";path=/" + ((settings.domain.length) ? ";domain=" + settings.domain : "");
                $window.document.cookie = local.raw;
                local.value = value;
                return self;
            }
            else
            {
                return _save(local.value);
            }
        };

        var _locale = function(locale)
        {
            if (locale)
            {
                local.value.LOCALE = locale;
                return self;
            }
            else
            {
                // self.read();
                if (local.value && local.value.LOCALE)
                {
                    return local.value.LOCALE;
                }
                else
                {
                    return null;
                }
            }
        };

        var _clear = function()
        {
            local = {value: {}, raw: ""};
//            return self;
        };

        var _keepAlive = function()
        {
            return true;
        };
        return{
            read: function() {
                return _read();
            },
            save: function(value) {
                return _save(value);
            },
            locale: function(locale) {
                return _locale(locale);
            },
            clear: function() {
                return _clear();
            },
            keepAlive: function() {
                return _keepAlive();
            }

        };
//    };
    }]);
angular.module('att.core.language', [])
        .constant("languageConfig", {
                "defaultLocale": "en-US",
                "serviceURI": "/UICommonServices/rest/userlocale",
                "langComponentObjName": "languageComponent",
                "pathId": "languageId.languageContent.language",
                "preferedLangSource": "object" //can be file or object, if file it will take from configuration and
                        //if object it will take from component stored in session.In case of object 
                        //we have to pass pathId and object name as stored in session.
            })
        .constant("languageComponent", {
                "languageId": {
                    "languageContent": {
                        "language": "en-US"
                    }
                }
        })
        .service("languageServices",
        [
            '$log',
            '$q',
            '$http',
            'languageConfig',
            function(
                    $log,
                    $q,
                    $http,
                    languageConfig
                    ) {
                
                 var langCode="";                

                var _getLang = function() {

                    var deferred = $q.defer();
                    var uri = languageConfig.serviceURI;
                    var success = function(data) {
                        if (data && data.data && data.data.preferredLanguageCode) {
                            var locale = data.data.preferredLanguageCode;
                            $log.info("languageService::success::locale is => " + locale);
                            deferred.resolve(data.data);
                        } else {
                            deferred.resolve(getLocale());
                        }
                    };
                    var error = function(error) {
                        $log.error("languageService::error::not received language in response and setting default language from properties");
                        deferred.resolve(getLocale());
                    };

                    if (angular.isString(uri) && uri.length > 0) {
                        $http.get(uri).then(success, error);
                    } else {
                        deferred.resolve(getLocale());
                    }
                    return deferred.promise;

                };
                var getLangFromComponent = function() {
                    var languageComponent = JSON.parse(sessionStorage.getItem("languageComponent")),
                            language = null;
                    if (angular.isObject(languageComponent)) {
                        for (var i = 0, path = (languageConfig.pathId).split('.'), len = path.length; i < len; i++) {
                            if (languageComponent[path[i]]) {
                                if (i + 1 === len) {
                                    language = languageComponent[path[i]];
                                } else {
                                    languageComponent = languageComponent[path[i]];
                                }
                            } else {
                                $log.warn("languageComponent is not an object or the path is wrong :: picking default language");
                            }
                        }
                    } else {
                        $log.warn("languageComponent is not an object or the path is wrong :: picking default language");
                    }
                    return language || languageConfig.defaultLocale;
                };

                var getLocale = function() {
                    var locale,
                            langCode,
                            defaultData;
                    if (languageConfig.preferedLangSource === 'object') {
                        locale = getLangFromComponent();
                    } else {
                        locale = languageConfig.defaultLocale;
                    }
                    langCode = locale.split('-')[0];
                    defaultData = {preferredLocale: locale, preferredLanguageCode: langCode, config: true};
                    return defaultData;
                };
                _getLang().then(function(data){
                if ( data && data.preferredLanguageCode) {
                langCode = data.preferredLanguageCode;
                }
                });
                
                return {
                    getLang: _getLang
                };
            }]);
angular.module('att.core.location', [])
        .constant('ManageLocationUri',
        {
            location: {
                credentials: 'Amf3khlDckLVtYJ_ehQ-FOLXofiaH6ETAID7AH4N_p7HT-cJRb13cLQhjeg2JzeE',
                uri: '//dev.virtualearth.net/REST/v1/Locations/',
                param: {
                    jsonp: 'JSON_CALLBACK'
                },
                geolocation: {
                    maximumAge: 60000, timeout: 5000
                },
                bypassGPS: {}
            }
        })
        .service('LocationService', ['$rootScope', '$q', '$log', '$http', 'ManageLocationUri', function($rootScope, $q, $log, $http, ManageLocationUri) {
        $log.log("entering location constructor");
        var scope = $rootScope;
        var log = $log;
        var q = $q;
        var http = $http;
        var credentials = ManageLocationUri.location.credentials;
        var locationUri = ManageLocationUri.location.uri;
        var locationParamJsonp = ManageLocationUri.location.param.jsonp;
        var geolocation = ManageLocationUri.location.geolocation;
        var bypassGPS = ManageLocationUri.location.bypassGPS;
        var _getGPS = function() {

            var deferred = $q.defer();

            var self = this;


            var success = function(position) {
                geolocation = true;
                scope.$apply(deferred.resolve({lat: position.coords.latitude, long: position.coords.longitude, query: false, geolocation: true}));
            };

            var error = function(error) {
                scope.$apply(deferred.resolve({geolocation: false}));
                //$scope.$apply(deferred.resolve(this.bypassGPS));
            };

            try
            {
                if (navigator.geolocation)
                {
                    if (angular.isDefined(bypassGPS.lat))
                    {
                        deferred.resolve(bypassGPS);
                    }
                    else
                    {
                        navigator.geolocation.getCurrentPosition(success, error, this.geolocation);
                        //alert(angular.isFunction(navigator.geolocation.getCurrentPosition));
                    }
                }
                else
                {
                    deferred.resolve({geoLocation: false});
                    geolocation = false;
                }
            } catch (e)
            {
                $log.error(e);
                deferred.resolve({geoLocation: false});
            }

            return deferred.promise;
        };

        var _saveLocation = function() {
            var deferred = $q.defer();
            self.getGPS().then(
                    function(data) {
                        $log.log("data.geolocation" + data.geolocation);
                        if (data.geolocation) {
                            var locData = data;
                            $log.log(data);
                            localStorage.setItem("myLat", data.lat);
                            localStorage.setItem("myLong", data.long);
                            localStorage.setItem("isGeo", "yes");
                            var url = locationUri + data.lat + "," + data.long + "?output=json&key=" + credentials + "&jsonp=" + locationParamJsonp;
                            $log.log("url=" + url);
                            $http.jsonp(url)
                                    .success(
                                    function(data) {
                                        $log.log("SUCCESS");
                                        $log.log(data);
                                        var zip = data.resourceSets[0].resources[0].address.postalCode;
                                        var state = data.resourceSets[0].resources[0].address.adminDistrict;
                                        localStorage.setItem("zip", zip);
                                        localStorage.setItem("state", state);
                                        deferred.resolve(locData);
                                    }
                            )
                                    .error(
                                    function(data) {
                                        $log.log("FAILURE");
                                        $log.log(data);
                                        deferred.reject(data);
                                    }
                            );
                        } else {
                            deferred.reject(data);
                        }
                    });
            return deferred.promise;
        };
        return {
            getGPS: function() {
                return _getGPS();
            },
            saveLocation: function() {
                return _saveLocation();
            }
        };
    }]);

angular.module('att.core.logging', [])

.constant('errorLoggingConfig', {
    "Loglevel": 'info', //Valid values are info,warn,error. 
    "LoggingType": 'both', // valid values are server/console/both
    "baseUrl": '/UICommonServices/rest/log', //service url for sending logs to server
    "baseHeaderUrl": '/LoggingService/rest/log/header', //service url for sending logs header to server
    "logBatchSize": 5  //Log messages are sent to server in Batchs
})

.factory('LoggerFactory', ['errorLoggingConfig', function(errorLoggingConfig) {

    var loggerFactory = {
        serviceUrl: errorLoggingConfig.baseUrl || "",
        batchSize: errorLoggingConfig.logBatchSize || 1,
        loggerName: errorLoggingConfig.loggerName || "myATTMobileFirstlog",
        batchBuffer: [],
        info: function(logObject) {
            return LogAppenders.log(getInfoLogLevel(), logObject);
        },
        warn: function(logObject) {
            return LogAppenders.log(getWarnLogLevel(), logObject);
        },
        error: function(logObject) {
            return LogAppenders.log(getErrorLogLevel(), logObject);
        }
    };
    function getInfoLogLevel() {
        return 3000;
    }
    function getWarnLogLevel() {
        return 4000;
    }
    function getErrorLogLevel() {
        return 5000;
    }
    var LogItem = (function() {
        function LogItem(l, m, n, t) {
            this.l = l;
            this.m = m;
            this.n = n;
            this.t = t;
        }
        return LogItem;
    })();
    function stringifyLogObject(logObject) {
        switch (typeof logObject) {
            case "object":
                if ((logObject instanceof String) || (logObject instanceof Number) || (logObject instanceof Boolean)) {
                    return logObject.toString();
                } else {
                    return JSON.stringify(logObject);
                }
                break;
            case "string":
                return logObject;
            case "number":
                return logObject.toString();
            case "boolean":
                return logObject.toString();
            case "undefined":
                return "undefined";
            default:
                return "unknown";
        }
    }
    var LogAppenders = {
        logger: function(level, message) {
            var logItem;
            logItem = new LogItem(level, message, loggerFactory.loggerName, new Date().getTime());
            loggerFactory.batchBuffer.push(logItem);
            if (loggerFactory.batchBuffer.length >= loggerFactory.batchSize) {
                this.sendBatch();
                return;
            }
        },
        sendBatch: function() {
            if (loggerFactory.batchBuffer.length === 0) {
                return;
            }
            LogAppenders.sendLogItems(loggerFactory.batchBuffer);
            loggerFactory.batchBuffer.length = 0;
        },
        sendLogItems: function(logItems) {
            var logItemsJson = JSON.stringify({
                lg: logItems
            });
            var xhr = new XMLHttpRequest();
            xhr.open('POST', loggerFactory.serviceUrl);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(logItemsJson);
        },
        log: function(level, logObject) {
            var message;
            message = stringifyLogObject(logObject);
            LogAppenders.logger(level, message);
        }
    };
    loggerFactory['sendBatch'] = LogAppenders.sendBatch;
    return loggerFactory;
}])

.service('logService', [function() {
    this.clientIdentifier = {};
    this.clientIdentifier.string = "userId:"; // TODO Provide business logic for identifying particular users logs on server.

    this.supressLogging = function(errortype, $delegate) {
        $delegate[errortype] = function(message) {
        };
    };

    this.logonconsole = function(LoggingType, _log_error, message) {
        if (LoggingType === 'both') {
            _log_error(message);
        }
    };
}])

.config(['$provide', 'errorLoggingConfig', function($provide, errorLoggingConfig) {
    var LoggingType = errorLoggingConfig.LoggingType;
    var Loglevel = errorLoggingConfig.Loglevel;
    if (LoggingType.toLowerCase() === 'server' || LoggingType.toLowerCase() === 'both') {
        $provide.decorator('$log', ['$delegate', 'errorLoggingConfig', 'logService', 'LoggerFactory', function($delegate, errorLoggingConfig, logService, LoggerFactory) {
                var _log_error = $delegate.error; // Saving the original behavior of log.error
                var _log_info = $delegate.info; // Saving the original behavior of log.info
                var _log_warn = $delegate.warn; // Saving the original behavior of log.warn
                var Loglevel = errorLoggingConfig.Loglevel;//Fetching log level from service
                try {
                    if (Loglevel.toLowerCase() === 'error') {
                        $delegate.error = function(message) {
                            LoggerFactory.error(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_error,
                                    message);
                        };
                        logService.supressLogging('info', $delegate);
                        logService.supressLogging('warn', $delegate);
                    } else if (Loglevel.toLowerCase() === 'warn') {
                        $delegate.warn = function(message) {
                            LoggerFactory.warn(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_warn,
                                    message);
                        };
                        $delegate.error = function(message) {
                            LoggerFactory.error(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_error,
                                    message);
                        };
                        logService.supressLogging('info', $delegate);
                    } else if (Loglevel.toLowerCase() === 'info') {
                        $delegate.warn = function(message) {
                            LoggerFactory.warn(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_warn,
                                    message);
                        };
                        $delegate.error = function(message) {
                            LoggerFactory.error(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_error,
                                    message);
                        };
                        $delegate.info = function(message) {
                            LoggerFactory.info(logService.clientIdentifier.string + message);
                            logService.logonconsole(LoggingType, _log_info,
                                    message);
                        };

                    }
                } catch (e) {
                    // console.log("attLoggingService.js :: $exceptionHandler - Unable to send log");
                }
                return $delegate;
            }]);

    } else {
        $provide.decorator('$log', ['$delegate', function($delegate) {
                if (Loglevel === 'error' || Loglevel === 'ERROR') {
                    $delegate.info = function(message) {
                    };
                    $delegate.warn = function(message) {
                    };
                } else if (Loglevel === 'warn' || Loglevel === 'WARN') {
                    $delegate.info = function(message) {
                    };
                }
                return $delegate;
            }
        ]);
    }
}])

.config(['$provide', 'errorLoggingConfig', function($provide, errorLoggingConfig) {
    var LoggingType = errorLoggingConfig.LoggingType;
    if (LoggingType.toLowerCase() === 'server' || LoggingType.toLowerCase() === 'both') {
        $provide.decorator("$exceptionHandler", ['$delegate', 'logService', 'LoggerFactory', function($delegate, logService, LoggerFactory) {
                return function(exception, cause) {
                    $delegate(exception, cause);
                    try {
                        var exceptionLog = (exception.message && exception.stack.indexOf(exception.message) === -1) ? 'Error: ' + exception.message + '\n' + exception.stack : exception.stack;
                        LoggerFactory.error(logService.clientIdentifier.string + exceptionLog);
                    } catch (e) {
                        // console.log("attLoggingService.js :: $exceptionHandler - Unable to get exception.stack");
                    }
                };
            }
        ]);
    }
}]);
angular.module("att.core.mapNumIndexToMonth", []).filter('mapNumIndexToMonth', function() {
    return function(numIndex) {
        var mappedMonth = "";
        if (numIndex == "1" || numIndex == "1.0") {
            mappedMonth = "Jan";
        }
        if (numIndex == "2" || numIndex == "2.0") {
            mappedMonth = "Feb";
        }
        if (numIndex == "3" || numIndex == "3.0") {
            mappedMonth = "Mar";
        }
        if (numIndex == "4" || numIndex == "4.0") {
            mappedMonth = "Apr";
        }
        if (numIndex == "5" || numIndex == "5.0") {
            mappedMonth = "May";
        }
        if (numIndex == "6" || numIndex == "6.0") {
            mappedMonth = "Jun";
        }
        if (numIndex == "7" || numIndex == "7.0") {
            mappedMonth = "Jul";
        }
        if (numIndex == "8" || numIndex == "8.0") {
            mappedMonth = "Aug";
        }
        if (numIndex == "9" || numIndex == "9.0") {
            mappedMonth = "Spt";
        }
        if (numIndex == "10" || numIndex == "10.0") {
            mappedMonth = "Oct";
        }
        if (numIndex == "11" || numIndex == "11.0") {
            mappedMonth = "Nov";
        }
        if (numIndex == "12" || numIndex == "12.0") {
            mappedMonth = "Dec";
        }
        return mappedMonth;
    };
});
angular.module('att.core.navigation', ['att.core.content'])

.constant("GlobalNavConfig", {
            menuUri: {
                english: "//m.att.com/shopmobile/globalnav/index.json?callback=ATTMobileMenuShunt.menuBuilder",
                spanish: "//m.att.com/shopmobile/es/globalnav/index.json?callback=ATTMobileMenuShunt.menuBuilder",
                fallback: "misc/demo/stub/mobileMenu.json"
            },
            hostName: {
                dss: "m.att.com",
                ecom: "m.att.com"
            },
            logIn: {
                english: "Log In",
                spanish: "Ingresar"
            },
            logOut: {
                english: "Log Out",
                spanish: "Salir"
            },
            showHeaderforce : true,
            showMenuIcon : true,
            hidesSearchBar: false
        })

/* ManageSearchUri */
.constant('ManageSearchUri', {
    remote: 'https://m.att.com',
    pivotClass: {
        find: '.grayTab',
        withoutPivot: 'dividerBefore',
        withPivot: ''
    },
    suggest: {
        url: '/searchservice/GlobalSearch_AutoSuggest/select?q=userQuery:[SEARCHTERM]&indent=true&fl=userQuery&wt=json&fq=data_source_name:%22Popular%20Search%20Terms%22&sort=lookupCount%20desc&rows=5&json.wrf=autoCompleteCallback',
        token: '[SEARCHTERM]',
        callback: 'autoCompleteCallback'
    },
    search: {
        url: '/mobilesearch/search-results.html?m_search=[SEARCHTERM][SEARCHSOURCE]',
        token: {search: '[SEARCHTERM]', source: '[SEARCHSOURCE]'}
    },
    silo: ""
})

/* GlobalNavService */
    .service('GlobalNavService', ['$window', '$resource', '$q', '$log', '$http', '$rootScope', 'GlobalNavConfig', function($window, $resource, $q, $log, $http, $rootScope, GlobalNavConfig) {
    var navMenuScope, navMenuArray;
    var _call = function(scope, model, fallbackUri, serviceUri, callback) {
        navMenuScope = scope;
        navMenuArray = model;
        var defer = $q.defer();
        try {
            var callbackVal = callback + '_value';
            // creating the hard coded callback call to accept the json-p data
            if (angular.isDefined(callback)) {
                $window[callback] = function(data) {
                    $window[callbackVal] = data;
                };
            }

            $log.info('INFO :: httpWithFallbackService : Calling service ' + serviceUri + '. Trying to load data from REST service');
            $log.info('INFO :: httpWithFallbackService : Service URL is ' + serviceUri);
            $log.info('INFO :: httpWithFallbackService : Fallback URL is ' + fallbackUri);
            $http.jsonp(serviceUri).success(function(data) {
                scope[model] = data;
                defer.resolve(data);
            })
                .error(function() {
                    if ($window[callbackVal]) {
                        scope[model] = $window[callbackVal];
                        defer.resolve(scope[model]);
                    } else {
                        $log.info('WARN :: httpWithFallbackService : Error Occurred. Trying to load data from static data file');
                        $http.get(fallbackUri)
                                .success(function(data) {
                                    $log.info('ERROR :: httpWithFallbackService : Success while calling fallback. Data is ' + JSON.stringify(data));
                                    scope[model] = data;
                                    defer.resolve(data);
                                }).error(function() {
                            $log.info('ERROR :: httpWithFallbackService : Error Occurred Again in fallback. Dead End!!');
                            defer.reject('ERROR :: httpWithFallbackService : Error Occurred Again in fallback. Dead End!!');
                        });
                    }
                });
        } catch (e) {
            $log.info('ERROR :: httpWithFallbackService : Exception Occurred. Trying to load data from static data file');
            $http.get(fallbackUri)
                    .success(function(data) {
                        scope[model] = data;
                        defer.resolve(data);
                    });
        }
        return defer.promise;
    };

    var _addMenuItem = function(menuName, menuURL) {
        var menuObj = {
            value: menuName,
            href: menuURL
        };
        navMenuScope[navMenuArray].menu.menuGroup.push(menuObj);
    };

    var _loadCss = function loadjscssfile(filename, filetype) {
        var fileref = null;
        if (filetype === "js") { //if filename is a external JavaScript file
            fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
            alert('called');
        }
        else if (filetype === "css") { //if filename is an external CSS file
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    };
        var _forceShowHeader = function() {
            GlobalNavConfig.showHeaderforce = true;
        };
        
        var _forceHideHeader = function() {
            GlobalNavConfig.showHeaderforce = false;
        };
        
        var _showSearchBar = function() {
            GlobalNavConfig.hidesSearchBar = false;
        };
        
        var _hideSearchBar = function() {
            GlobalNavConfig.hidesSearchBar = true;
        };
        
        var _showMenuIcon = function() {
            GlobalNavConfig.showMenuIcon = false;
        };
        
        
        var _hideMenuIcon = function() {
            GlobalNavConfig.hideMenuIcon = true;
        };
        
       

    return{
        call: function(scope, model, fallbackUri, serviceUri, callback) {
            return _call(scope, model, fallbackUri, serviceUri, callback);
        },
        addMenuItem: function(menuName, menuURL) {
            return _addMenuItem(menuName, menuURL);
        },
        loadjscssfile: function(filename, filetype) {
            return _loadCss(filename, filetype);
            },
            forceShowHeader: function() {
                return _forceShowHeader();
            },
            forceHideHeader: function() {
                return _forceHideHeader();
            },
            showSearchBar: function() {
                return _showSearchBar();
            },
            hideSearchBar: function() {
                return _hideSearchBar();
            },
            showMenuIcon: function() {
                return _showMenuIcon();
            },
            hideMenuIcon: function() {
                return _hideMenuIcon();
            }
    };
}])

.service("ThinNative", ['$window', function($window) {
    this.check = function() {
        var nameEQ = 'accessDomain' + "=",
                ca = $window.document.cookie.split(';'),
                i,
                c;
        for (i = 0; i < ca.length; i++) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                if (c.substring(nameEQ.length, c.length) === "native") {
                    return true;
                }
            }
        }
        return false;
    };
}])

/* attHeader */
   .directive('attHeader', ['ThinNative', '$window', '$document','CmsCacheService', function(ThinNative, $window, $document, CmsCacheService) {
                return{
                    restrict: 'A',
                    transclude: false,
                    replace: true,
                    templateUrl: 'template/navigation/navigation.html',
                    controller: ['$scope', 'GlobalNavService', 'ThinNative', '$rootScope', 'GlobalNavConfig','$timeout', function($scope, GlobalNavService, ThinNative, $rootScope, GlobalNavConfig,$timeout) {
                            var globalNavUrl;
                            var catoBlankUrl = "javascript";
                            catoBlankUrl = ":void(0)";                            

                            // Provided some time Interval to let all the window object variables are set
                            $timeout(function() {
                                $rootScope.getMenuItemURLHostName = function(url, id) {
                                    if (url) {
                                        url = trim(url);
                                        if (url.indexOf('//') === -1) {
                                            if (id === "myATT") {
                                                $scope.prependDssLinkLocation = $rootScope.setMenuItemURLHostName('dss');  
                                                return $scope.prependDssLinkLocation;
                                            }
                                            else {
                                                $scope.prependEcomLinkLocation = $rootScope.setMenuItemURLHostName('ecom');
                                                return $scope.prependEcomLinkLocation;
                                            }
                                        } else {
                                            return '';
                                        }
                                    } else {
                                        return catoBlankUrl;
                                    }
                                };

                                $rootScope.setMenuItemURLHostName = function(app) {
                                    var hostname = '',
                                            defaultHost = 'm.att.com',
                                            isEcom = (app === 'ecom'),
                                            isDss = (app === 'dss');

                                      //if the value is set in the constant use that
                                    if (isDss) {
                                        hostname = GlobalNavConfig.hostName.dss;
                                        if (hostname !== '')
                                        {
                                            hostname = location.protocol + '//' + hostname;
                                        }
                                        else {
                                            hostname = '';
                                        }
                                    }
                                    else if (isEcom) {
                                        hostname = GlobalNavConfig.hostName.ecom;
                                        if (hostname !== '')
                                        {
                                            hostname = location.protocol + '//' + hostname;
                                        }
                                        else {
                                            hostname = '';
                                        }
                                    }
                                    else {
                                        // adding appropriate protocol if not yet added
                                        hostname = location.protocol + '//' + defaultHost;
                                    }

                                    return hostname;
                                };
                            }, 1000);

                            var langCode = CmsCacheService.getLanguage();
                            globalNavUrl = GlobalNavConfig.menuUri.english;


                            if (langCode) {

                                if (langCode === "es") {

                                    globalNavUrl = GlobalNavConfig.menuUri.spanish;

                                }

                            }

                            else {

                                langCode = "en";
                            }
                            
                            
                            /*Fecthing data and updating the more value for web*/
                            $timeout(function() {
                                GlobalNavService.call($scope, 'mobileMenu', GlobalNavConfig.menuUri.fallback, globalNavUrl, "menuBuilder").then(
                                        function(data) {
                                            for (var i = 0; i < data.menu.menuGroup.length; i++) {
                                                for (var j = 0; j < data.menu.menuGroup[i].menuItem.length; j++) {
                                                    if (data.menu.menuGroup[i].menuItem[j].id === "more") {
                                                        var morePath = data.menu.menuGroup[i].menuItem[j].href + "?referer=mAttComWeb";
                                                        angular.extend(data.menu.menuGroup[i].menuItem[j], {"href": morePath});
                                                    }
                                                }
                                            }
                                        }
                                );                        
                            }, 1000);

                        // Watch for the Log In Log Out label according to the language
                        $scope.checkLoginTextStatus = function(value) {
                            $scope.logIn = value;
                            return $scope.logIn;
                        };

                        $scope.$watch(function() {
                            if(langCode === "en"){
                            return GlobalNavConfig.logIn.english;
                        }
                        if(langCode === "es"){
                            return GlobalNavConfig.logIn.spanish;
                        }
                        }, $scope.checkLoginTextStatus);
                        
                        $scope.checkLogoutTextStatus = function(value) {
                            $scope.logOut = value;
                            return $scope.logOut;
                        };

                        $scope.$watch(function() {
                            if(langCode === "en"){
                            return GlobalNavConfig.logOut.english;
                        }
                        if(langCode === "es"){
                            return GlobalNavConfig.logOut.spanish;
                        }
                        }, $scope.checkLogoutTextStatus);

                        
                            
                            GlobalNavService.loadjscssfile("//0.ecom.attccc.com/styles/att/assets3.2.0/css/mGlobalnav.css", "css");


                            if (ThinNative.check()) {
                                $scope.hideHeader = true;
                            }
                            
                            //watch if Menu need to hide
                            $scope.$watch(function() {
                                return GlobalNavConfig.hideMenuIcon;
                            }, function(newValue, oldValue) {
                                if (newValue === true) {
                                $scope.hideMenu = true;
                                }
                                else {
                                 $scope.hideMenu = false;
                                }
                            });

                            //watch if Header need to hide/show 
                            $scope.$watch(function() {
                                return GlobalNavConfig.showHeaderforce;
                            }, function(newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    $scope.hideHeader = !newValue;
                                }
                            });
                                      

                        }],
                    link: function(scope, element, attrs) {
                        scope.checkLogin = false;
                        var body = $document.find('body');
                        var html = $document.find('html');
                        body.append('<div class="modal-backdrop fade" aria-hidden="true" style="z-index:-1; background-color:#333"></div>');
                        var globalHeader = element.parent();
                        globalHeader.css({'position': 'relative', 'left': '0px'});
                        var menuIcon = document.getElementById("menuIcon");
                        var iconMenu = document.getElementById("iconMenu");
                        var iconMenuSpoken = document.getElementById("iconMenuSpoken");
                        var logoHolder = document.getElementById("logoHolder");
                        var modalBackdrop = $document.find('.modal-backdrop');
                        var outerMMW = angular.element($document.find('#outerMMW'));
                        var divPage = element.parent();
                        var menuWrapper = angular.element($document.find('#menuWrapper'));                        
                        var pageHeight = divPage[0].clientHeight;
                        var portHeight = window.innerHeight;

                        if (pageHeight > portHeight) {
                            outerMMW.css({
                                'height': pageHeight + "px"
                            });
                        } else {
                            outerMMW.css({
                                'height': portHeight + "px"
                            });
                        }

                        // chaining for menuWrapper
                        menuWrapper
                                .css({
                                    'overflow': 'auto',
                                    'height': portHeight + 'px'
                                });



                        var getBoolean = function(value) {
                            if (value === true || value === 'true') {
                                return true;
                            }
                            else {
                                return false;
                            }
                        };

                        scope.checkLoginStatus = function(value) {
                            var isUserAuthenticated = value;
                            scope.checkLogin = isUserAuthenticated ? getBoolean(isUserAuthenticated) : false;
                            return scope.checkLogin;
                        };

                        scope.$watch(function() {
                            return sessionStorage.getItem('isUserAuthenticated');
                        }, scope.checkLoginStatus);

                        if (!ThinNative.check())
                        {
                            globalHeader.css({'margin-left': '0px'});
                        }

                        angular.element(menuIcon).bind('click', open);

                        function open(e) {
                             if (e) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                            var MoveSize1 = -30;
                            html.css({
                                'overflow-y': 'hidden',
                                'height': portHeight
                            });
                            
                            body.css({
                                'height': portHeight,
                                'overflow-y': 'hidden'
                            });
                            modalBackdrop.css({
                                'z-index': '1039'
                            });
                            angular.element(outerMMW).css({'display': 'block'});
                            iconMenuSpoken.innerHTML = "Menu open";

                            var globalHeader1 = globalHeader[0].style;
                            var globalHeaderCurr1 = parseInt(globalHeader1.left, 10);
                            if (globalHeaderCurr1 >= -240)
                            {
                                globalHeader1.left = globalHeaderCurr1 + MoveSize1 + "px";
                                setTimeout(open, 5);
                                clearTimeout(5);
                                modalBackdrop.addClass('in');
                            }
                            angular.element(menuIcon).unbind('click');
                            angular.element(menuIcon).bind('click', close);
                        }

                        function close(e) {
                            html.css({
                                'height': 'auto',
                                'overflow-y': 'auto'
                            });
                            body.css({
                                'height': 'auto',
                                'overflow-y': 'auto'
                            });
                            modalBackdrop.css({
                                'z-index': '-1'
                            });
                            angular.element(menuIcon).bind('click', open);
                            var outerMMWObj1 = outerMMW.style;
                            iconMenuSpoken.innerHTML = "Menu closed";

                            var globalHeader2 = globalHeader[0].style;
                            var globalHeaderCurr2 = parseInt(globalHeader2.left, 10);
                            if (globalHeaderCurr2 < 0)
                            {
                                globalHeader2.left = globalHeaderCurr2 + 30 + "px";
                                setTimeout(close, 5);
                            }
                            if (globalHeaderCurr2 >= 0)
                            {
                                angular.element(outerMMW).css({'display': 'none'});
                            }
                            modalBackdrop.removeClass('in');
                            angular.element(menuIcon).unbind('click');
                            angular.element(menuIcon).bind('click', open);
                        }
                    }
                };
            }])

/* attFooter */
.directive('attFooter', ['Language', 'ThinNative','$rootScope','$route', function(Language, ThinNative, $rootScope, $route) {
    return{
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: {
            showSegmtBar: '@',
            showLanguage: '@'
        },
        template: '<div> <footer att-content="Footer_Elements" att-page-content="Footer_Elements"><att-search></att-search>' +
                '<div id="footerNav" class="component" att-section-content="SegmentationFooter" ng-if="showSegmentBar">' +
                '<div class="ui-block-a row-fluid">' +
                '<a href="javascript:void(0)" att-link-content="ATTnet"></a>' +
                '</div>' +
                '<div class="ui-block-a row-fluid">' +
                '<a href="javascript:void(0)" att-link-content="Business"></a>' +
                '</div>' +
                '<div class="ui-block-a row-fluid">' +
                '<a href="javascript:void(0)" att-link-content="AboutATT"></a>' +
                '</div>' +
                '</div>' +
                '<div id="footerBtm" class="component" att-section-content="FooterSection" ng-if="!isThinClient">' +
                '<ul>' +
                '<li><a href="javascript:void(0)" role="link" att-link-content="FullSite"></a></li>' +
                '<li><a href="javascript:void(0)" att-link-content="Privacy"></a></li>' +
                '<li><a href="javascript:void(0)" att-link-content="TermsOfUse"></a></li>' +
                '</ul>' +
                '<ng-switch on="override">' +
                '<ul ng-switch-when="true">' +
                '<li><a href="javascript:void(0)" att-link-content="ContactUs"></a></li>' +
                '<li><a href="javascript:void(0)" att-link-content="Legal"></a></li>' +
                '<li><a  att-link-content="ESPANOL" ng-click="setLanguage()"></a></li>' +
                '</ul>' +
                '<ul ng-switch-when="false">' +
                '<li><a href="javascript:void(0)" att-link-content="ContactUs"></a></li>' +
                '<li><a href="javascript:void(0)" att-link-content="Legal"></a></li>' +
                '</ul>' +
                '</ng-switch>' +
                '<p><a href="javascript:void(0)" att-link-content="CopyRights"></a> <span att-label-content="CopyRights"></span></p>' +
                '</div>' +
                '</footer> </div>',
        link: function(scope, ele, attrs) {

            if (ThinNative.check()) {
                scope.isThinClient = true;
                if (attrs.showSegmtBar === "true") {
                    scope.showSegmentBar = true;
                }
                else {
                    scope.showSegmentBar = false;
                }
            } else {
                scope.showSegmentBar = (attrs.showSegmtBar === "true");
                scope.override = (attrs.showLanguage === "true");
            }
            $rootScope.$on('$viewContentLoaded', function() {  
                $rootScope.showLang =  $route.current.showLanguageinFooter; 
                $rootScope.segmentBar =  $route.current.showSegmtBar;
            });

            scope.$watch('showSegmtBar', function(newValue, oldValue) {
                scope.showSegmentBar = (newValue === "true");
            });

            scope.$watch('showLanguage', function(newValue, oldValue) {
                scope.override = (newValue === "true");
            });

            scope.toggleLanguage = function() {
                Language.toggle();
            };
        }
    };
}])

/* attSearchBox */
.directive('attSearchBox', ['$log', '$timeout', function($log, $timeout) {
        return {
            restrict: 'A',
            require: '^attSearch',
            link: function(scope, elm, attrs, searchCtrl) {
//      so i need to be able to handle
                // 1. On Focus, fire off the previous searches
                // 2. On clear, to fire off the previous searches and clear autosuggest... i think that i may add a search directive for that... $watch(searchTerm)
                // 3. On input, fire off the autosuggest
                elm.bind('focus', function(ev) {
                    $log.info(ev);
                    searchCtrl.showPrevious();
                });


                // utility timer for auto complete
                var delay = (function() {
                    var timer = 0;
                    return function(callback, ms) {
                        $timeout.cancel(timer);
                        timer = $timeout(callback, ms);
                    };
                }());


                // when user stops typing for 1000ms, run auto suggest query, avoid binding keyup for android 4.0.4 per mHR (documented conflict) trying to see if this has resolved
                //if (navigator.userAgent.indexOf('4.0.4') === -1) {
                elm.bind('keyup', function(ev) {
                    $log.info(ev);
                    delay(searchCtrl.autoSuggest, 1000);
                });
                //}

                elm.bind('blur', function(ev) {
                    $log.info(ev);
                    searchCtrl.closeSuggest();
                });

            }
        };
    }])

/* attSearchWidget */
.directive('attSearchWidget', ['$log', function($log) {
        return {
            restrict: 'AC',
            require: '^attSearch',
            scope: false,
            link: function(scope, elm, attrs, searchCtrl) {

                elm.bind('click', function(ev) {
                    $log.info(ev);
//                    angular.element('html,body').animate({
//                        scrollTop: elm.offset().top
//                    }, 1000);
                    $log.info('should scroll to attSearchWidget');
                });
            }
        };
    }])

/* attAriaActiveFocus */
.directive('attAriaActiveFocus', function() {
    return {
        restrict: 'A',
        require: '^attSearch',
        scope: false,
        link: function(scope, elm, attrs, searchCtrl) {
            elm.bind('focus', function(ev) {
                if (attrs.id) {
                    searchCtrl.setActiveSuggestion(attrs.id);
                }
            });
        }
    };
})



/* attSearch */
    .directive('attSearch', ['$log', '$window', 'ManageSearchUri', function($log, $window, ManageSearchUri) {
        return{
            restrict: 'EA',
            transclude: false,
            replace: true,
            template: "<div class=\"searchWidget\"  ng-hide=\"hideSearch\">"+
            "<search ng-class=\"pivotClass\" class=\"sidemenu\">"+
            "<div style=\"background-color: #f2f2f2;\" att-search-widget=\"\" class=\"field-group tooltip-onclick\" >"+
            "<form data-ajax=\"false\" ng-submit=\"search()\" id=\"subSearch\" style=\"background-color: #f2f2f2;\" class=\"searchForm ng-pristine ng-valid\">"+
            "<div role=\"combobox\" id=\"inp_wrap\">"+
            "<div class=\"hidden-spoken\">Enter one or two letters in the search field for a list of suggestions.</div>"+
            "<input type=\"text\" att-search-box=\"\" placeholder=\"Search AT&amp;T\" class=\"searchInput ui-input-text ui-body-c ng-pristine ng-valid\" id=\"m_search\" name=\"m_search\" data-type=\"search\" autocorrect=\"off\" aria-owns=\"predictionBucket\" aria-autocomplete=\"list\" autocomplete=\"off\" ng-model=\"searchTerm\" role=\"combobox\" title=\"search\" att-reset>"+            
            "<a class=\"searchClick\" href=\"javascript:void(0);\">"+
            "<span class=\"hidden-spoken\">Tap to search</span>"+
            "</a>"+
            "</div>"+
            "<div aria-expanded=\"false\" style=\"display: block;\" id=\"autoSearchVat\" class=\"autoSearchVat\">"+
            "<ul class=\"ui-listview ui-listview-inset ui-corner-all ui-shadow ng-hide\" ng-show=\"suggesting\" aria-activedescendant=\"\" aria-hidden=\"true\" aria-expanded=\"false\" id=\"predictionBucket\">"+
            "<li ng-repeat=\"suggestion in suggestions\" id=\"li{{$index}}\" role=\"option\" att-aria-active-focus>"+
            "<a ng-click=\"search(suggestion)\" data-ajax=\"false\">{{suggestion}} <i class=\"cssIcon-chevron-r-w\"></i></a>"+
            "</li>"+
            "</ul>"+
            "</div>"+
            "</form>"+
            "</div>"+
            "</search>"+
            "</div>",
           controller: ['$rootScope', '$scope', '$log', '$window', 'GlobalNavService', 'ManageSearchUri', 'GlobalNavConfig','ThinNative', function($rootScope, $scope, $log, $window, GlobalNavService, ManageSearchUri, GlobalNavConfig, ThinNative) {
                    
                    if (ThinNative.check()) {
                                $scope.showThinSearch = true;
                            }
                            
                    var initialize = function() {
                        $scope.suggestions = [];
                        $scope.suggesting = false;
                        $scope.activeSuggestion = '';
                        openTray(false);
                    };


                    var openTray = function(down) {
                        var autoSearchVat = document.getElementById("autoSearchVat");
                        var vat = angular.element(autoSearchVat);                   
                        self.trayDown = down;
                    };

                    var getPrevious = function() {
                        try {
                            if (localStorage.getItem("prevSearches") !== null) {
                                $scope.suggestions = localStorage.getItem("prevSearches").split('|');
                            }
                            else
                            {
                                $scope.suggestions = [];
                            }
                            $scope.suggesting = $scope.suggestions.length > 0;
                            if ($scope.suggesting)
                                {openTray(true);}
                        } catch (e)
                        {
                            $log.error(e);
                        }
                    };


//  initialization
                    var self = this;
                    self.trayDown = false;
                    $scope.pivotClass = "";
                    initialize();


// scope functions

                    $scope.search = function(s_val) {
                        var searchTerm = '',
                                searchSilo = '',
                                searchSource = '';

                        if (!s_val) {
                            searchTerm = $scope.searchTerm;
                        } else {
                            searchTerm = s_val;
                        }
                        if (angular.isDefined(searchSource)) {
                            searchSource = '&autoSuggestInd=Y';


                        }

                        if (ManageSearchUri.silo.length > 0) {
                            searchSilo = "&searchSilo=" + ManageSearchUri.silo;
                        }

                        if (searchTerm !== undefined && searchTerm !== '' && searchTerm !== null && searchTerm.match(/#|%|\^|\*|\(|\)|\[|\]|\/|\\/g)) {
                            searchTerm = searchTerm.replace(/#|%|\^|\*|\(|\)|\[|\]|\/|\\/g, '');
                        }
                        if (searchTerm !== undefined && searchTerm !== '' && searchTerm !== null) {
                            searchTerm = searchTerm.replace('&', '%26');
                            $window.location = ManageSearchUri.remote + ManageSearchUri.search.url.replace(ManageSearchUri.search.token.search, searchTerm).replace(ManageSearchUri.search.token.source, searchSource) + searchSilo;

                        } else {
                            $window.alert('Please enter a search term.');
                        }
                    };

// controller API: setActiveSuggestion, autoSuggest, showPrevious, closeSuggest

                    this.setActiveSuggestion = function(id) {
                        $scope.activeSuggestion = id;
                    };


                    this.autoSuggest = function() {
                        var url,
                                self = this,
                                currFormVal = angular.copy($scope.searchTerm);

                        if (currFormVal !== undefined && currFormVal !== '') {
                            if (currFormVal.match(/[^a-zA-Z0-9 ]/g)) {
                                currFormVal = currFormVal.replace(/[^a-zA-Z0-9 ]/g, '');
                            }
                            if (currFormVal !== '') {
                                url = ManageSearchUri.remote + ManageSearchUri.suggest.url.replace(ManageSearchUri.suggest.token, currFormVal.toLowerCase());
                                GlobalNavService.call($scope, 'autoSuggest', 'data/autoSuggest.json', url, ManageSearchUri.suggest.callback).then(function(data) {
                                    $scope.suggestions = [];
                                    if (angular.isDefined(data) && angular.isDefined(data.response) && angular.isDefined(data.response.docs))
                                        {angular.forEach(data.response.docs, function(value, key) {
                                            this.push(value.userQuery);
                                        }, $scope.suggestions);}
                                    $scope.suggesting = $scope.suggestions.length > 0;
                                    if ($scope.suggesting)
                                        {openTray(true);}
                                });
                            }
                        }
                    };

                    this.showPrevious = function() {
                        $scope.$apply(getPrevious);
                    };



                    this.closeSuggest = function() {
                        initialize();
                    };

// event listeners

                    //watch when searchTerm gets cleared.
                    $scope.$watch('searchTerm', function(newval, oldval) {
                        if (newval === oldval)
                            {return;}
                        if ((newval === undefined || newval === '') || (newval === undefined && newval === '' && newval.length === 0)) {
                            getPrevious();
                        }

                });
                //watch if search bar need to hide/show
                $scope.$watch(function () { return GlobalNavConfig.hidesSearchBar; }, function(newValue, oldValue) {
                    if(newValue!==oldValue){
                        $scope.hideSearch = newValue ;
                    }
                    });

                    //listening to when ng-view content has been loaded, check to see if there are pivot links on the partial
                    $rootScope.$on("$viewContentLoaded", function() {
                        if (angular.element(ManageSearchUri.pivotClass.find)[0])
                        {
                            $scope.pivotClass = ManageSearchUri.pivotClass.withPivot;
                        }
                        else
                        {
                            $scope.pivotClass = ManageSearchUri.pivotClass.withoutPivot;
                        }
                    });                
                }]
        };
    }
]);


angular.module('att.core.parseContactNumber', [])
        .directive('parseContactNumbers', ['$sce', '$log', function($sce, $log) {
                return {
                    restrict: 'A',
                    replace: true,
                    link: function(scope, element, attrs) {
                        function clean(obj, valueToRemove) {
                            for (var index = 0; index < obj.length; index++) {
                                if (obj[index] == valueToRemove) {
                                    obj.splice(index, 1);
                                    index--;
                                }
                            }
                            return obj;
                        }
                        function convertContactNumbers(st) {
                            if (st === undefined || st === '') {
                                return;
                            }
                            var rptFirst = new Array("");
                            var contactNumberArray = st.match(/([1]{1}[-\s\.][(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4})|([(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4})|([0-9]{3})/g);

                            //Split the string based on those contact numbers
                            var splitString = st.split(/([1]{1}[-\s\.][(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4})|([(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4})|([0-9]{3})/g);

                            //clean any undefined matches
                            splitString = clean(splitString, undefined);

                            //Create a new element to wrap our content html and anchor tags
                            var cnSpan = angular.element('<span>');

                            //initialize our index to be used to populate content around the anchor tags
                            var splitStringIndex = 0;
                            var elementString = "";
                            if (contactNumberArray !== undefined && contactNumberArray != null && splitString !== undefined && splitString != null)
                            {

                                for (var index = 0; index < contactNumberArray.length; index++)
                                {
                                    //Create the anchor tag with respective contact numbers
                                    elementString = "<a href='tel:" + contactNumberArray[index] + "' ";

                                    elementString += ">" + contactNumberArray[index] + "</a>";
                                    rptFirst[index] = angular.element(elementString);



                                    //Start building the element to be used by iterating through the content and adding the anchor tags in the correct position
                                    while (splitString[splitStringIndex] !== undefined && splitString[splitStringIndex] != contactNumberArray[index])
                                    {
                                        cnSpan.append(splitString[splitStringIndex]);
                                        splitStringIndex++;
                                    }
                                    splitStringIndex++;
                                    cnSpan.append(rptFirst[index]);
                                }

                                //Since the for loop ended at the last contact number append the rest of the content if any
                                while (splitStringIndex < splitString.length)
                                {
                                    cnSpan.append(splitString[splitStringIndex]);
                                    splitStringIndex++;
                                }
                            } else {

                                cnSpan.append(st);
                            }
                            cnSpan.append('</span><br>');
                            element.append(cnSpan);
                           
                        }
                        scope.$watch(attrs.parseContactNumbers, function(newValue) {
                            convertContactNumbers(newValue);
                        });
                    }
                };
            }]);
        
        


angular.module('att.core.parseErrorCode', [])
.filter('parseErrorCode', ['$log', function($log){
    var ErrorCodes = 
            [
                {key : 'INACTIVE', value: 'IneligibleSuspended' },
                {key : 'DEVICE_INCOMPATIBLE', value: 'IneligibleDeviceType' },
                {key : 'PENDING_PLAN', value: 'IneligibleFutureDatedChange' },
                {key : 'PARKED_UPGRADE', value: 'DeviceCurrentlySuspended' }
             ];                    
    return function(errorCode) 
       {
           try 
           {               
               for(var code in ErrorCodes){
                   if( ErrorCodes[code].key === errorCode){
                       return ErrorCodes[code].value;
                   }
               } 
            } 
            catch (err) 
            {
                $log.error('parseErrorCode :: Error occured in filter parseErrorCode. Returning original errorCode. Error:' + err);
            }           
           return errorCode;
       };
 }]);
angular.module("att.core.priceFilter", [])
  .filter('attPriceDollar', ['$filter', function($filter) {
    return function(data) {
        var parseDigits = function(stringValue) {
            if (stringValue && !isNaN(stringValue)) {
                var numbers = stringValue.replace(/-/, '').split('.');
                if (numbers.length === 1) {
                return $filter('number')(numbers[0]);
                } 
                else if (numbers.length === 2) {
                    if (numbers[0]) {
                        return $filter('number')(numbers[0]);
                    } 
                    else {
                        return '0';
                    }
                    } 
                else {
                        return '0';
                }
                return '0';
            } else {
                return '0';
            }
        };
        if (typeof data === 'string') {
            return parseDigits(data.replace(/\$/, ''));
        } else if (typeof data === 'number') {
            return parseDigits(String(data));
        } else {
            return '0';
        }
    };
}]).filter('attPriceCents', function() {
    return function(data) {
        var parseFractions = function(stringValue) {
            if (stringValue && !isNaN(stringValue)) {
                var numbers = stringValue.split('.');
                if (numbers.length === 1) {
                    return '00';
                } else if (numbers.length === 2) {
                    var num = numbers[1];
                    if (num.length === 1) {
                        return num + '0';
                    }
                    else if (num.length === 2) {
                        return num;
                    }
                    else if (num.length >= 3) {
                        return num.substr(0,2);
                    }
                } else {
                    return '00';
                }
            } else {
                return '00';
            }
        };
        if (typeof data === 'string') {
            return parseFractions(data.replace(/\$/, ''));
        } else if (typeof data === 'number') {
            return parseFractions(String(data));
        } else if (typeof data === 'undefined') {
            return '00';
        } else {
            return '00';
        }
    };
}).filter('attFilterDigits', function() {
    return function(data, num) {
        var parseDigitCharacter = function(stringValue) {
            var digits = /\d+/;
            if (stringValue) {
                var result = stringValue.match(digits);
                if (result) {
                    if (num && (typeof num === 'number')) {
                        return result[0].substr(-num);
                    }
                    return result[0];
                } else {
                    return '';
                }
            } else {
                return '';
            }
        };
        if (typeof data === 'string') {
            return parseDigitCharacter(data);
        } else if (typeof data === 'number') {
            return parseDigitCharacter(String(data));
        } else {
            return '';
        }
    };
});
      
angular.module("att.core.processString", [])
 .filter('processString', [ '$log','$sce', function($log,$sce) {
        return function(desc,lengthParameter) {
            var splitDescription = desc || '';
            try {                
                if( splitDescription && arguments.length > 2 ){
                    var strToRemove = '';
                    for( var i = 2; i < arguments.length ; i++ ){
                        strToRemove = arguments[i];
                        if( strToRemove ){
                            splitDescription = splitDescription.replace(strToRemove,"");
                        }
                    }
                }
                if(splitDescription) {
                    if(splitDescription.length > parseInt(lengthParameter,10)) {
                        var tempSplitDescription=splitDescription.substr(0,lengthParameter);
                        var lengthofLastIndex=tempSplitDescription.lastIndexOf(" ");
                        if(lengthofLastIndex!==-1){
                        splitDescription='<p>'+tempSplitDescription.substr(0,lengthofLastIndex)+'<br>'+splitDescription.substr(lengthofLastIndex,splitDescription.length)+'</br></p>';                       
                        }
                    }
                }
            } catch( Exception ){
                splitDescription = desc || '';
                $log.error("billingSplitWord :: Exception occurred :: Error message : "+ Exception.toString());
            }
            return $sce.trustAsHtml(splitDescription);
        };
    }]);
angular.module("att.core.rangeFilter", [])
        .filter('rangeFilter', function() {
            return function(input, total) {
                total = parseInt(total, 10);
                if (input.length === 0) {
                    for (var i = 0; i < total; i++) {
                        input.push(i);
                    }
                }
                return input;
            };
        });
angular.module("att.core.replaceChar", []).filter('attReplaceChar', function() {
        return function(data,replaceVal) {
            if(data !== undefined){
                return data.replace("[X]",replaceVal);
            }
        };
    });
/**
 * @ngdoc module
 * @name att.core.restAPI
 * @description
 * The `att.core.restAPI` module provides interaction support with Rest API 
 * services in angular application via the RestAPI service.
 */
/**
 * @ngdoc service
 * @name RestAPI
 * @requires $http, $q, $log
 * @description
 * A factory which creates a restApi object that lets you interact with Rest API
 * backend via get/post methods.
 */
angular.module('att.core.restAPI', [])
        .provider('RestAPI', function() {
            /*
             * @type {object}
             * Default headers and methods.
             */
            var headers = {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8"
            },
            methods = {'post': 'POST', 'get': 'GET'};
            /*
             * Creating local reference to global methods of angular.
             */
            var noop = angular.noop,
                    extend = angular.extend,
                    isObject = angular.isObject;
            /*
             * To avoid error in IE if there is no console object
             */
            var console = window.console || {};
            console.error = console.error || noop;
            /*
             * @function
             * @name clearAndCopy
             * @param {object}
             * @param {object}
             * @return {object}
             * Removes key-values from source and copy all which are own property
             * of destination.
             */
            function clearAndCopy(source, dest) {
                dest = dest || {};
                for (var dKey in dest) {
                    delete dest[dKey];
                }
                for (var sKey in source) {
                    if (source.hasOwnProperty(sKey)) {
                        dest[sKey] = source[sKey];
                    }
                }
                return dest;
            }
            /*
             * @function
             * @name setDefaultHeaders
             * @param {object}
             * @return {undefined}
             * Set the default headers for all request by overriding the existing 
             * default header value.This method need to be called from config block
             * of main module.
             */
            this.setDefaultHeaders = function(header) {
                if (isObject(header)) {
                    headers = clearAndCopy(header, headers);
                } else {
                    console.error('Expect object but found ' + typeof header +
                            ' in setDefaultHeaders() method call.');
                }
            };
            this.$get = ['$http', '$log', '$q', function($http, $log, $q) {
                    var httpConfig = {};
                    var successData, errorData, status;
                    var validateMap = {};
                    var apiServiceMethods = ['get', 'post'];
                    /*
                     * Checks of the given object is empty or not
                     */
                    function checkEmptyObject(obj) {
                        return Object.keys(obj).length <= 0;
                    }
                    /*
                     * Checks of the given input is a function or not
                     */
                    function checkFunction(fn) {
                        return typeof fn === 'function';
                    }
                    function validateUrl(url) {
                        return url;
                    }
                    /*
                     * Checks of the given object's result status 
                     */
                    function checkSuccessData(data) {
                        return data.Result.Status === 'SUCCESS' ||
                                data.Result.Status === 'PARTIAL_SUCCESS';
                    }
                    /*
                     * @function
                     * @name createHeaders
                     * @return {object}
                     * Combine default headers to request specific headers
                     */
                    function createHeaders(defaults, specific) {
                        var header = {};
                        if (!checkEmptyObject(specific)) {
                            header = extend(header, specific);
                        }
                        if (!checkEmptyObject(header)) {
                            return extend(header, defaults);
                        } else {
                            return defaults;
                        }
                    }
                    /*
                     * @function
                     * @name sendReq
                     * @param {object}
                     * @return {object}
                     * Call Rest API using http service and return promise
                     */
                    function sendReq(configObj) {
                        var deferObj = $q.defer(),
                                promise = deferObj.promise;
                        $http(configObj).then(function(response) {
                            deferObj.resolve(response);
                        }, function(response) {
                            deferObj.reject(response);
                        });
                        return promise;
                    }
                    /*
                     * @function
                     * @name readValidateJson
                     * @param {apiName(string)}
                     * @return promise
                     * Call Rest API using http service and return promise
                     * Read Keys to be validated
                     */
                    function readValidateKeys(obj, apiName) {
                        for (var key in obj) {
                            validateMap[apiName] = obj[key];
                        }
                        return validateMap;
                    }
                    /*
                     * @function
                     * @name getNodesFromObject
                     * @param {object}
                     * @return boolean
                     * Call Rest API using http service and return promise
                     */
                    function getNodesFromObject(theObject, nodeArray, idx) {
                        var flag = false;
                        for (var i = idx; i < nodeArray.length; i++) {
                            if (theObject instanceof Array) {
                                for (var j = 0; j < theObject.length; j++) {
                                    console.log(theObject[j]);
                                    flag = getNodesFromObject(theObject[j], nodeArray, idx);
                                }
                            }
                            else {
                                for (var prop in theObject) {
                                    if (nodeArray[i] === prop) {
                                        flag = true;
                                        idx = i + 1;
                                        if (idx === nodeArray.length)
                                        {
                                            i = idx;
                                            break;
                                        }
                                        else
                                        {
                                            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                                                flag = getNodesFromObject(theObject[prop], nodeArray, idx);
                                            }
                                        }
                                    }

                                }
                            }
                        }
                        return flag;
                    }
                    /*
                     * @function
                     * @name restApiService
                     * @param {srting}
                     * @param {object}
                     * @return {object}
                     * Return service object with get() and post() 
                     * method to make Rest request.
                     */
                    var restApiService = function(path, specificHeader, optionalKeys) {
                        var service = {};
                        service.url = path;
                        service.apiName = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
                        service.headers = specificHeader ?
                                createHeaders(headers, specificHeader) : headers;
                        if (optionalKeys && isObject(optionalKeys)) {
                            enableValidation = true;
                        }
                        else {
                            enableValidation = false;
                        }

                        angular.forEach(apiServiceMethods, function(method) {
                            service[method] = function(data, successCb, errorCb) {
                                var deferred = $q.defer(),
                                        promise = deferred.promise;
                                var isKeyExist = false;
                                if (successCb) {
                                    if (!checkFunction(successCb)) {
                                        $log.error('Expect callback(s) as function::RestAPI');
                                        return;
                                    }
                                }
                                if (errorCb) {
                                    if (!checkFunction(errorCb)) {
                                        $log.error('Expect callback(s) as function::RestAPI');
                                        return;
                                    }
                                }
                                httpConfig.headers = this.headers;
                                if (data && !checkEmptyObject(data)) {
                                    httpConfig.data = data;
                                } else {
                                    for (var key in httpConfig.headers) {
                                        if (key.toLowerCase() === 'content-type') {
                                            delete httpConfig.headers[key];
                                        }
                                    }
                                }
                                httpConfig.method = methods[method].toUpperCase();
                                httpConfig.url = this.url;
                                sendReq(httpConfig).then(function(response) {
                                    successData = response.data;
                                    status = response.status;
                                    if (enableValidation) {
                                        validateMap = readValidateKeys(optionalKeys, service.apiName);
                                        for (var i = 0; i < validateMap[service.apiName].length; i++) {
                                            var splitedNodes = validateMap[service.apiName][i].split('.');
                                            if (splitedNodes.length === 1) {
                                                if (successData.hasOwnProperty(splitedNodes))
                                                {
                                                    isKeyExist = true;
                                                }
                                                else {
                                                    isKeyExist = false;
                                                    break;
                                                }
                                            }
                                            else {
                                                var obj = successData[splitedNodes[0]];
                                                isKeyExist = getNodesFromObject(obj, splitedNodes, 1);
                                            }
                                        }
                                    }
                                    if ((isKeyExist && checkSuccessData(successData)) || (!enableValidation && checkSuccessData(successData))) {
                                        (successCb || noop)(successData, status);
                                        deferred.resolve(successData);

                                    } else {
                                        (errorCb || noop)(successData, status);
                                        deferred.reject(successData);
                                    }

                                }, function(response) {
                                    errorData = response.data === '' ? {} : response.data;
                                    status = response.status;
                                    (errorCb || noop)(errorData, status);
                                    deferred.reject(errorData);
                                });
                                if (!successCb) {
                                    return promise;
                                }
                            };
                        });
                        return service;
                    };
                    var restApi = {
                        call: function(path, specificHeader, OptionalKeys) {
                            if (!path || path.trim() === "") {
                                throw new Error('Expect an path but found empty' +
                                        ' string or null or undefined to call() :: RestService');
                            }
                            if (specificHeader && !isObject(specificHeader)) {
                                throw new Error('Expect an object as request specific' +
                                        ' header to call(), but found ' +
                                        typeof specificHeader + ' ::RestService');
                            }
                            return restApiService(path, specificHeader, OptionalKeys);
                        },
                        getDefaultHeaders: function() {
                            return headers;
                        }
                    };
                    return restApi;
                }];
        });
angular.module("att.core.roundFloat", [])
.filter('roundFloat', function() {
    return function(input) {
        var output = Math.round(input,10);
        return output;
    };
});
angular.module('att.core.serviceDiscountCost', [])
.filter('serviceDiscountCost', [
            '$log', function($log)
            {
                /**
 * Created by ap9601 on 1/29/14.
 */
(function() {
    // check for  conflicts
    var _isBlank=function(input){
        var result= angular.isUndefined(input) || input === null || input === "" || input === "null";

        if(!result && angular.isArray(input)){
            return input.length===0;
        }
        if(!result && typeof input=== "object"){
            for (var key in input) {
                return false;
            }
            return true;
        }
        return result;
    };
    angular.extend(angular, {"isBlank": _isBlank});

    var _isNotBlank=function(input){
        return !angular.isBlank(input);
    };
    angular.extend(angular, {"isNotBlank": _isNotBlank});

    var _isEquals=function(input1,input2){
        if(_isBlank(input1) || _isBlank(input2)){
            return false;
        }
        else
        {
            return input1 === input2;
        }
    };
    angular.extend(angular, {"isEquals": _isEquals});

    var _isEqualsIgnoreCase=function(input1,input2){
        if(_isBlank(input1) || _isBlank(input2)){
            return false;
        }
        input1=angular.uppercase(input1);
        input2=angular.uppercase(input2);

        return input1 === input2;
    };
    angular.extend(angular, {"isEqualsIgnoreCase": _isEqualsIgnoreCase});

    var _notEquals=function(input1,input2){
        return !angular.isEquals(input1,input2);
    };
    angular.extend(angular, {"isNotEquals": _notEquals});

    var _evalBoolean=function(input){
        if(angular.isBlank(input)){
            return false;
        }
        if(typeof input === "boolean"){
            return input;
        }
        if(angular.isString(input) && angular.isEqualsIgnoreCase("true",input)){
            return true;
        }
        return false;
    };
    angular.extend(angular, {"evalBoolean": _evalBoolean});
    var _safeEval=function(sourceObj,input){
        if(angular.isNotBlank(sourceObj) && angular.isNotBlank(input)){
            //alert(input);
            var inputArray=input.split(".");
            var arraySize=inputArray.length;
            var result=sourceObj;
            for(var i=0;i<arraySize;i++){
                var temp=result[inputArray[i]];
                if(angular.isNotBlank(temp)){
                    result=temp;
                }else{
                    return "";
                }
            }
            return result;
        }
        return "";
    };
    angular.extend(angular, {"safeEval": _safeEval});
}).call(this);

                var serviceDiscountCost = function(cost, discount, UOM)
                {
                    var num = null;
                    var  discountedCost;
                    var discountValue;
                    var price;
                    var hasServiceDiscount = angular.evalBoolean((angular.isNotBlank(UOM) && (angular.isEqualsIgnoreCase(UOM, "P") || angular.isEqualsIgnoreCase(UOM, "D")) && (angular.isNotBlank(discount) && parseFloat(discount) > 0)));
                    if (hasServiceDiscount)
                    {
                         discountedCost = 0;
                         discountValue = 0;
                         price = 0;
                        if (cost !== null)
                        {
                            price = parseFloat(cost);

                            //$log.info(price);
                        }

                        if (discount !== null)
                        {
                            discountValue = parseFloat(discount);
                            if ((discountValue > 0 && price > 0) && (UOM !== null && angular.isEqualsIgnoreCase(UOM, "P")))
                            {
                                discountValue = ((discountValue / 100) * price).toFixed(2);
                            }

                            //$log.info(discountValue);
                        }

                        if (price > 0 && discountValue > 0)
                        {
                            discountedCost = (price - discountValue).toFixed(2);
                            //$log.info(discountedCost);
                        }
                        else
                        {
                            discountedCost = price.toFixed(2);
                            //$log.info(discountedCost);
                        }

                        num = discountedCost;
                    }
                    else
                    {
                        //US29533 - added logic in to calculate cost and discount when no UOM is needed
                        if (cost !== null)
                        {
                            price = parseFloat(cost);
                            //$log.info(cost);
                        }

                        if (price > 0 && discount > 0)
                        {
                            discountValue = parseFloat(discount);
                            discountedCost = (price - discountValue).toFixed(2);
                            //$log.info(discountedCost);
                        }
                        else
                        {
                            discountedCost = price.toFixed(2);
                            //$log.info(discountedCost);
                        }

                        if (discountedCost > 0)
                        {
                            num = discountedCost;
                        }
                        else
                        {
                            num = parseFloat(cost).toFixed(2);
                        }
                        //US29533 - END
                    }
                    return num;
                };               
                return serviceDiscountCost;
            }]);
angular.module("att.core.session", [])
.constant("SessionKeeperConst", {namespace:"mrasSession",sessionObject:"current"})
.service("SessionKeeper", ['$rootScope', '$log', 'SessionKeeperConst',function($rootScope, $log, SessionKeeperConst){
    var session =    {
        namespace : SessionKeeperConst.namespace,
        obj : SessionKeeperConst.sessionObject,
        scope : $rootScope,
        log : $log   };    
    var _ReadSession = function(){
        var scope = session.scope;
        if(scope[session.obj]){return scope[session.obj];}
        if(sessionStorage && sessionStorage.getItem(session.namespace)){
            var val = sessionStorage.getItem(session.namespace);
            if(val && val != 'undefined'){
                var sessionJSON = JSON.parse(val);
                if(scope){
                    return (scope[this.obj] = sessionJSON);
                }
                else{
                    return sessionJSON;
                }
            }
        }
        return null;
    };           
    var _SaveSession = function(scope){
        scope = scope || session.scope;
        if(sessionStorage){
            try{
                var txt = JSON.stringify(scope[session.obj]);
                sessionStorage.setItem(session.namespace, txt);
            }
            catch(e){
                this.log.error(e);
            }
        }
        else{
            this.log.error("Session did not save.");
        }
    };           
    var _ClearSession = function(){
        if(sessionStorage){
            try{
                sessionStorage.removeItem(session.namespace);
                }
            catch(e)
            {}
        }
    };           
    return {
        read : function(){
            return _ReadSession();
        },
        save : function(){
            return _SaveSession();
        },
        clear : function(){
            return _ClearSession();
        }
    };
    }]);
/**
 * @ngdoc
 * @service SessionTimeout
 * @author AT&T
 * 
 * A provider service to track user's idle time
 * Provide options to configure for how much of time user should be idle and for how much 
 * time warning should be shown. This need to pass in module's config block by calling setTimeOutOptions() method.
 * @example 
 * angular.module('myApp',[]).config(function(SessionTimeoutProvider){
    SessionTimeoutProvider.setTimeOutOptions(
            {
                idleDuration : 10,
                warningDuration : 5
            }
        );
    });
 * Then we can call watch() method using SesssionTimer service to start time which will keep track 
 * of user for predefined idle time and will broadcast three events as: 
 * idleWarningStart- when idle time passed,
 * idleTimeout- when idle time+ warning time passed &
 * idleWarnCount- in each second during warning time to keep how much warning time remain.
 * @example
 * $rootScope.$on('idleTimeout', function(events, args){
 *  //custom code implementation to handle time out
 * }
 */
angular.module('att.core.sessionTimeout', [])
        .provider('SessionTimeout', function() {

    /**
     * @type object
     * contains default value for idleDuration and warningDuration, overridden when configured through provider
     * also contain events list in response to which will cancel the timer object.
     */
    var options = {
        idleDuration: 60, // in seconds (default is 60sec)
        warningDuration: 60 // in seconds (default is 60sec)
    };
    /**
     * @type object
     * contain events list in response to which will cancel the timer object.
     */
    var eventOptions = {
        events: 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart'
    };
    /**
     * to avoid error if window.console is not avialable in some browser.
     */
    var console = window.console || {};
    console.error = console.error || function(){};
    /**
     * @function setTimeOutOptions 
     * @param {object} timeOutOptions
     * @returns {undefined}
     * This method will iterate over the object keys passed and set the values to options
     * also do some validations to the object provided.
     * To know what key should be passed, see main doc. 
     */
    this.setTimeOutOptions = function(timeOutOptions) {
        try{
            
            if(angular.isObject(timeOutOptions)){
                
                if(Object.keys(timeOutOptions).length <=0){
                    throw new Error('Service::SessionTimeOut::SessionTimeoutProvider::Empty object to method setTimeOutOptions, assigning default value.');
                }
                if (timeOutOptions.idleDuration && timeOutOptions.idleDuration <= 0) {
                    throw new Error('Service::SessionTimeOut::SessionTimeoutProvider::idleDuration must be grater than 0, in seconds. So assigning default value 900s');
                }
                if (timeOutOptions.warningDuration && timeOutOptions.warningDuration <= 0) {
                    throw new Error('Service::SessionTimeOut::SessionTimeoutProvider::warningDuration must be grater than 0, in seconds. So assigning default value 60s');
                }
                for (var keys in timeOutOptions) {
                    if (keys in options) {
                        options [keys] = timeOutOptions [keys];
                    }else{
                        throw new Error('Service::SessionTimeOut::SessionTimeoutProvider::'+keys + ': Not a valid key.');
                    }
                }
            }else{
                throw new Error('Service::SessionTimeOut::SessionTimeoutProvider::Parameter is not an object, method setTimeOutOptions expects an object.');
            }
        }catch(e){
            if(console){
                console.error(e.message || e.stack ||e);
            }else{
                throw new Error(e.message || e.stack || e);
            }
        }
    };
    /**
     * 
     * @param {string} events
     * if want to set any other event instead of default events, can call from config block of module.
     * default event will be overridden.
     * @example 'mousemove keydown'
     * @returns {undefined}
     */
    this.setEventOptions = function(events) {
        eventOptions.events = events;
    };
    /**
     * @param $timeout
     * @param $rootScope
     * @param $document
     * @return {object} sessionTimer
     * Creation of service by implementing $get
     */
    this.$get = ['$timeout', '$rootScope', '$document', function($timeout, $rootScope, $document) {
            /**
             * 
             * @type type
             */
            var state = {
                idle: null,
                warning: null, 
                idling: false,
                running: false,
                countdown: null
            };
            /**
             * @function toggleState
             * @returns {undefined}
             */
            var toggleState = function() {
                state.idling = !state.idling;
                if(state.idling){
                    $rootScope.$broadcast('idleWarningStart');
                }
                if (state.idling) {
                    state.countdown = options.warningDuration;
                    countdown();
                }
            };
            /**
             * @function countdown
             * @returns {undefined}
             */
            var countdown = function() {
                if (state.countdown <= 0) {
                    $rootScope.$broadcast('idleTimeout');
                } else {
                    $rootScope.$broadcast('idleWarnCount', state.countdown);

                    state.warning = $timeout(countdown, 1000);
                }

                state.countdown--;
            };
            /**
             * 
             * @type object
             * expose different method that will be available to service
             */
            var sessionTimer = {
                /**
                 * @function getOptions
                 * @returns {object}
                 * return option object
                 */
                getOptions: function() {
                    return options;
                },
                /**
                 * @function getEventOptions
                 * @returns {object}
                 * return option object
                 */
                getEventOptions: function() {
                    return eventOptions;
                },
                /**
                 * @function running
                 * @returns {Boolean}
                 * return true or false based on whether watch is in progress or not
                 */
                runningState: function() {
                    return state.running;
                },
                /**
                 * @function unwatch
                 * @returns {undefined}
                 * cancel all timer and make state.running and state.idling to false
                 */
                unwatch: function() {
                    $timeout.cancel(state.idle);
                    $timeout.cancel(state.warning);

                    state.idling = false;
                    state.running = false;
                },
                /**
                 * @function watch
                 * @returns {undefined}
                 * start timer and make state.running to true
                 */
                watch: function() {
                    $timeout.cancel(state.idle);
                    $timeout.cancel(state.warning);

                    if (state.idling){
                        toggleState();
                    }
                    state.running = true;

                    state.idle = $timeout(toggleState, options.idleDuration * 1000);
                }
            };
            /**
             * @function interrupt
             * @returns {undefined}
             * call watch in listen to events specified in eventOptions.events
             */
            var interrupt = function() {
                if (state.running){
                    sessionTimer.watch();
                }
            };
            //cancelling timeout object on listeing to events
            $document.find('body').on(eventOptions.events, interrupt);

            return sessionTimer;
        }];
});


angular.module("att.core.tel", []).filter('tel', function () {
    return function (tel) {
        if (!tel) {
            return '';
        }
        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }
        var country, city, number;
        switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

        default:
            return tel;
        }
        if (country == 1) {
            country = "";
        }
        number = number.slice(0, 3) + '-' + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
    };
});
angular.module('att.core.truncName', [])
        .filter('truncFullName', [
            '$rootScope',
            function($rootScope) {
                var truncFullName = function(text) {
                    if (text && text !== null && text !== "" && text.length > 20)
                    {
                        return text.substring(0, 19) + String.fromCharCode(8230);
                    }
                    else
                    {
                        return text;
                    }
                };
                return truncFullName;
            }]
        )
        .filter('truncSubscriberName', [
            '$rootScope',
            function($rootScope) {
                var truncSubscriberName = function(devName) {

                    if (devName && devName !== null && devName !== "" && devName.length >= 15)
                    {
                        return devName.trim().substring(0, 14) + String.fromCharCode(8230);
                    }
                    else
                    {
                        return devName;
                    }
                };
                return truncSubscriberName;
            }]
        );


angular.module("template/navigation/navigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/navigation/navigation.html",
    "<header class=\"navbar globalNav\" ng-hide=\"hideHeader\"><div id=\"logoHolder\"><a href=\"//m.att.com\" att-link-click=\"attGlobeImageLinkClick,null,null,//m.att.com\" class=\"cssIcon-globe\" data-transition=\"slide\" tabindex=\"0\">at&amp;t home</a></div>\n" +
    "    <div id=\"menuIcon\" ng-hide=\"hideMenu\">\n" +
    "        <button aria-haspopup=\"true\" id=\"iconMenu\" class=\"toggleMenuMain iconMenu\">\n" +
    "            <span class=\"hidden-spoken\" id=\"iconMenuSpoken\">Menu</span> <i></i>\n" +
    "        </button>\n" +
    "        <div style=\"display: none; width: 270px; position:absolute; right:-270px;\" id=\"outerMMW\" aria-expanded=\"false\">\n" +
    "            <div id=\"menuMainSlider\">\n" +
    "                <div class=\"menuWedge\"></div>\n" +
    "                <div style=\"height: 100%; overflow : hidden\" role=\"navigation\" id=\"menuWrapper\">\n" +
    "                    <ul>\n" +
    "                        <li class=\"grayMenuButton\"><i class=\"fusion-sprite mgnav-myatt-logo\"><span class=\"hidden-spoken\">my A T and T</span></i><a class=\"fusion-logout btn\" href = \" #/logout\" ng-if=\"checkLogin\" style=\"float: right\">{{logOut}}</a><a class=\"fusion-logout btn\" href = \"#/login\" ng-if=\"!checkLogin\" style=\"float: right\">{{logIn}}</a></li>\n" +
    "                        <li ng-repeat=\"menuItem in mobileMenu.menu.menuGroup\" ng-class=\"{'grayMenuButton': menuItem.menuItem.length === 0}\">\n" +
    "                            <a ng-show=\"(menuItem.menuItem.length === 0)\" href=\"{{getMenuItemURLHostName(menuItem.href,menuItem.id)}}{{menuItem.href}}\" id=\"mg0myATT\" name=\"menuItem\">{{menuItem.value}} <i class=\"cssIcon-chevron-r-w\"></i></a>\n" +
    "                            <ul ng-show=\"(menuItem.menuItem.length !== 0)\" class=\"grayListButtons\" style=\"margin-bottom: auto\">\n" +
    "                                <li ng-repeat=\"pivot in menuItem.menuItem\"><a id=\"storesFindStoreLinkMenu\" href=\"{{getMenuItemURLHostName(pivot.href,pivot.id)}}{{pivot.href}}\"><i ng-class=\"{'fusion-att-globe' : pivot.id === 'more'}\"></i>{{pivot.value}}<i class=\"cssIcon-chevron-r-w\"></i></a></li>\n" +
    "                            </ul>  \n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <nav></nav>\n" +
    "</header>");
}]);
