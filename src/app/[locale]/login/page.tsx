"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {useTranslations} from 'next-intl';

function LoginContent() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", {
        ...form,
        action: 'login',
        redirect: false,
        callbackUrl: "/"
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.url) {
        router.push(res.url);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  // Show error from NextAuth (e.g., ?error=CredentialsSignin)
  const urlError = searchParams.get("error");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-white">{t('title')}</h2>
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
          {loading ? t('loggingIn') : t('loginButton')}
        </button>
        {(error || urlError) && (
          <p data-testid="login-error" className="text-red-400 mt-2">{error || t('invalidCredentials')}</p>
        )}
        <p className="mt-4 text-sm text-gray-300">
          {t('noAccount')} <a href="/register" className="text-blue-400 underline hover:text-blue-300">{t('registerLink')}</a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
