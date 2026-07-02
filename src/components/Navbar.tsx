'use client' // Client component since we need to use `useState`, `useEffect`, `useRef` and `onChange`

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"; // This replaces useNavigate
import { searchCards } from "@/lib/api";
import { PokemonCard } from "@/lib/types";

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

  return (
    <nav>
      <Link href="/">MyPokéCollection</Link>
      <Link href="/explore">Explore Cards</Link>
      <Link href="/create">Create Custom Card</Link>
      <form>
        <input type='text' placeholder='Search Pokémon...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type='submit'>
          {/* To be swapped out with a Poké ball icon later */}
          {isSearching ? '🌀' : '🔍'}
        </button>
      </form>
    </nav>
  )
};
