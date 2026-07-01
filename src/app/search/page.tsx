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
  // If it fails, Next.js automatically catches it for us in error.tsx! And all `await`-ing is intercepted by loading.tsx! 
  const data = await searchCards(query, page, limit);
  const searchResults = data.results;
  const pagination = data.pagination;

  // Our zero results state
  if (searchResults.lenth === 0) {
    return (
      <div>
        <h2>No Pokémon found in the tall grass!</h2>
        <p>Try with another search query!</p>
      </div>
    );
  }

  return (
    <div>
      <p>Showing results for "{query}" - {pagination.total} total results</p>
      
      <ul className="search-results-grid">
        {searchResults.map((result: any) => (
          // Once again; no more "Backpack strat" haha! Next.js Link handles all of the caching
          <Link key={result.id} href={`/card/${result.id}`}>
            {/* <SearchResultItem resultItem={result} /> SearchResultItem and Card will be built out next */}
          </Link>
        ))}
      </ul>

      {/* The Pagination Controls */}
      <div className="pagination-controls">
        {/* If we can go back, render a Link. If not, render a disabled button! */}
        {pagination.page > 1 ? (
          <Link 
            className="pagination-btn" 
            href={`/search?q=${query}&page=${page - 1}&limit=${limit}`}
          >
            Previous
          </Link>
        ) : (
          <button className="pagination-btn" disabled>Previous</button>
        )}

        {/* If we can go forward, render a Link. If not, render a disabled button! */}
        {pagination.page < pagination.total_pages ? (
          <Link 
            className="pagination-btn" 
            href={`/search?q=${query}&page=${page + 1}&limit=${limit}`}
          >
            Next
          </Link>
        ) : (
          <button className="pagination-btn" disabled>Next</button>
        )}
      </div>
    </div>
  );
};