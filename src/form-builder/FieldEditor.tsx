import React from 'react';
import { FieldConfig, ValidationRules, DerivedField } from '../types';

interface FieldEditorProps {
  field: FieldConfig;
  allFields: FieldConfig[];
  onChange: (updatedField: FieldConfig) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  allFields,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
 
  const handleChange = (key: keyof FieldConfig, value: any) => {
    onChange({ ...field, [key]: value });
  };

  // Validation updater typed against ValidationRules
  const handleValidationChange = <K extends keyof ValidationRules>(
    key: K,
    value: ValidationRules[K] | undefined
  ) => {
    const newValidation: ValidationRules = { ...(field.validation || {}) };
    (newValidation as any)[key] = value;
    onChange({ ...field, validation: newValidation });
  };

  // Options helpers (for select / radio / checkbox)
  const handleOptionsChange = (index: number, value: string) => {
    const updatedOptions = [...(field.options || [])];
    updatedOptions[index] = value;
    handleChange('options', updatedOptions);
  };

  const addOption = () => {
    handleChange('options', [...(field.options || []), '']);
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...(field.options || [])];
    updatedOptions.splice(index, 1);
    handleChange('options', updatedOptions);
  };

  // Derived field toggle
  const toggleDerived = () => {
    if (field.derived) {
      onChange({ ...field, derived: null });
    } else {
      const newDerived: DerivedField = { parents: [], expression: '' };
      onChange({ ...field, derived: newDerived });
    }
  };

  const toggleParentField = (parentId: string) => {
    if (!field.derived) return;
    const parents = field.derived.parents || [];
    const updatedParents = parents.includes(parentId)
      ? parents.filter(p => p !== parentId)
      : [...parents, parentId];
    onChange({ ...field, derived: { ...field.derived, parents: updatedParents } });
  };

  // type checks for what to render
  const isTextField = ['text', 'textarea'].includes(field.type);
  const isOptionField = ['radio', 'checkbox', 'select'].includes(field.type);
  const isNumberField = field.type === 'number';
  const isDateField = field.type === 'date';

  // helpers to parse number/date inputs
  const onNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ValidationRules) => {
    const v = e.target.value;
    handleValidationChange(key as any, v ? parseFloat(v) : undefined);
  };

  const onDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ValidationRules) => {
    const v = e.target.value;
    handleValidationChange(key as any, v || undefined);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={field.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('label', e.target.value)}
          placeholder="Label"
        />
        <input
          type="text"
          value={field.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          placeholder="Name"
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Required
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('required', e.target.checked)}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Default Value:&nbsp;
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={field.defaultValue ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('defaultValue', e.target.value)}
            placeholder="Default Value"
          />
        </label>
      </div>

      {isTextField && (
        <fieldset style={{ marginTop: 10, padding: 10 }}>
          <legend>Text Validation</legend>

          <label style={{ display: 'block' }}>
            Not Empty
            <input
              type="checkbox"
              checked={field.validation?.notEmpty || false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValidationChange('notEmpty', e.target.checked)}
              style={{ marginLeft: 6 }}
            />
          </label>

          <label style={{ display: 'block' }}>
            Min Length
            <input
              type="number"
              value={field.validation?.minLength ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValidationChange('minLength', e.target.value ? parseInt(e.target.value, 10) : undefined)
              }
              style={{ marginLeft: 6, width: 80 }}
            />
          </label>

          <label style={{ display: 'block' }}>
            Max Length
            <input
              type="number"
              value={field.validation?.maxLength ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValidationChange('maxLength', e.target.value ? parseInt(e.target.value, 10) : undefined)
              }
              style={{ marginLeft: 6, width: 80 }}
            />
          </label>
        </fieldset>
      )}

      
      {isNumberField && (
        <fieldset style={{ marginTop: 10, padding: 10 }}>
          <legend>Number Validation</legend>

          <label style={{ display: 'block' }}>
            Min
            <input
              type="number"
              value={field.validation?.min ?? ''}
              onChange={(e) => onNumberInputChange(e, 'min')}
              style={{ marginLeft: 6, width: 120 }}
            />
          </label>

          <label style={{ display: 'block' }}>
            Max
            <input
              type="number"
              value={field.validation?.max ?? ''}
              onChange={(e) => onNumberInputChange(e, 'max')}
              style={{ marginLeft: 6, width: 120 }}
            />
          </label>
        </fieldset>
      )}

      {isDateField && (
        <fieldset style={{ marginTop: 10, padding: 10 }}>
          <legend>Date Constraints</legend>

          <label style={{ display: 'block' }}>
            Min Date
            <input
              type="date"
              value={field.validation?.minDate ?? ''}
              onChange={(e) => onDateInputChange(e, 'minDate')}
              style={{ marginLeft: 6 }}
            />
          </label>

          <label style={{ display: 'block' }}>
            Max Date
            <input
              type="date"
              value={field.validation?.maxDate ?? ''}
              onChange={(e) => onDateInputChange(e, 'maxDate')}
              style={{ marginLeft: 6 }}
            />
          </label>
        </fieldset>
      )}

      {/* OPTIONS editor (select / radio / checkbox) */}
      {isOptionField && (
        <fieldset style={{ marginTop: 10, padding: 10 }}>
          <legend>Options</legend>
          {(field.options || []).map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <input
                type="text"
                value={opt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOptionsChange(idx, e.target.value)}
              />
              <button type="button" onClick={() => removeOption(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addOption}>Add option</button>

          {/* Option-level validation: notEmpty (makes sense for required selection) */}
          <div style={{ marginTop: 8 }}>
            <label>
              Require selection (Not Empty)
              <input
                type="checkbox"
                checked={field.validation?.notEmpty || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValidationChange('notEmpty', e.target.checked)}
                style={{ marginLeft: 6 }}
              />
            </label>
          </div>
        </fieldset>
      )}

      {/* Derived */}
      <div style={{ marginTop: 10 }}>
        <label>
          Derived field
          <input
            type="checkbox"
            checked={!!field.derived}
            onChange={toggleDerived}
            style={{ marginLeft: 6 }}
          />
        </label>
      </div>

      {field.derived && (
        <div style={{ border: '1px solid #aaa', padding: 10, marginTop: 10 }}>
          <div>
            <strong>Select parents</strong>
            {allFields.filter(f => f.id !== field.id).map(parent => (
              <div key={parent.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.derived?.parents?.includes(parent.id) || false}
                    onChange={() => toggleParentField(parent.id)}
                  />
                  &nbsp;{parent.label} ({parent.type})
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8 }}>
            <label>
              Expression
              <textarea
                value={field.derived.expression}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onChange({ ...field, derived: { ...field.derived!, expression: e.target.value } })
                }
                rows={3}
                style={{ width: '100%', marginTop: 6 }}
                placeholder="Example: parent1 + parent2 * 2"
              />
            </label>
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button type="button" onClick={onMoveUp}>↑</button>
        <button type="button" onClick={onMoveDown}>↓</button>
        <button type="button" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default FieldEditor;
