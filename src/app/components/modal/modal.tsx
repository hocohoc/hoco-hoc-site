import { ReactNode } from "react"

type Props = {
    children: ReactNode
    className?: string
}

export default function Modal(props: Props) {
    return <div className={`p-4 max-w-2xl w-full bg-slate-900 border-2 border-slate-700 rounded-md overflow-y-auto ${props.className || ""} `} role="document">
        {props.children}
    </div>
}