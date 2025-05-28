import React, { useState } from "react";
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
export default function Login() {
    const navigate=useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const payload = isLogin
                ? {
                    email: formData.email,
                    password: formData.password,
                }
                : formData;

            const res = await axios.post(`${import.meta.env.VITE_USER_API}${isLogin ? "/login" : "/register"}`, payload);
            if (res.data.success)
                toast.success(res.data.message);
            dispatch(
                setCredentials({
                    token: res.data.token,
                    user: res.data.user,
                })
            );
            navigate('/');

        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="flex space-x-4">

            <img
                className="hidden md:block py-12 w-1/2 h-full  object-contain"
                src="/login.jpg"
                alt="Login visual"
            />



            {/* Right side form */}
            <div className="flex flex-col justify-center md:w-1/2 px-8 py-12">
                <h2 className="text-3xl font-bold mb-6 text-center ">{isLogin ? "Login" : "Sign Up"}</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            className="w-full border-0 border-b-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border-0 border-b-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
                        onChange={handleChange}
                        required
                        value={formData.email}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full border-0 border-b-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                    {!isLogin && (
                        <>
                            <input
                                name="phone"
                                type="text"
                                placeholder="Phone Number"
                                className="w-full border-0 border-b-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
                                onChange={handleChange}
                                value={formData.phone}
                            />
                            <input
                                name="address"
                                type="text"
                                placeholder="format-> street city state zipcode country"
                                className="w-full border-0 border-b-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-0"
                                onChange={handleChange}
                                value={formData.address}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700 transition p-2 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        ) : (
                            isLogin ? "Login" : "Sign Up"
                        )}
                    </button>

                </form>

                <button
                    onClick={toggleForm}
                    className="mt-4 text-sm text-blue-600 hover:underline self-start"
                >
                    {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}
