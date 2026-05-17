import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Zap } from 'lucide-react';
import { useAuth, getApiError } from '../../context/AuthContext';
import type { RegisterFormData } from '../../types';
import { Input, Select } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import { USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(80),
  email:    z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a digit'),
  role:     z.enum(['Admin', 'SalesUser']).optional(),
});

const roleOptions = USER_ROLES.map((r) => ({ value: r, label: r === 'SalesUser' ? 'Sales User' : r }));

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'SalesUser' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-brand-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg mb-4">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join Smart Leads Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alice Johnson"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="alice@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 chars, 1 uppercase, 1 digit"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Select
              label="Role"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
