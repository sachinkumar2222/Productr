import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp } from '../api/auth';

const Login = () => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (inputValue) {
                const response = await sendOtp(inputValue);
                navigate('/verify-otp', { state: { contact: inputValue } });
            }
        } catch (err) {
            console.error('Login Failed:', err);
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center px-4 sm:px-0">
            <div className="w-full max-w-[400px] flex-1 flex flex-col justify-center">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">Login to your Productr Account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-gray-700 text-sm font-medium">Email or Phone number</label>
                        <input
                            type="text"
                            className="w-full p-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10 shadow-sm"
                            placeholder="e.g. Acme@gmail.com"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full p-3.5 bg-[#1a1a80] text-white rounded-xl text-base font-semibold shadow-md hover:shadow-lg hover:bg-[#121250] active:scale-[0.98] transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Sending OTP...' : 'Login'}
                    </button>
                </form>
            </div>

            <div className="mb-6 w-full max-w-[400px] border border-gray-100 rounded-2xl p-6 text-center bg-white/50 backdrop-blur-sm bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px]">
                <p className="text-gray-500 text-sm mb-1">Don't have a Productr Account?</p>
                <Link to="#" className="text-[#1a1a80] font-bold text-sm hover:underline hover:text-[#121250] transition-colors">
                    Sign Up Here
                </Link>
            </div>
        </div>
    );
};

export default Login;
