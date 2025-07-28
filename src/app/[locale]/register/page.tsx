"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {useTranslations} from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      name: form.name,
      action: 'register',
      redirect: false
    });

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(t('registrationSuccess'));
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-white">{t('title')}</h2>
        <input
          type="text"
          name="name"
          placeholder={t('namePlaceholder')}
          value={form.name}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded bg-gray-700 text-white placeholder-gray-300 border-gray-600"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t('emailPlaceholder')}
          value={form.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded bg-gray-700 text-white placeholder-gray-300 border-gray-600"
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('passwordPlaceholder')}
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded bg-gray-700 text-white placeholder-gray-300 border-gray-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t('registering') : t('registerButton')}
        </button>
        {error && <p data-testid="register-error" className="text-red-400 mt-2">{error}</p>}
        {success && <p data-testid="register-success" className="text-green-400 mt-2">{success}</p>}
        <p className="mt-4 text-sm text-gray-300">
          {t('haveAccount')} <a href="/login" className="text-blue-400 underline hover:text-blue-300">{t('loginLink')}</a>
        </p>
      </form>
    </div>
  );
}
