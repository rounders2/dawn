$(function() {

  function updateWhatsIncluded(e) {
    var $currentOption = $('#ProductSelect-product-template-swatch option:selected');
    var $mesgElement = $('#product-whats-included');

    if (typeof metaData === "undefined") {
      return;
    }

    if ($currentOption) {
      var variantID = Number($currentOption.val());
      var mesg = metaData[variantID];

      if (mesg) {
        $mesgElement.html(mesg).show();
      } else {
        $mesgElement.hide();
      }
    }
  }

  $('[data-swatch-options]').on('change', 'input[type=radio]', updateWhatsIncluded);

  updateWhatsIncluded();
});
