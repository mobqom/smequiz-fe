import { FC, ReactNode } from 'react'

type Props = { children: ReactNode }

const GameLayout: FC<Props> = ({ children }) => {
	return <div>{children}</div>
}

export default GameLayout
