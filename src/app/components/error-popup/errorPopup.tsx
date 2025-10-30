import { ReactNode } from "react"
import Modal from "../modal/modal"
import ModalContainer from "../modal/modalContainer"
import { XMarkIcon } from "@heroicons/react/24/outline"

type Action = {
  name: string
  onActivate: () => void
}

type Props = {
  error: Error
  children?: ReactNode[] | ReactNode
  close?: () => void
}

export default function ErrorPopup(props: Props) {
  return <ModalContainer ariaLabel="Error dialog" onDismiss={props.close}>
    <Modal className="flex flex-col">
      <div className="flex flex-row items-start">
        <div className="flex-1">
          <p className="font-mono font-bold mb-2 text-lg">:(</p>
          <h1 className={`font-mono text-2xl font-bold text-red-400 mb-2`}>Something went wrong...</h1>
        </div>
        {props.close &&
          <button className="bg-slate-700 rounded-full p-1 flex items-center hover:bg-slate-600 justify-center" type="button" onClick={props.close} aria-label="Close error dialog">
            <XMarkIcon className="h-5 w-5 text-slate-200" />
          </button>
        }
      </div>
      <p className="font-mono text-sm text-slate-400 p-1 bg-slate-950 rounded mb-4"> Error Details: {props.error.name} - {props.error.message} </p>
      <div className="flex flex-col">
        {props.children}
      </div>
    </Modal>
  </ModalContainer >
}
