'use client';

import { useRouter } from 'next/navigation';
import { Anchor, Truck, Globe, BarChart3, Shield, Zap, ArrowRight, CheckCircle2, TrendingUp, Package } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Optimization",
      description: "Intelligent route planning and cargo optimization for maximum efficiency"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Connect with carriers, shippers, and traders worldwide in real-time"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Analytics",
      description: "Track shipments and analyze performance with live dashboards"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full regulatory compliance"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Cost Reduction",
      description: "Reduce logistics costs by up to 30% with intelligent automation"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "End-to-End Tracking",
      description: "Monitor every shipment from origin to destination in real-time"
    }
  ];

  const benefits = [
    "Automated cargo booking and management",
    "Real-time shipment tracking with IoT integration",
    "Smart route optimization",
    "Integrated trade request marketplace",
    "Comprehensive analytics and reporting",
    "Multi-role collaboration platform"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-[30%] w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Anchor size={40} strokeWidth={2.5} />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IntelliCargo
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              The Future of Intelligent Logistics
            </p>
            
            <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              Streamline your cargo operations with smart optimization, real-time tracking, and seamless global connectivity. Join the next generation of logistics management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <button
                onClick={() => router.push('/signup')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/auth')}
                className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-slate-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Truck className="w-5 h-5" />
                Sign In
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-slate-400 mt-8 animate-fade-in-up animation-delay-500">
              ✨ Trusted by 500+ logistics companies worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features for Modern Logistics
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage, optimize, and scale your logistics operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-slate-100 hover:border-blue-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose IntelliCargo?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Transform your logistics operations with cutting-edge technology designed for efficiency, visibility, and growth.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 animate-fade-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                    <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                    <p className="text-white text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Average Cost Savings</p>
                      <p className="text-white text-2xl font-bold">30%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Faster Processing</p>
                      <p className="text-white text-2xl font-bold">5x</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Global Coverage</p>
                      <p className="text-white text-2xl font-bold">150+ Countries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ 
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join hundreds of companies already using IntelliCargo to optimize their supply chain operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/signup')}
                className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/auth')}
                className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white">
                <Anchor size={18} />
              </div>
              <span className="font-bold text-slate-800">IntelliCargo</span>
            </div>
            
            <p className="text-slate-500 text-sm">
              © 2026 IntelliCargo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
