
(function() {
  console.log("cart suggestions loaded");
  var configuration = {
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
    }
  }

  var qualifyingVariants = Object.keys(configuration);

  var upsells = {};
  var option;

  function variantInCart(variantID) {
    var a =  theme.cartObject.items.some(function(item) {
      return item.variant_id == variantID;
    });

    return a;
  }

  for (var i = 0; i < theme.cartObject.items.length; i++) {
    for (var j = 0; j < qualifyingVariants.length; j++ ) {
      if (theme.cartObject.items[i].variant_id == qualifyingVariants[j] && !variantInCart(configuration[qualifyingVariants[j]].upsellVariant)) {
        option = configuration[qualifyingVariants[j]];
        upsells[option.upsellProductHandle] = {
          upsellVariant: option.upsellVariant,
          mesg: option.mesg,
          addToCart: option.addToCart
        }
      }
    }
  }


  var source = $('#CartSuggestionsTemplate').html();
  var template = Handlebars.compile(source);

  var $cartSuggestions = $('#cart-suggestions');
  var upsellProductHandles = Object.keys(upsells);
  var promises = []

  function fetchProductJson(handle) {
    // var variant;

    // promises.push($.get("https://good2goco.ca/products/" + handle + ".json").then(data => {
    //   upsells[handle].product = data.product;

    //   variant = data.product.variants.find(function(v) {
    //     return (v.id == upsells[handle].upsellVariant);
    //   });

    //   upsells[handle].product.url = "/products/"+ handle + "?variant=" + variant.id;

    //   upsells[handle].variant = variant;
    //   upsells[handle].variant.formatted_price = theme.Currency.formatMoney(100*Number(variant.price), theme.moneyFormat);
    // }));
  }

  for (var k=0; k < upsellProductHandles.length; k++) {
    fetchProductJson(upsellProductHandles[k]);
  }

  // $.when.apply($, promises).then(function() {
  //   $cartSuggestions.append(template(upsells));
  // });


  // $(document).on('click', '[data-add-cart-suggestions]', function(e) {
  //   e.preventDefault();

  //   $.ajax({
  //     type: 'POST',
  //     url: '/cart/add.js',
  //     data: {
  //       items: [
  //         {
  //           quantity: 1,
  //           id: $(this).data('variant-id'),
  //         }
  //       ]
  //     },
  //     dataType: 'json',
  //     success: function(result) {
  //       if (window.location.pathname == "/cart") {
  //         setTimeout(function() {
  //           window.location.reload();
  //         }, 500);
  //       }
  //     },
  //     error: function(XMLHttpRequest, textStatus) {
  //       console.log("error trying to add Free Product", textStatus);
  //     }
  //   });

  // });
})();
