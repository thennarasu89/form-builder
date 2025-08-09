import React, { useState } from 'react';
import { FieldConfig, FieldType } from '../types';
import FieldEditor from './FieldEditor';

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FieldConfig[]>([]);

  const addField = (type: FieldType) => {
    const newField: FieldConfig = {
      id: Date.now().toString(),
      name:'example',
      type,
      label: 'New Field',
      required: false,
      defaultValue: '',
      validation: {},
      derived: { 
        parents: [],
        expression: ''
      }
    };
    setFields(prev => [...prev, newField]);
  };

  const deleteField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const moveFieldUp = (index: number) => {
    if (index > 0) {
      setFields(prev => {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      });
    }
  };

  const moveFieldDown = (index: number) => {
    if (index < fields.length - 1) {
      setFields(prev => {
        const updated = [...prev];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        return updated;
      });
    }
  };

 const saveForm = () => {
  const formName = prompt('Enter form name:');
  if (formName) {
    const savedData = {
      createdAt: new Date().toISOString(),
      fields,
    };
    localStorage.setItem(formName, JSON.stringify(savedData));
    alert('Form saved!');
  }
};


  return (
    <div>
      <h2>Form Builder</h2>
      <div>
       <button onClick={() => addField('text')}>Add Text Field</button>
<button onClick={() => addField('number')}>Add Number Field</button>
<button onClick={() => addField('textarea')}>Add Textarea Field</button>
<button onClick={() => addField('select')}>Add Select Field</button>
<button onClick={() => addField('radio')}>Add Radio Field</button>
<button onClick={() => addField('checkbox')}>Add Checkbox Field</button>
<button onClick={() => addField('date')}>Add Date Field</button>
<button onClick={saveForm}>Save Form</button>
</div>
      <ul>
  {fields.map((field, index) => (
    <li key={field.id}>
      <FieldEditor
        field={field}
          allFields={fields}  
        onChange={updatedField => {
          setFields(prev => {
            const copy = [...prev];
            copy[index] = updatedField;
            return copy;
          });
        }}
        onDelete={() => deleteField(index)}
        onMoveUp={() => moveFieldUp(index)}
        onMoveDown={() => moveFieldDown(index)}
      />
    </li>
  ))}
</ul>

    </div>
  );
};

export default FormBuilder;
