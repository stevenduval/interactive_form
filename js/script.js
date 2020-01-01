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
$('#title').on('change', function(){
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
$('.activities').on('click', 'input', function(){
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
        if ($thisActivityDateTime === $(input).attr('data-day-and-time') && $(input).attr('disabled')){
            $(input).removeAttr('disabled'); 
        // else if this date time matches another input add disabled class to the other input    
        } else if ($thisActivityDateTime === $(input).attr('data-day-and-time')) {
            $(input).attr('disabled', 'disabled'); 
        }
    });
});

// payment section
$('#payment').on('change', function(){
    const $selectedPayment = $('#payment option:selected').attr('value');
    $('#bitcoin, #credit-card, #paypal').hide()
    if ($selectedPayment === 'Credit Card') { 
        $('#credit-card').show();
    } else if ($selectedPayment === 'PayPal') {
        $('#paypal').show();
    } else if ($selectedPayment === 'Bitcoin') {
        $('#bitcoin').show();
    }
});