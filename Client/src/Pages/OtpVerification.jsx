import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../api/auth';

const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const contact = location.state?.contact;

    useEffect(() => {
        if (!contact) {
            navigate('/login');
        }
    }, [contact, navigate]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) {
            setError("Please enter a complete 6-digit OTP");
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await verifyOtp(contact, fullOtp);

            if (response.token) {
                localStorage.setItem('token', response.token);
                alert("Login Successful!");
                navigate('/');
            } else {
                throw new Error("Token missing in response");
            }
        } catch (err) {
            console.error("Verification Failed:", err);
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const [timer, setTimer] = useState(20);
    const [isTimerActive, setIsTimerActive] = useState(true);

    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleResend = async () => {
        if (isTimerActive) return;

        try {
            await sendOtp(contact);
            setTimer(20);
            setIsTimerActive(true);
            alert("OTP resent successfully!");
        } catch (err) {
            alert("Failed to resend OTP");
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center px-4 sm:px-0">
            <div className="w-full max-w-[400px] flex-1 flex flex-col justify-center">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Verification</h2>
                    <p className="text-gray-500 text-sm">We've sent a code to your device.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block mb-4 text-gray-700 text-sm font-medium">Enter 6-digit OTP</label>
                        <div className="flex gap-2 justify-between">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="w-12 h-14 text-center text-xl font-bold text-gray-800 border border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10 shadow-sm"
                                    maxLength="1"
                                    value={data}
                                    ref={(el) => inputRefs.current[index] = el}
                                    onChange={(e) => handleChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full p-3.5 bg-[#1a1a80] text-white rounded-xl text-base font-semibold shadow-md hover:shadow-lg hover:bg-[#121250] active:scale-[0.98] transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
            </div>

            <div className="mb-6 w-full max-w-[400px] border border-gray-100 rounded-2xl p-6 text-center bg-white/50 backdrop-blur-sm bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px]">
                <p className="text-gray-500 text-sm mb-1">Didn't receive code?</p>
                <span
                    onClick={handleResend}
                    className={`text-[#1a1a80] font-bold text-sm transition-colors ${!isTimerActive ? 'cursor-pointer hover:underline hover:text-[#121250]' : 'cursor-not-allowed opacity-60'}`}
                >
                    {isTimerActive ? `Resend in ${timer}s` : 'Resend Now'}
                </span>
            </div>
        </div>
    );
};

export default OtpVerification;
