"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  if (session) {
    router.push("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginOrRegister = async () => {
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      username: form.username,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Login / Register</h1>
      <button onClick={() => signIn()} className="bg-red-500 text-white px-4 py-2 rounded mb-2">
        Sign in with Google
      </button>
      <input name="username" placeholder="Username" onChange={handleChange} className="border p-2 m-2 w-64" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 m-2 w-64" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 m-2 w-64" />
      <button onClick={loginOrRegister} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Login / Register
      </button>
    </div>
  );
}
