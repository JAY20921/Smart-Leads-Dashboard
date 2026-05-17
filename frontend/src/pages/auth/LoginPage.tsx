import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Zap } from 'lucide-react';
import { useAuth, getApiError } from '../../context/AuthContext';
import type { LoginFormData } from '../../types';
import { Input } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate             = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg mb-4">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-brand-600 dark:text-brand-300">
              <p>Admin: <strong>admin@smartleads.dev</strong> / <strong>Admin@1234</strong></p>
              <p>Sales: <strong>sales@smartleads.dev</strong> / <strong>Sales@1234</strong></p>
            </div>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
