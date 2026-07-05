import { useState } from 'react';
import data from './data/products.json';
import AccordionStep from './components/AccordionStep';
import ReviewPanel from './components/ReviewPanel';
import {
  buildInitialSelections,
  setActiveVariant,
  setQuantity,
} from './lib/bundleLogic';
import { readSavedSystem, useSavedSystem } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [selections, setSelections] = useState(() => {
    const saved = readSavedSystem();
    return saved?.selections ?? buildInitialSelections(data);
  });
  const [openStepId, setOpenStepId] = useState(() => {
    const saved = readSavedSystem();
    return saved?.openStepId ?? data.steps[0].id;
  });
  const { save } = useSavedSystem();

  const handleSetActiveVariant = (productId, variantId) => {
    setSelections((prev) => setActiveVariant(prev, productId, variantId));
  };

  const handleSetQuantity = (productId, variantId, quantity) => {
    setSelections((prev) => setQuantity(prev, productId, variantId, quantity));
  };

  const handleToggleStep = (stepId) => {
    setOpenStepId((prev) => (prev === stepId ? null : stepId));
  };

  const handleNext = (currentIndex) => {
    const nextStep = data.steps[currentIndex + 1];
    if (nextStep) setOpenStepId(nextStep.id);
  };

  const handleSave = () => {
    const ok = save(selections, openStepId);
    if (ok) window.alert('Your system has been saved. Come back anytime to pick up where you left off.');
  };

  return (
    <div className="app">
      <div className="app__grid">
        <main className="builder-col">
          <h1 className="app__title">Let's get started!</h1>
          <div className="builder">
          {data.steps.map((step, index) => (
            <AccordionStep
              key={step.id}
              step={step}
              totalSteps={data.steps.length}
              isOpen={openStepId === step.id}
              selections={selections}
              onToggle={() => handleToggleStep(step.id)}
              onSetActiveVariant={handleSetActiveVariant}
              onSetQuantity={handleSetQuantity}
              onNext={
                index < data.steps.length - 1
                  ? () => handleNext(index)
                  : null
              }
              nextLabel={
                index < data.steps.length - 1
                  ? `Next: ${data.steps[index + 1].title}`
                  : null
              }
            />
          ))}
          </div>
        </main>

        <ReviewPanel
          data={data}
          selections={selections}
          onSetQuantity={handleSetQuantity}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default App;
