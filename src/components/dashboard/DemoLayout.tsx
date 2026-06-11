'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, TrendingUp, Map, Package, DollarSign, Leaf, Shield,
  CreditCard, Calendar, Target, FileText, Users, User,
  ChevronLeft, ChevronRight, Play, X, Menu, Database, RotateCcw,
  Briefcase, Building, Cpu, Layers, Calculator, Zap, MessageSquare, Landmark,
  Activity, Mail, Smile, Scale
} from 'lucide-react';
import Link from 'next/link';

import type { ActiveSection, UserRole } from '@/src/types';
import { PrototypeBadge } from '../shared/PrototypeBadge';
import { DataTrustDrawer } from './DataTrustDrawer';

import { ExecutiveOverview } from './sections/ExecutiveOverview';
import { AIReadiness } from './sections/AIReadiness';
import { Competitiveness } from './sections/Competitiveness';
import { OpportunityMap } from './sections/OpportunityMap';
import { AISolutionStudio } from './sections/AISolutionStudio';
import { ImplementationBlueprint } from './sections/ImplementationBlueprint';
import { DemandInventory } from './sections/DemandInventory';
import { CashFlow } from './sections/CashFlow';
import { Sustainability } from './sections/Sustainability';
import { ResponsibleAI } from './sections/ResponsibleAI';
import { FinancingPlanner } from './sections/FinancingPlanner';
import { CapitalIntelligence } from './sections/CapitalIntelligence';
import { ROISimulator } from './sections/ROISimulator';
import { UseCaseMarketplace } from './sections/UseCaseMarketplace';
import { AICopilot } from './sections/AICopilot';
import { Plan90Day } from './sections/Plan90Day';
import { ImpactCentre } from './sections/ImpactCentre';
import { ImplementationReport } from './sections/ImplementationReport';
import { RMPortfolio } from './sections/RMPortfolio';
import { RMBrightCart } from './sections/RMBrightCart';
import { WorkforceImpact } from './sections/WorkforceImpact';
import { BusinessVitalMonitor } from './sections/BusinessVitalMonitor';
import { EmailMeetingIntelligence } from './sections/EmailMeetingIntelligence';
import { ConsumerInsightHub } from './sections/ConsumerInsightHub';
import { PolicyMonitor } from './sections/PolicyMonitor';

const SME_NAV: { id: ActiveSection; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'overview', label: 'Executive Overview', Icon: BarChart2 },
  { id: 'vital-monitor', label: 'Business Vital Monitor™', Icon: Activity },
  { id: 'readiness', label: 'AI Readiness', Icon: Shield },
  { id: 'email-meeting', label: 'Email & Meeting Intelligence™', Icon: Mail },
  { id: 'competitiveness', label: 'Competitiveness', Icon: TrendingUp },
  { id: 'consumer-insight', label: 'Consumer Insight Hub™', Icon: Smile },
  { id: 'opportunity-map', label: 'Opportunity Map', Icon: Map },
  { id: 'solution-studio', label: 'AI Solution Studio', Icon: Cpu },
  { id: 'implementation-blueprint', label: 'Implementation Blueprint', Icon: Layers },
  { id: 'workforce-impact', label: 'Workforce Impact', Icon: Users },
  { id: 'demand', label: 'Demand & Inventory', Icon: Package },
  { id: 'cashflow', label: 'Cash Flow', Icon: DollarSign },
  { id: 'sustainability', label: 'Sustainability', Icon: Leaf },
  { id: 'responsible-ai', label: 'Responsible AI', Icon: Shield },
  { id: 'policy-monitor', label: 'Policy Monitor™', Icon: Scale },
  { id: 'financing', label: 'Financing Planner', Icon: CreditCard },
  { id: 'capital-intelligence', label: 'HSBC Capital Intelligence™', Icon: Landmark },
  { id: 'roi-simulator', label: 'ROI Simulator', Icon: Calculator },
  { id: 'use-case-marketplace', label: 'Use Case Marketplace', Icon: Zap },
  { id: 'ai-copilot', label: 'AI Copilot', Icon: MessageSquare },
  { id: 'plan', label: '90-Day Plan', Icon: Calendar },
  { id: 'impact', label: 'Impact Centre', Icon: Target },
  { id: 'report', label: 'Implementation Report', Icon: FileText },
];

const RM_NAV: { id: ActiveSection; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'rm-portfolio', label: 'Portfolio Overview', Icon: Briefcase },
  { id: 'rm-portfolio', label: 'Intervention Queue', Icon: Target },
  { id: 'rm-portfolio', label: 'SME Portfolio', Icon: Users },
  { id: 'rm-brightcart', label: 'BrightCart Profile', Icon: Building },
];

const PRESENTATION_SEQUENCE: ActiveSection[] = [
  'overview', 'readiness', 'vital-monitor', 'email-meeting', 'consumer-insight', 'policy-monitor',
  'competitiveness', 'opportunity-map',
  'solution-studio', 'implementation-blueprint', 'workforce-impact',
  'demand', 'cashflow', 'sustainability', 'responsible-ai',
  'financing', 'capital-intelligence', 'roi-simulator', 'use-case-marketplace', 'ai-copilot',
  'plan', 'impact', 'report', 'rm-portfolio', 'rm-brightcart',
];

export function DemoLayout() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [role, setRole] = useState<UserRole>('sme');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataTrustOpen, setDataTrustOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);

  const nav = role === 'sme' ? SME_NAV : RM_NAV;

  const startPresentation = useCallback(() => {
    setPresentationIndex(0);
    setActiveSection(PRESENTATION_SEQUENCE[0]!);
    setRole('sme');
    setPresentationMode(true);
  }, []);

  const nextSlide = useCallback(() => {
    const next = Math.min(presentationIndex + 1, PRESENTATION_SEQUENCE.length - 1);
    setPresentationIndex(next);
    setActiveSection(PRESENTATION_SEQUENCE[next]!);
    if (PRESENTATION_SEQUENCE[next] === 'rm-portfolio' || PRESENTATION_SEQUENCE[next] === 'rm-brightcart') {
      setRole('rm');
    } else {
      setRole('sme');
    }
  }, [presentationIndex]);

  const prevSlide = useCallback(() => {
    const prev = Math.max(presentationIndex - 1, 0);
    setPresentationIndex(prev);
    setActiveSection(PRESENTATION_SEQUENCE[prev]!);
    if (PRESENTATION_SEQUENCE[prev] === 'rm-portfolio' || PRESENTATION_SEQUENCE[prev] === 'rm-brightcart') {
      setRole('rm');
    } else {
      setRole('sme');
    }
  }, [presentationIndex]);

  const exitPresentation = useCallback(() => {
    setPresentationMode(false);
  }, []);

  const resetDemo = useCallback(() => {
    setActiveSection('overview');
    setRole('sme');
    setPresentationMode(false);
    setSidebarOpen(false);
  }, []);

  const sectionLabel = [...SME_NAV, ...RM_NAV].find((n) => n.id === activeSection)?.label ?? '';

  function renderSection() {
    switch (activeSection) {
      case 'overview': return <ExecutiveOverview onNavigate={(s) => setActiveSection(s as ActiveSection)} />;
      case 'readiness': return <AIReadiness />;
      case 'vital-monitor': return <BusinessVitalMonitor />;
      case 'email-meeting': return <EmailMeetingIntelligence />;
      case 'consumer-insight': return <ConsumerInsightHub />;
      case 'policy-monitor': return <PolicyMonitor />;
      case 'competitiveness': return <Competitiveness />;
      case 'opportunity-map': return <OpportunityMap />;
      case 'solution-studio': return <AISolutionStudio />;
      case 'implementation-blueprint': return <ImplementationBlueprint />;
      case 'workforce-impact': return <WorkforceImpact onNavigate={(s) => setActiveSection(s as ActiveSection)} />;
      case 'demand': return <DemandInventory />;
      case 'cashflow': return <CashFlow />;
      case 'sustainability': return <Sustainability />;
      case 'responsible-ai': return <ResponsibleAI />;
      case 'financing': return <FinancingPlanner />;
      case 'capital-intelligence': return <CapitalIntelligence onNavigate={(s) => setActiveSection(s as ActiveSection)} />;
      case 'roi-simulator': return <ROISimulator />;
      case 'use-case-marketplace': return <UseCaseMarketplace />;
      case 'ai-copilot': return <AICopilot onNavigate={(s) => setActiveSection(s as ActiveSection)} />;
      case 'plan': return <Plan90Day />;
      case 'impact': return <ImpactCentre />;
      case 'report': return <ImplementationReport />;
      case 'rm-portfolio': return <RMPortfolio onSelectClient={(id) => setActiveSection(id as ActiveSection)} />;
      case 'rm-brightcart': return <RMBrightCart />;
      default: return <ExecutiveOverview />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f4f4f4' }}>
      {/* Sidebar overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 flex flex-col h-full transition-transform duration-300 no-print ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: 240, background: '#111', flexShrink: 0 }}
      >
        {/* Brand */}
        <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-bold text-white text-xs shrink-0"
              style={{ background: '#db0011' }}
            >
              H
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">HSBC AI Launchpad</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Concept Prototype</p>
            </div>
          </Link>

          {/* Company */}
          <div className="flex items-center gap-2.5 p-2.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: '#db0011' }}
            >
              BC
            </div>
            <div>
              <p className="text-xs font-medium text-white">BrightCart Ltd</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Online retail · 42 staff</p>
            </div>
          </div>
        </div>

        {/* Role toggle */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {([['sme', 'SME View', User], ['rm', 'RM View', Users]] as const).map(([r, label, Icon]) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setActiveSection(r === 'rm' ? 'rm-portfolio' : 'overview');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-all"
                style={{
                  background: role === r ? '#db0011' : 'transparent',
                  color: role === r ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {nav.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id + item.label}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-all"
                style={{
                  background: isActive ? 'rgba(219,0,17,0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid #db0011' : '3px solid transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                }}
              >
                <item.Icon size={14} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setDataTrustOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
          >
            <Database size={12} />
            Data Trust
          </button>
          <button
            onClick={resetDemo}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
          >
            <RotateCcw size={12} />
            Reset Demo
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-4 lg:px-6 py-3 no-print"
          style={{ background: 'white', borderBottom: '1px solid #e2e2e2', minHeight: 56 }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold" style={{ color: '#111' }}>
                {sectionLabel}
              </p>
              <p className="text-xs" style={{ color: '#888' }}>
                BrightCart Ltd · {role === 'rm' ? 'HSBC RM View' : 'SME View'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PrototypeBadge className="hidden sm:flex" />
            <button
              onClick={() => setDataTrustOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border"
              style={{ borderColor: '#e2e2e2', color: '#555' }}
            >
              <Database size={12} />
              Data Trust
            </button>
            <button
              onClick={startPresentation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white"
              style={{ background: '#db0011' }}
            >
              <Play size={12} />
              <span className="hidden sm:inline">Presentation</span>
            </button>
          </div>
        </header>

        {/* Presentation bar */}
        <AnimatePresence>
          {presentationMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-print"
              style={{ background: '#db0011', overflow: 'hidden' }}
            >
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    disabled={presentationIndex === 0}
                    className="p-1.5 rounded disabled:opacity-40 text-white"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={presentationIndex === PRESENTATION_SEQUENCE.length - 1}
                    className="p-1.5 rounded disabled:opacity-40 text-white"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                  <span className="text-xs text-white font-medium">
                    {presentationIndex + 1} / {PRESENTATION_SEQUENCE.length} — {sectionLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Progress dots */}
                  <div className="hidden sm:flex items-center gap-1">
                    {PRESENTATION_SEQUENCE.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setPresentationIndex(i);
                          setActiveSection(PRESENTATION_SEQUENCE[i]!);
                        }}
                        className="rounded-full transition-all"
                        style={{
                          width: i === presentationIndex ? 16 : 6,
                          height: 6,
                          background: i === presentationIndex ? 'white' : 'rgba(255,255,255,0.4)',
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={exitPresentation}
                    className="p-1.5 rounded text-white"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                    aria-label="Exit presentation"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DataTrustDrawer open={dataTrustOpen} onClose={() => setDataTrustOpen(false)} />
    </div>
  );
}
