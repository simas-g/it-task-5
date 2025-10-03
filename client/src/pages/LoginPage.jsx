import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../auth/auth";
import { useAuth } from "../auth/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLogin } = useAuth();
  const mutation = useMutation({
    mutationFn: (variables) => login(variables),
    onError: (error) => {
      setErrorMessage(error.message || "Login failed. Please try again.");
    },
    onSuccess: (data) => {
      handleLogin(data);
      setEmail("");
      setPassword("");
      setErrorMessage("");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            THE APP
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600">
            Start your journey
          </p>
          <h2 className="mt-6 text-xl font-bold text-center text-gray-800">
            Sign In to The App
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?
                <a
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
