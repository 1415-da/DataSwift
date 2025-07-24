"use client"

import type * as React from "react"
import { ChevronDown, Database, TestTube, GraduationCap, BookOpen, Sun, Moon, Laptop, BarChart2, FlaskConical, CheckCircle2, Users, Layers, Settings as SettingsIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Navigation data with subnavigations
const navigationData = [
  {
    title: "EDA",
    icon: Database,
    items: [
      { title: "Data Overview", url: "/dashboard/eda" },
      { title: "Statistical Analysis", url: "#" },
      { title: "Data Visualization", url: "#" },
      { title: "Feature Engineering", url: "#" },
      { title: "Data Quality", url: "#" },
    ],
  },
  {
    title: "Model Testing",
    icon: TestTube,
    items: [
      { title: "Model Validation", url: "/dashboard/model-testing" },
      { title: "Cross Validation", url: "#" },
      { title: "Performance Metrics", url: "#" },
      { title: "A/B Testing", url: "#" },
      { title: "Bias Detection", url: "#" },
    ],
  },
  {
    title: "Training",
    icon: GraduationCap,
    items: [
      { title: "Model Training", url: "/dashboard/training" },
      { title: "Hyperparameter Tuning", url: "#" },
      { title: "Pipeline Management", url: "#" },
      { title: "Experiment Tracking", url: "#" },
      { title: "Model Registry", url: "#" },
    ],
  },
  // Knowledge Hub removed
]

const docsSubItems = [
      { title: "Documentation", url: "/dashboard/knowledgehub/documentation" },
      { title: "Best Practices", url: "/dashboard/knowledgehub/best-practices" },
      { title: "Tutorials", url: "/dashboard/knowledgehub/tutorials" },
      { title: "API Reference", url: "/dashboard/knowledgehub/api" },
      { title: "Community", url: "/dashboard/knowledgehub/community" },
];

const mainNav = [
  { title: "Data", url: "/dashboard/data", icon: Database },
  { title: "EDA", url: "/dashboard/eda", icon: BarChart2 },
  { title: "ModelLab", url: "/dashboard/modellab", icon: FlaskConical },
  { title: "Testing", url: "/dashboard/testing", icon: CheckCircle2 },
  { title: "Collaboration", url: "/dashboard/collaboration", icon: Users },
  { title: "Docs", icon: BookOpen, subItems: docsSubItems },
  { title: "History", url: "/dashboard/history", icon: Layers },
  // KnowledgeHub and Settings removed from this group
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme, theme } = useTheme();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-2">
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-background border border-border">
            <Image src="/LOGO.jpg" alt="DataSwift Logo" width={32} height={32} className="object-cover w-8 h-8" />
          </div>
          <span className="text-xl font-semibold">DataSwift</span>
        </div>
      </SidebarHeader>

      {/* Main navigation group only */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                item.subItems ? (
                  <Collapsible key={item.title} defaultOpen={false} className="group/collapsible mt-2">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full text-[1rem] font-semibold tracking-tight flex items-center gap-2">
                        {item.icon ? <item.icon className="h-4 w-4" /> : null}
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} prefetch={true} className="pl-7 py-1 block text-[0.97rem] font-normal text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded transition-colors">
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} prefetch={true}>
                      <SidebarMenuButton
                        className={`w-full text-[1rem] font-semibold tracking-tight flex items-center gap-2 rounded-md transition-colors px-3 py-2 ${pathname.startsWith(item.url) ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted hover:text-accent-foreground'}`}
                        isActive={pathname.startsWith(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  {theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Laptop className="h-4 w-4" />
                  )}
                  <span>Theme</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
