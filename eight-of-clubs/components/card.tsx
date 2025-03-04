"use client"

import { motion } from "framer-motion"

interface CardProps {
  card: {
    suit: string
    value: string
    id: string
  }
  isFaceUp: boolean
  isLarge?: boolean
}

export default function Card({ card, isFaceUp, isLarge = false }: CardProps) {
  const { suit, value } = card

  // Determine card color based on suit
  const isRed = suit === "hearts" || suit === "diamonds"
  const textColor = isRed ? "text-red-600" : "text-slate-900"

  // Get suit symbol
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
      default:
        return ""
    }
  }

  const suitSymbol = getSuitSymbol(suit)

  return (
    <div
      className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden ${isLarge ? "shadow-2xl" : "shadow-md"}`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFaceUp ? 0 : 180 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Front */}
        <div
          className={`absolute inset-0 w-full h-full bg-white rounded-lg p-2 ${textColor} flex flex-col`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <div className="text-left">
              <div className={`font-bold ${isLarge ? "text-2xl" : "text-lg"}`}>{value}</div>
              <div className={`${isLarge ? "text-2xl" : "text-lg"}`}>{suitSymbol}</div>
            </div>
            <div className={`${isLarge ? "text-2xl" : "text-lg"}`}>{suitSymbol}</div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className={`${isLarge ? "text-6xl" : "text-3xl"} font-bold`}>{suitSymbol}</div>
          </div>

          <div className="flex justify-between items-end">
            <div className={`${isLarge ? "text-2xl" : "text-lg"}`}>{suitSymbol}</div>
            <div className="text-right">
              <div className={`${isLarge ? "text-2xl" : "text-lg"}`}>{suitSymbol}</div>
              <div className={`font-bold ${isLarge ? "text-2xl" : "text-lg"} rotate-180`}>{value}</div>
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full w-full bg-white/10 backdrop-blur-sm rounded-md border border-white/20 flex items-center justify-center">
            <div className="h-1/3 w-1/3 rounded-full bg-white/20 flex items-center justify-center">
              <div className="h-2/3 w-2/3 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

