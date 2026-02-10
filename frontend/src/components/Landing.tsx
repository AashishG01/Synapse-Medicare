import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2 } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Synapse Medicare
                    </h1>
                    <p className="text-lg leading-8 text-gray-600">
                        Advanced Healthcare Management & AI Diagnosis System
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-10">
                    {/* Patient Section */}
                    <Card className="hover:shadow-lg transition-shadow border-blue-100">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl">I am a Patient</CardTitle>
                            <CardDescription>
                                Access your health records, AI diagnosis, and book appointments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Link to="/login" className="w-full">
                                <Button className="w-full text-lg py-6" variant="default">
                                    Login as Patient
                                </Button>
                            </Link>
                            <Link to="/register" className="w-full">
                                <Button className="w-full" variant="outline">
                                    Register New Account
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Hospital Staff Section */}
                    <Card className="hover:shadow-lg transition-shadow border-green-100">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl">Hospital Staff</CardTitle>
                            <CardDescription>
                                For Doctors and Hospital Administrators.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <a href="http://localhost:5174" className="w-full">
                                <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700">
                                    Go to Hospital Portal
                                </Button>
                            </a>
                            <div className="text-center text-sm text-gray-500 mt-2">
                                (Redirects to Hospital App)
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
