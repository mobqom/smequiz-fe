'use client'
import { WebSocketAction } from '@/enums/websocketaction'
import useWebSocketStore from '@/store/websocketStore'
import { FC, useEffect, useState } from 'react'
import s from './GameLobby.module.scss'
import { Player1 } from './Player1'
import { Player10 } from './Player10'
import { Player2 } from './Player2'
import { Player3 } from './Player3'
import { Player4 } from './Player4'
import { Player5 } from './Player5'
import { Player6 } from './Player6'
import { Player7 } from './Player7'
import { Player8 } from './Player8'
import { Player9 } from './Player9'

interface Player {
	id: string
	name: string
}

interface GameLobbyProps {
	players?: Player[]
	currentPlayerId?: string
	maxPlayers?: number
}

const GameLobby: FC<GameLobbyProps> = ({
	players = [],
	currentPlayerId,
	maxPlayers = 10,
}) => {
	const { sendMessage, isConnected } = useWebSocketStore()
	const [localPlayers, setLocalPlayers] = useState<Player[]>(players)

	// Обновляем игроков при изменении пропсов
	useEffect(() => {
		setLocalPlayers(players)
	}, [players])

	// Проверяем, является ли текущий игрок первым
	const isFirstPlayer =
		localPlayers.length > 0 && localPlayers[0]?.id === currentPlayerId

	// Проверяем, достаточно ли игроков для старта (3 и более)
	const hasEnoughPlayers = localPlayers.length >= 3

	// Определяем статус кнопки
	const getButtonState = () => {
		// if (!isFirstPlayer) {
		// 	return {
		// 		disabled: true,
		// 		text: 'Ждем старта...',
		// 		className: s.waitingButton,
		// 	}
		// }

		if (!hasEnoughPlayers) {
			return {
				disabled: true,
				text: `Ждем игроков (${localPlayers.length}/3)`,
				className: s.waitingButton,
			}
		}

		return {
			disabled: false,
			text: 'Начать игру',
			className: s.startButton,
		}
	}

	// Функция для получения компонента картинки по индексу игрока
	const getPlayerImageByIndex = (index: number) => {
		// Массив с компонентами картинок для 10 игроков
		const images = [
			Player1,
			Player2,
			Player3,
			Player4,
			Player5,
			Player6,
			Player7,
			Player8,
			Player9,
			Player10,
		]

		// Если индекс выходит за пределы массива, используем последний компонент
		const safeIndex = Math.min(index, images.length - 1)
		const ImageComponent = images[safeIndex]

		return <ImageComponent />
	}

	const buttonState = getButtonState()

	const handleStartGame = () => {
		if (!buttonState.disabled) {
			console.log(`📤 Старт игры }`)
			sendMessage(WebSocketAction.START_GAME)
		}
	}

	return (
		<div className={s.GameLobby}>
			<div className={s.playersList}>
				<div className={s.players}>
					{localPlayers.map((player, index) => (
						<div
							key={player.id}
							className={`${s.playerItem} ${index === 0 ? s.firstPlayer : ''}`}
						>
							<div className={s.avatarWrapper}>
								{getPlayerImageByIndex(index)}
							</div>

							<div className={s.playerInfo}>
								<span className={s.playerName}>{player.name}</span>
							</div>
						</div>
					))}

					{/* Плейсхолдеры для пустых слотов */}
					{[...Array(maxPlayers - localPlayers.length)].map((_, index) => {
						return (
							<div
								key={`empty-${index}`}
								className={`${s.playerItem} ${s.emptySlot}`}
							>
								<div className={s.playerAvatar}>
									<div className={s.emptyAvatar}></div>
								</div>
								<div className={s.playerInfo}>
									<span className={s.emptyName}>Свободный слот...</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			<div className={s.actions}>
				<button
					className={`${s.button} ${buttonState.className}`}
					onClick={handleStartGame}
					disabled={buttonState.disabled}
				>
					{buttonState.text}
				</button>

				{!isFirstPlayer && localPlayers.length > 0 && (
					<p className={s.waitingMessage}>Ожидание начала игры хостом...</p>
				)}
			</div>
		</div>
	)
}

export default GameLobby
