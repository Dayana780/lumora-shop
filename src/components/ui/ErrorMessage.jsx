function ErrorMessage({ message }) {
  return (
    <div className="mx-auto my-8 max-w-md rounded-2xl border border-rose-200 bg-blush-50 px-6 py-5 text-center text-sm text-rose-600">
      {message || "Something went wrong. Please try again."}
    </div>
  );
}

export default ErrorMessage;
