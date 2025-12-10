'use client'

interface ChooseSideProps {
  onChoose: (side: 'X' | 'O') => void
}

export default function ChooseSide({ onChoose }: ChooseSideProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
          Выберите сторону ✨
        </h2>
        <p className="text-gray-600">
          За кого вы хотите играть?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        <button
          onClick={() => onChoose('X')}
          className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 hover:from-pink-100 hover:to-pink-200 transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-pink-300"
        >
          <div className="text-center mb-4">
            <div className="text-6xl inline-block transition-transform group-hover:scale-110">
              ❌
            </div>
          </div>
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-pink-600 group-hover:text-pink-700 transition-all duration-300 group-hover:text-[1.6rem]">
              Крестики
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 transition-all duration-300 group-hover:text-[0.9375rem]">
              Ходите первым
            </div>
          </div>
        </button>

        <button
          onClick={() => onChoose('O')}
          className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-purple-300"
        >
          <div className="text-center mb-4">
            <div className="text-6xl inline-block transition-transform group-hover:scale-110">
              ⭕
            </div>
          </div>
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-all duration-300 group-hover:text-[1.6rem]">
              Нолики
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 transition-all duration-300 group-hover:text-[0.9375rem]">
              Ходите вторым
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

