'use client'
import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Sun, Moon, Settings, User, Bell, Shield, Layout, Download, QrCode } from 'lucide-react';
import { ModeToggle } from '~/app/_components/darkMode';
import QRCode from 'qrcode';

interface QRCodeState {
  qrDataUrl: string | null;
  generatedAt: string | null;
  isGenerating: boolean;
  error: string | null;
}

const ProfilePage = () => {
  const [qrState, setQrState] = useState<QRCodeState>({
    qrDataUrl: null,
    generatedAt: null,
    isGenerating: false,
    error: null
  });

  // Format dates consistently using UTC to avoid hydration mismatch
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const generateQRCode = async () => {
    setQrState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
        const url = `https://zeroq.vercel.app/${userData.routeName}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      setQrState({
        qrDataUrl,
        generatedAt: new Date().toISOString(), // Store as ISO string
        isGenerating: false,
        error: null
      });
    } catch (error) {
      setQrState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to generate QR code. Please try again.'
      }));
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (!qrState.qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrState.qrDataUrl;
    link.download = `${userData.routeName}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample user data
  const userData = {
    _id: "67767cc134334f601168d45e",
    email: "doc2heal.service@gmail.com",
    name: "Doc2heal",
    routeName: "doc2heal",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocJkzdYg8ZNX-zIW3OQzrV9Df3L68SalY7nIj-6E62vm72ADhXo=s96-c",
    isVerified: true,
    googleId: "118348117602524667588",
    authProvider: "google",
    userRole: "COMPANY",
    phone: null,
    upiId: "doc2heal@upi",
    createdAt: new Date("2025-01-02T11:47:13.173Z"),
    updatedAt: new Date("2025-01-02T11:47:13.173Z")
  };

  return (
    <div className="container mx-auto p-4 space-y-4  overflow-hidden scrollbar-none">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <ModeToggle />
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {userData.profile ? (
                <img 
                  src={userData.profile} 
                  alt={userData.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userData?.phone ?? "Contact not added"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="QR Code" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            <span className="hidden md:inline">QR Code</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex w-full justify-between items-center">
                    <label className="text-sm font-medium">Route Name</label>
                    <Button variant="outline" className="w-full md:w-auto">
                      Update Route Name
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{userData.routeName}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between w-full items-center">
                    <label className="text-sm font-medium">UPI ID</label>
                    <Button variant="outline" className="w-full md:w-auto">
                      Update UPI ID
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{userData.upiId}</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Account Created</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Auth Provider</label>
                  <p className="text-sm text-gray-500 capitalize">{userData.authProvider}</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Verification Status</label>
                  <p className="text-sm text-gray-500">
                    {userData.isVerified ? "Verified Account" : "Not Verified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email Notifications</label>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="QR Code">
          <Card>
            <CardContent className="p-6 ">
                  <h4 className="text-lg font-medium mb-4">Company QR Code</h4>
              <div className="space-y-3">
                {/* QR Code Section */}
                <div className="">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      {qrState.qrDataUrl ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img 
                              src={qrState.qrDataUrl} 
                              alt="Company QR Code" 
                              className="max-w-[200px] border p-2 rounded-lg bg-white"
                            />
                          
                          </div>
                          <div className='flex gap-x-2 items-center'>
                              <Button
                                variant="outline"
                                onClick={generateQRCode}
                                disabled={qrState.isGenerating}
                                className="w-full md:w-auto"
                              >
                                {qrState.isGenerating ? 'Generating...' : 'Regenerate'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={downloadQRCode}
                                className="w-full md:w-auto"
                              >
                                Download
                              </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="default" 
                          onClick={generateQRCode}
                          disabled={qrState.isGenerating}
                          className="w-full md:w-auto"
                        >
                          {qrState.isGenerating ? 'Generating...' : 'Generate QR Code'}
                        </Button>
                      )}
                      
                      {qrState.error && (
                        <p className="text-sm text-red-500 mt-2">{qrState.error}</p>
                      )}
                    </div>
                    <div className="flex-1">
                    <div className="grid gap-2">
                  <label className="text-sm font-medium">Last Updated</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(userData.updatedAt)}
                  </p>
                </div> 
                      {qrState.generatedAt && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Last Generated</p>
                          <p className="text-sm text-gray-500">
                            {new Date(qrState.generatedAt).toLocaleString()}
                          </p>
                          <p className="text-sm font-medium mt-4">QR Code URL</p>
                          <p className="text-sm text-gray-500 break-all">
                            localhost:3000/{userData.routeName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;