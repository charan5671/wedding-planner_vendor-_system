import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Payment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        amount: '1000' // Default amount
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3000/api/payments/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount)
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Payment successful! Transaction ID: ${data.transactionId}`);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError(data.message || 'Payment failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-8">
            <div className="card p-6">
                <h2 className="text-2xl font-serif font-bold mb-6 text-center">Make a Payment</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="input"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="input"
                            required
                            placeholder="0000 0000 0000 0000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                id="expiry"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 mb-1">
                                CVC
                            </label>
                            <input
                                type="text"
                                id="cvc"
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-6"
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}
