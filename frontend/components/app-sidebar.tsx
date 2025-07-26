"use client"

import type * as React from "react"
import { ChevronDown, Database, TestTube, GraduationCap, BookOpen, Sun, Moon, Laptop, BarChart2, FlaskConical, CheckCircle2, Users, Layers, Settings as SettingsIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const dataSubItems = [
  { title: "Upload", url: "/dashboard/data#overview" },
  { title: "Meta Data", url: "/dashboard/data#cleaning" },
  { title: "Preview", url: "/dashboard/data#preview" },
  { title: "Actions", url: "/dashboard/data#export" },
];

// Add EDA subsections for the sidebar
const edaSubItems = [
  { title: "Overview", url: "/dashboard/eda#overview" },
  { title: "Summary Stats", url: "/dashboard/eda#summary" },
  { title: "Visualizations", url: "/dashboard/eda#visualizations" },
  { title: "Correlations", url: "/dashboard/eda#correlations" },
  { title: "Outliers", url: "/dashboard/eda#outliers" },
  { title: "Insights", url: "/dashboard/eda#insights" },
  { title: "Export", url: "/dashboard/eda#export" },
];

const modellabSubItems = [
  { title: "Dataset Summary", url: "/dashboard/modellab#select-dataset" },
  { title: "Configure Model", url: "/dashboard/modellab#configure-model" },
  { title: "Experiments", url: "/dashboard/modellab#experiments" },
  { title: "Results & Analysis", url: "/dashboard/modellab#results" },
  { title: "Export & Deployment", url: "/dashboard/modellab#export" },
];

const mainNav = [
  { title: "Data", icon: Database, subItems: dataSubItems },
  { title: "EDA", url: "/dashboard/eda", icon: BarChart2, subItems: edaSubItems },
  { title: "ModelLab", url: "/dashboard/modellab", icon: FlaskConical, subItems: modellabSubItems },
  { title: "Testing", url: "/dashboard/testing", icon: CheckCircle2 },
  { title: "Collaboration", url: "/dashboard/collaboration", icon: Users },
  { title: "Docs", icon: BookOpen, subItems: docsSubItems },
  { title: "History", url: "/dashboard/history", icon: Layers },
  // KnowledgeHub and Settings removed from this group
];

// Helper: map sidebar item title to main page href
const mainNavHref = {
  Data: '/dashboard/data',
  Docs: '/dashboard/knowledgehub/documentation',
  EDA: '/dashboard/eda',
  ModelLab: '/dashboard/modellab',
  Testing: '/dashboard/testing',
  Collaboration: '/dashboard/collaboration',
  History: '/dashboard/history',
};

// Add EDA section IDs for scroll tracking
const edaSectionIds = [
  'overview',
  'summary',
  'visualizations',
  'correlations',
  'outliers',
  'insights',
  'export',
];

const modellabSectionIds = [
  'select-dataset',
  'configure-model',
  'experiments',
  'results',
  'export',
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme, theme } = useTheme();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const [activeSection, setActiveSection] = useState('overview');
  const [manualActiveSection, setManualActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [dataOpen, setDataOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false); // Added state for Docs submenu
  const [docsActiveHash, setDocsActiveHash] = useState('');
  // Add EDA section IDs for scroll tracking
  const [activeEdaSection, setActiveEdaSection] = useState('overview');
  const [activeModelLabSection, setActiveModelLabSection] = useState('select-dataset');

  // Track hash for Docs section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateDocsHash = () => setDocsActiveHash(window.location.hash.replace('#', ''));
    updateDocsHash();
    window.addEventListener('hashchange', updateDocsHash);
    return () => window.removeEventListener('hashchange', updateDocsHash);
  }, []);

  // Restore scroll tracking and manualActiveSection logic for EDA and Data subItems
  // 1. Re-add useEffect for scroll tracking for EDA and Data sections
  // 2. Restore state: activeEdaSection, activeSection, manualActiveSection, setActiveEdaSection, setActiveSection, setManualActiveSection
  // 3. In the rendering of subItems (for EDA and Data), restore isActive logic to:
  //    isActive = pathname === '/dashboard/eda' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeEdaSection === hash)));
  //    (and similar for Data)
  // 4. onClick for subItems: setManualActiveSection(hashId) and scrollIntoView
  // 5. Restore any code that sets or uses activeEdaSection, activeSection, manualActiveSection for highlight

  // Helper: ensure last section is active if scrolled to bottom
  function isAtBottom() {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2);
  }

  useEffect(() => {
    const sectionIds = ['overview', 'cleaning', 'preview', 'export'];
    const handleScroll = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) { // 80px offset for topbar
            current = id;
          }
        }
      }
      // If at bottom of page, force last section active
      if (isAtBottom()) {
        current = sectionIds[sectionIds.length - 1];
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear manualActiveSection on scroll, hashchange, or after a short timeout
  useEffect(() => {
    if (!manualActiveSection) return;
    const clear = () => setManualActiveSection(null);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('hashchange', clear);
    const timeout = setTimeout(clear, 700);
    return () => {
      window.removeEventListener('scroll', clear);
      window.removeEventListener('hashchange', clear);
      clearTimeout(timeout);
    };
  }, [manualActiveSection]);

  // Scroll tracking for ModelLab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname.startsWith('/dashboard/modellab')) return;
    const handleScroll = () => {
      let current = modellabSectionIds[0];
      for (const id of modellabSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = id;
          }
        }
      }
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
        current = modellabSectionIds[modellabSectionIds.length - 1];
      }
      setActiveModelLabSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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
                  <Collapsible key={item.title}
                    open={
                      item.title === 'Data' ? dataOpen :
                      item.title === 'Docs' ? docsOpen :
                      undefined
                    }
                    onOpenChange={
                      item.title === 'Data' ? setDataOpen :
                      item.title === 'Docs' ? setDocsOpen :
                      undefined
                    }
                    defaultOpen={false}
                    className="group/collapsible mt-2"
                  >
                    <SidebarMenuItem>
                      <div className="flex items-center">
                        <Link
                          href={mainNavHref[item.title as keyof typeof mainNavHref] || '#'}
                          className="flex-1"
                          onClick={() => {
                            // For sections with submenus, set to first subsection; for others, set to section name
                            if (item.title === 'Data') setManualActiveSection('overview');
                            else if (item.title === 'Docs') setManualActiveSection('documentation');
                            else if (item.title === 'EDA') setManualActiveSection('eda');
                            else if (item.title === 'ModelLab') setManualActiveSection('modellab');
                            else if (item.title === 'Testing') setManualActiveSection('testing');
                            else if (item.title === 'Collaboration') setManualActiveSection('collaboration');
                            else if (item.title === 'History') setManualActiveSection('history');
                          }}
                        >
                          <SidebarMenuButton
                            className={[
                              'w-full text-[1rem] font-semibold tracking-tight flex items-center gap-2 relative transition-colors',
                              (item.title === 'Data' && pathname === '/dashboard/data' && !dataOpen && ['overview', 'cleaning', 'preview', 'export'].includes(activeSection)) ? 'bg-primary/10 text-primary' :
                              (item.title === 'EDA' && pathname.startsWith('/dashboard/eda')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'ModelLab' && pathname.startsWith('/dashboard/modellab')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Testing' && pathname.startsWith('/dashboard/testing')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Collaboration' && pathname.startsWith('/dashboard/collaboration')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Docs' && pathname.startsWith('/dashboard/knowledgehub')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'History' && pathname.startsWith('/dashboard/history')) ? 'bg-primary/10 text-primary' :
                              ''
                            ].join(' ')}
                          >
                            {/* Show indicator if Data is closed and any of its subsections is active */}
                            {item.title === 'Data' &&
                              pathname === '/dashboard/data' &&
                              !dataOpen &&
                              ['overview', 'cleaning', 'preview', 'export'].includes(activeSection) && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-primary shadow-lg transition-all duration-300" />
                            )}
                            {/* Show indicator for other main sections */}
                            {item.title !== 'Data' && (
                              ((item.title === 'EDA' && pathname.startsWith('/dashboard/eda')) ||
                               (item.title === 'ModelLab' && pathname.startsWith('/dashboard/modellab')) ||
                               (item.title === 'Testing' && pathname.startsWith('/dashboard/testing')) ||
                               (item.title === 'Collaboration' && pathname.startsWith('/dashboard/collaboration')) ||
                               (item.title === 'Docs' && pathname.startsWith('/dashboard/knowledgehub')) ||
                               (item.title === 'History' && pathname.startsWith('/dashboard/history'))
                              ) && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-primary shadow-lg transition-all duration-300" />
                              )
                            )}
                            {item.icon ? <item.icon className="h-4 w-4" /> : null}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                        <CollapsibleTrigger asChild>
                          <button className="ml-2 p-1 rounded hover:bg-muted transition-colors">
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.subItems.map((subItem) => {
                              const hash = subItem.url.split('#')[1] || '';
                              let isActive = false;
                              if (item.title === 'Data') {
                                isActive = pathname === '/dashboard/data' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeSection === hash)));
                              } else if (item.title === 'EDA') {
                                isActive = pathname === '/dashboard/eda' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeEdaSection === hash)));
                              } else if (item.title === 'Docs') {
                                isActive = pathname.startsWith('/dashboard/knowledgehub') && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : docsActiveHash === hash)));
                              } else if (item.title === 'ModelLab') {
                                isActive = pathname === '/dashboard/modellab' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeModelLabSection === hash)));
                              }
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a
                                      href={subItem.url}
                                      className={[
                                        'pl-7 py-1 block text-[0.97rem] font-normal flex items-center gap-2 transition-colors rounded relative',
                                        isActive ? 'text-primary font-semibold' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                      ].join(' ')}
                                      onMouseEnter={() => setHoveredSection(hash)}
                                      onMouseLeave={() => setHoveredSection(null)}
                                      onClick={e => {
                                        if (subItem.url.startsWith('/dashboard/data#')) {
                                          e.preventDefault();
                                          const hashId = subItem.url.split('#')[1];
                                          const el = document.getElementById(hashId);
                                          if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            window.history.replaceState(null, '', `#${hashId}`);
                                          }
                                        } else if (subItem.url.startsWith('/dashboard/eda#')) {
                                          e.preventDefault();
                                          const hashId = subItem.url.split('#')[1];
                                          const el = document.getElementById(hashId);
                                          if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            window.history.replaceState(null, '', `#${hashId}`);
                                          }
                                        } else if (subItem.url.startsWith('/dashboard/knowledgehub/documentation#')) {
                                          e.preventDefault();
                                          const hashId = subItem.url.split('#')[1];
                                          setDocsActiveHash(hashId);
                                          const el = document.getElementById(hashId);
                                          if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            window.history.replaceState(null, '', `#${hashId}`);
                                          }
                                        } else if (subItem.url.startsWith('/dashboard/modellab#')) {
                                          e.preventDefault();
                                          const hashId = subItem.url.split('#')[1];
                                          setManualActiveSection(hashId);
                                          const el = document.getElementById(hashId);
                                          if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                          }
                                        }
                                      }}
                                    >
                                      {/* No dot/bar for Docs subsections */}
                                      <span className="ml-3">{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} prefetch={true}>
                      <div className="relative w-full">
                        {pathname.startsWith(item.url) && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-primary shadow-lg transition-all duration-300" />
                        )}
                        <SidebarMenuButton
                          className={`w-full text-[1rem] font-semibold tracking-tight flex items-center gap-2 rounded-md transition-colors px-3 py-2 ${pathname.startsWith(item.url) ? 'bg-primary/10 text-primary shadow' : 'hover:bg-muted hover:text-accent-foreground'}`}
                          isActive={pathname.startsWith(item.url)}
                        >
                          <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </div>
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
