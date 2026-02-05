import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6"
      data-theme="forest"
    >
      {/* MAIN CARD */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl max-h-[95vh] bg-base-100 rounded-xl shadow-lg overflow-hidden">
        
        {/* LEFT : LOGIN FORM */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
          
          {/* LOGO */}
          <div className="mb-4 flex items-center gap-2">
            <ShipWheelIcon className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Streamify
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4 py-2">
              <span className="text-sm">
                {error?.response?.data?.message || "Login failed"}
              </span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm opacity-70">
                Sign in to continue your language journey
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {/* EMAIL */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="input input-bordered input-sm w-full"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered input-sm w-full"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="btn btn-primary btn-sm w-full mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* SIGNUP LINK */}
              <div className="text-center mt-3">
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT : IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center overflow-hidden">
          <div className="max-w-md p-6">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-2 mt-4">
              <h2 className="text-lg font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="text-sm opacity-70">
                Practice conversations and grow together
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
