export default function VariantSelector({ variants, activeVariantId, selectedIds = [], onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="variant-selector" role="radiogroup" aria-label="Color">
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          role="radio"
          aria-checked={variant.id === activeVariantId}
          className={`variant-chip ${selectedIds.includes(variant.id) ? 'variant-chip--active' : ''}`}
          onClick={() => onSelect(variant.id)}
          title={variant.label}
        >
          {variant.image ? (
            <span className="variant-chip__swatch variant-chip__swatch--image">
              <img
                src={`${import.meta.env.BASE_URL}images/${variant.image}`}
                alt=""
              />
            </span>
          ) : (
            <span
              className="variant-chip__swatch"
              style={{ backgroundColor: variant.swatch }}
            />
          )}
          <span className="variant-chip__label">{variant.label}</span>
        </button>
      ))}
    </div>
  );
}
