'use client'

import { useState } from 'react'

interface WinModalProps {
  promocode: string
  onClose: () => void
  onCloseModal?: () => void
}

export default function WinModal({ promocode, onClose, onCloseModal }: WinModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promocode)
      setCopied(true)
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    } catch (error) {
      // Fallback для браузеров без Clipboard API
      console.error('Ошибка копирования:', error)
      // Можно добавить fallback с выделением текста
      const textArea = document.createElement('textarea')
      textArea.value = promocode
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Fallback копирование не сработало:', err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in">
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
          Поздравляем!
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Вы выиграли! Ваш промокод на скидку:
        </p>
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
          <div className="text-5xl font-bold text-pink-600 tracking-wider animate-pulse-glow">
            {promocode}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="mb-3 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          {copied ? '✓ Скопировано!' : '📋 Копировать промокод'}
        </button>
        <button
          onClick={onClose}
          className="mb-3 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          ✨ Сыграть ещё раз ✨
        </button>
        {onCloseModal && (
          <button
            onClick={onCloseModal}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all"
          >
            Закрыть
          </button>
        )}
      </div>
    </div>
  )
}
