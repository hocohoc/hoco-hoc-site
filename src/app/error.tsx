"use client"
import { useEffect } from "react";
import ModalContainer from "./components/modal/modalContainer";
import Modal from "./components/modal/modal";
import ErrorPopup from "./components/error-popup/errorPopup";

export default function CustomError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    console.log("An error occurred!");
    console.log(error)
  }, [error])

  return <div>
    <ErrorPopup error={error}>
      <p className="mb-4">Sorry, an uncaught error occurred somewhere. This is not supposed to happen. Contact us if the problem persists.</p>
    </ErrorPopup>
  </div>
}
