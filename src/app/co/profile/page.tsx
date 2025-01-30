'use client'
import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Sun, Moon, Settings, User, Bell, Shield, Layout, Download, QrCode, Megaphone, TicketPercent, Loader2, Power, Info } from 'lucide-react';
import { ModeToggle } from '~/app/_components/global/darkMode';
import QRCode from 'qrcode';
import { signOut, useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import Image from 'next/image';
import { BannerCard, BannerUploader } from '~/app/_components/page/profile/bannerManagement';
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import UpdateProfileModal from '~/app/_components/page/profile/profileUpdateModal';
import { env } from "../../../env";


interface QRCodeState {
  qrDataUrl: string | null;
  generatedAt: string | null;
  isGenerating: boolean;
  error: string | null;
}

const updateFormSchema = z.object({
  routeName: z.string()
    .min(2, "Route name must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Route name can only contain lowercase letters, numbers, and hyphens")
    .refine((value) => !value.startsWith('-') && !value.endsWith('-'),
      "Route name cannot start or end with a hyphen"),
  upiId: z.string()
    .min(5, "UPI ID must be at least 5 characters")
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const handleLogout = async () => {
  await signOut({
    callbackUrl: '/auth/login'
  });
};

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const LoadingProfile = () => (
  <div className="container mx-auto p-4">
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ErrorAlert = ({ title, description }: { title: string; description: string }) => (
  <Alert variant="destructive" className="m-4">
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);

const ProfilePage = () => {
  // All hooks must be called at the top level
  const { data: session, status: sessionStatus,update: updateSession } = useSession();

  const [qrState, setQrState] = useState<QRCodeState>({
    qrDataUrl: null,
    generatedAt: null,
    isGenerating: false,
    error: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [debouncedRouteName, setDebouncedRouteName] = useState("");

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      routeName: "",
      upiId: ""
    }
  });

  const companyId = session?.user?.companyId;
  const utils = api.useUtils();

  const {
    data: companyData,
    isLoading: companyLoading,
    error: companyError
  } = api.company.getCompanyById.useQuery(
    { companyId: companyId! },
    {
      enabled: !!companyId,
      retry: false
    }
  );

  const updateCompanyData = api.company.updateCompany.useMutation({
    onError: (error) => {
      console.error('Update failed:', error);
    }
    
  });

  // Helper functions
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };


  const { data: routeCheckData, isLoading: isCheckingRoute } = api.company.checkRoute.useQuery(
    {
      slug: debouncedRouteName,
      currentCompanyId: session?.user?.companyId
    },
    {
      enabled: debouncedRouteName.length >= 2,
    }
  );

  React.useEffect(() => {
    if (companyData) {
      updateForm.reset({
        routeName: companyData.routeName ?? "",
        upiId: companyData.upiId ?? ""
      });
    }
  }, [companyData, updateForm]);

  React.useEffect(() => {
    const routeName = updateForm.watch('routeName');
    const timer = setTimeout(() => {
      if (routeName && routeName.length >= 2 && /^[a-z0-9-]+$/.test(routeName)) {
        setDebouncedRouteName(routeName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [updateForm.watch('routeName')]);

  const handleUpdateProfile = async (data: UpdateFormValues) => {
    if (routeCheckData?.exists && data.routeName !== companyData?.routeName) {
      updateForm.setError('routeName', {
        type: 'manual',
        message: 'This route name is already taken'
      });
      return;
    }

    try {
      await updateCompanyData.mutateAsync({
        routeName: data.routeName,
        upiId: data.upiId
      });

      if (session && data.routeName !== companyData?.routeName) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            routeName: data.routeName
          }
        });
      }

      setIsUpdateModalOpen(false);
      await utils.company.getCompanyById.invalidate();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const generateQRCodeData = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 150,
        margin: 1,
        errorCorrectionLevel: 'L',
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');

      return {
        qr: base64Data,
        url: url
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const generateQRCode = async () => {
    if (!companyData?.routeName) {
      setQrState(prev => ({
        ...prev,
        error: 'Company route name is required to generate QR code.'
      }));
      return;
    }

    setQrState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const url = `${env.NEXT_PUBLIC_AUTH_URL}/${companyData.routeName}`;
      const { qr, url: qrUrl } = await generateQRCodeData(url);

      await updateCompanyData.mutateAsync({
        qrCode: { qr, url: qrUrl }
      });

      await utils.company.getCompanyById.invalidate();

      setQrState({
        qrDataUrl: `data:image/png;base64,${qr}`,
        generatedAt: new Date().toISOString(),
        isGenerating: false,
        error: null
      });
    } catch (error) {
      setQrState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to generate QR code. Please try again.'
      }));
    }
  };

  const getQrImageSrc = () => {
    if (companyData?.qrCode?.qr) {
      return `data:image/png;base64,${companyData.qrCode.qr}`;
    }
    return qrState.qrDataUrl;
  };

  const downloadQRCode = async () => {
    const qrImage = getQrImageSrc();
    if (!qrImage) {
      setQrState(prev => ({
        ...prev,
        error: 'No QR code available to download.'
      }));
      return;
    }
  
    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.background = 'white';
      container.style.padding = '28px';
      container.style.width = '300px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '12px';
  
      // Add company name
      
      const nameElement = document.createElement('h2');
      nameElement.textContent = companyData?.name ?? 'Company Name';
      nameElement.style.fontSize = '24px';
      nameElement.style.fontWeight = 'bold';
      nameElement.style.color = '#1f2937';
      nameElement.style.textAlign = 'center';
      container.appendChild(nameElement);
  
      // Add QR code
      const qrContainer = document.createElement('div');
      qrContainer.style.padding = '12px';
      qrContainer.style.background = 'white';
      
      const qrElement = document.createElement('img');
      qrElement.src = qrImage;
      qrElement.style.width = '200px';
      qrElement.style.height = '200px';
      qrElement.style.objectFit = 'contain';
      qrContainer.appendChild(qrElement);
      container.appendChild(qrContainer);
  
      // Add route name
      const url = `${env.NEXT_PUBLIC_AUTH_URL}/${companyData?.routeName}`;
      const routeElement = document.createElement('p');
      routeElement.textContent = url ?? 'company-route';
      routeElement.style.fontSize = '18px';
      routeElement.style.color = '#4b5563';
      routeElement.style.fontWeight = '500';
      routeElement.style.textAlign = 'center';
      container.appendChild(routeElement);
  
      // Add trademark
      const trademarkElement = document.createElement('span');
      trademarkElement.textContent = 'powered by QEND';
      trademarkElement.style.fontSize = '10px';
      trademarkElement.style.color = '#9ca3af';
      trademarkElement.style.position = 'absolute';
      trademarkElement.style.bottom = '4px';
      trademarkElement.style.right = '8px';
      container.appendChild(trademarkElement);
  
      // Add to document temporarily
      document.body.appendChild(container);
  
      // Convert to image using html2canvas
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(container, {
        backgroundColor: 'white',
      });
  
      // Create download link
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${companyData?.name ?? 'company'}-qr-code.png`;
      link.click();
  
      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      setQrState(prev => ({
        ...prev,
        error: 'Failed to download QR code. Please try again.'
      }));
    }
  };

  const handleAddBanner = async (bannerData: { title: string; url: string }) => {
    if (!bannerData.title || !bannerData.url) return;

    setIsUploading(true);
    try {
      const newBanner = {
        title: bannerData.title,
        url: bannerData.url,
        isActive: true
      };

      await updateCompanyData.mutateAsync({
        banners: [...(companyData?.banners ?? []), newBanner]
      });

      await utils.company.getCompanyById.invalidate();
    } catch (error) {
      console.error('Failed to add banner:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = async (bannerId: string) => {
    if (!bannerId || !companyData?.banners) return;

    const updatedBanners = companyData.banners.map(banner =>
      banner._id.toString() === bannerId
        ? { ...banner, isActive: !banner.isActive }
        : banner
    );

    try {
      await updateCompanyData.mutateAsync({ banners: updatedBanners });
      await utils.company.getCompanyById.invalidate();
    } catch (error) {
      console.error('Failed to toggle banner status:', error);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!bannerId || !companyData?.banners) return;

    const updatedBanners = companyData.banners.filter(
      banner => banner._id.toString() !== bannerId
    );

    try {
      await updateCompanyData.mutateAsync({ banners: updatedBanners });
      await utils.company.getCompanyById.invalidate();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  // Early returns for different states
  if (sessionStatus === 'loading') {
    return <LoadingSpinner />;
  }

  if (sessionStatus === 'unauthenticated') {
    return <ErrorAlert
      title="Authentication Required"
      description="Please sign in to access your profile."
    />;
  }

  if (!companyId) {
    return <ErrorAlert
      title="Company ID Missing"
      description="Unable to load profile. Company ID not found."
    />;
  }

  if (companyError) {
    return <ErrorAlert
      title="Error Loading Profile"
      description={companyError.message}
    />;
  }

  if (companyLoading) {
    return <LoadingProfile />;
  }
  return (
    <div className="container mx-auto p-4 space-y-4  overflow-hidden scrollbar-none">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <div className='flex gap-x-2'>
          <ModeToggle className='size-7' style="outline" />
          <Button variant="outline" onClick={handleLogout} className="size-7">
            <Power />
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {companyData?.profile ? (
                <img
                  src={companyData.profile}
                  alt={companyData.name ?? 'Company Profile'}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold">{companyData?.name ?? 'Company Name Not Set'}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{companyData?.email ?? 'Email Not Set'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {companyData?.phone ?? "Contact not added"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px] mb-4">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="banner" className="flex items-center gap-2">
            <TicketPercent className="w-4 h-4" />
            <span className="hidden md:inline">Banner</span>
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
        {/* <TabsContent value="settings">
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
                  <p className="text-sm text-gray-500">{companyData?.routeName}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between w-full items-center">
                    <label className="text-sm font-medium">UPI ID</label>
                    <Button variant="outline" className="w-full md:w-auto">
                      Update UPI ID
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{companyData?.upiId}</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Account Created</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(companyData?.createdAt??null)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Profile Settings</h3>
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  Update Profile
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Route Name</label>
                  <p className="text-sm text-gray-500">{companyData?.routeName}</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">UPI ID</label>
                  <p className="text-sm text-gray-500">{companyData?.upiId}</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Account Created</label>
                  <p className="text-sm text-gray-500">
                    {formatDate(companyData?.createdAt ?? null)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Company Banners</h3>
                <BannerUploader onBannerAdd={handleAddBanner} />
              </div>
              {companyData?.banners?.length ?? 0 > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyData?.banners?.map((banner) => (
                    <BannerCard
                      key={banner._id.toString()}
                      banner={banner}
                      onToggleActive={handleToggleActive}
                      onDelete={handleDeleteBanner}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-sm italic text-center font-serif">
                    Banner Image Tips: For the best display, please upload images with a 3:1 aspect ratio. This will ensure your banner looks great!
                  </p>
                </div>
              )}

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
                  <p className="text-sm text-gray-500 capitalize">{companyData?.authProvider}</p>
                </div>
                {/* <div className="grid gap-2">
                  <label className="text-sm font-medium">Verification Status</label>
                  <p className="text-sm text-gray-500">
                    {companyData?.isVerified ? "Verified Account" : "Not Verified"}
                  </p>
                </div> */}
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
                  <p className="text-sm text-gray-500">{companyData?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="QR Code">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-lg font-medium mb-2">Company QR Code</h4>
              <div className="space-y-2">
                <div className="">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 ">
                      {(companyData?.qrCode?.qr ?? qrState.qrDataUrl) ? (
                        <div className="space-y-2">
                          <div className="relative">
                            <Image
                              height={150}
                              width={150}
                              src={getQrImageSrc() ?? ""}
                              alt="Company QR Code"
                              className="max-w-[200px] border p-2 rounded-lg bg-white"
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-block absolute left-40 top-0 cursor-pointer ">
                                    <Info className='size-4' />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className='text-emerald-400'>
                                  <p>Download and display this QR code at your business location</p>
                                  <p>for easy customer access to your digital queue.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                          {companyData?.qrCode?.updated
                            ? formatDate(companyData.qrCode.updated)
                            : 'Not generated yet'}
                        </p>
                      </div>
                      {(companyData?.qrCode?.updated ?? qrState.generatedAt) && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium mt-4">QR Code URL</p>
                          <Link
                            href={companyData?.qrCode?.url ?? `${env.NEXT_PUBLIC_AUTH_URL}/${companyData?.routeName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p title="Click here to View" className="text-sm text-blue-500 break-all">
                              {companyData?.qrCode?.url ?? `${env.NEXT_PUBLIC_AUTH_URL}/${companyData?.routeName}`}
                            </p>
                          </Link>


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
      {companyData && (
        <UpdateProfileModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          initialData={{
            routeName: companyData.routeName ?? "",
            upiId: companyData.upiId ?? ""
          }}
          onUpdate={handleUpdateProfile}
          isCheckingRoute={isCheckingRoute}
          isRouteNameTaken={!!routeCheckData?.exists}
        />
      )}
    </div>
  );
};

export default ProfilePage;