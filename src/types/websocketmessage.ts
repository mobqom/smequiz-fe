/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocketAction } from '@/enums/websocketaction'

// Типы для сообщений WebSocket с использованием enum
export interface WebSocketMessage {
	action: WebSocketAction // Используем enum вместо string
	payload?: any
}
