'use client'

import { useCollection } from "@/contexts/CollectionContext";
import CollectionItem from "@/components/CollectionItem";

export default function Home() {
  const { userCollection, increaseAmount, decreaseAmount, removeCardFromCollection } = useCollection();
  const collectionSize = userCollection.length;

  return (
    <div className={collectionSize === 0 ? "empty-collection" : "collection-grid"}>
      {collectionSize === 0 ? (
        <p>There are no cards in your collection! Add your first card now :)</p>
      ) : (
        userCollection.map(collectionItem =>
          <CollectionItem
            key={collectionItem.id}
            card={collectionItem}
            onIncrease={increaseAmount}
            onDecrease={decreaseAmount}
            onDelete={removeCardFromCollection}
          />)
      )}
    </div>
  )
};
