class CartSuggestions extends HTMLElement {
  constructor() {
    super();

    // edit as needed
    this.configuration = {
      36191353241766 : { // franklins-finest-survival-coffee-720-servings-1-bucket
        upsellProductHandle: "lifestraw-go",
        upsellVariant: 36191168757926,
        mesg: "Add a Lifestraw GO Water Bottle in Teal for only:",
        addToCart: true
      },
      37009363173542: { // womens-v2-tactical-pants
        upsellProductHandle: "santa-fe-black-veans-rice-emergency-essentials",
        upsellVariant: 36191164039334,
        mesg: "Add some extra protein to every meal for only:",
        addToCart: true
      }
    }

    this.render();
  }

  template(upsell) {
    return `
      <div class="cart-upsell-item">
        <div class="cart-upsell-image">
          <a href="${upsell.product.url}" class="cart-upsell-product"><img src="${this.getSizedImageUrl(upsell.variantImage.src, '300x')}" class="cart__image" alt="${upsell.product.title}"></a>
        </div>
        <div class="cart-upsell-deets">
          <a href="${upsell.product.url}"><p>${upsell.mesg} <span>${upsell.variant.formatted_price}</span></p></a>
          <a data-add-cart-suggestions data-variant-id="${upsell.variant.id}" href="#" class="button cart-upsell-btn">Add Now</a>
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
        let variant = data.product.variants.find(v => v.id == upsells[handle].upsellVariant);

        upsells[handle].product.url = `/products/${handle}?variant=${variant.id}`;
        upsells[handle].variant = variant;
        upsells[handle].variant.formatted_price = `${variant.price}`;
        upsells[handle].variantImage = data.product.images.find(image => image.id == variant.image_id) || data.product.image;
      }));
    });

    Promise.all(promises).then(() => {
      this.innerHTML = upsellProductHandles.map((handle) => {
        return this.template(upsells[handle]);
      }).join('');

      this.bindEvents();

    });
  }

  addUpsellToCart(e) {
    e.preventDefault();

    let addLink = e.target;
    addLink.setAttribute('aria-disabled', true);
    addLink.classList.add('loading');

    let config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.body = JSON.stringify({
      items: [
        { quantity: 1, id: addLink.dataset.variantId }
      ]
    })

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        addLink.classList.remove('loading');
        addLink.removeAttribute('aria-disabled', true);
        location.reload();
      });
  }

  bindEvents() {
    Array.from(document.querySelectorAll('[data-add-cart-suggestions]')).forEach((element) => {
      element.addEventListener('click', this.addUpsellToCart);
    });
  }

  fetchProductJSON(handle) {
    return fetch(`${window.location.origin}/products/${handle}.json`);
  }

  getSizedImageUrl(src, size) {
    function removeProtocol(path) {
      return path.replace(/http(s)?:/, '');
    }

    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return removeProtocol(src);
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return removeProtocol(`${prefix[0]}_${size}${suffix}`);
    } else {
      return null;
    }
  }

  get variantsInCart() {
    return Array.from(document.querySelectorAll('.cart-item')).map((el) => {
      return Number(el.dataset.variantId);
    });
  }
}

customElements.define('cart-suggestions', CartSuggestions);
