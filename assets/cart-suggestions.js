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
      },
      37009363173542: {
        upsellProductHandle: "santa-fe-black-veans-rice-emergency-essentials",
        upsellVariant: 36191164039334,
        mesg: "Deez beens are da best!",
        addToCart: true
      }

    }

    this.render();
  }

  template(upsell) {
    return `
      <div class="cart-upsell-item">
        <div class="cart-upsell-image">
          <a href="${upsell.product.url}" class="cart-upsell-product"><img src="${this.getSizedImageUrl(upsell.product.image.src, '300x')}" class="cart__image" alt="${upsell.product.title}"></a>
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

      this.bindEvents();

    });
  }

  addUpsellToCart(e) {
    e.preventDefault();
    console.log("clicked ", e.target);

    let config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.body = JSON.stringify({
      items: [
        { quantity: 1, id: e.target.dataset.variantId }
      ]
    })

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          console.log("the response status is ", response.status);
        }
        console.log("The response is ", response);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
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
    return JSON.parse(this.getAttribute('variants'));
  }
}

customElements.define('cart-suggestions', CartSuggestions);
