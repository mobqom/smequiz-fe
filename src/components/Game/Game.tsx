/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { ScreenType } from '@/enums/screentype'
import { WebSocketAction } from '@/enums/websocketaction'
import useWebSocketStore from '@/store/websocketStore'
import { WebSocketMessage } from '@/types/websocketmessage'
import { FC, useEffect, useState } from 'react'
import { JoinRoom } from '../JoinRoom'
import s from './Game.module.scss'

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

const Game: FC = () => {
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

	// Обрабатываем сообщения
	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1] as WebSocketMessage
			console.log('📨 Получено сообщение:', lastMessage)

			if (lastMessage) {
				console.log('✅ Распарсено:', lastMessage)

				// Проверяем action используя enum
				switch (lastMessage.action) {
					case WebSocketAction.SET_SCREEN:
						console.log(`🖥️ Смена экрана на: ${lastMessage.payload}`)
						// Проверяем, что payload соответствует ScreenType
						if (Object.values(ScreenType).includes(lastMessage.payload)) {
							setCurrentScreen(lastMessage.payload as ScreenType)
						} else {
							console.warn('⚠️ Неизвестный тип экрана:', lastMessage.payload)
							setCurrentScreen(lastMessage.payload)
						}
						break

					case WebSocketAction.GAME_START:
						console.log('🎮 Игра началась!')
						// Можете установить соответствующий экран
						// setCurrentScreen(ScreenType.GAME_SCREEN)
						break

					case WebSocketAction.JOIN_ROOM:
						console.log('👤 Игрок присоединился:', lastMessage.payload)
						break

					default:
						console.log('📨 Получено другое действие:', lastMessage.action)
				}
			} else {
				console.log('❌ Не удалось распарсить сообщение')
			}
		}
	}, [messages])

	// Отслеживаем изменение currentScreen
	useEffect(() => {
		console.log('🔄 Текущий экран:', currentScreen)
	}, [currentScreen])

	// Рендерим экран используя enum
	const renderScreen = () => {
		switch (currentScreen) {
			case ScreenType.SET_NAME_SCREEN:
				console.log('🎨 Рендерим Test компонент')
				return <JoinRoom />

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

export default Game
