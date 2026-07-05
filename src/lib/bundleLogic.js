// Selections shape:
// {
//   [productId]: {
//     activeVariantId: string,
//     quantities: { [variantId]: number }
//   }
// }
// Products with no color variants use the single implicit key 'default'.

export const DEFAULT_VARIANT = 'default';

export function variantIdsFor(product) {
  return product.variants ? product.variants.map((v) => v.id) : [DEFAULT_VARIANT];
}

export function buildInitialSelections(data) {
  const selections = {};
  data.steps.forEach((step) => {
    step.products.forEach((product) => {
      const ids = variantIdsFor(product);
      const quantities = {};
      ids.forEach((id) => {
        quantities[id] = product.defaultQuantities?.[id] ?? 0;
      });
      const activeVariantId =
        ids.find((id) => quantities[id] > 0) ?? ids[0];
      selections[product.id] = { activeVariantId, quantities };
    });
  });
  return selections;
}

export function getActiveVariantId(selections, productId, product) {
  return (
    selections[productId]?.activeVariantId ?? variantIdsFor(product)[0]
  );
}

export function getQuantity(selections, productId, variantId) {
  return selections[productId]?.quantities?.[variantId] ?? 0;
}

export function setActiveVariant(selections, productId, variantId) {
  const current = selections[productId] ?? { quantities: {} };
  return {
    ...selections,
    [productId]: {
      ...current,
      activeVariantId: variantId,
    },
  };
}

export function setQuantity(selections, productId, variantId, quantity) {
  const clamped = Math.max(0, quantity);
  const current = selections[productId] ?? {
    activeVariantId: variantId,
    quantities: {},
  };
  return {
    ...selections,
    [productId]: {
      ...current,
      quantities: {
        ...current.quantities,
        [variantId]: clamped,
      },
    },
  };
}

// Number of distinct products in a step with at least one variant quantity > 0
export function countSelectedInStep(step, selections) {
  return step.products.reduce((count, product) => {
    const ids = variantIdsFor(product);
    const hasAny = ids.some(
      (id) => getQuantity(selections, product.id, id) > 0
    );
    return hasAny ? count + 1 : count;
  }, 0);
}

// Every variant (or the implicit default) with qty > 0, grouped by review category.
export function buildReviewLines(data, selections) {
  const groups = [];
  data.steps.forEach((step) => {
    const lines = [];
    step.products.forEach((product) => {
      const ids = variantIdsFor(product);
      ids.forEach((variantId) => {
        const qty = getQuantity(selections, product.id, variantId);
        if (qty <= 0) return;
        const variantMeta = product.variants?.find((v) => v.id === variantId);
        lines.push({
          productId: product.id,
          variantId,
          name: product.name,
          variantLabel: variantMeta?.label ?? null,
          image: variantMeta?.image ?? product.image,
          quantity: qty,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          priceLabel: product.priceLabel,
          priceSuffix: product.priceSuffix,
          required: !!product.required,
          isPlan: !!product.isPlan,
          hasStepper: !product.isPlan,
        });
      });
    });
    if (lines.length > 0) {
      groups.push({ category: step.reviewCategory, order: step.reviewOrder ?? 0, lines });
    }
  });
  groups.sort((a, b) => a.order - b.order);
  return groups;
}

export function computeTotals(data, selections) {
  const groups = buildReviewLines(data, selections);
  let subtotal = 0;
  let compareAtSubtotal = 0;

  groups.forEach((group) => {
    group.lines.forEach((line) => {
      const lineActive = (line.price ?? 0) * line.quantity;
      const lineCompareAt = (line.compareAtPrice ?? line.price ?? 0) * line.quantity;
      subtotal += lineActive;
      compareAtSubtotal += lineCompareAt;
    });
  });

  const savings = Math.max(0, compareAtSubtotal - subtotal);

  return { subtotal, compareAtSubtotal, savings };
}
