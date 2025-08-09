export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface Option {
  label: string;
  value: string;
}

export interface ValidationRules {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: {
    minLength?: number;
    requireNumber?: boolean;
    requireUpper?: boolean;
  };
  // Added for number/date fields
  min?: number;        // for number fields
  max?: number;        // for number fields
  minDate?: string;    // ISO string or date format
  maxDate?: string;    // ISO string or date format
}

export interface DerivedField {
  parents: string[];
  expression: string;
}

export interface FieldSchema {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: Option[];
  validation?: ValidationRules;
  isDerived?: boolean;
  derived?: DerivedField | null;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldSchema[];
}

export type FieldConfig = {
  id: string;
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
  options?: string[];
  required?: boolean;
  validation?: ValidationRules; // Reuse the main ValidationRules type
  derived?: DerivedField | null;
};
