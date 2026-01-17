import { useNavigate } from 'react-router-dom';

export function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed bottom-8 left-8 z-[100] flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full shadow-2xl hover:bg-primary-600 transition-all active:scale-95 group"
            aria-label="Go back"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span>BACK</span>
        </button>
    );
}
