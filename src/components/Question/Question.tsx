/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { WebSocketAction } from '@/enums/websocketaction'
import useWebSocketStore from '@/store/websocketStore'
import { FC, useEffect, useState } from 'react'
import { InputCloud } from './InputCloud'
import s from './Question.module.scss'
import { StationeryButton } from './StationeryButton'

interface QuestionProps {
	stageId: string
	question: string
}

const Question: FC<QuestionProps> = ({ stageId, question }) => {
	const [answer, setAnswer] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [timeLeft, setTimeLeft] = useState<number | null>(30) // Установите начальное значение

	const { sendMessage } = useWebSocketStore()

	// Таймер для вопроса
	useEffect(() => {
		if (timeLeft === null || timeLeft <= 0) return

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev && prev > 0) return prev - 1
				return null
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft])

	// Сбрасываем состояние при новом вопросе
	useEffect(() => {
		setAnswer('')
		setIsSubmitting(false)
		setTimeLeft(30)
	}, [stageId, question]) // Срабатывает когда приходит новый вопрос

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!answer.trim() || isSubmitting) return

		setIsSubmitting(true)

		// Отправляем ответ
		const answerPayload = {
			stageId: stageId,
			answer: answer.trim(),
		}

		console.log('📤 Отправка ответа:', answerPayload)
		sendMessage(WebSocketAction.ANSWER_QUESTION, answerPayload)

		// Блокируем кнопку на 2 секунды чтобы избежать повторной отправки
		setTimeout(() => {
			setIsSubmitting(false)
		}, 2000)
	}

	// Проверяем, есть ли вопрос
	if (!question || !stageId) {
		return (
			<div className={s.Question}>
				<div className={s.waiting}>
					<p>Ожидание вопроса...</p>
				</div>
			</div>
		)
	}

	return (
		<div className={s.Question}>
			<div className={s.questionContainer}>
				{timeLeft !== null && (
					<div className={s.timer}>
						<span className={s.timerValue}>{timeLeft}</span>
					</div>
				)}

				<div className={s.questionBlock}>
					<div className={s.vote}>Вопрос</div>
					<div className={s.questionAtribute}>
						<StationeryButton />
					</div>
					<div className={s.questionContent}>
						<p className={s.questionText}>{question}</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className={s.answerForm}>
					<div className={s.inputGroup}>
						<div className={s.cloudBackground}>
							<InputCloud />
						</div>
						<textarea
							className={s.answerInput}
							value={answer}
							onChange={e => setAnswer(e.target.value)}
							placeholder='Введите ответ'
							rows={4}
							disabled={isSubmitting}
							maxLength={50}
						/>
					</div>

					<button
						type='submit'
						className={s.submitButton}
						disabled={!answer.trim() || isSubmitting}
					>
						{isSubmitting ? 'Отправка...' : 'Отправить ответ'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Question
