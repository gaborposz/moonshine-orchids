"use client";

import { useEffect, useState } from "react";
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const [backendStatus, setBackendStatus] = useState<string>(t('checkingBackend'));

  useEffect(() => {
    fetch("/api/healthcheck")
      .then(async (res) => {
        const data = await res.json();
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus(t('backendOffline'));
      });
  }, [t]);


  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center mb-8">{t('title')}</h1>
      <p className="text-lg text-center text-gray-600">{backendStatus}</p>
    </div>
  );
}
