/* eslint-disable @typescript-eslint/no-explicit-any */
// store/websocketStore.ts
import { create } from 'zustand'

interface WebSocketState {
	socket: WebSocket | null
	isConnected: boolean
	messages: string[]
	connect: (url: string) => void
	disconnect: () => void
	sendMessage: (action: string, payload: any) => void
	addMessage: (message: string) => void
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
	socket: null,
	isConnected: false,
	messages: [],

	connect: (url: string) => {
		const socket = new WebSocket(url)

		socket.onopen = () => {
			console.log('✅ WebSocket connected')
			set({ isConnected: true, socket })
		}

		socket.onmessage = event => {
			console.log('📩 Message received:', event.data)
			get().addMessage(`Received: ${event.data}`)
		}

		socket.onerror = error => {
			console.error('❌ WebSocket error:', error)
			get().addMessage(`Error: ${error}`)
		}

		socket.onclose = () => {
			console.log('🔌 WebSocket disconnected')
			set({ isConnected: false, socket: null })
			get().addMessage('Disconnected from server')
		}
	},

	disconnect: () => {
		const { socket } = get()
		if (socket) {
			socket.close()
		}
	},

	sendMessage: (action: string, payload: any) => {
		const { socket, isConnected } = get()
		if (socket && isConnected) {
			const message = JSON.stringify({ action, payload })
			socket.send(message)
			console.log('📤 Message sent:', message)
			get().addMessage(`Sent: ${message}`)
		} else {
			console.warn('⚠️ Cannot send message - WebSocket not connected')
		}
	},

	addMessage: (message: string) => {
		set(state => ({
			messages: [
				...state.messages,
				`${new Date().toLocaleTimeString()}: ${message}`,
			],
		}))
	},
}))

export default useWebSocketStore
