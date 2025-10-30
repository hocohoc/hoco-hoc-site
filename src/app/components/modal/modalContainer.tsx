import { ReactNode, useEffect, useRef } from "react"

type Props = {
    children: ReactNode
    className?: string
    labelledBy?: string
    describedBy?: string
    ariaLabel?: string
    onDismiss?: () => void
}

export default function ModalContainer({ children, className, labelledBy, describedBy, ariaLabel, onDismiss }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const focusableSelector = "a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
        const initialFocusTarget = container.querySelector<HTMLElement>(focusableSelector);
        (initialFocusTarget ?? container).focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && onDismiss) {
                event.preventDefault();
                onDismiss();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(element => !element.hasAttribute("disabled"));
            if (focusableElements.length === 0) {
                event.preventDefault();
                container.focus();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            } else if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [onDismiss]);

    return <div
        ref={containerRef}
        className={`w-full h-full fixed top-0 left-0 flex flex-col justify-center items-center bg-gray-950/50 z-50 p-2 overflow-hidden ${className || ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        tabIndex={-1}
    >
        {children}
    </div>
}
