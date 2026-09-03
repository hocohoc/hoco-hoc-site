"use client"

import { TrashIcon } from "@heroicons/react/24/outline"
import { useId, useState } from "react"
import Modal from "../modal/modal"
import ModalContainer from "../modal/modalContainer"

type Props = {
    itemType: "article" | "section"
    itemName: string
    onDelete: () => Promise<void>
    warning?: string
    compact?: boolean
}

export default function DeleteContentButton({ itemType, itemName, onDelete, warning, compact = false }: Props) {
    const [confirming, setConfirming] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState("")
    const headingId = useId()
    const descriptionId = useId()
    const itemLabel = itemType === "article" ? "Article" : "Section"

    async function handleDelete() {
        setDeleting(true)
        setError("")

        try {
            await onDelete()
            setConfirming(false)
        } catch (deleteError) {
            console.error(deleteError)
            setError(`The ${itemType} could not be deleted. Please try again.`)
        } finally {
            setDeleting(false)
        }
    }

    return <>
        <button
            className={`btn-danger font-mono inline-flex items-center justify-center gap-1.5 ${compact ? "text-sm" : ""}`}
            type="button"
            onClick={() => {
                setError("")
                setConfirming(true)
            }}
            aria-label={`Delete ${itemType} ${itemName}`}
        >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            Delete{compact ? "" : ` ${itemLabel}`}
        </button>

        {confirming && <ModalContainer
            labelledBy={headingId}
            describedBy={descriptionId}
            onDismiss={deleting ? undefined : () => setConfirming(false)}
        >
            <Modal className="max-w-lg">
                <h2 id={headingId} className="text-xl font-bold">Delete {itemLabel}?</h2>
                <p id={descriptionId} className="mt-2 text-slate-300">
                    You&apos;re about to permanently delete <span className="font-semibold text-slate-100">&ldquo;{itemName}&rdquo;</span>.
                    {warning ? ` ${warning}` : " This cannot be undone."}
                </p>
                {error && <p className="mt-3 rounded border border-red-400/60 bg-red-950/50 p-2 text-sm text-red-200" role="alert">{error}</p>}
                <div className="mt-5 flex justify-end gap-2">
                    <button className="btn-secondary font-mono" type="button" onClick={() => setConfirming(false)} disabled={deleting}>
                        Cancel
                    </button>
                    <button className="btn-danger font-mono inline-flex items-center gap-1.5" type="button" onClick={handleDelete} disabled={deleting}>
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        {deleting ? "Deleting..." : `Delete ${itemLabel}`}
                    </button>
                </div>
            </Modal>
        </ModalContainer>}
    </>
}
