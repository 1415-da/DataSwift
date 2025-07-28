"use client"

import type * as React from "react"
import { ChevronDown, Database, TestTube, GraduationCap, BookOpen, Sun, Moon, Laptop, BarChart2, FlaskConical, CheckCircle2, Users, Layers, Settings as SettingsIcon, Clock } from "lucide-react"
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
  { title: "Data Upload", url: "/dashboard/data#overview" },
  { title: "Data Cleaning", url: "/dashboard/data#cleaning" },
  { title: "Data Preview", url: "/dashboard/data#preview" },
  { title: "Data Actions", url: "/dashboard/data#export" },
];

// Add EDA subsections for the sidebar
const edaSubItems = [
  { title: "Data Overview", url: "/dashboard/eda#overview" },
  { title: "Summary Statistics", url: "/dashboard/eda#summary" },
  { title: "Data Visualizations", url: "/dashboard/eda#visualizations" },
  { title: "Correlation Analysis", url: "/dashboard/eda#correlations" },
  { title: "Outlier Detection", url: "/dashboard/eda#outliers" },
  { title: "AI Insights", url: "/dashboard/eda#insights" },
  { title: "Export Report", url: "/dashboard/eda#export" },
];

const modellabSubItems = [
  { title: "Dataset Selection", url: "/dashboard/modellab#select-dataset" },
  { title: "Train-Test Split", url: "/dashboard/modellab#train-test-split" },
  { title: "Model Configuration", url: "/dashboard/modellab#configure-model" },
  { title: "Training Experiments", url: "/dashboard/modellab#experiments" },
  { title: "Results Analysis", url: "/dashboard/modellab#results" },
  { title: "Model Deployment", url: "/dashboard/modellab#export" },
];

const testingSubItems = [
  { title: "Model Selection", url: "/dashboard/testing#model-selection" },
  { title: "Test Data Upload", url: "/dashboard/testing#file-upload" },
  { title: "Prediction Results", url: "/dashboard/testing#predictions" },
  { title: "Performance Metrics", url: "/dashboard/testing#confusion-matrix" },
];

const historySubItems = [
  { title: "Activity Overview", url: "/dashboard/history#overview" },
  { title: "Search & Filters", url: "/dashboard/history#filters" },
  { title: "Activity List", url: "/dashboard/history#activity-list" },
  { title: "Export Data", url: "/dashboard/history#export" },
];

const transformationSubItems = [
  { title: "Feature Engineering", url: "/dashboard/data#feature-engineering" },
  { title: "Encoding", url: "/dashboard/data#encoding" },
  { title: "Scaling", url: "/dashboard/data#scaling" },
  { title: "Export", url: "/dashboard/data#export" },
];

const mainNav = [
  { title: "Data Management", icon: Database, subItems: dataSubItems },
  { title: "Exploratory Analysis", url: "/dashboard/eda", icon: BarChart2, subItems: edaSubItems },
  { title: "Data Transformation", url: "/dashboard/transformation#feature-engineering", icon: Layers, subItems: transformationSubItems },
  { title: "Model Laboratory", url: "/dashboard/modellab", icon: FlaskConical, subItems: modellabSubItems },
  { title: "Model Testing", url: "/dashboard/testing", icon: CheckCircle2, subItems: testingSubItems },
  { title: "Team Collaboration", url: "/dashboard/collaboration", icon: Users },
  { title: "Documentation", icon: BookOpen, subItems: docsSubItems },
  { title: "Activity History", url: "/dashboard/history", icon: Clock, subItems: historySubItems },
  // KnowledgeHub and Settings removed from this group
];

// Helper: map sidebar item title to main page href
const mainNavHref = {
  "Data Management": '/dashboard/data',
  "Documentation": '/dashboard/knowledgehub/documentation',
  "Exploratory Analysis": '/dashboard/eda',
  "Model Laboratory": '/dashboard/modellab',
  "Model Testing": '/dashboard/testing',
  "Team Collaboration": '/dashboard/collaboration',
  "Activity History": '/dashboard/history',
  "Data Transformation": '/dashboard/transformation',
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

const testingSectionIds = [
  'model-selection',
  'file-upload',
  'predictions',
  'confusion-matrix',
];

const historySectionIds = [
  'overview',
  'filters',
  'activity-list',
  'export',
];

const transformationSectionIds = [
  'feature-engineering',
  'encoding',
  'scaling',
  'export',
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme, theme } = useTheme();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const [activeSection, setActiveSection] = useState('overview');
  const [manualActiveSection, setManualActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [edaOpen, setEdaOpen] = useState(pathname.startsWith('/dashboard/eda'));
  const [modellabOpen, setModellabOpen] = useState(pathname.startsWith('/dashboard/modellab'));
  const [dataOpen, setDataOpen] = useState(pathname.startsWith('/dashboard/data'));
  const [docsOpen, setDocsOpen] = useState(pathname.startsWith('/dashboard/knowledgehub'));
  const [testingOpen, setTestingOpen] = useState(pathname.startsWith('/dashboard/testing'));
  const [historyOpen, setHistoryOpen] = useState(pathname.startsWith('/dashboard/history'));
  const [docsActiveHash, setDocsActiveHash] = useState('');
  // Add EDA section IDs for scroll tracking
  const [activeEdaSection, setActiveEdaSection] = useState('overview');
  const [activeModelLabSection, setActiveModelLabSection] = useState('select-dataset');
  const [activeTestingSection, setActiveTestingSection] = useState('model-selection');
  const [activeHistorySection, setActiveHistorySection] = useState('overview');
  const [activeTransformationSection, setActiveTransformationSection] = useState('feature-engineering');
  const [transformationOpen, setTransformationOpen] = useState(pathname.startsWith('/dashboard/transformation'));

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

  // Scroll tracking for Testing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname.startsWith('/dashboard/testing')) return;
    const handleScroll = () => {
      let current = testingSectionIds[0];
      for (const id of testingSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = id;
          }
        }
      }
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
        current = testingSectionIds[testingSectionIds.length - 1];
      }
      setActiveTestingSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Scroll tracking for History
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname.startsWith('/dashboard/history')) return;
    const handleScroll = () => {
      let current = historySectionIds[0];
      for (const id of historySectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = id;
          }
        }
      }
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
        current = historySectionIds[historySectionIds.length - 1];
      }
      setActiveHistorySection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Scroll tracking for Data Transformation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!pathname.startsWith('/dashboard/transformation')) return;
    const handleScroll = () => {
      let current = transformationSectionIds[0];
      for (const id of transformationSectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = id;
          }
        }
      }
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2)) {
        current = transformationSectionIds[transformationSectionIds.length - 1];
      }
      setActiveTransformationSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Update testingOpen when pathname changes
  useEffect(() => {
    setTestingOpen(pathname.startsWith('/dashboard/testing'));
  }, [pathname]);

  useEffect(() => { setEdaOpen(pathname.startsWith('/dashboard/eda')); }, [pathname]);
  useEffect(() => { setModellabOpen(pathname.startsWith('/dashboard/modellab')); }, [pathname]);
  useEffect(() => { setDataOpen(pathname.startsWith('/dashboard/data')); }, [pathname]);
  useEffect(() => { setDocsOpen(pathname.startsWith('/dashboard/knowledgehub')); }, [pathname]);
  useEffect(() => { setTestingOpen(pathname.startsWith('/dashboard/testing')); }, [pathname]);
  useEffect(() => { setHistoryOpen(pathname.startsWith('/dashboard/history')); }, [pathname]);
  useEffect(() => { setTransformationOpen(pathname.startsWith('/dashboard/transformation')); }, [pathname]);

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
                      item.title === 'Data Management' ? dataOpen :
                      item.title === 'Documentation' ? docsOpen :
                      item.title === 'Exploratory Analysis' ? edaOpen :
                      item.title === 'Model Laboratory' ? modellabOpen :
                      item.title === 'Model Testing' ? testingOpen :
                      item.title === 'Activity History' ? historyOpen :
                      item.title === 'Data Transformation' ? transformationOpen :
                      undefined
                    }
                    onOpenChange={
                      item.title === 'Data Management' ? setDataOpen :
                      item.title === 'Documentation' ? setDocsOpen :
                      item.title === 'Exploratory Analysis' ? setEdaOpen :
                      item.title === 'Model Laboratory' ? setModellabOpen :
                      item.title === 'Model Testing' ? setTestingOpen :
                      item.title === 'Activity History' ? setHistoryOpen :
                      item.title === 'Data Transformation' ? setTransformationOpen :
                      undefined
                    }
                    defaultOpen={
                      item.title === 'Data Management' ? pathname.startsWith('/dashboard/data') :
                      item.title === 'Documentation' ? pathname.startsWith('/dashboard/knowledgehub') :
                      item.title === 'Exploratory Analysis' ? pathname.startsWith('/dashboard/eda') :
                      item.title === 'Model Laboratory' ? pathname.startsWith('/dashboard/modellab') :
                      item.title === 'Model Testing' ? pathname.startsWith('/dashboard/testing') :
                      item.title === 'Activity History' ? pathname.startsWith('/dashboard/history') :
                      item.title === 'Data Transformation' ? pathname.startsWith('/dashboard/transformation') : false}
                    className="group/collapsible mt-2"
                  >
                    <SidebarMenuItem>
                      <div className="flex items-center">
                        <Link
                          href={mainNavHref[item.title as keyof typeof mainNavHref] || '#'}
                          className="flex-1"
                          onClick={() => {
                            // For sections with submenus, set to first subsection; for others, set to section name
                            if (item.title === 'Data Management') setManualActiveSection('overview');
                            else if (item.title === 'Documentation') setManualActiveSection('documentation');
                            else if (item.title === 'Exploratory Analysis') setManualActiveSection('eda');
                            else if (item.title === 'Model Laboratory') setManualActiveSection('modellab');
                            else if (item.title === 'Model Testing') setManualActiveSection('testing');
                            else if (item.title === 'Team Collaboration') setManualActiveSection('collaboration');
                            else if (item.title === 'Activity History') setManualActiveSection('history');
                            else if (item.title === 'Data Transformation') setManualActiveSection('feature-engineering');
                          }}
                        >
                          <SidebarMenuButton
                            className={[
                              'w-full text-[1rem] font-semibold tracking-tight flex items-center gap-2 relative transition-colors',
                              (item.title === 'Data Management' && pathname === '/dashboard/data' && !dataOpen && ['overview', 'cleaning', 'preview', 'export'].includes(activeSection)) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Exploratory Analysis' && pathname.startsWith('/dashboard/eda')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Model Laboratory' && pathname.startsWith('/dashboard/modellab')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Model Testing' && pathname.startsWith('/dashboard/testing')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Team Collaboration' && pathname.startsWith('/dashboard/collaboration')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Documentation' && pathname.startsWith('/dashboard/knowledgehub')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Activity History' && pathname.startsWith('/dashboard/history')) ? 'bg-primary/10 text-primary' :
                              (item.title === 'Data Transformation' && pathname.startsWith('/dashboard/transformation')) ? 'bg-primary/10 text-primary' :
                              ''
                            ].join(' ')}
                          >
                            {/* Show indicator if Data is closed and any of its subsections is active */}
                            {item.title === 'Data Management' &&
                              pathname === '/dashboard/data' &&
                              !dataOpen &&
                              ['overview', 'cleaning', 'preview', 'export'].includes(activeSection) && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-primary shadow-lg transition-all duration-300" />
                            )}
                            {/* Show indicator for other main sections */}
                            {item.title !== 'Data Management' && (
                              ((item.title === 'Exploratory Analysis' && pathname.startsWith('/dashboard/eda')) ||
                               (item.title === 'Model Laboratory' && pathname.startsWith('/dashboard/modellab')) ||
                               (item.title === 'Model Testing' && pathname.startsWith('/dashboard/testing')) ||
                               (item.title === 'Team Collaboration' && pathname.startsWith('/dashboard/collaboration')) ||
                               (item.title === 'Documentation' && pathname.startsWith('/dashboard/knowledgehub')) ||
                               (item.title === 'Activity History' && pathname.startsWith('/dashboard/history')) ||
                               (item.title === 'Data Transformation' && pathname.startsWith('/dashboard/transformation'))
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
                              if (item.title === 'Data Management') {
                                isActive = pathname === '/dashboard/data' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeSection === hash)));
                              } else if (item.title === 'Exploratory Analysis') {
                                isActive = pathname === '/dashboard/eda' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeEdaSection === hash)));
                              } else if (item.title === 'Documentation') {
                                isActive = pathname.startsWith('/dashboard/knowledgehub') && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : docsActiveHash === hash)));
                              } else if (item.title === 'Model Laboratory') {
                                isActive = pathname === '/dashboard/modellab' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeModelLabSection === hash)));
                                                             } else if (item.title === 'Model Testing') {
                                 isActive = pathname === '/dashboard/testing' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeTestingSection === hash)));
                               } else if (item.title === 'Activity History') {
                                 isActive = pathname === '/dashboard/history' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeHistorySection === hash)));
                               } else if (item.title === 'Data Transformation') {
                                 isActive = pathname === '/dashboard/transformation' && ((hoveredSection && hoveredSection === hash) || (!hoveredSection && (manualActiveSection ? manualActiveSection === hash : activeTransformationSection === hash)));
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
                                          setManualActiveSection(hashId);
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
                                        } else if (subItem.url.startsWith('/dashboard/testing#')) {
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
