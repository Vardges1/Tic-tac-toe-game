'use client'

import { useState } from 'react'
import ChooseSide from '@/components/ChooseSide'
import TicTacToeGame from '@/components/TicTacToeGame'
import WinModal from '@/components/WinModal'
import LoseModal from '@/components/LoseModal'

export default function Home() {
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [promocode, setPromocode] = useState<string>('')
  const [gameKey, setGameKey] = useState(0)

  const handleWin = (code: string) => {
    setPromocode(code)
    setShowWinModal(true)
  }

  const handleLose = () => {
    setShowLoseModal(true)
  }

  const handleChooseSide = (side: 'X' | 'O') => {
    setPlayerSymbol(side)
  }

  const handleNewGame = () => {
    setShowWinModal(false)
    setShowLoseModal(false)
    setPromocode('')
    setPlayerSymbol(null) // Возврат к выбору стороны
    setGameKey(prev => prev + 1) // Перезапуск игры
  }

  const handleCloseLoseModal = () => {
    setShowLoseModal(false) // Просто закрываем модальное окно, не перезапуская игру
  }

  const handleCloseWinModal = () => {
    setShowWinModal(false) // Просто закрываем модальное окно, не перезапуская игру
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative z-10" role="main">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            ✨ Крестики-Нолики ✨
          </h1>
          <p className="text-lg text-gray-600">
            Сыграй с нами и выиграй промокод на скидку!
          </p>
        </div>

        {!playerSymbol ? (
          <ChooseSide onChoose={handleChooseSide} />
        ) : (
          <TicTacToeGame
            key={gameKey}
            playerSymbol={playerSymbol}
            onWin={handleWin}
            onLose={handleLose}
            onNewGame={handleNewGame}
          />
        )}

        {showWinModal && (
          <WinModal
            promocode={promocode}
            onClose={handleNewGame}
            onCloseModal={handleCloseWinModal}
          />
        )}

        {showLoseModal && (
          <LoseModal
            onClose={handleCloseLoseModal}
            onPlayAgain={handleNewGame}
          />
        )}
      </div>
    </main>
  )
}
