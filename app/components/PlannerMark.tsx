export function PlannerMark({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* calendar body */}
            <rect x="3.5" y="5.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
            {/* binding */}
            <path d="M7 3.75V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 3.75V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* header divider */}
            <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* checkmark */}
            <path
                d="M8.2 15.2L10.4 17.4L15.8 12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}