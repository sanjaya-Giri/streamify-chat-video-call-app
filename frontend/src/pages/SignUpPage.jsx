import React, { useState } from "react";
import { Link } from "react-router";
import { ShipWheelIcon } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl bg-base-100 rounded-xl shadow-lg overflow-hidden lg:max-h-[90vh]">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
          <div className="mb-4 flex items-center gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Streamify
            </span>
          </div>
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response?.data?.message ||
                  error.message ||
                  "Signup failed"}
              </span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">
                Join Streamify and start your language learning adventure!
              </p>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="John Doe"
                value={signupData.fullName}
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="john@gmail.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                placeholder="********"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                required
                minLength={6}
              />
              <p className="text-xs opacity-70 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* TERMS */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  required
                />
                <span className="text-xs">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">terms</span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline">
                    privacy policy
                  </span>
                </span>
              </label>
            </div>

            {/* SUBMIT */}
             <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
            {/* LOGIN */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <img
              src="/i.png"
              alt="Language connection illustration"
              className="mx-auto max-w-sm"
            />
            <h2 className="text-xl font-semibold mt-6">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-70 mt-2">
              Practice conversations, make friends, and improve together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
