import QuantityStepper from './QuantityStepper';
import Icon from './Icon';
import WyzeShield from './WyzeShield';
import { buildReviewLines, computeTotals } from '../lib/bundleLogic';

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export default function ReviewPanel({ data, selections, onSetQuantity, onSave }) {
  const groups = buildReviewLines(data, selections);
  const { subtotal, compareAtSubtotal, savings } = computeTotals(data, selections);

  return (
    <aside className="review-panel">
      <div className="review-panel__main">
      <span className="review-panel__eyebrow">Review</span>
      <h2 className="review-panel__title">Your security system</h2>
      <p className="review-panel__subtitle">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      <div className="review-panel__groups">
        {groups.map((group) => (
          <div className="review-group" key={group.category}>
            <h3 className="review-group__label">{group.category}</h3>
            {group.lines.map((line) =>
              line.isPlan ? (
                <div className="review-line review-line--plan" key={line.productId}>
                  <span className="review-line__plan-logo">
                    <WyzeShield size={22} />
                    <span>
                      <span className="review-line__plan-logo-lead">
                        {line.name.split(' ')[0]}
                      </span>{' '}
                      {line.name.split(' ').slice(1).join(' ')}
                    </span>
                  </span>
                  <span />
                  <span className="review-line__price">
                    {line.compareAtPrice != null && (
                      <span className="price price--compare">
                        {formatPrice(line.compareAtPrice)}
                        {line.priceSuffix ?? ''}
                      </span>
                    )}
                    <span className="price price--active">
                      {formatPrice(line.price)}
                      {line.priceSuffix ?? ''}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="review-line" key={`${line.productId}-${line.variantId}`}>
                  <span className="review-line__thumb" aria-hidden="true">
                    {line.image && (
                      <img
                        className="review-line__thumb-img"
                        src={`${import.meta.env.BASE_URL}images/${line.image}`}
                        alt=""
                      />
                    )}
                  </span>
                  <span className="review-line__name">
                    {line.name}
                    {line.variantLabel ? ` (${line.variantLabel})` : ''}
                  </span>
                  <QuantityStepper
                    size="sm"
                    quantity={line.quantity}
                    onChange={(next) => onSetQuantity(line.productId, line.variantId, next)}
                  />
                  <span className="review-line__price">
                    {line.compareAtPrice != null && (
                      <span className="price price--compare">
                        {formatPrice(line.compareAtPrice * line.quantity)}
                      </span>
                    )}
                    <span className="price price--active">
                      {line.priceLabel ?? formatPrice((line.price ?? 0) * line.quantity)}
                    </span>
                  </span>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="review-line review-line--shipping">
        <span className="review-line__thumb review-line__thumb--shipping" aria-hidden="true">
          <Icon name="truck" size={16} />
        </span>
        <span className="review-line__name">{data.shipping.label}</span>
        <span />
        <span className="review-line__price">
          <span className="price price--compare">{formatPrice(data.shipping.compareAtPrice)}</span>
          <span className="price price--active">{data.shipping.priceLabel}</span>
        </span>
      </div>
      </div>

      <div className="review-panel__aside">
      <div className="review-summary">
        <img
          className="review-summary__stamp"
          src={`${import.meta.env.BASE_URL}images/satisfaction-badge.png`}
          alt="100% Wyze satisfaction guarantee — try worry-free for 30 days"
          title={`${data.guarantee.title} — ${data.guarantee.description}`}
        />
        <div className="guarantee-copy">
          <p className="guarantee-copy__title">{data.guarantee.title}</p>
          <p className="guarantee-copy__desc">{data.guarantee.description}</p>
        </div>
        <div className="review-summary__totals">
          <span className="financing-chip">
            {data.financing.label} {formatPrice(data.financing.amount)}
            {data.financing.suffix}
          </span>
          <div className="review-total">
            <span className="price price--compare">{formatPrice(compareAtSubtotal)}</span>
            <span className="price price--total">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {savings > 0 && (
        <p className="savings-callout">
          Congrats! You're saving {formatPrice(savings)} on your security bundle!
        </p>
      )}

      <button type="button" className="btn btn--checkout">
        Checkout
      </button>

      <button type="button" className="link link--save" onClick={onSave}>
        Save my system for later
      </button>
      </div>
    </aside>
  );
}
