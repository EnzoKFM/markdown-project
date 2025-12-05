const variants = {
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    green: "bg-green-600 text-white hover:bg-green-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    transparent: "bg-transparent text-slate-300 hover:bg-slate-800",
};

export default function Button({
    children,
    variant = "blue",
    onClick,
    className = "",
    ...props
}) {
    return (
        <button
            onClick={onClick}
            className={`h-10 px-4 py-2 rounded-md text-sm cursor-pointer ${variants[variant]} ${className} `}
            {...props}
        >
            {children}
        </button>
    );
}
