import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRocket, FaCheck } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles } from 'react-icons/hi';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    const result = await signup(username, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const passwordStrength = () => {
    if (password.length === 0) return { score: 0, label: '', color: '' };
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'bg-error-500' };
    if (password.length < 8) return { score: 2, label: 'Fair', color: 'bg-warning-500' };
    if (password.length < 10) return { score: 3, label: 'Good', color: 'bg-primary-500' };
    return { score: 4, label: 'Strong', color: 'bg-success-500' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-soft">
              <HiAcademicCap />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Gaplify</h2>
          <p className="text-gray-600">Start your career transformation journey today</p>
        </div>

        {/* Signup Form */}
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-error-500 rounded-full mr-3"></div>
                <p className="text-error-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="form-label" htmlFor="username">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  className="form-input pl-10"
                  value={username}
                  placeholder="Enter your full name"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="form-input pl-10"
                  value={email}
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  value={password}
                  placeholder="Create a strong password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      strength.score === 1 ? 'text-error-600' :
                      strength.score === 2 ? 'text-warning-600' :
                      strength.score === 3 ? 'text-primary-600' :
                      'text-success-600'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center">
                  {password === confirmPassword ? (
                    <FaCheck className="w-4 h-4 text-success-500 mr-2" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-error-300 rounded-full mr-2"></div>
                  )}
                  <span className={`text-sm ${
                    password === confirmPassword ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="#"   onClick={() => navigate('/terms-and-conditions')} className="text-primary-600 hover:text-primary-500">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" onClick={() => navigate('/privacy-policy')} className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full group"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-5 h-5 mr-3"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaRocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Create Account
                </div>
              )}
            </button>
          </form>

          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <HiSparkles className="w-4 h-4 mr-2 text-primary-500" />
              AI-Powered Guidance
            </div>
            <div className="flex items-center justify-center">
              <FaRocket className="w-4 h-4 mr-2 text-secondary-500" />
              Free to Start
            </div>
            <div className="flex items-center justify-center">
              <HiAcademicCap className="w-4 h-4 mr-2 text-accent-500" />
              Expert Mentorship
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 