import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
