import RegisterForm from "@/components/ui/RegisterForm";
import AuthCanvasBackground from "@/components/ui/AuthCanvasBackground";
import Link from "next/link";


export default function Register() {
    return (
        <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)" }}>

            <AuthCanvasBackground />

            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-sm mt-1.5">
                        Join ShopMart and start shopping
                    </p>
                </div>

                <RegisterForm />

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have account?{' '}
                    <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                        Log in
                    </Link>
                </p>

            </div>

        </div>
    )
}