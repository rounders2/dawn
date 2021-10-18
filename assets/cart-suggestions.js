class CartSuggestions extends HTMLElement {
  constructor() {
    super();
    console.log("instantiated cart-suggestions element");
    this.configuration = {
      36191353241766: {
        upsellProductHandle: "lifestraw-go",
        upsellVariant: 36191168757926,
        mesg: "You gotta have this thing!",
        addToCart: true
      }

    }

    this.render();
  }

  template(upsell) {
    return `
      <div class="cart-upsell-item">
        <div class="cart-upsell-image">
          <a href="${upsell.product.url}" class="cart-upsell-product"><img src="${upsell.product.image.src}" class="cart__image" alt="${upsell.product.title}"></a>
        </div>
        <div class="cart-upsell-deets">
          <a href="${upsell.product.url}"><h4>${upsell.mesg}</h4></a>
          <p><span>${upsell.variant.formatted_price}</span></p>
          <a data-add-cart-suggestions data-variant-id="${upsell.variant.id}" href="#" class="btn cart-upsell-btn">Add Now</a>
        </div>
      </div>
    `;
  }

  isInCart(variantID) {
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

        let variant = data.product.variants.find((v) => {
          return (v.id == upsells[handle].upsellVariant);
        });

        upsells[handle].product.url = `/products/${handle}?variant=${variant.id}`;
        upsells[handle].variant = variant;
        upsells[handle].variant.formatted_price = `${variant.price}`;
      }));
    });

    Promise.all(promises).then(() => {
      this.innerHTML = upsellProductHandles.map((handle) => {
        return this.template(upsells[handle]);
      }).join();
    });
  }

  fetchProductJSON(handle) {
    return fetch(`${window.location.origin}/products/${handle}.json`);
  }


  get variantsInCart() {
    return JSON.parse(this.getAttribute('variants'));
  }
}

customElements.define('cart-suggestions', CartSuggestions);
