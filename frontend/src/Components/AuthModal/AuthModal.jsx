import { useState } from "react";
import axios from "axios";

export default function AuthModal({ closeModal }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const res = await axios.post(endpoint, form);
    localStorage.setItem("token", res.data.token);
    closeModal();
  };

  return (
    <div className="modal">
      <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit}>{isSignup ? "Sign Up" : "Sign In"}</button>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  );
}
