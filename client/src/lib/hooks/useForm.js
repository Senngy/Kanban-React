// hooks/useForm.js
import { useState } from "react";

export const useForm = (initialValues, onSubmitCallback) => {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmitCallback(values);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    }
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, handleSubmit, resetForm, error };
};