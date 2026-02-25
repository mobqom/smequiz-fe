'use client'
import { FC, useEffect, useState } from 'react'
import useWebSocketStore from '../Websocket/websocketStore'
import { Mouth } from './Mouth'
import s from './Test.module.scss'

const Test: FC = () => {
	const [nickname, setNickname] = useState('')
	const [coderoom, setCoderoom] = useState('')
	const { connect, sendMessage, isConnected, messages } = useWebSocketStore()

	// Подключаемся к WebSocket при монтировании компонента
	useEffect(() => {
		console.log('🔄 Попытка подключения к WebSocket...')
		connect('ws://localhost:8080')

		// Отключаемся при размонтировании
		return () => {
			console.log('🔌 Отключение от WebSocket...')
			useWebSocketStore.getState().disconnect()
		}
	}, [connect])

	// Логируем изменение статуса подключения
	useEffect(() => {
		if (isConnected) {
			console.log('✅ WebSocket успешно подключен')
		} else {
			console.log('❌ WebSocket отключен')
		}
	}, [isConnected])

	// Логируем все сообщения
	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1]
			console.log(`📨 ${lastMessage}`)
		}
	}, [messages])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (nickname.trim() && coderoom.trim() && isConnected) {
			console.log(`📤 Отправка имени: ${nickname.trim()}`)
			console.log(`📤 Вход в комнату: ${coderoom.trim()}`)
			sendMessage('SET_NAME', nickname.trim())
			setNickname('')
			sendMessage('JOIN_ROOM', 'room_' + coderoom.trim())
			setCoderoom('')
		} else if (!isConnected) {
			console.warn('⚠️ Невозможно отправить сообщение: WebSocket не подключен')
		}
	}

	return (
		<div className={s.pageCenter}>
			<div className={s.smile}>
				{/* Зрачки */}
				<div className={s.eye}>
					<div className={s.eyeLeftPupil}></div>
					<div className={s.eyeRightPupil}></div>
				</div>
				<div className={s.mouth}>
					<Mouth />
				</div>
			</div>

			<div className={s.inputContainer}>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						value={nickname}
						onChange={e => setNickname(e.target.value)}
						placeholder='Введите ник'
						aria-label='Введите ваше имя'
						disabled={!isConnected}
					/>
					<input
						type='text'
						value={coderoom}
						onChange={e => setCoderoom(e.target.value)}
						placeholder='Введите код'
						aria-label='Введите ваш код'
						disabled={!isConnected}
					/>
					<button
						type='submit'
						disabled={!isConnected || !nickname.trim() || !coderoom.trim()}
					>
						Отправить
					</button>
				</form>
			</div>
		</div>
	)
}

export default Test
