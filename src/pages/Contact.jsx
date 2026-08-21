import { useState } from "react";
import { Mail, Clock, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const initialForm = { name: "", email: "", subject: "", message: "" };

function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required";
    if (!formData.message.trim()) nextErrors.message = "Message is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setStatus("loading");

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        user_id: user?.id ?? null,
      });

      if (error) {
        throw error;
      }

      setStatus("success");
      setFormData(initialForm);
    } catch (error) {
      console.error("Contact form submit error:", error);
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="section-eyebrow">Get In Touch</p>
        <h1 className="mt-3 text-4xl font-semibold">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-md text-stone-500">
          Have a question about an order, a product, or just want to say
          hello? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <div className="card-surface flex items-start gap-4 p-5">
            <Mail className="mt-0.5 text-rose-500" size={20} />
            <div>
              <p className="text-sm font-medium text-charcoal">Email us</p>
              <p className="text-sm text-stone-500">hello@lumora.com</p>
            </div>
          </div>

          <div className="card-surface flex items-start gap-4 p-5">
            <Clock className="mt-0.5 text-rose-500" size={20} />
            <div>
              <p className="text-sm font-medium text-charcoal">Response time</p>
              <p className="text-sm text-stone-500">We reply within 1–2 business days.</p>
            </div>
          </div>

          <div className="card-surface flex items-start gap-4 p-5">
            <MessageCircle className="mt-0.5 text-rose-500" size={20} />
            <div>
              <p className="text-sm font-medium text-charcoal">Need quick answers?</p>
              <p className="text-sm text-stone-500">
                Check our <a href="/faq" className="text-rose-600 hover:underline">FAQ page</a> first.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="card-surface space-y-4 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label-field">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-rose-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label-field">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="label-field">Subject</label>
            <input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-field"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="mt-1 text-xs text-rose-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="label-field">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="input-field resize-none"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs text-rose-600">{errors.message}</p>
            )}
          </div>

          {status === "success" && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
              Your message has been sent. We'll get back to you soon.
            </p>
          )}

          {status === "error" && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              Something went wrong sending your message. Please try again.
            </p>
          )}

          <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
