/**
 * Product Variant Picker JS
 * Handles the variant selection and price updates
 */

class VariantPicker {
    constructor() {
      this.productId = null;
      this.selectors = {
        variantPicker: ".js-variant-picker",
        variantInput: ".variant-input",
        variantSelect: "[data-variant-select]",
        priceContainer: "[data-price-container]",
        productPrice: "[data-product-price]",
        comparePrice: "[data-product-compare-price]",
        saving: "[data-product-saving]",
        addToCartText: "[data-add-to-cart-text]",
        loader: "[data-loader]",
        inventoryStockCount: "[data-inventory-stock-count]",
        inventoryStockText: "[data-inventory-stock-text]",
      };
  
      this.classes = {
        selected: "selected-variant",
      };
  
      this.init();
    }
  
    init() {
      const variantPickers = document.querySelectorAll(
        this.selectors.variantPicker
      );
  
      variantPickers.forEach((picker) => {
        this.initializeVariantPicker(picker);
      });
    }
  
    initializeVariantPicker(picker) {
      const productId = picker.dataset.productId;
      this.productId = productId;
      const variantInputs = picker.querySelectorAll(this.selectors.variantInput);
      const variantSelect = picker.querySelector(this.selectors.variantSelect);
  
      if (!productId || !variantSelect) return;
  
      // Store the variants data for easy access
      this.variantsData = this.getVariantsData(variantSelect);
  
      // Add event listeners to each variant input
      variantInputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.onVariantChange(picker);
        });
      });
  
      // Initialize the selected variant
      this.updateSelectedVariant(picker);
    }
  
    onVariantChange(picker) {
      const selectedOptions = this.getSelectedOptions(picker);
      const selectedVariant = this.getVariantFromOptions(selectedOptions);
  
      if (selectedVariant) {
        this.updateVariantSelect(picker, selectedVariant.id);
        this.updateVariantURL(picker, selectedVariant);
        this.updatePriceDisplay(selectedVariant);
        this.updateAddToCartButton(selectedVariant);
        this.updateSelectedValueDisplay(picker, selectedOptions);
        this.updateInventoryDisplay(selectedVariant);
        // Dispatch custom event for gallery to listen to
        document.dispatchEvent(
          new CustomEvent("variant:changed", {
            detail: {
              variantId: selectedVariant.id,
              options: selectedOptions,
            },
          })
        );
      }
    }
  
    getSelectedOptions(picker) {
      const selectedOptions = {};
      const optionInputs = picker.querySelectorAll(
        this.selectors.variantInput + ":checked"
      );
  
      optionInputs.forEach((input) => {
        const optionPosition = parseInt(input.dataset.optionPosition);
        const value = input.dataset.value;
        selectedOptions[`option${optionPosition}`] = value;
      });
  
      return selectedOptions;
    }
  
    getVariantsData(variantSelect) {
      const variantsData = [];
  
      variantSelect.querySelectorAll("option").forEach((option) => {
        if (option.dataset.variantData) {
          try {
            const variantData = JSON.parse(
              decodeURIComponent(option.dataset.variantData)
            );
            variantsData.push(variantData);
          } catch (e) {
            console.error("Error parsing variant data:", e);
          }
        }
      });
  
      return variantsData;
    }
  
    getVariantFromOptions(selectedOptions) {
      return this.variantsData.find((variant) => {
        return Object.keys(selectedOptions).every((key) => {
          const position = parseInt(key.replace("option", ""));
          return variant[`option${position}`] === selectedOptions[key];
        });
      });
    }
  
    updateVariantSelect(picker, variantId) {
      const variantSelect = picker.querySelector(this.selectors.variantSelect);
      if (variantSelect) {
        variantSelect.value = variantId;
        variantSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
  
      // Also update the hidden input used by the form
      const form = document.getElementById(variantSelect.getAttribute("form"));
      if (form) {
        const idInput = form.querySelector('input[name="id"]');
        if (idInput) {
          idInput.value = variantId;
          idInput.disabled = false;
        }
      }
    }
  
    updateVariantURL(picker, variant) {
      if (picker.dataset.updateUrl === "false") return;
  
      const url = new URL(window.location.href);
      const variantUrl = `${picker.dataset.url}?variant=${variant.id}`;
  
      window.history.replaceState({ path: variantUrl }, "", variantUrl);
    }
  
    updatePriceDisplay(variant) {
      const priceContainers = document.querySelectorAll(
        this.selectors.priceContainer
      );
  
      priceContainers.forEach((container) => {
        const priceElement = container.querySelector(this.selectors.productPrice);
        const compareElement = container.querySelector(
          this.selectors.comparePrice
        );
        const savingElement = container.querySelector(this.selectors.saving);
  
        if (priceElement) {
          priceElement.innerHTML = this.formatMoney(variant.price);
        }
  
        if (compareElement && savingElement) {
          if (variant.compare_at_price > variant.price) {
            compareElement.innerHTML = this.formatMoney(variant.compare_at_price);
            compareElement.style.display = "inline";
  
            const savings = Math.round(
              ((variant.compare_at_price - variant.price) * 100) /
                variant.compare_at_price
            );
            savingElement.innerHTML = `Save ${savings}%`;
            savingElement.style.display = "inline";
          } else {
            compareElement.style.display = "none";
            savingElement.style.display = "none";
          }
        }
      });
    }
  
    updateInventoryDisplay(variant) {
      const variant_id = variant.id;
      const variantJsonElement = document.querySelector(
        `#VariantInventoryJson-${this.productId}`
      );
  
      // Check if the variant inventory JSON element exists
      if (!variantJsonElement) return;
  
      const variant_json = variantJsonElement.textContent;
      // json parse the variant data as object
      const variant_data = JSON.parse(variant_json);
      // find the variant object in the variant data object matching the variant id
      const inventory = variant_data.find((v) => v.id === variant_id);
      if (!inventory) return;
  
      const elInventoryStockCount = document.querySelectorAll(
        this.selectors.inventoryStockCount
      );
      const elInventoryStockText = document.querySelectorAll(
        this.selectors.inventoryStockText
      );
  
      // Only update stock count elements if they exist
      if (elInventoryStockCount.length > 0) {
        elInventoryStockCount.forEach((element) => {
          if (inventory.available) {
            element.style.display = "flex";
            element.textContent = inventory.inventory_quantity;
          } else {
            element.style.display = "none";
          }
        });
      }
  
      // Only update stock text elements if they exist
      if (elInventoryStockText.length > 0) {
        elInventoryStockText.forEach((element) => {
          element.textContent = inventory.available
            ? "available"
            : "Not available";
          element.style.color = inventory.available ? "green" : "red";
        });
      }
    }
  
    updateAddToCartButton(variant) {
      const addToCartButtons = document.querySelectorAll('button[name="add"]');
      const addToCartTexts = document.querySelectorAll(
        this.selectors.addToCartText
      );
  
      const activeClasses = [
        "text-zinc-900",
        "bg-white",
        "hover:text-zinc-100",
        "hover:bg-zinc-900",
        "cursor-pointer",
      ];
      const inactiveClasses = [
        // "text-zinc-700",
        // "bg-zinc-400",
        "cursor-not-allowed",
        "opacity-50",
      ];
  
      addToCartButtons.forEach((button) => {
        button.disabled = !variant.available;
        if (variant.available) {
          button.classList.remove(...inactiveClasses);
          button.classList.add(...activeClasses);
        } else {
          button.classList.remove(...activeClasses);
          button.classList.add(...inactiveClasses);
        }
      });
  
      addToCartTexts.forEach((text) => {
        text.textContent = variant.available
          ? window.theme?.strings?.addToCart || "Add to Cart"
          : window.theme?.strings?.soldOut || "Out of Stock";
        ``;
      });
    }
  
    updateSelectedValueDisplay(picker, selectedOptions) {
      Object.keys(selectedOptions).forEach((key) => {
        const position = parseInt(key.replace("option", ""));
        const value = selectedOptions[key];
        const displayElement = picker.querySelector(
          `[data-selected-option-value="option-${position}"]`
        );
        if (displayElement) {
          displayElement.textContent = value;
        }
  
        // update selected as checked and remove checked from others
        const input = picker.querySelector(
          `input[data-option-position="${position}"][data-value="${value}"]`
        );
  
        if (input) {
          input.checked = true;
        }
  
        // Update classes for visual selection state
        const allLabels = picker.querySelectorAll(
          `label[data-option-position="${position}"]`
        );
  
        allLabels.forEach((label) => {
          if (label.getAttribute("data-value") === value) {
            label.classList.add(this.classes.selected);
          } else {
            label.classList.remove(this.classes.selected);
          }
        });
      });
    }
  
    formatMoney(cents) {
      if (typeof window.Shopify !== "undefined" && window.Shopify.formatMoney) {
        return window.Shopify.formatMoney(cents);
      }
  
      const value = (cents / 100).toFixed(2);
      return `$${value}`;
    }
  
    updateSelectedVariant(picker) {
      const variantSelect = picker.querySelector(this.selectors.variantSelect);
      if (!variantSelect) return;
  
      const selectedOption = variantSelect.querySelector("option:checked");
      if (!selectedOption) return;
  
      const variantId = selectedOption.value;
      const variant = this.variantsData.find(
        (v) => v.id.toString() === variantId
      );
  
      if (variant) {
        this.updatePriceDisplay(variant);
        this.updateInventoryDisplay(variant);
        this.updateAddToCartButton(variant);
      }
    }
  }
  
  // Initialize on DOM loaded
  document.addEventListener("DOMContentLoaded", () => {
    new VariantPicker();
  });
  