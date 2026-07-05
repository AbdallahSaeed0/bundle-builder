import VariantSelector from './VariantSelector';
import QuantityStepper from './QuantityStepper';
import WyzeShield from './WyzeShield';
import {
  variantIdsFor,
  getActiveVariantId,
  getQuantity,
} from '../lib/bundleLogic';

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export default function ProductCard({ product, selections, onSetActiveVariant, onSetQuantity }) {
  const activeVariantId = getActiveVariantId(selections, product.id, product);
  const quantity = getQuantity(selections, product.id, activeVariantId);
  const isSelected = variantIdsFor(product).some(
    (id) => getQuantity(selections, product.id, id) > 0
  );
  const activeVariant = product.variants?.find((v) => v.id === activeVariantId);
  const image = activeVariant?.image ?? product.image;

  return (
    <div className={`product-card ${isSelected ? 'product-card--selected' : ''}`}>
      {product.badge && <span className="product-card__badge">{product.badge}</span>}

      <div className="product-card__image">
        {image ? (
          <img
            className="product-card__image-img"
            src={`${import.meta.env.BASE_URL}images/${image}`}
            alt={product.name}
          />
        ) : (
          <span className="product-card__image-glyph" aria-hidden="true">
            <WyzeShield size={64} />
          </span>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">
          {product.description}{' '}
          <a className="product-card__link" href={product.learnMoreUrl}>
            Learn More
          </a>
        </p>

        {product.variants && (
          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariantId}
            selectedIds={variantIdsFor(product).filter(
              (id) => getQuantity(selections, product.id, id) > 0
            )}
            onSelect={(variantId) => onSetActiveVariant(product.id, variantId)}
          />
        )}

        <div className="product-card__footer">
          <QuantityStepper
            quantity={quantity}
            onChange={(next) => onSetQuantity(product.id, activeVariantId, next)}
          />
          <div className="product-card__price">
            {product.compareAtPrice != null && (
              <span className="price price--compare price--compare-red">
                {formatPrice(product.compareAtPrice)}
                {product.priceSuffix ?? ''}
              </span>
            )}
            <span className="price price--active">
              {product.priceLabel ?? formatPrice(product.price)}
              {product.priceSuffix ?? ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
