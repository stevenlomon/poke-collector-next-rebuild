import Card from "./Card"
import { PokemonCard } from "@/lib/types"

// Receives a mapping of individual PokemonCards from the search page 
// `{searchResults.map((result: PokemonCard) => (`
// and passes them along to the Card component. The shapes match perfectly at every single step
interface SearchResultItemProps {
  resultItem: PokemonCard;
}

export default function SearchResultItem({ resultItem }: SearchResultItemProps) {
  return (
    <li className="search-result-item">
      < Card card={resultItem} />
    </li>
  )
};