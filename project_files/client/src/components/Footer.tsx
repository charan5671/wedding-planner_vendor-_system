

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Wedding Planner. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
