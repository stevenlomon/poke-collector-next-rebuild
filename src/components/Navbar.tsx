'use client' // Client component since we need to use `useState`, `useEffect`, `useRef` and `onChange`

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // This replaces useNavigate
import { searchCards } from '@/lib/api';
import { type PokemonCard } from '@/lib/types';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [previews, setPreviews] = useState<PokemonCard[]>([]); // Starts as an empty array but it's not of type "array with empty values"; it's an array of our type PokemonCard!
  const [isOpen, setIsOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Our original timeoutRef, now typed! From the docstring `This object is created internally and is returned from setTimeout() and setInterval()`. It's either that or null, starts as null
  const router = useRouter(); // Replaces `let navigate = useNavigate();`

  // Our useEffect to achieve debouncing is almost entirely the same as in the Vite version
  useEffect(() => {
    // Our edge case completely unchaned: Don't navigate to a search result page for an empty string
    if (!searchTerm.trim()) {
      setIsOpen(false);
      setPreviews([]);
      return;
    }

    // Our original setTimeout, completely unchanged. If the user stops typing for 500ms, this runs
    timeoutRef.current = setTimeout(async () => {
      // Handle local state
      setIsSearching(true);
      setIsOpen(true);

      // Do the fetching business. Completely unchanged
      try {
        const data = await searchCards(searchTerm, 1, 5); // Fetch exactly page 1, limit 5 for the preview
        setPreviews(data.results || []);
      } catch (err) {
        console.error("Preview fetch failed", err);
        setPreviews([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    // And then the important cleanup. If the user types again before 500ms, this kills the previous timer
    return () => {
      if (timeoutRef.current) { // Improvement in our cleanup function; now we guarantee that timeoutRef.current will never be `undefined` which is not in the contract we've written with TypeScript haha
        clearTimeout(timeoutRef.current);
      }
    }; 
  }, [searchTerm]); // Run every time there is a change in the searchTerm state variable

  // We still need a form submission function; now typed
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) { // We *do* use FormEvent here! Despite VSCode saying it's deprecated. In the Browser's native DOM library, FormEvent is deprecated in favor of SubmitEvent. But in the React ecosystem, React.FormEvent<HTMLFormElement> is apparently still perfectly safe, valid and *not* deprecated.
    e.preventDefault();

    if (!searchTerm.trim()) return; // Same safety check; return early if there is no search term
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Updated safety for the clearTimeout!

    setIsOpen(false); // Same important local state management to prevent the curtains from staying open when we return
    router.push(`/search?q=${searchTerm}`); // Replaces `navigate(`/search?q=${searchTerm}`);`
  };

  return (
    <nav className="search-nav">
      <Link href="/">MyPokéCollection</Link>

      <Link
        href="/explore"
        className="disabled-link"
        onClick={(e) => e.preventDefault()}
        title="Coming Soon!"
      >
        Explore Cards
      </Link>
      <Link
        href="/create"
        className="disabled-link"
        onClick={(e) => e.preventDefault()}
        title="Coming Soon!"
      >
        Create Custom Card
      </Link>

      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Search Pokémon...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type='submit'>
          {/* To be swapped out with a Poké ball icon later */}
          {isSearching ? '🌀' : '🔍'}
        </button>
      </form>

      {/* THE DROPDOWN */}
      {isOpen && (
        <div className="search-dropdown">
          {isSearching ? (
            <p className="dropdown-message">Locating Pokémon...</p>
          ) : previews.length > 0 ? (
            <ul className="preview-list">

              {previews.map((card: PokemonCard) => ( // We could leave out `: PokemonCard` here and TS would infer the type from this line `const [previews, setPreviews] = useState<PokemonCard[]>([]);`
                <li key={card.id} className="preview-item">
                  <Link
                    href={`/card/${card.id}`} // Next.js standard href
                    onClick={() => setIsOpen(false)}
                    className="preview-link"
                    // The "Backpack" is gone! No more `state={{ cardData: card }}`
                  >
                    <strong>{card.card_info?.name}</strong> <br />
                    <small className="preview-set-name">{card.card_info?.set_name}</small>
                  </Link>
                </li>
              ))}

              {/* The Goodreads-style "See all results" footer */}
              <li className="preview-footer">
                <Link
                  href={`/search?q=${searchTerm}`}
                  onClick={() => setIsOpen(false)}
                  className="preview-footer-link"
                >
                  See all results for "{searchTerm}"
                </Link>
              </li>
            </ul>
          ) : (
            <p className="dropdown-message">No Pokémon found in the tall grass.</p>
          )}
        </div>
      )}
    </nav>
  )
};
