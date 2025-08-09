import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SavedForm {
  name: string;
  createdAt: string;
}

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<SavedForm[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const savedForms: SavedForm[] = [];

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return;
        const parsed = JSON.parse(item);
        if (parsed && parsed.createdAt) {
          savedForms.push({ name: key, createdAt: parsed.createdAt });
        }
      } catch {
        // Ignore invalid JSON or other localStorage items
      }
    });

    setForms(savedForms);
  }, []);

  const openPreview = (formName: string) => {
    navigate(`/preview/${encodeURIComponent(formName)}`);
  };

  return (
    <div>
      <h2>My Saved Forms</h2>
      {forms.length === 0 && <p>No saved forms found.</p>}
      <ul>
        {forms.map(form => (
          <li key={form.name} style={{ cursor: 'pointer', marginBottom: '8px' }} onClick={() => openPreview(form.name)}>
            <strong>{form.name}</strong> - {new Date(form.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyForms;
