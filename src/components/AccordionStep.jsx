import ProductCard from './ProductCard';
import Icon from './Icon';
import { countSelectedInStep } from '../lib/bundleLogic';

export default function AccordionStep({
  step,
  totalSteps,
  isOpen,
  selections,
  onToggle,
  onSetActiveVariant,
  onSetQuantity,
  onNext,
  nextLabel,
}) {
  const selectedCount = countSelectedInStep(step, selections);

  return (
    <section className={`accordion-step ${isOpen ? 'accordion-step--open' : ''}`}>
      <button
        type="button"
        className="accordion-step__header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="accordion-step__eyebrow">
          STEP {step.stepNumber} OF {totalSteps}
        </span>
        <span className="accordion-step__row">
          <span className="accordion-step__icon">
            <Icon name={step.icon} size={26} />
          </span>
          <span className="accordion-step__title">{step.title}</span>
          <span className="accordion-step__state">
            {selectedCount > 0 && (
              <span className="accordion-step__count">{selectedCount} selected</span>
            )}
            <Icon
              className="accordion-step__chevron"
              name={isOpen ? 'caret-up' : 'caret-down'}
              size={14}
            />
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="accordion-step__body">
          <div className="product-grid">
            {step.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selections={selections}
                onSetActiveVariant={onSetActiveVariant}
                onSetQuantity={onSetQuantity}
              />
            ))}
          </div>
          {onNext && (
            <button type="button" className="btn btn--next" onClick={onNext}>
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
