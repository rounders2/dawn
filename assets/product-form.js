if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      this.cartNotification.setActiveElement(document.activeElement);

      const submitButton = this.querySelector('[type="submit"]');

      submitButton.setAttribute('disabled', true);
      submitButton.classList.add('loading');

      const body = JSON.stringify({
        ...JSON.parse(serializeForm(this.form)),
        sections: this.cartNotification.getSectionsToRender().map((section) => section.id),
        sections_url: window.location.pathname
      });

      fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
        .then((response) => response.json())
        .then((parsedState) => {
          this.cartNotification.renderContents(parsedState);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('disabled');
        });
    }
  });
}

$(function() {
  // console.log("harvestright-swatch loaded");
  $('[data-swatch-options]').on('change', 'input[type=radio]', function(e) {
    var $btn = $(this);
    var optionName = $btn.prop('name');

    var $singleOptionSelector = $('#' + $btn.data('related'));
    // console.log("The related singleOptionSelector is", $singleOptionSelector[0]);

    var selectedOption = $btn.val();
    // console.log("The selected option is: " + selectedOption);

    $singleOptionSelector.val(selectedOption).trigger('change');

    // display addendum for Size which is stored in product metafields
    if (optionName == "Size") {
      $('.size-addendum').hide();
      $('[data-size-addendum="'+ selectedOption + '"]').show();
    }

    if (optionName == "Finish") {
      $('.swatch-finish span[data-selected-value]').text(selectedOption);
    }
    if (optionName == "Color") {
      $('.swatch-color span[data-selected-value]').text(selectedOption);
    }

    e.preventDefault();
    // console.log("radio button clicked");

    momocato.update();
  });
});
