
let activityTotal = 0;
// when an activity input is clicked run the below code
$('.activities').on('click', 'input', function(){
    //grab cost from data-cost attribute on clicked input tag
    const $activityCost = $(this).attr('data-cost').substring(1);
    const $dateTime = $(this).attr('data-day-and-time');
    console.log($dateTime);
    //check if input is checked
    const $isChecked = $(this).is(':checked');
    //if input is checked add data cost to the activity total else minus data cost from the activity total
    $isChecked ? activityTotal += parseInt($activityCost) : activityTotal -= parseInt($activityCost);
    //variable to check if a span tag in activites area exists
    const $activitySpan = $('.activities span');
    const spanText = `Total: $${activityTotal}`;
    //if activiy span isnt present add it, else if the activity total is 0 then remove the span, else update the span with the activity total
    $activitySpan.length === 0 ? $('.activities').append(`<span>${spanText}</span>`) : activityTotal === 0 ? $activitySpan.remove() : $activitySpan.text(spanText);

    $('[type=checkbox]').not(this).each(function(index, input){
        if ($dateTime === $(input).attr('data-day-and-time') && $(input).attr('disabled')){
            $(input).removeAttr('disabled'); 
        } else if ($dateTime === $(input).attr('data-day-and-time')) {
            $(input).attr('disabled', 'disabled'); 
        }
    });

});
