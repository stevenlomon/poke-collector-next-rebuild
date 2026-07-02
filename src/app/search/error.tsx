'use client'
// Client component (uses `useEffect` and `onClick`) that is purely responsible for catching errors and displaying them!
// Under the hood it uses React Error Boundaries which is advanced React I've never had a reason to touch haha

// It wraps both our Search page *and* our Loading component:
//{/* The Error Boundary intercepts any crashes from its children */}
//  <NextJsErrorBoundary fallback={<Error />}>
//    
//    {/* Suspense intercepts any 'awaits' from its children */}
//    <ReactSuspense fallback={<Loading />}>
//      
//      {/* Our actual page */}
//      <SearchPage />
//      
//    </ReactSuspense>
//    
//  </NextJsErrorBoundary>

// Just like I wrote in the Loading component; absolutely mindblowing engineering

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) { // "Expect an object that has everything a standard Error has, AND also allow it to have a digest property."
  useEffect(() => {
    // Here we can log the error to the console or send it to services like Sentry or Datadog
    console.error("Caught by Next.js Error Boundary:", error)
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <h2>Oh no! A wild error appeared!</h2>
      <p className="text-gray-500 my-4">{error.message || "Failed to fetch Pokémon data."}</p>
      
      {/* The reset function tells Next.js to re-run the server component and try again! */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  )
};