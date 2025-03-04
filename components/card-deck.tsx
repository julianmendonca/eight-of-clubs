"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";
import Card from "@/components/card";

// Define card suits and values
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

// Create the deck of 52 cards
const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, id: `${value}-${suit}` });
    }
  }
  return shuffleArray(deck); // Shuffle the deck before returning
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: { suit: string; value: string; id: string }[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function CardDeck() {
  const [cards, setCards] = useState(createDeck());
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [magicTrickActive, setMagicTrickActive] = useState(false);
  const magicCard = { suit: "clubs", value: "8", id: "8-clubs" };

  const handleShuffle = () => {
    setIsShuffling(true);
    setSelectedCardId(null);

    setTimeout(() => {
      setCards(shuffleArray(createDeck()));
      setIsShuffling(false);
    }, 1500);
  };

  const handleCardClick = (cardId: string) => {
    if (magicTrickActive) {
      setCards((prev) => {
        const magicCardPositionIndex = prev.findIndex(
          (i) => i.id === magicCard.id
        );
        const selectedCard = prev.find((i) => i.id === cardId);
        const selectedCardIndex = prev.findIndex((i) => i.id === cardId);
        const newDeck = [...prev];
        newDeck[selectedCardIndex] = { ...magicCard, id: cardId };
        newDeck[magicCardPositionIndex] = {
          ...selectedCard!,
          id: magicCard.id,
        };
        return newDeck;
      });
      toggleMagicTrick();
      setSelectedCardId(magicCard.id);
    } else {
      setSelectedCardId(cardId);
    }
    //setSelectedCardId(magicTrickActive ? magicCard.id : cardId)
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedCardId(null);
    }
  };

  const toggleMagicTrick = () => {
    setMagicTrickActive(!magicTrickActive);
  };

  const selectedCard = cards.find((card) => card.id === selectedCardId);

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="sticky top-0 z-10 py-4 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-950 dark:to-transparent">
        <Button
          onClick={handleShuffle}
          disabled={isShuffling}
          className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 mb-4"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </Button>
      </div>

      {/* Shuffling animation overlay */}
      <AnimatePresence>
        {isShuffling && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative h-40 w-32"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 left-0 h-40 w-32 rounded-lg bg-white shadow-lg border border-slate-200"
                  initial={{
                    x: 0,
                    y: 0,
                    rotateZ: 0,
                    scale: 1,
                  }}
                  animate={{
                    x: [0, i * 5 - 10, 0],
                    y: [0, i * -3, 0],
                    rotateZ: [0, i % 2 === 0 ? 5 : -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: 0,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                >
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                    <div className="h-full w-full bg-white rounded-md flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card grid */}
      <div className="grid grid-cols-3 gap-2 pb-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => handleCardClick(card.id)}
          >
            <Card card={card} isFaceUp={card.id === selectedCardId} />
          </motion.div>
        ))}
      </div>

      {/* Selected card overlay */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 180 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.8,
              }}
              className="w-4/5 max-w-xs h-auto aspect-[2/3]"
              style={{ perspective: "1000px" }}
            >
              <Card
                card={magicTrickActive ? magicCard : selectedCard}
                isFaceUp={true}
                isLarge={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magic trick toggle button */}
      <div
        className="fixed bottom-4 right-4 w-20 h-20"
        onClick={toggleMagicTrick}
      />
    </div>
  );
}
