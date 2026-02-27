/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import Test from '@/components/Test/Test'
import useWebSocketStore from '@/components/Websocket/websocketStore'
import { FC, useCallback, useEffect, useState } from 'react'
import s from './page.module.scss'

// Enum для действий WebSocket
export enum WebSocketAction {
	SET_SCREEN = 'SET_SCREEN',
	PLAYER_ID = 'PLAYER_ID',
	JOIN_ROOM = 'JOIN_ROOM',
	GAME_START = 'GAME_START',
	CREATE_ROOM = 'CREATE_ROOM',
	SET_NAME = 'SET_NAME',
	CURRENT_ROOM = 'CURRENT_ROOM',
	PLAYERS_LIST = 'PLAYERS_LIST',
}

// Enum для экранов
export enum ScreenType {
	SET_NAME_SCREEN = 'SET_NAME_SCREEN',
	GAME_LOBBY_WAIT_PLAYERS_SCREEN = 'GAME_LOBBY_WAIT_PLAYERS_SCREEN',
}

// Типы для сообщений WebSocket с использованием enum
interface WebSocketMessage {
	action: WebSocketAction // Используем enum вместо string
	payload?: any
}

// Тип для сообщений в сторе (может быть строкой или объектом)
type MessageType = string | WebSocketMessage | any

const LoadingScreen: FC<{ currentScreen: ScreenType | string }> = ({
	currentScreen,
}) => (
	<div className={s.loadingScreen}>
		<div className={s.loader}>
			<div className={s.spinner}></div>
			<p>Подключение к серверу...</p>
			<p className={s.screenInfo}>
				Текущий экран: {currentScreen || 'ожидание'}
			</p>
		</div>
	</div>
)

const Home: FC = () => {
	const [currentScreen, setCurrentScreen] = useState<ScreenType | string>('')
	const { connect, isConnected, messages } = useWebSocketStore()

	// Подключаемся к WebSocket
	useEffect(() => {
		console.log('🔄 Подключение к WebSocket...')
		connect('ws://localhost:8080')

		return () => {
			console.log('🔌 Отключение от WebSocket...')
			useWebSocketStore.getState().disconnect()
		}
	}, [connect])

	// Функция для парсинга сообщения
	const parseMessage = useCallback(
		(message: MessageType): WebSocketMessage | null => {
			// Если это строка
			if (typeof message === 'string') {
				const trimmed = message.trim()

				// Пробуем распарсить как JSON
				if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
					try {
						const parsed = JSON.parse(trimmed)
						// Проверяем, что action соответствует enum
						if (
							parsed.action &&
							Object.values(WebSocketAction).includes(parsed.action)
						) {
							return parsed as WebSocketMessage
						}
						return parsed
					} catch (e) {
						console.warn('Не удалось распарсить JSON:', trimmed)
						return null
					}
				}

				// Если это текстовая команда, маппим в enum
				if (trimmed === 'SET_NAME_SCREEN') {
					return {
						action: WebSocketAction.SET_SCREEN,
						payload: ScreenType.SET_NAME_SCREEN,
					}
				}

				return null
			}

			// Если это уже объект
			if (message && typeof message === 'object') {
				// Проверяем, есть ли поле action
				if ('action' in message) {
					// Проверяем, что action соответствует enum
					if (Object.values(WebSocketAction).includes(message.action)) {
						return message as WebSocketMessage
					}
				}
			}

			return null
		},
		[],
	)

	// Обрабатываем сообщения
	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1] as MessageType
			console.log('📨 Получено сообщение:', lastMessage)

			const parsedMessage = parseMessage(lastMessage)

			if (parsedMessage) {
				console.log('✅ Распарсено:', parsedMessage)

				// Проверяем action используя enum
				switch (parsedMessage.action) {
					case WebSocketAction.SET_SCREEN:
						console.log(`🖥️ Смена экрана на: ${parsedMessage.payload}`)
						// Проверяем, что payload соответствует ScreenType
						if (Object.values(ScreenType).includes(parsedMessage.payload)) {
							setCurrentScreen(parsedMessage.payload as ScreenType)
						} else {
							console.warn('⚠️ Неизвестный тип экрана:', parsedMessage.payload)
							setCurrentScreen(parsedMessage.payload)
						}
						break

					case WebSocketAction.GAME_START:
						console.log('🎮 Игра началась!')
						// Можете установить соответствующий экран
						// setCurrentScreen(ScreenType.GAME_SCREEN)
						break

					case WebSocketAction.JOIN_ROOM:
						console.log('👤 Игрок присоединился:', parsedMessage.payload)
						break

					default:
						console.log('📨 Получено другое действие:', parsedMessage.action)
				}
			} else {
				console.log('❌ Не удалось распарсить сообщение')
			}
		}
	}, [messages, parseMessage])

	// Отслеживаем изменение currentScreen
	useEffect(() => {
		console.log('🔄 Текущий экран:', currentScreen)
	}, [currentScreen])

	// Рендерим экран используя enum
	const renderScreen = () => {
		switch (currentScreen) {
			case ScreenType.SET_NAME_SCREEN:
				console.log('🎨 Рендерим Test компонент')
				return <Test />

			default:
				console.log('🔄 Рендерим экран по умолчанию (загрузка)')
				return <LoadingScreen currentScreen={currentScreen} />
		}
	}

	return (
		<main className={s.main}>
			{/* Индикатор подключения */}
			<div
				className={`${s.connectionStatus} ${isConnected ? s.connected : s.disconnected}`}
			>
				{isConnected ? '🟢 Подключено' : '🔴 Отключено'}
			</div>

			{renderScreen()}
		</main>
	)
}

export default Home
