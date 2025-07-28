import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  console.log('i18n.ts - received locale:', locale);
  
  // Fallback to 'en' if locale is undefined
  const currentLocale = locale || 'en';
  console.log('i18n.ts - using locale:', currentLocale);
  
  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
