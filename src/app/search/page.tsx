// Not a client component! It's a pure server component and because of this it'll be a *lot* slimmer than the
// *behemoth* that is the original SearchPage haha. Because we don't have a client component doing both client and server work! 
// No more `useState` or `useEffect`. Because we are on the server, we don't need an "effect" to run after the page loads. We just pause the server (await searchCards()), get the data, and render the HTML instantly.
// No more `useSearchParams` -> Next.js automatically hands the URL parameters directly to our Page component as a prop called `searchParams`
// No more handleNextPage functions. We just use standard Next.js `Link` tags that point to the next page's URL!
import Link from "next/link";
import { searchCards } from "@/lib/api";
import SearchResultItem from "@/components/SearchResultItem";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string, limit?: string }>;}) {
  return (
    <div>SearchPage</div>
  )
};