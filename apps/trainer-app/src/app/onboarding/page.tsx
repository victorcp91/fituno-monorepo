'use client';

import { Alert, AlertDescription } from '@fituno/ui';
import { Button } from '@fituno/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fituno/ui';
import { Input } from '@fituno/ui';
import { Label } from '@fituno/ui';
import { Textarea } from '@fituno/ui';
import { AuthService } from '@fituno/services';
import { ArrowRight, Briefcase, Loader2, MapPin, Phone, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function OnboardingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    specialization: '',
    bio: '',
    experience: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get current user data to pre-fill form
    const loadUserData = async () => {
      try {
        const { data } = await AuthService.getCurrentUser();
        setFormData(prev => ({
          ...prev,
          fullName: data?.user?.user_metadata?.full_name || '',
        }));
      } catch {

      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Update user metadata with trainer profile information
      const { error } = await AuthService.updateProfile({
        data: {
          user_type: 'trainer',
          full_name: formData.fullName,
          trainer_profile: {
            phone: formData.phone,
            location: formData.location,
            specialization: formData.specialization,
            bio: formData.bio,
            experience: formData.experience,
          },
          onboarding_completed: true,
          profile_completed_at: new Date().toISOString(),
        } as any,
      });

      if (error) {
        setError(error.message || 'Failed to update profile');
        return;
      }

      // Redirect to originally requested page or dashboard
      const redirectTo = searchParams.get('redirectTo');
      if (redirectTo) {
        // Use window.location for dynamic redirects to avoid type issues
        window.location.href = decodeURIComponent(redirectTo);
      } else {
        // Use window.location for consistent navigation
        window.location.href = '/';
      }
    } catch {

      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.fullName && formData.specialization && formData.bio;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl">
              Fituno
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Trainer Profile</h1>
          <p className="text-gray-600 mt-2">
            Help us set up your professional trainer account to get started
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Tell us about yourself and your expertise as a fitness trainer
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={e => handleInputChange('fullName', e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="specialization">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Specialization *
                  </Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Weight Loss, Strength Training, Yoga, etc."
                    value={formData.specialization}
                    onChange={e => handleInputChange('specialization', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    value={formData.experience}
                    onChange={e => handleInputChange('experience', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell potential clients about your experience, certifications, and training philosophy..."
                    value={formData.bio}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    required
                    disabled={isLoading}
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="fitness-gradient h-12 w-12 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
