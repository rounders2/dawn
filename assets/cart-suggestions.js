class CartSuggestions extends HTMLElement {
  constructor() {
    super();
    console.log("instantiated cart-suggestions element");
    this.configuration = {
      36191353241766: {
        upsellProductHandle: "2021-biolite-solarpower-10",
        upsellVariant: 32106582638710,
        mesg: "Don't Forget the Cream for your Coffee!",
        addToCart: true
      }

    }

    this.render();
  }

  function isInCart(variantID) {
    return this.variantsInCart.indexOf(variantID) != -1
  }

  render() {
    var upsells = {};
    this.variantsInCart.forEach((variantID) => {
      let option = this.configuration[variantID];

      if (option && !this.isInCart(option.upsellVariant)) {
        console.log(`${variantID} needs upselling`);

        upsells[option.upsellProductHandle] = {
          upsellVariant: option.upsellVariant,
          mesg: option.mesg,
          addToCart: option.addToCart
        }
      }
    });

    let upsellProductHandles = Object.keys(upsells);
    let promises = []

    upsellProductHandles.forEach((handle) => {
      promises.push(this.fetchProductJSON(handle).then(response => response.json()).then((data) => {
        upsells[handle].product = data.product;
        console.log("foo: ", data)
        let variant = data.product.variants.find((v) => {
          console.log(`comparing ${v.id} and ${upsells[handle].upsellVariant}`);
          return (v.id == upsells[handle].upsellVariant);
        });

        // upsells[handle].product.url = `/products/${handle}?variant=${variant.id}`;
        // upsells[handle].variant = variant;
        // upsells[handle].variant.formatted_price = `${variant.price}`;
      }));
    });

    Promise.all(promises).then(() => {
      console.log("all promises done");
    });
  }

  function fetchProductJSON(handle) {
    return fetch(`${window.location.origin}/products/${handle}.json`);
  }


  get variantsInCart() {
    return JSON.parse(this.getAttribute('variants'));
  }
}

customElements.define('cart-suggestions', CartSuggestions);
