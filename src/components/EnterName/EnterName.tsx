// EnterName.tsx
import { FC } from 'react'
import s from './EnterName.module.scss'
import { Mouth } from './Mouth'

const EnterName: FC = () => {
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
				<input
					type='text'
					placeholder='Введите ник'
					aria-label='Введите ваше имя'
				/>
			</div>
		</div>
	)
}

export default EnterName
