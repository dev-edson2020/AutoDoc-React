import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function FormField({ field, value, onChange, error, showErrors }) {
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;

    if (field.name.includes('cpf') && field.name !== 'contratante_cpf') {
      newValue = formatCPF(newValue);
      if (newValue.length > 14) return;
    } else if (field.name === 'contratante_cpf') {
      // Can be CPF or CNPJ
      const numbers = newValue.replace(/\D/g, '');
      if (numbers.length <= 11) {
        newValue = formatCPF(newValue);
        if (newValue.length > 14) return;
      } else {
        newValue = formatCNPJ(newValue);
        if (newValue.length > 18) return;
      }
    } else if (field.name === 'valor') {
      if (newValue === '') {
        onChange(field.name, '');
        return;
      }
      newValue = formatCurrency(newValue);
      if (newValue.length > 15) return; // Limit to reasonable amount
    }

    onChange(field.name, newValue);
  };

  return (
    <div>
      <Label htmlFor={field.name} className="text-base font-medium text-gray-700 mb-2 block">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.type === "textarea" ? (
        <Textarea
          id={field.name}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={`min-h-[100px] ${showErrors && error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
        />
      ) : (
        <Input
          id={field.name}
          type={field.name === 'valor' ? 'text' : field.type}
          step={field.step}
          value={value || ""}
          onChange={field.name.includes('cpf') || field.name === 'valor' ? handleInputChange : (e) => onChange(field.name, e.target.value)}
          className={showErrors && error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
        />
      )}
      {showErrors && error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}