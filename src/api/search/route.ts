// This will be very similar to the card-image Route Handler! They are both built so that we can confidentally say that
// *the Browser (via our client components) NEVER talks directly to the external API* that requires an API key. This would 
// expose our API key in the browser! Instead we create "mini-servers" and proxies that sit between the browser and PokeWallet.
// Whenever the browser makes a request, it asks the relevant Route Handler, the Route Handler uses our API key that stays
// perfectly safe on our server, makes the request, and then hands the data back to the Browser
// The main differences between the Image Route Handler and this Search Route Handler lies only in query VS params and JSON vs binary,
// as well as caching. Incomplete searches are not cached, images are cached for 24h. But the mentals models stays intact between the two

import { NextResponse } from 'next/server';
import { searchCards } from '@/lib/api';

export async function GET(request: Request) {
  // Extract the search term from the URL (e.g., /api/search?q=charizard)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // Return early if no query
  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  try {
    // *HERE* we run this line of code that was origninall in Navbar!
    const data = await searchCards(query, 1, 5);

    // Send the clean JSON back to the Browser (client component)
    return NextResponse.json(data);
  } catch (err) {
    console.error("Route Handler Error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};