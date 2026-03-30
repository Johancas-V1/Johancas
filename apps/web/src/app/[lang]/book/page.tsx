import { redirect } from "next/navigation";

export default async function BookRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/books/the-great-famine`);
}
