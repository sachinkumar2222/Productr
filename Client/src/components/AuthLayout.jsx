import React from 'react';
import { Outlet } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const AuthLayout = () => {
    return (
        <div className="h-screen w-screen flex bg-gray-50 font-sans">
            <div className="hidden md:flex flex-1 relative m-4 rounded-[30px] overflow-hidden bg-gray-200 items-center justify-center">
                <img src={heroImg} alt="Hero" className="w-full h-full object-fill" />
            </div>
            <div className="flex-1 flex flex-col p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
