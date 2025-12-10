'use client'

interface LoseModalProps {
  onClose: () => void
  onPlayAgain: () => void
}

export default function LoseModal({ onClose, onPlayAgain }: LoseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in shadow-2xl">
        <div className="text-8xl mb-4">😔</div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
          Упс!
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          К сожалению, вы проиграли. Но не расстраивайтесь! 
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Попробуйте ещё раз — удача обязательно улыбнётся! 💪
        </p>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Хотите сыграть ещё раз?
          </p>
        </div>
        <button
          onClick={onPlayAgain}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 mb-3 shadow-lg"
        >
          ✨ Сыграть ещё раз ✨
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}
