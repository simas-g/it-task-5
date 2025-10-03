import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { register } from "../auth/auth";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = formData;
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const inputClass =
    "relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1";
  const labelClass = "block text-sm font-medium text-gray-700";
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage("");
    setSuccessMessage("");
  };
  const mutation = useMutation({
    mutationFn: (variables) => register(variables),
    onError: (error) => {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
      setSuccessMessage("");
    },
    onSuccess: () => {
      resetForm();
      setSuccessMessage("Registration successful! You can now log in.");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    mutation.mutate({ name, email, password });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            THE APP
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600">
            Join the journey
          </p>
          <h2 className="mt-6 text-xl font-bold text-center text-gray-800">
            Create Your Account
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleChange(e)}
                placeholder="Alex Clare"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => handleChange(e)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => handleChange(e)}
                placeholder="Password"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleChange(e)}
                placeholder="Confirm Password"
                className={inputClass}
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign Up
              </button>
            </div>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?
                <a
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
