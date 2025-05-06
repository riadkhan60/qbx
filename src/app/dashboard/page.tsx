'use client';
import { EmptyState } from '@/components/CreateBusiness/EmptyState';
import { AppSidebar } from '../../components/DashBoard/SIdeBar/app-sidebar';
import { Files, FileText, Link } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import BusinessCards from '@/components/temporary/BusinessCards/BusinessCards';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className=" rounded-xl flex justify-center items-centerborder-2  border-muted/50 bg-background">
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
            <div className="aspect-[2.5/1] rounded-xl bg-muted/50" />
          </div>
          <div className="flex-1 flex justify-center items-center p-4 bg-background rounded-xl shadow-sm border">
            <div className="">
              <h2 className="text-xl font-semibold mb-4">
                Your Existing Businesses
              </h2>
              <div className="bg-background max-w-7xl">
                <BusinessCards />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
