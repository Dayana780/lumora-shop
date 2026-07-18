import { useEffect, useState } from "react";

function useForm(initialValues) {
  const [formData, setFormData] = useState(initialValues);
  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
  function resetForm() {
    setFormData(initialValues);
  }
  return { formData, handleChange, resetForm };
}

export default useForm;
