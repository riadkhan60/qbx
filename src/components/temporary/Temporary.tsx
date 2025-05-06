'use client';
import { useUserContext } from '@/contexts/UserContext/UserContextProvoder';
import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { EmptyState } from '@/components/CreateBusiness/EmptyState';
import { Files, FileText, Link, Menu } from 'lucide-react';
import BusinessCards from './BusinessCards/BusinessCards';

export default function Temporary() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [sessions, setSessions] = React.useState<{ id: string }[]>([]);
  const { accountId } = useUserContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  console.log('Account ID:', accountId);
  useEffect(() => {
    async function fetchUser() {
      if (isLoaded) {
        const userSessions = await user?.getSessions();
        setSessions(userSessions || []);
      }
    }
    fetchUser();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse w-12 h-12 bg-muted rounded-full"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Not signed in</h2>
          <p className="text-muted-foreground">
            Please sign in to access your businesses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-4 md:px-6 py-6">
      {/* Header with user info */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold hidden md:block">
              My Businesses
            </h1>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-3">
              <span className="text-sm font-medium">
                Hello, {user.firstName || 'User'}
              </span>
              <span className="text-xs text-muted-foreground">
                {sessions.length} active sessions
              </span>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Existing businesses */}
          <div className="lg:col-span-8 w-full">
            <div className="bg-background rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Your Existing Businesses
              </h2>
              <BusinessCards />
            </div>
          </div>

          {/* Create new business */}
          <div className="lg:col-span-4 w-full">
            
              <EmptyState
                title="Create New Business"
                description="Start managing a new business by creating it here"
                icons={[FileText, Link, Files]}
                action={{
                  label: 'New Business',
                  onClick: () => console.log('Create form clicked'),
                }}
              />
          
          </div>
        </div>
      </main>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/90 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <nav className="space-y-4">
              <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-muted">
                My Businesses
              </button>
              <button className="w-full text-left py-2 px-4 rounded-lg hover:bg-muted">
                Account Settings
              </button>
              <button
                className="w-full text-left py-2 px-4 rounded-lg hover:bg-muted"
                onClick={() => {
                  // Add sign out logic here
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
