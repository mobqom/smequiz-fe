'use client'
import { FC, useState } from 'react'
import useWebSocketStore from '../Websocket/websocketStore'
import { Mouth } from './Mouth'
import s from './Test.module.scss'

const Test: FC = () => {
	const [nickname, setNickname] = useState('')
	const [coderoom, setCoderoom] = useState('')
	const { sendMessage, isConnected } = useWebSocketStore()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (nickname.trim() && coderoom.trim() && isConnected) {
			console.log(`📤 Отправка имени: ${nickname.trim()}`)
			console.log(`📤 Вход в комнату: ${coderoom.trim()}`)
			sendMessage('SET_NAME', nickname.trim())
			setNickname('')
			sendMessage('JOIN_ROOM', 'room_' + coderoom.trim())
			setCoderoom('')
		}
	}

	return (
		<div className={s.pageCenter}>
			<div className={s.smile}>
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
					{isConnected && nickname.trim() && coderoom.trim() && (
						<button type='submit'>Отправить</button>
					)}
				</form>
			</div>
		</div>
	)
}

export default Test
