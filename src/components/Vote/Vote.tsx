import { WebSocketAction } from '@/enums/websocketaction'
import useWebSocketStore from '@/store/websocketStore'
import { FC, useState } from 'react'
import s from './Vote.module.scss'

interface VoteProps {
	stageId: string
	question: string
	answers: Array<{
		playerId: string
		answer: string
	}>
}

const Vote: FC<VoteProps> = ({ stageId, question, answers }) => {
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { sendMessage } = useWebSocketStore()

	const handleAnswerSelect = (playerId: string) => {
		setSelectedAnswer(playerId)
	}

	const handleSubmit = () => {
		if (!selectedAnswer) return

		setIsSubmitting(true)

		// Создаем сообщение для отправки
		const voteMessage = {
			stageId: stageId,
			playerId: selectedAnswer, // ID игрока, за которого голосуем
		}

		sendMessage(WebSocketAction.VOTE_QUESTION, voteMessage)

		setTimeout(() => {
			setIsSubmitting(false)
		}, 2000)
	}

	return (
		<div className={s.pageVote}>
			<div className={s.container}>
				<h2 className={s.question}>{question}</h2>

				<div className={s.answers}>
					{answers.map(answer => (
						<button
							key={answer.playerId}
							className={`${s.answerButton} ${
								selectedAnswer === answer.playerId ? s.selected : ''
							}`}
							onClick={() => handleAnswerSelect(answer.playerId)}
							disabled={isSubmitting}
						>
							<span className={s.answerText}>{answer.answer}</span>
							<span className={s.playerId}>Игрок: {answer.playerId}</span>
						</button>
					))}
				</div>

				<button
					className={s.submitButton}
					onClick={handleSubmit}
					disabled={!selectedAnswer || isSubmitting}
				>
					{isSubmitting ? 'Отправка...' : 'Отправить ответ'}
				</button>
			</div>
		</div>
	)
}

export default Vote
