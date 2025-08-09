// 1. Imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import FormBuilder from './form-builder/FormBuilder';
import FormPreview from './form-builder/FormPreview';
import MyForms from './form-builder/MyForms';
import { FormSchema } from './types';

// 2. App Component with routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<FormBuilder />} />
        <Route path="/myforms" element={<MyForms />} />
        <Route path="/preview/:formName" element={<FormPreviewWrapper />} />
      </Routes>
    </Router>
  );
};

// 3. Wrapper component to load form and show preview
const FormPreviewWrapper: React.FC = () => {
  const { formName } = useParams<{ formName: string }>();
  const [form, setForm] = React.useState<FormSchema | null>(null);

  React.useEffect(() => {
    if (!formName) return;
    const decodedName = decodeURIComponent(formName);
    const savedFormJSON = localStorage.getItem(decodedName);

    if (savedFormJSON) {
      try {
        const parsed = JSON.parse(savedFormJSON);
        const loadedForm: FormSchema = {
          id: 'form-' + decodedName,
          name: decodedName,
          createdAt: parsed.createdAt,
          fields: parsed.fields,
        };
        setForm(loadedForm);
      } catch {
        setForm(null);
      }
    } else {
      setForm(null);
    }
  }, [formName]);

  if (!form) {
    return <div>Form not found or failed to load.</div>;
  }

  return <FormPreview form={form} />;
};

// 4. Export app
export default App;
