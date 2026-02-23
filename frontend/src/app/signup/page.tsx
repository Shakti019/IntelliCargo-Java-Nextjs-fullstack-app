'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        role: '',
        companyName: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const steps = [
        {
            step: 1,
            field: 'fullName',
            title: 'What is your full name?',
            placeholder: 'Enter your full name',
            instruction: 'Let\'s start with your name. This helps us personalize your experience and verify your identity on the platform.',
            type: 'text',
        },
        {
            step: 2,
            field: 'email',
            title: 'What is your email address?',
            placeholder: 'your.email@company.com',
            instruction: 'Your email will be used for account verification, important notifications, and secure login. Make sure it\'s an email you check regularly.',
            type: 'email',
        },
        {
            step: 3,
            field: 'password',
            title: 'Create a strong password',
            placeholder: 'Enter password',
            instruction: 'Choose a secure password with at least 8 characters. Use a mix of uppercase, lowercase, numbers, and special characters for maximum security.',
            type: 'password',
        },
        {
            step: 4,
            field: 'confirmPassword',
            title: 'Confirm your password',
            placeholder: 'Re-enter password',
            instruction: 'Please re-enter your password to make sure we got it right. This helps prevent typos and ensures you can access your account.',
            type: 'password',
        },
        {
            step: 5,
            field: 'country',
            title: 'Where are you located?',
            placeholder: 'Select your country',
            instruction: 'Your country helps us provide relevant logistics solutions, comply with local regulations, and connect you with partners in your region.',
            isSelect: true,
            options: [
                'United States', 'United Kingdom', 'Canada', 'India', 
                'Germany', 'France', 'China', 'Japan', 'Australia', 
                'Singapore', 'UAE', 'Netherlands', 'Brazil', 'Mexico',
                'South Korea', 'Indonesia', 'Italy', 'Spain', 'Other'
            ],
        },
        {
            step: 6,
            field: 'role',
            title: 'What is your role?',
            placeholder: 'Select your role',
            instruction: 'Your role helps us tailor the platform features to your needs and connect you with the right business opportunities.',
            isSelect: true,
            options: [
                { value: 'SHIPPER', label: '📦 Shipper - I ship cargo' },
                { value: 'CARRIER', label: '🚢 Carrier - I transport cargo' },
                { value: 'TRADER', label: '💼 Trader - I buy/sell goods' },
                { value: 'LOGISTICS_PARTNER', label: '🔗 Logistics Partner' },
                { value: 'IMPORTER', label: '📥 Importer' },
                { value: 'EXPORTER', label: '📤 Exporter' },
                { value: 'WAREHOUSE_MANAGER', label: '🏢 Warehouse Manager' },
            ],
        },
        {
            step: 7,
            field: 'companyName',
            title: 'What is your company name?',
            placeholder: 'Enter company name (optional)',
            instruction: 'Enter your company name if you\'re signing up on behalf of a business. You can also skip this and add it later from your profile settings.',
            type: 'text',
            optional: true,
        },
    ];

    // Typing effect for instructions
    useEffect(() => {
        const currentInstruction = steps[currentStep - 1].instruction;
        let index = 0;
        setTypedText('');
        
        const typingInterval = setInterval(() => {
            if (index < currentInstruction.length) {
                setTypedText(currentInstruction.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 20);

        return () => clearInterval(typingInterval);
    }, [currentStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const validateCurrentStep = () => {
        const currentField = steps[currentStep - 1].field as keyof typeof formData;
        const currentStepData = steps[currentStep - 1];
        
        // Skip validation for optional fields
        if (currentStepData.optional && !formData[currentField]) {
            return true;
        }

        if (!formData[currentField]) {
            setError('This field is required');
            return false;
        }

        // Email validation
        if (currentField === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                return false;
            }
        }

        // Password validation
        if (currentField === 'password') {
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long');
                return false;
            }
        }

        // Confirm password validation
        if (currentField === 'confirmPassword') {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (!validateCurrentStep()) {
            return;
        }
        
        setError('');
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        setError('');
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === steps.length) {
                handleSubmit(e as any);
            } else {
                handleNext();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    country: formData.country,
                    role: formData.role,
                    companyName: formData.companyName || undefined,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('username', data.fullName || formData.fullName);
                
                // Show success message and redirect
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const currentStepData = steps[currentStep - 1];
    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Form */}
            <div className="w-1/2 flex items-center justify-center p-12">
                <div className="max-w-lg w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.push('/auth')}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-2 mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Login
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">
                                Step {currentStep} of {steps.length}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-12 leading-tight">
                        {currentStepData.title}
                    </h1>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Input Field */}
                    <div className="mb-12">
                        {currentStepData.isSelect ? (
                            <select
                                name={currentStepData.field}
                                value={formData[currentStepData.field as keyof typeof formData]}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-2xl py-4 bg-transparent transition-colors"
                                autoFocus
                            >
                                <option value="">{currentStepData.placeholder}</option>
                                {currentStepData.options?.map((option) => (
                                    typeof option === 'string' ? (
                                        <option key={option} value={option}>{option}</option>
                                    ) : (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    )
                                ))}
                            </select>
                        ) : currentStepData.type === 'password' ? (
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name={currentStepData.field}
                                    value={formData[currentStepData.field as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyPress}
                                    placeholder={currentStepData.placeholder}
                                    className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-2xl py-4 bg-transparent placeholder-gray-400 transition-colors pr-12"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <input
                                type={currentStepData.type || 'text'}
                                name={currentStepData.field}
                                value={formData[currentStepData.field as keyof typeof formData]}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder={currentStepData.placeholder}
                                className="w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none text-2xl py-4 bg-transparent placeholder-gray-400 transition-colors"
                                autoFocus
                            />
                        )}
                    </div>

                    {/* Optional Field Note */}
                    {currentStepData.optional && (
                        <p className="text-sm text-gray-500 -mt-8 mb-8">
                            This field is optional. You can skip it and add later.
                        </p>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}
                        
                        {currentStep < steps.length ? (
                            <button
                                onClick={handleNext}
                                className="ml-auto flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Continue
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="ml-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    '✓ Create Account'
                                )}
                            </button>
                        )}
                    </div>

                    {/* Keyboard Hint */}
                    <p className="mt-8 text-sm text-gray-400">
                        Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Enter ↵</kbd> to continue
                    </p>
                </div>
            </div>

            {/* Right Side - Instructions with Typing Effect */}
            <div className="w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-lg">
                    {/* Icon */}
                    <div className="mb-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    {/* Typing Text */}
                    <p className="text-white text-2xl leading-relaxed font-light min-h-[120px]">
                        {typedText}
                        <span className="inline-block w-0.5 h-6 bg-white ml-1 animate-pulse" />
                    </p>

                    {/* Platform Benefits */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-white/80 text-sm mb-4">Join IntelliCargo for:</p>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Smart logistics optimization
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Global trade network access
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Real-time shipment tracking
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Secure payment processing
                            </li>
                        </ul>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 flex items-center gap-2 text-white/60 text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Your data is encrypted and secure
                    </div>
                </div>
            </div>
        </div>
    );
}
