import { Server } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
              <Server className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">MyMCP</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h1>
            <p className="text-slate-600">We&apos;ll send you a link to reset your password</p>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600">
              Password reset functionality coming soon. For now, please{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                return to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}