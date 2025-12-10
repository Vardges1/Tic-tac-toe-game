import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Валидация сообщения
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Сообщение не может быть пустым' },
        { status: 400 }
      )
    }

    // Проверка длины (лимит Telegram - 4096 символов)
    if (message.length > 4096) {
      return NextResponse.json(
        { error: 'Сообщение слишком длинное (максимум 4096 символов)' },
        { status: 400 }
      )
    }

    // Получаем токен бота и chat ID из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не установлены')
      return NextResponse.json(
        { error: 'Telegram конфигурация не настроена' },
        { status: 500 }
      )
    }

    // Отправляем сообщение в Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Ошибка Telegram API:', errorData)
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение в Telegram' },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

