import { TelegramClient } from './client';

export async function setupBotCommands() {
  const commands = [
    {
      command: 'start',
      description: 'Iniciar conversa com suporte'
    },
    {
      command: 'help',
      description: 'Ver comandos disponíveis'
    },
    {
      command: 'status',
      description: 'Verificar status do atendimento'
    }
  ];

  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setMyCommands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commands })
      }
    );
  } catch (error) {
    console.error('Error setting bot commands:', error);
  }
}