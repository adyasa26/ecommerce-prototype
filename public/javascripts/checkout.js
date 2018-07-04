Stripe.setPublishableKey('pk_test_F8AM34Ain02ehzAcxzdutnip');	
// secret api key sk_test_fsiOUpWHXtcEOpX4pLvI8Nv6

let $form = $('#checkout-form');

$form.submit(function(event){
    $('#charge-errors').addClass('hidden');
    $form.find('button').prop('disabled',true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
      }, stripeResponseHandler);
      return false;
});

function stripeResponseHandler(status, response){
    // Grab the form:
  // var $form = $('#payment-form');

  if (response.error) { // Problem!

    // Show the errors on the form
    $('#charge-errors').text(response.error.message);
    $('#charge-errors').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();

  }
}

