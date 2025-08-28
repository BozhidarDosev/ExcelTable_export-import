 export async function safeToast(type, message, durationSeconds = 3) {
        const toast = document.createElement("div");

        const baseStyles = "px-4 py-2 rounded shadow-md text-sm transition-opacity duration-300";
        const typeStyles = {
            "info": "bg-blue-500 text-white",
            "success": "bg-green-500 text-white",
            "error": "bg-red-500 text-white",
            "warning": "bg-yellow-500 text-black"
        };

        toast.className = `${baseStyles} ${typeStyles[type] || typeStyles["info"]}`;
        toast.textContent = message;

        const container = document.getElementById("toastContainer");
        container.appendChild(toast);

        // Animate fade-out and remove
        setTimeout(() => {
            toast.classList.add("opacity-0");
            setTimeout(() => toast.remove(), 1000);
        }, durationSeconds * 1500);   // Visible for durationSeconds + fade time
        
    }