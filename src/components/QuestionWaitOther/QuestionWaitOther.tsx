'use client'
import { FC } from 'react'
import { BigHappySmile } from './BigHappySmile'
import s from './QuestionWaitOther.module.scss'

const QuestionWaitOther: FC = () => {
	return (
		<div className={s.pageQuestionWaitOther}>
			<div className={s.bigSmile}>
				<BigHappySmile />
			</div>
			<p className={s.whiteText}>Еще не все ответили</p>
			<p>Ждем-с</p>
		</div>
	)
}

export default QuestionWaitOther
