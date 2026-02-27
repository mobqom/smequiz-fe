/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Websocket/websocketStore.ts
import { WebSocketAction } from '@/enums/websocketaction'
import { create } from 'zustand'

// Тип для сообщений
type MessageType = string | any

interface WebSocketState {
	socket: WebSocket | null
	isConnected: boolean
	messages: MessageType[]
	connect: (url: string) => void
	disconnect: () => void
	sendMessage: (action: WebSocketAction, payload?: any) => void // Используем enum
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	messages: [],

	connect: (url: string) => {
		console.log('🔌 Store: попытка подключения к', url)
		const socket = new WebSocket(url)

		socket.onopen = () => {
			console.log('✅ Store: WebSocket подключен')
			set({ isConnected: true })
		}

		socket.onmessage = event => {
			console.log('📨 Store: получено сообщение', event.data)
			let message: MessageType = event.data
			try {
				if (
					typeof event.data === 'string' &&
					(event.data.trim().startsWith('{') ||
						event.data.trim().startsWith('['))
				) {
					message = JSON.parse(event.data)
				}
			} catch (e) {
				console.log('Store: сообщение не JSON, оставляем строкой')
			}

			set(state => ({
				messages: [...state.messages, message],
			}))
		}

		socket.onerror = error => {
			console.error('❌ Store: ошибка WebSocket', error)
		}

		socket.onclose = () => {
			console.log('🔌 Store: WebSocket отключен')
			set({ isConnected: false, socket: null })
		}

		set({ socket })
	},

	disconnect: () => {
		const { socket } = get()
		if (socket) {
			socket.close()
		}
	},

	sendMessage: (action: WebSocketAction, payload?: any) => {
		const { socket, isConnected } = get()
		if (socket && isConnected) {
			const message = JSON.stringify({ action, payload })
			console.log('📤 Store: отправка сообщения', message)
			socket.send(message)
		} else {
			console.warn('⚠️ Store: невозможно отправить, WebSocket не подключен')
		}
	},
}))

export default useWebSocketStore
