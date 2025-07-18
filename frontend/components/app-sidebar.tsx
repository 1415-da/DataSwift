"use client"

import type * as React from "react"
import { ChevronDown, Database, TestTube, GraduationCap, BookOpen, Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import Image from 'next/image';

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
      { title: "Data Overview", url: "#" },
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
      { title: "Model Validation", url: "#" },
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
      { title: "Model Training", url: "#" },
      { title: "Hyperparameter Tuning", url: "#" },
      { title: "Pipeline Management", url: "#" },
      { title: "Experiment Tracking", url: "#" },
      { title: "Model Registry", url: "#" },
    ],
  },
  {
    title: "Knowledge Hub",
    icon: BookOpen,
    items: [
      { title: "Documentation", url: "#" },
      { title: "Best Practices", url: "#" },
      { title: "Tutorials", url: "#" },
      { title: "API Reference", url: "#" },
      { title: "Community", url: "#" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme, theme } = useTheme()

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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.map((item) => (
                <Collapsible key={item.title} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a
                                href={subItem.url}
                                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              >
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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
