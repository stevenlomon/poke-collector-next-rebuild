// Not a client component! It's a pure server component and because of this it'll be a *lot* slimmer than the
// *behemoth* that is the original SearchPage haha. Because we don't have a client component doing both client and server work! 
// No more `useState` or `useEffect`. Because we are on the server, we don't need an "effect" to run after the page loads. We just pause the server (await searchCards()), get the data, and render the HTML instantly.
// No more `useSearchParams` -> Next.js automatically hands the URL parameters directly to our Page component as a prop called `searchParams`
// No more handleNextPage functions. We just use standard Next.js `Link` tags that point to the next page's URL!
import Link from "next/link";
import { searchCards } from "@/lib/api";
import SearchResultItem from "@/components/SearchResultItem";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string, limit?: string }>;}) {
  const params = await searchParams;
  const query = params.q;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "20");

  // Our empty state; returned instanty, no fetching needed
  if (!query) {
    return (
      <div>
        <h2>Looking for Pokémon?</h2>
        <p>Use the search bar to find cards to add to your collection!</p>
      </div>
    )
  }

  // The actual fetch now is just pure server-side awaiting! No useEffect and no loading states related to the data fetching!!
  // If it fails, Next.js automatically catches it for us in errors.tsx!
  const data = await searchCards(query, page, limit);
  const searchResults = data.results;
  const pagination = data.pagination;

  return (
    <div>SearchPage</div>
  )
};