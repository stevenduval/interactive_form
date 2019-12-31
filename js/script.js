//set global vars
let activityTotal = 0;
const $shirtOptions = $('#color option');
//run on pageload to focus on name, hide extra fields & run browser fix
$( document ).ready(function() {
    $('input#name').focus();
    $('input#other-jobrole, #colors-js-puns, #paypal, #bitcoin').hide();
    //ensures 'select theme' is the always selected on 'design'
    $("#design").val($("#design option:eq(0)").val());
    //ensures activites are not checked when page is reloaded
    $('[type=checkbox]').prop('checked', false);
    //ensures credit card is the option selected when page is loaded
    $("#payment").val($("#payment option:eq(1)").val());
});


// when a shirt design is selected run the following code
$('#design').on('change', function(){
    const bartle = $('#design option:selected').attr('value');
    $shirtOptions.removeClass('disabled');
    $('#colors-js-puns').hide();
    $('#colors-js-puns option').each(function(index, input){
        if($(input).is(':contains("(I")') && bartle === 'js puns') { $(input).addClass('disabled'); $('#colors-js-puns').show();};
        if($(input).is(':contains("(JS")') && bartle === 'heart js') { $(input).addClass('disabled'); $('#colors-js-puns').show();};
        $shirtOptions.detach();
        $shirtOptions.not(".disabled").appendTo("#color");
        $("#color").val($("#color option:eq(0)").val());
    });
});


// when an activity is clicked run the below code
$('.activities').on('click', 'input', function(){
    const $thisActivityCost = $(this).attr('data-cost').substring(1);
    const $thisActivityDateTime = $(this).attr('data-day-and-time');
    const $thisIsChecked = $(this).is(':checked');
    const $activitySpan = $('.activities span');
    //if input is checked add data cost to the activity total else minus data cost from the activity total
    $thisIsChecked ? activityTotal += parseInt($thisActivityCost) : activityTotal -= parseInt($thisActivityCost);
    //set activity total text to be added to page
    const spanText = `Total: $${activityTotal}`;
    //if activiy span isnt present add it, else if the activity total is 0 then remove the span, else update the span with the activity total
    $activitySpan.length === 0 ? $('.activities').append(`<span>${spanText}</span>`) : activityTotal === 0 ? $activitySpan.remove() : $activitySpan.text(spanText);
    //grab the elements that have a type of checkbox but are not equal to the current element
    $('[type=checkbox]').not(this).each(function(index, input){
        //if this date time matches one of the input date time and has a disabled attribute then remove it (this means that you have unchecked the box)
        if ($thisActivityDateTime === $(input).attr('data-day-and-time') && $(input).attr('disabled')){
            $(input).removeAttr('disabled'); 
        // else if this date time matches another input add disabled class to the other input    
        } else if ($thisActivityDateTime === $(input).attr('data-day-and-time')) {
            $(input).attr('disabled', 'disabled'); 
        }
    });
});
