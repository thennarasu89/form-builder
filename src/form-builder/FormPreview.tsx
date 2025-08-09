import React, { useState, useEffect } from 'react';
import { FieldSchema, FormSchema } from '../types';

interface FormPreviewProps {
  form: FormSchema;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  // State to hold user inputs for fields by id or name
  const [values, setValues] = useState<Record<string, any>>({});
  
  // State for validation errors: key = field name, value = error message string
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate a single field value based on validation rules
  const validateField = (field: FieldSchema, value: any): string | null => {
    const rules = field.validation;
    if (!rules) return null;

    if (rules.notEmpty && (!value || value.toString().trim() === '')) {
      return 'This field is required.';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength}.`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength}.`;
    }

    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email format.';
    }

    if (rules.passwordRule) {
      if (rules.passwordRule.minLength && value.length < rules.passwordRule.minLength) {
        return `Password must be at least ${rules.passwordRule.minLength} characters.`;
      }
      if (rules.passwordRule.requireNumber && !/\d/.test(value)) {
        return 'Password must contain a number.';
      }
      if (rules.passwordRule.requireUpper && !/[A-Z]/.test(value)) {
        return 'Password must contain an uppercase letter.';
      }
    }

    return null;
  };

  // Handle input change
  const handleChange = (field: FieldSchema, value: any) => {
    setValues(prev => ({ ...prev, [field.id]: value }));
  };

  // Calculate derived fields whenever values change
  useEffect(() => {
    form.fields.forEach(field => {
      if (field.isDerived && field.derived) {
        try {
          // For example, assume expression is a JS formula string referencing parent fields by name
          // Evaluate formula with current values of parents
          const formula = field.derived.expression;
          const parents = field.derived.parents;

          // Build an object with parent field values for evaluation
          const context: Record<string, any> = {};
          parents.forEach(p => {
            context[p] = values[p];
          });

          // Use Function constructor to evaluate formula safely (basic eval)
          // e.g. formula = "parents['dob'] ? calculateAge(parents['dob']) : ''"
          // Simplify formula as per your design
          // Here, we replace variable names in formula with actual values for a simple approach
          let evalFormula = formula;
          Object.entries(context).forEach(([key, val]) => {
            evalFormula = evalFormula.replaceAll(key, JSON.stringify(val));
          });

          // Evaluate string to get derived value
          // eslint-disable-next-line no-new-func
          const derivedValue = new Function(`return ${evalFormula}`)();

          // Update derived field value in state
          setValues(prev => ({ ...prev, [field.id]: derivedValue }));
        } catch (err) {
          console.error('Error calculating derived field:', err);
        }
      }
    });
  }, [values, form.fields]);

  // Validate all fields on submit or onBlur (simple example)
  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, values[field.id]);
      if (error) newErrors[field.id] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      alert('Form submitted successfully!');
      // Do something with values if needed
    }
  };

  // Render input by type
  const renderField = (field: FieldSchema) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      value: values[field.id] ?? field.defaultValue ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(field, e.target.value),
      disabled: field.isDerived,
    };

    switch (field.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'textarea':
        return <textarea {...commonProps} />;
case 'select':
  return (
    <select {...commonProps}>
      <option value="">Select</option>
      {field.options?.map((opt, idx) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;
        return (
          <option key={value ?? idx} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );

case 'radio':
  return (
    <div>
      {field.options?.map((opt, idx) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;
        return (
          <label key={value ?? idx}>
            <input
              type="radio"
              name={field.id}
              value={value}
              checked={values[field.id] === value}
              onChange={() => handleChange(field, value)}
              disabled={field.isDerived}
            />
            {label}
          </label>
        );
      })}
    </div>
  );

case 'checkbox':
  return (
    <div>
      {field.options?.map((opt, idx) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const value = typeof opt === "string" ? opt : opt.value;
        return (
          <label key={value ?? idx} style={{ display: "block" }}>
            <input
              type="checkbox"
              name={field.id}
              value={value}
              checked={Array.isArray(values[field.id]) ? values[field.id].includes(value) : false}
              onChange={(e) => {
                const currentValues = Array.isArray(values[field.id]) ? [...values[field.id]] : [];
                if (e.target.checked) {
                  handleChange(field, [...currentValues, value]);
                } else {
                  handleChange(field, currentValues.filter(v => v !== value));
                }
              }}
              disabled={field.isDerived}
            />
            {label}
          </label>
        );
      })}
    </div>
  );


      case 'date':
        return <input type="date" {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{form.name}</h2>
      {form.fields.map(field => (
        <div key={field.id} style={{ marginBottom: 15 }}>
          <label htmlFor={field.id}>
            {field.label} {field.required && '*'}
          </label>
          <div>{renderField(field)}</div>
          {errors[field.id] && <div style={{ color: 'red' }}>{errors[field.id]}</div>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormPreview;

