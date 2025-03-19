# Variant Picker

The `Variant Picker` module is a JavaScript and Liquid solution designed to handle the selection of product variants and update the corresponding price and inventory details on a Shopify store.

## Features

- **Variant Selection**: Allows users to select product variants using radio buttons.
- **Price Update**: Updates the displayed price based on the selected variant.
- **Inventory Update**: Displays the current inventory status of the selected variant.
- **URL Update**: Optionally updates the URL with the selected variant.

## Installation

1. Add the `variant-picker.js` file to your Shopify theme's assets.
2. Add the `variant-picker.liquid` file to your Shopify theme's snippets.

## Usage

### JavaScript

The `variant-picker.js` file contains the JavaScript logic for handling variant changes and updating the DOM.

### Liquid

The `variant-picker.liquid` file is a snippet that renders the variant picker form and integrates with the JavaScript logic.

To use the variant picker on a product page, include the snippet as follows:

```liquid
{% render 'variant-picker', product: product, product_form_id: 'product-form' %}
```

Sure! Here is the converted configurations and methods section from the `README.md` file in markdown format:

### Configuration

#### Options

- `product`: The product object to render variants for.
- `product_form_id`: The ID of the product form to which the variant picker is associated.
- `update_url` (optional): Boolean to determine whether or not to update the URL when changing variants. Default is `true`.

### Methods

#### JavaScript Methods

- `initializeVariantPicker(picker)`: Initializes the variant picker for a given product.
- `onVariantChange(picker)`: Handles the change event when a variant is selected.
- `getSelectedOptions(picker)`: Retrieves the selected options from the picker.
- `getVariantsData(variantSelect)`: Parses the variants data from the select element.
- `getVariantFromOptions(selectedOptions)`: Finds the variant matching the selected options.
- `updateVariantSelect(picker, variantId)`: Updates the variant select element with the selected variant ID.
- `updateVariantURL(picker, variant)`: Updates the URL with the selected variant ID.
- `updatePriceDisplay(variant)`: Updates the displayed price based on the selected variant.
- `updateInventoryDisplay(variant)`: Updates the displayed inventory status based on the selected variant.
- `updateAddToCartButton(variant)`: Updates the add to cart button based on the selected variant.
- `updateSelectedValueDisplay(picker, selectedOptions)`: Updates the selected value display based on the selected options.
- `formatMoney(cents)`: Formats the price in cents to a currency string.

## Events

- `variant:changed`: Custom event dispatched when a variant is changed, with details including the variant ID and selected options.

Feel free to integrate these sections into your `README.md` file. If you need any more assistance, let me know!
