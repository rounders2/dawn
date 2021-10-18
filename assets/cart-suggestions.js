class CartSuggestions extends HTMLElement {
  constructor() {
    super();
    console.log("instantiated cart-suggestions element");
    this.configuration = {
      //  Solo Stove Bonfire
      18313979363446: {
        upsellProductHandle: "starters",
        upsellVariant: 32148539801718,
        mesg: "Light Your Fire Easier With Solo Stove Firestarters.",
        addToCart: true
      },
      //  Solo Stove Ranger
      21207434920054: {
        upsellProductHandle: "starters",
        upsellVariant: 32148539801718,
        mesg: "Light Your Fire Easier With Solo Stove Firestarters.",
        addToCart: true
      },
      //  Solo Stove Yukon
      31954465554550: {
        upsellProductHandle: "starters",
        upsellVariant: 32148539801718,
        mesg: "Light Your Fire Easier With Solo Stove Firestarters.",
        addToCart: true
      },
      //  Solo Stove Yukon plus
      31954497994870: {
        upsellProductHandle: "starters",
        upsellVariant: 32148539801718,
        mesg: "Light Your Fire Easier With Solo Stove Firestarters.",
        addToCart: true
      },
      //  Solo Stove Grill
      31954522046582: {
        upsellProductHandle: "all-natural-charcoal-4-pack",
        upsellVariant: 32148511195254,
        mesg: "Use All Natural charcoal briquettes & Starters With Your Grill.",
        addToCart: true
      },
      //  Firestarters
      32148539801718: {
        upsellProductHandle: "solo-stove-fire-pit-tools",
        upsellVariant: 29155132801142,
        mesg: "Pefect for S'Mores!",
        addToCart: true
      },
      //  Klymit Double Sleeping Insulated Double V Pad
      32061390127222: {
        upsellProductHandle: "double-v-sheet",
        upsellVariant: 32061431087222,
        mesg: "Protect Your Sleeping Pad With A Klymit Double Fitted Sheet",
        addToCart: true
      },
      //  Klymit INSULATED V ULTRALITE
      32061280387190: {
        upsellProductHandle: "v-sheet",
        upsellVariant: 32061425090678,
        mesg: "Protect Your Sleeping Pad With A Klymit Fitted Sheet",
        addToCart: true
      },
      //  Franklin's Coffee
      32042478338166: {
        upsellProductHandle: "ready-hour-coffee-creamer",
        upsellVariant: 32106582638710,
        mesg: "Don't Forget the Cream for your Coffee!",
        addToCart: true
      },
      //  Test
      36191353241766: {
        upsellProductHandle: "ready-hour-coffee-creamer",
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
      promises.push(this.fetchProductJSON(handle).then((data) => {
        upsells[handle].product = data.product;

        let variant = data.product.variants.find((v) => {
          return (v.id == upsells[handle].upsellVariant);
        });

        upsells[handle].product.url = `/products/${handle}?variant=${variant.id}`;
        upsells[handle].variant = variant;
        upsells[handle].variant.formatted_price = `${variant.price}`;
      });
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
