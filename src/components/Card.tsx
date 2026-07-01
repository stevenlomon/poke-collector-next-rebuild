import CardImage from "./CardImage";
import { PokemonCard } from "@/lib/types";

interface CardProps {
  card: PokemonCard;
}

export default function Card({ card }: CardProps) {
  return (
    // Completely unchanged from the Vite React SPA version with exception of the fallback improvement
    <div className="card-component">
      <h2>{card.card_info?.name}</h2>
      <h3>Set: {card.card_info?.set_name}</h3>

      <CardImage cardId={card.id} cardName={card.card_info.name} />
    </div>
  )
};