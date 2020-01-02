/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

//set global vars
let activityTotal = 0;
const $shirtOptions = $('#color option');

//run on pageload
$( document ).ready(function() {
    // focus on name input
    $('input#name').focus();
    // hide other job role field, color dropdown, paypal and bitcoin sections
    $('input#other-jobrole, #colors-js-puns, #paypal, #bitcoin').hide();
    // ensures 'select theme' is the always selected on 'design'
    $("#design").val($("#design option:eq(0)").val());
    // ensures activites are not checked when page is reloaded
    $('[type=checkbox]').prop('checked', false);
    // ensures credit card is the option selected when page is loaded
    $("#payment").val($("#payment option:eq(1)").val());
});

// job role section
$('#title').on('change', function() {
    // get value of selected option
    const $selectedJob = $('#title option:selected').attr('value');
    // ensure that the other job role input is hidden until selected
    $('#other-jobrole').hide();
    // show other job role input if it is selected
    if ($selectedJob === 'other') { 
        $('#other-jobrole').show();
    }  
});

// design section
$('#design').on('change', function() {
    // get value of selected option
    const $selectedDesign = $('#design option:selected').attr('value');
    // remove disabled class from all of the options
    $shirtOptions.removeClass('disabled');
    // hide the color menu
    $('#colors-js-puns').hide();
    // loop through each of the color options
    $('#colors-js-puns option').each(function(index, input) {
        // remove all of the options from the color dropdown
        $shirtOptions.detach();
        // add disabled class and show the appropriate options
        if ($(input).is(':contains("(I")') && $selectedDesign === 'js puns' || $(input).is(':contains("(JS")') && $selectedDesign === 'heart js') { 
            $(input).addClass('disabled'); 
            $('#colors-js-puns').show();
        }
        // add options back to the dropdown if they do not have a class of disabled
        $shirtOptions.not(".disabled").appendTo("#color");
        // ensure that the first option is always selected
        $("#color").val($("#color option:eq(0)").val());
    });
});

// activity section
$('.activities').on('click', 'input', function() {
    const $thisActivityCost = $(this).attr('data-cost').substring(1);
    const $thisActivityDateTime = $(this).attr('data-day-and-time');
    const $thisIsChecked = $(this).is(':checked');
    const $activitySpan = $('.activities span');
    // if input is checked add data cost to the activity total else minus data cost from the activity total
    $thisIsChecked ? activityTotal += parseInt($thisActivityCost) : activityTotal -= parseInt($thisActivityCost);
    // set activity total text to be added to page
    const spanText = `Total: $${activityTotal}`;
    // if activiy span isnt present add it, else if the activity total is 0 then remove the span, else update the span with the activity total
    $activitySpan.length === 0 ? $('.activities').append(`<span>${spanText}</span>`) : activityTotal === 0 ? $activitySpan.remove() : $activitySpan.text(spanText);
    // grab the elements that have a type of checkbox but are not equal to the current element
    $('[type=checkbox]').not(this).each(function(index, input){
        // if this date time matches one of the input date time and has a disabled attribute then remove it (this means that you have unchecked the box)
        if ($thisActivityDateTime === $(input).attr('data-day-and-time') && $(input).attr('disabled')) {
            $(input).removeAttr('disabled'); 
        // else if this date time matches another input add disabled class to the other input    
        } else if ($thisActivityDateTime === $(input).attr('data-day-and-time')) {
            $(input).attr('disabled', 'disabled'); 
        }
    });
});

// payment section, show/hide certain fields depending upon which option is selected
$('#payment').on('change', function() {
    const $selectedPayment = $('#payment option:selected').attr('value');
    $('#bitcoin, #credit-card, #paypal').hide()
    if ($selectedPayment === 'Credit Card') { 
        $('#credit-card').show();
    } else if ($selectedPayment === 'PayPal') {
        $('#paypal').show();
        $('#cc-num, #zip, #cvv').val("");
    } else if ($selectedPayment === 'Bitcoin') {
        $('#bitcoin').show();
        $('#cc-num, #zip, #cvv').val("");
    }
});

// form validation
$('body').on('keyup blur', 'input,checkbox', function() {
    // get active input name & value
    const $activeElement = $(this).attr('name');
    const $ccActive = $('#payment option:selected').attr('value') === 'Credit Card';
    // set regex values to check against
    const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const ccregex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    const zipregex = /^\d{5}$/;
    const cvvregex = /^\d{3}$/;
    // set input background to red if error
    const $applyInvalidBackground = function(element) {
        $(element).css('backgroundColor', 'red');
    }
    // remove input background color
    const $removeInvalidBackground = function(element) {
        $(element).css('backgroundColor', '');
    }
    // function to throw field empty error of element its called in has a length of zero
    const $emptyField = function(element) {
        if ($(element).val().length === 0) {
            $(element).before(`<span class="error-${$activeElement}" style="color: red;"> This field cannot be empty.</span>`);
            $applyInvalidBackground($(element));
        } 
    }
    // function to throw invalid format error if the element it is called on doesnt match the regex above
    const $invalidFormat = function(element) {
        if ($activeElement != 'user-name' && $activeElement != 'user-other-jobrole' && $(element).val().length != 0) {
            //set which regex to use
            let regex = null;
            if ($activeElement === 'user-email') {
                regex = emailregex;
            } else if ($activeElement === 'user-cc-num') {
                regex = ccregex;
            } else if ($activeElement === 'user-zip') {
                regex = zipregex;
            } else if ($activeElement === 'user-cvv') {
                regex = cvvregex;
            }
            //throw error if regex is not true
            if (!regex.test($(element).val())) {
                $(element).before(`<span class="error-${$activeElement}" style="color: red;"> This field is not properly formatted.</span>`);
                $applyInvalidBackground($(element));
            }
        }
    }
    // run above functions depending upon which input is active
    if ($activeElement === 'user-name' || $activeElement === 'user-email' || $activeElement === 'user-other-jobrole' ||
        ($ccActive && $activeElement === 'user-cc-num' || $activeElement === 'user-zip' || $activeElement === 'user-cvv')) {
        $(`.error-${$activeElement}`).remove();
        $removeInvalidBackground($(this));
        $emptyField($(this));
        $invalidFormat($(this));
    }
});