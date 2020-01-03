/******************************************
Treehouse Techdegree:
FSJS project 3 - Interactive Form
******************************************/

// run on pageload
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

// set global vars
let activityTotal = 0;
const $shirtOptions = $('#color option');

// job role section
$('#title').on('change', function() {
    // get value of selected option
    $('.error-user-other-jobrole').remove();
    const $selectedJob = $('#title option:selected').attr('value');
    // ensure that the other job role input is hidden until selected
    $('#other-jobrole').hide();
    // show other job role input if it is selected
    if ($selectedJob === 'other') { 
        $('#other-jobrole').show();
    }  
});

// design section event listener
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

// activity section click event listener
$('.activities').on('click', 'input', function() {
    $('.error-select-one').remove();
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

// payment section event listener, show/hide certain fields depending upon which option is selected
$('#payment').on('change', function() {
    const $selectedPayment = $('#payment option:selected').attr('value');
    $('.error-user-cc-num').remove();
    $('.error-user-zip').remove();
    $('.error-user-cvv').remove();
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

// form validation section

// set input border to red if error
 const $applyInvalidBorder = function(element) {
    $(element).css('border', '2px solid red');
}
// remove input border color
const $removeInvalidBorder = function(element) {
    $(element).css('border', '');
}
// function to throw field empty error if element its called in has a length of zero
const $emptyField = function(element, $activeElement) {
    if ($(element).val().length === 0 && !$(element).is(':checkbox') && $(element).css('display') != 'none' && $(element).parent().parent().css('display') != 'none') {
        $(element).before(`<span class="error-${$activeElement}" style="color: red;"> This field cannot be empty.</span>`);
        $applyInvalidBorder($(element));
    } 
}

// function to throw invalid format error if the element it is called on doesnt match the regex listed
const $invalidFormat = function(element, $activeElement) {
    if ($activeElement != 'user-name' && $activeElement != 'user-other-jobrole' && $(element).val().length != 0 && !$(element).is(':checkbox')) {
        const emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const ccregex = /^[0-9]{13,16}$/;
        const zipregex = /^\d{5}$/;
        const cvvregex = /^\d{3}$/;
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
        if (!regex.test($(element).val())) {
            $(element).before(`<span class="error-${$activeElement}" style="color: red;"> This field is not properly formatted.</span>`);
            $applyInvalidBorder($(element));
        }
    }
}

// function to insert message if no activities are selected on form submit
const $boxChecked = function(element) {
    if ($(element).is(':checkbox')) {
        if ($('.activities span').length === 0) {
            $('.activities').prepend('<span class="error-select-one" style="color: red;"> Please select an activity.<br><br></span>');
        }    
    } 
}
// event listener for all input fields, run above form validation functions on all inputs
$('body').on('keyup blur', 'input', function() {
    // get active input name & value
    const $activeElement = $(this).attr('name');
    $(`.error-${$activeElement}`).remove();
    $removeInvalidBorder($(this));
    $emptyField($(this), $activeElement);
    $invalidFormat($(this), $activeElement);
});

//run form validation functions if register button is clicked
$('button').on('click', function(e){
    $('input').each(function(index, input){
        const $activeElement = $(input).attr('name');
        $(`.error-${$activeElement}`).remove();
        $removeInvalidBorder($(this));
        $emptyField($(this), $activeElement);
        $invalidFormat($(this), $activeElement);
        $boxChecked($(this));
    });
    //if error class exists on anything don't allow form to submit
    if ($("[class*='error']").length === 0){
        return true;
    } else {
        return false;
    }
});