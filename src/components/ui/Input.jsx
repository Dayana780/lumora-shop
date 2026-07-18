function Input({ name, formData, handleChange }) {
  return (
    <>
      <label>{name}</label>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
    </>
  );
}

export default Input;
