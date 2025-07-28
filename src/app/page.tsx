import {redirect} from 'next/navigation';

// This page will only render if the user visits the root URL "/"
// and not a localized URL like "/en" or "/hu"
export default function RootPage() {
  // Redirect to default locale
  redirect('/en');
}
