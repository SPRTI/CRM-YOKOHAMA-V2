import { LoginForm } from '../../components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Aeternum</p>
        <h1 className="mt-2 text-3xl font-bold">Yokohama CRM</h1>
        <p className="mt-2 text-sm text-neutral-400">Ingresá para administrar chats, incidencias y control del bot.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
