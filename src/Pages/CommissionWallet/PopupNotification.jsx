import { useEffect } from "react";

const PopupNotification = ({
    message,
    type = "success",
    visible,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [visible, duration, onClose]);

    if (!visible) return null;

    const baseStyle =
        "fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm text-white z-50 transition-all duration-300";

    const typeStyle =
        type === "error"
            ? "bg-red-600"
            : type === "success"
                ? "bg-green-600"
                : "bg-gray-700";

    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            <span>{message}</span>

            <button
                onClick={onClose}
                className="ml-2 text-lg font-bold leading-none hover:opacity-80"
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

export default PopupNotification;
