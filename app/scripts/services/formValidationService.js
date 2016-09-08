(function(){
    'use strict';
    webapp.factory('FormValidationService',
        function(){
            // var reg1=new RegExp(^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$);
            // var reg2=new RegExp(^.+@.+\..+$);
            var validations={mobileNumValidation:(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/).toString().split('/').join(''),
                                emailValidation : (/^.+@.+\..+$/).toString().split('/').join(''),
                                mobileErrorMessage:'Enter a valid mobile number.',
                                emailErrorMessage:'Enter a valid email address.',
                                pinCodeValidation:(/^([0-9]{6})$/).toString().split('/').join(''),
                                pinErrorMessage:'Enter a valid pin number.',
                                ifscValidation:(/^([a-zA-Z]{4}[0-9]{7})$/).toString().split('/').join(''),
                                ifscErrorMessage:'Enter a valid IFSC code.',
                                panValidation:(/^([A-Za-z]{5}\d{4}[A-Za-z]{1})$/).toString().split('/').join(''),
                                panErrorMessage:'Enter a valid PAN number.'};
            
            return validations;
        
    });
})();
