'use client'

import { useState, useEffect, useRef } from 'react'

type CellValue = 'X' | 'O' | null
type Board = CellValue[]

interface TicTacToeGameProps {
  playerSymbol: 'X' | 'O'
  onWin: (promocode: string) => void
  onLose: () => void
  onNewGame: () => void
}

export default function TicTacToeGame({ playerSymbol, onWin, onLose, onNewGame }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const computerSymbol = playerSymbol === 'X' ? 'O' : 'X'
  const [isPlayerTurn, setIsPlayerTurn] = useState(playerSymbol === 'X')
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Генерация промокода
  const generatePromocode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Проверка победы
  const checkWinner = (currentBoard: Board): { winner: CellValue; line: number[] | null } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтали
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикали
      [0, 4, 8], [2, 4, 6] // Диагонали
    ]

    for (const line of lines) {
      const [a, b, c] = line
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], line }
      }
    }
    return { winner: null, line: null }
  }

  // Проверка ничьей
  const checkDraw = (currentBoard: Board): boolean => {
    return currentBoard.every(cell => cell !== null)
  }

  // ИИ для компьютера (минимикс с упрощённой логикой)
  const getComputerMove = (currentBoard: Board, compSymbol: 'X' | 'O'): number => {
    // Сначала попытаться выиграть
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard]
        testBoard[i] = compSymbol
        if (checkWinner(testBoard).winner === compSymbol) {
          return i
        }
      }
    }

    // Затем заблокировать игрока
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard]
        testBoard[i] = playerSymbol
        if (checkWinner(testBoard).winner === playerSymbol) {
          return i
        }
      }
    }

    // Центр
    if (currentBoard[4] === null) {
      return 4
    }

    // Углы
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(i => currentBoard[i] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Любая доступная клетка
    const available = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter((val): val is number => val !== null)
    return available[Math.floor(Math.random() * available.length)]
  }

  // Первый ход компьютера, если игрок выбрал нолики
  useEffect(() => {
    if (!gameStarted && playerSymbol === 'O' && !gameOver && board.every(cell => cell === null)) {
      setGameStarted(true)
      const timer = setTimeout(() => {
        const computerMove = getComputerMove(board, computerSymbol)
        const newBoard: Board = [...board]
        newBoard[computerMove] = computerSymbol
        setBoard(newBoard)
        setIsPlayerTurn(true)
      }, 500)
      return () => clearTimeout(timer)
    } else if (!gameStarted && playerSymbol === 'X') {
      setGameStarted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, playerSymbol, gameOver, computerSymbol])

  // Сброс победной линии при новой игре и cleanup таймеров
  useEffect(() => {
    setWinningLine(null)
    setGameResult(null)
    
    // Cleanup таймеров при размонтировании или смене игрока
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [playerSymbol])

  // Отправка сообщения в Telegram
  const sendTelegramMessage = async (message: string) => {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error)
    }
  }

  // Ход игрока
  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameOver || !gameStarted) return

    const newBoard = [...board]
    newBoard[index] = playerSymbol
    setBoard(newBoard)
    setIsPlayerTurn(false)

    // Проверка победы игрока
    const winnerResult = checkWinner(newBoard)
    if (winnerResult.winner === playerSymbol) {
      setGameOver(true)
      setGameResult('win')
      setWinningLine(winnerResult.line)
      const promocode = generatePromocode()
      sendTelegramMessage(`Победа! Промокод выдан: ${promocode}`)
      // Не используем cleanup для этого таймера, так как это финальное состояние игры
      setTimeout(() => onWin(promocode), 500)
      return
    }

    // Проверка ничьей
    if (checkDraw(newBoard)) {
      setGameOver(true)
      setGameResult('lose')
      sendTelegramMessage('Проигрыш')
      // Не используем cleanup для этого таймера, так как это финальное состояние игры
      setTimeout(() => onLose(), 500)
      return
    }

    // Ход компьютера
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      const computerMove = getComputerMove(newBoard, computerSymbol)
      const updatedBoard = [...newBoard]
      updatedBoard[computerMove] = computerSymbol
      setBoard(updatedBoard)
      setIsPlayerTurn(true)

      // Проверка победы компьютера
      const computerWinnerResult = checkWinner(updatedBoard)
      if (computerWinnerResult.winner === computerSymbol) {
        setGameOver(true)
        setGameResult('lose')
        setWinningLine(computerWinnerResult.line)
        sendTelegramMessage('Проигрыш')
        setTimeout(() => onLose(), 500)
        return
      }

      // Проверка ничьей
      if (checkDraw(updatedBoard)) {
        setGameOver(true)
        setGameResult('lose')
        sendTelegramMessage('Проигрыш')
        setTimeout(() => onLose(), 500)
      }
    }, 500)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <div className="text-xl font-bold mb-2" style={{ color: playerSymbol === 'X' ? '#ec4899' : '#a855f7' }}>
            Вы
          </div>
          <div className="text-5xl transform transition-transform hover:scale-110">
            {playerSymbol === 'X' ? '❌' : '⭕'}
          </div>
          <div className="text-xs text-gray-400 mt-2">Игрок</div>
        </div>
        <div className="flex-1 text-center">
          {!gameOver && (
            <div className={`text-sm font-medium transition-all duration-300 ${
              isPlayerTurn 
                ? (playerSymbol === 'X' ? 'text-pink-500' : 'text-purple-500') + ' animate-pulse'
                : (computerSymbol === 'X' ? 'text-pink-500' : 'text-purple-500')
            }`}>
              {isPlayerTurn ? '✨ Ваш ход!' : '💭 Думаю...'}
            </div>
          )}
        </div>
        <div className="text-center flex-1">
          <div className="text-xl font-bold mb-2" style={{ color: computerSymbol === 'X' ? '#ec4899' : '#a855f7' }}>
            Компьютер
          </div>
          <div className="text-5xl transform transition-transform hover:scale-110">
            {computerSymbol === 'X' ? '❌' : '⭕'}
          </div>
          <div className="text-xs text-gray-400 mt-2">Соперник</div>
        </div>
      </div>

      <div className="relative max-w-md mx-auto p-2">
        <div className="grid grid-cols-3 gap-3 relative">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={cell !== null || !isPlayerTurn || gameOver}
              aria-label={cell ? `${cell === 'X' ? 'Крестик' : 'Нолик'} в позиции ${index + 1}` : `Пустая клетка ${index + 1}`}
              className={`
                aspect-square bg-gradient-to-br from-pink-50 via-white to-purple-50
                rounded-2xl text-6xl font-bold
                transition-all duration-300
                border-2 border-transparent
                hover:scale-105 hover:shadow-xl
                active:scale-95
                disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
              ${cell === 'X' ? 'bg-gradient-to-br from-pink-100 to-pink-50 border-pink-300' : ''}
              ${cell === 'O' ? 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300' : ''}
                ${winningLine && winningLine.includes(index) ? 'ring-4 ring-yellow-400 ring-opacity-75 shadow-xl scale-105' : ''}
                ${!cell && !gameOver && isPlayerTurn && gameStarted ? 'cursor-pointer hover:bg-gradient-to-br hover:from-pink-100 hover:via-white hover:to-purple-100 ' + (playerSymbol === 'X' ? 'hover:border-pink-300' : 'hover:border-purple-300') : ''}
                ${cell ? 'animate-bounce-in' : ''}
              `}
              style={cell ? {
                animationDelay: cell ? `${index * 0.05}s` : '0s',
                color: cell === 'X' ? '#ef4444' : '#ef4444'
              } : {
                animationDelay: cell ? `${index * 0.05}s` : '0s'
              }}
            >
              {cell === 'X' && '❌'}
              {cell === 'O' && '⭕'}
            </button>
          ))}
        </div>
        
        {/* Выигрышная линия */}
        {winningLine && winningLine.length === 3 && (() => {
          const sorted = [...winningLine].sort((a, b) => a - b)
          const isHorizontal = sorted[1] === sorted[0] + 1 && sorted[2] === sorted[1] + 1 && sorted[0] % 3 === 0
          const isVertical = sorted[1] === sorted[0] + 3 && sorted[2] === sorted[1] + 3
          const isDiagonalDown = sorted[0] === 0 && sorted[1] === 4 && sorted[2] === 8
          const isDiagonalUp = sorted[0] === 2 && sorted[1] === 4 && sorted[2] === 6
          
          let x1, y1, x2, y2
          const cellSize = 33.33
          const cellCenter = 16.67
          const padding = 5
          
          if (isHorizontal) {
            const row = Math.floor(sorted[0] / 3)
            x1 = padding
            y1 = row * cellSize + cellCenter
            x2 = 100 - padding
            y2 = row * cellSize + cellCenter
          } else if (isVertical) {
            const col = sorted[0] % 3
            x1 = col * cellSize + cellCenter
            y1 = padding
            x2 = col * cellSize + cellCenter
            y2 = 100 - padding
          } else if (isDiagonalDown) {
            x1 = padding
            y1 = padding
            x2 = 100 - padding
            y2 = 100 - padding
          } else if (isDiagonalUp) {
            x1 = 100 - padding
            y1 = padding
            x2 = padding
            y2 = 100 - padding
          } else {
            return null
          }
          
          // Уникальный ID для градиента чтобы избежать конфликтов
          const gradientId = `winningLineGradient-${playerSymbol}-${winningLine.join('')}`
          
          return (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 10, width: '100%', height: '100%' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              {/* Тень линии для объёма */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#${gradientId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.3"
                style={{ filter: 'blur(3px)' }}
              />
              {/* Основная линия */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#${gradientId})`}
                strokeWidth="5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(236, 72, 153, 0.8))' }}
              />
            </svg>
          )
        })()}
      </div>
      
      {gameOver && (
        <div className="mt-6 text-center animate-fade-in">
          <button
            onClick={onNewGame}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🎮 Новая игра
          </button>
        </div>
      )}
    </div>
  )
}
