export default function QuantityStepper({ quantity, onChange, disabled, size = 'md' }) {
  return (
    <div className={`stepper stepper--${size} ${disabled ? 'stepper--disabled' : ''}`}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(quantity - 1)}
        disabled={disabled || quantity <= 0}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="stepper__value">{quantity}</span>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
