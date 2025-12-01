import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'btn',
                    {
                        'btn-primary': variant === 'primary',
                        'btn-secondary': variant === 'secondary',
                        'btn-ghost': variant === 'ghost',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
