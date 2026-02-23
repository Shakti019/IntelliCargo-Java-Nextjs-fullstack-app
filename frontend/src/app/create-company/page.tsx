'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Company {
    id: number;
    name: string;
    registrationNumber: string;
    country: string;
    status: string;
}

export default function CreateCompanyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [hasCompany, setHasCompany] = useState(false);
    const [company, setCompany] = useState<Company | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        country: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [typedText, setTypedText] = useState('');
    
    const steps = [
        {
            step: 1,
            field: 'name',
            title: 'What is your company name?',
            placeholder: 'Enter your company name',
            instruction: 'Start by entering your official company name. This should match your legal business registration documents.',
        },
        {
            step: 2,
            field: 'registrationNumber',
            title: 'What is your registration number?',
            placeholder: 'Enter registration number',
            instruction: 'Provide your official business registration number. This helps us verify your company and ensure compliance with local regulations.',
        },
        {
            step: 3,
            field: 'country',
            title: 'Where is your company registered?',
            placeholder: 'Select country',
            instruction: 'Select the country where your business is legally registered. This determines the regulatory framework we use for your account.',
            isSelect: true,
            options: [
                'United States', 'United Kingdom', 'Canada', 'India', 
                'Germany', 'France', 'China', 'Japan', 'Australia', 
                'Singapore', 'UAE', 'Netherlands', 'Other'
            ]
        },
    ];

    useEffect(() => {
        checkExistingCompany();
    }, []);

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
        }, 30);

        return () => clearInterval(typingInterval);
    }, [currentStep]);

    const checkExistingCompany = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth');
                return;
            }

            const response = await fetch('http://localhost:8080/api/companies/my-company', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCompany(data);
                setHasCompany(true);
            } else if (response.status === 404) {
                setHasCompany(false);
            }
        } catch (err) {
            console.error('Error checking company:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        const currentField = steps[currentStep - 1].field as keyof typeof formData;
        if (!formData[currentField]) {
            setError('This field is required');
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
        setError('');
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setCompany(data);
                setHasCompany(true);
                // Navigate back to dashboard
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to create company');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (hasCompany && company) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Company Registered</h1>
                        <p className="text-gray-500 text-lg">Your company is active and ready to use</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-2">Company Name</p>
                            <p className="text-2xl font-semibold text-gray-900">{company.name}</p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-2">Registration Number</p>
                            <p className="text-2xl font-semibold text-gray-900">{company.registrationNumber}</p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-2">Country</p>
                            <p className="text-2xl font-semibold text-gray-900">{company.country}</p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                            <p className="text-sm text-gray-500 mb-2">Status</p>
                            <span className="inline-block px-4 py-2 rounded-lg text-lg font-semibold bg-green-100 text-green-700">
                                {company.status}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentStepData = steps[currentStep - 1];
    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Form */}
            <div className="w-1/2 flex items-center justify-center p-12">
                <div className="max-w-lg w-full">
                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-500">Step {currentStep} of {steps.length}</span>
                            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
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
                        <div className="mb-6 text-red-600 text-sm font-medium">
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
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
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

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
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
                                        Creating...
                                    </span>
                                ) : (
                                    'Create Company'
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
            <div className="w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-lg">
                    {/* Icon */}
                    <div className="mb-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    {/* Typing Text */}
                    <p className="text-white text-2xl leading-relaxed font-light">
                        {typedText}
                        <span className="inline-block w-0.5 h-6 bg-white ml-1 animate-pulse" />
                    </p>

                    {/* Additional Info */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-white/80 text-sm mb-4">Why we need this information:</p>
                        <ul className="space-y-2 text-white/70 text-sm">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verify business legitimacy
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Ensure regulatory compliance
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Secure your transactions
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
