'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Cpu, ChevronRight, ExternalLink } from 'lucide-react';
import { BRIGHTCART } from '@/src/data/brightcart';

const { readiness, competitiveness, opportunities, funding } = BRIGHTCART;
const topOpp = opportunities[0]!;

interface Citation {
  label: string;
  section: string;
  color: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  links?: { label: string; section: string }[];
}

const SUGGESTED_PROMPTS = [
  'Why was demand optimisation recommended?',
  'Why is my readiness score 68?',
  'How do I improve governance?',
  'What funding support might be available?',
  'What is my biggest competitive gap?',
  'How much value could this create?',
  'How does BrightCart compare to peers?',
  'What are the biggest risks of deploying AI?',
];

function buildResponse(query: string): { content: string; citations: Citation[]; links: { label: string; section: string }[] } {
  const q = query.toLowerCase();

  if (q.includes('demand') && (q.includes('recommend') || q.includes('why') || q.includes('selected') || q.includes('opportunit'))) {
    return {
      content: `Demand & Inventory Optimisation was selected as BrightCart's priority AI opportunity because it achieves the highest opportunity score of **88/100**, combining strong feasibility (85/100) with high commercial impact (90/100).\n\nThe core evidence is compelling:\n\n• **Stockout rate of 7.8%** is 3.2 percentage points above the peer median of 4.6% — representing lost sales and customer dissatisfaction.\n• **Inventory turnover of 4.2x** is significantly below the peer median of 5.8x, meaning approximately £48,000 in working capital is unnecessarily tied up in stock.\n• BrightCart has **24 months of clean sales transaction history** — the primary input needed for demand forecasting — giving this project a strong data foundation.\n\nEstimated annual net benefit is **£42,000** with an implementation cost of £28,000 and a base-case payback of 8 months. The risk classification is Low, making it appropriate given BrightCart's current readiness level of 68/100.`,
      citations: [
        { label: 'Score: 88/100', section: 'opportunity-map', color: '#db0011' },
        { label: 'Stockout: 7.8% vs 4.6%', section: 'competitiveness', color: '#d97706' },
        { label: 'Est. £42k benefit', section: 'financing', color: '#00875a' },
      ],
      links: [
        { label: 'View Opportunity Map', section: 'opportunity-map' },
        { label: 'View AI Solution Studio', section: 'solution-studio' },
      ],
    };
  }

  if (q.includes('readiness') && (q.includes('68') || q.includes('score') || q.includes('why') || q.includes('how'))) {
    const dims = readiness.dimensions;
    const sorted = [...dims].sort((a, b) => a.score - b.score);
    return {
      content: `BrightCart's AI Readiness score is **68/100**, which places it in the "Pilot Ready with Controls" category. This means the business has sufficient foundations to run a controlled AI pilot, but requires governance and data improvements before scaling.\n\nThe score is a weighted average across seven dimensions:\n\n${dims.map((d) => `• **${d.label}**: ${d.score}/100`).join('\n')}\n\nThe score is held back primarily by **${sorted[0]!.label} (${sorted[0]!.score}/100)** and **${sorted[1]!.label} (${sorted[1]!.score}/100)**.\n\nKey blockers:\n${readiness.blockers.map((b) => `• ${b}`).join('\n')}\n\nThree immediate actions recommended:\n${readiness.immediateActions.slice(0, 3).map((a, i) => `${i + 1}. ${a}`).join('\n')}`,
      citations: [
        { label: 'Readiness: 68/100', section: 'readiness', color: '#db0011' },
        { label: `Governance: ${dims.find((d) => d.id === 'governance')?.score}/100`, section: 'responsible-ai', color: '#d97706' },
      ],
      links: [
        { label: 'View AI Readiness', section: 'readiness' },
        { label: 'View Responsible AI', section: 'responsible-ai' },
      ],
    };
  }

  if (q.includes('governance') || q.includes('policy') || q.includes('responsible')) {
    const govDim = readiness.dimensions.find((d) => d.id === 'governance');
    return {
      content: `BrightCart's Governance & Security dimension scores **${govDim?.score ?? 49}/100**, which is the lowest readiness dimension and the primary area requiring improvement before scaling AI.\n\nCurrent weaknesses in this area:\n${(govDim?.weaknesses ?? []).map((w) => `• ${w}`).join('\n')}\n\n**Recommended improvement actions:**\n\n1. **Draft a lightweight AI acceptable-use policy** — this is a governance gate requirement before the pilot can proceed. A 2-page policy covering approved tools, data handling, and human oversight is sufficient.\n\n2. **Define a model-monitoring process** — establish who reviews AI recommendations, how often accuracy is checked, and what triggers a model review.\n\n3. **Address informal AI tool usage** — employees currently use public AI tools without formal oversight. A policy brings this under control and reduces data leakage risk.\n\nImproving governance from 49 to ~65 would increase the overall readiness score from 68 to approximately 70–72, unlocking more complex AI use cases.`,
      citations: [
        { label: 'Governance: 49/100', section: 'responsible-ai', color: '#db0011' },
        { label: 'No AI policy', section: 'readiness', color: '#d97706' },
      ],
      links: [
        { label: 'View Responsible AI Passport', section: 'responsible-ai' },
        { label: 'View AI Readiness', section: 'readiness' },
      ],
    };
  }

  if (q.includes('funding') || q.includes('grant') || q.includes('support')) {
    const progs = funding;
    return {
      content: `BrightCart has been matched to **${progs.length} illustrative funding programmes** that may support the AI implementation project:\n\n${progs.map((p) => `**${p.name}**\n• Match score: ${p.matchPercent}%\n• Potential amount: £${p.potentialAmount.toLocaleString()}\n• Stage: ${p.stage}`).join('\n\n')}\n\n**Total potential funding support: £${progs.reduce((s, p) => s + p.potentialAmount, 0).toLocaleString()}**\n\nThe most immediately actionable programme is the Digital Productivity Support Programme (86% match). The primary missing requirement is a supplier quotation — once submitted, BrightCart could progress to application.\n\nNote: these programmes are illustrative and based on publicly available information. Eligibility should be verified with HSBC or the relevant programme body.`,
      citations: [
        { label: '3 programmes matched', section: 'funding', color: '#00875a' },
        { label: '£8k potential support', section: 'financing', color: '#d97706' },
      ],
      links: [
        { label: 'View Funding Navigator', section: 'funding' },
        { label: 'View Financing Planner', section: 'financing' },
      ],
    };
  }

  if (q.includes('competitive') || q.includes('gap') || q.includes('peers') || q.includes('benchmark')) {
    const below = competitiveness.metrics.filter((m) => m.status === 'Below median' || m.status === 'Needs attention');
    const above = competitiveness.metrics.filter((m) => m.status === 'Above median');
    return {
      content: `BrightCart sits at the **${competitiveness.overallPercentile}th percentile** overall against illustrative sector peers — meaning approximately 58% of comparable businesses outperform BrightCart on the combined benchmark.\n\n**${below[0]?.label ?? 'Stockout Rate'}** is the most impactful competitive gap:\n• BrightCart: ${below[0]?.value}${below[0]?.unit} vs peer median ${below[0]?.median}${below[0]?.unit}\n• ${below[0]?.implication}\n\nOther gaps:\n${below.slice(1).map((m) => `• **${m.label}**: ${m.value}${m.unit} vs peer median ${m.median}${m.unit}`).join('\n')}\n\nBrightCart outperforms peers on:\n${above.map((m) => `• **${m.label}**: ${m.value}${m.unit} vs peer median ${m.median}${m.unit} — ${m.implication}`).join('\n')}\n\nAddressing the inventory efficiency gap through demand optimisation is the highest-value path to improving competitive position.`,
      citations: [
        { label: `${competitiveness.overallPercentile}th percentile`, section: 'competitiveness', color: '#d97706' },
        { label: 'Stockout 7.8% vs 4.6%', section: 'competitiveness', color: '#db0011' },
      ],
      links: [
        { label: 'View Competitiveness', section: 'competitiveness' },
        { label: 'View Opportunity Map', section: 'opportunity-map' },
      ],
    };
  }

  if (q.includes('value') || q.includes('benefit') || q.includes('much') || q.includes('roi') || q.includes('return')) {
    return {
      content: `The demand & inventory optimisation project is estimated to generate the following value for BrightCart:\n\n**Year 1:**\n• Gross annual benefit: ~£51,000\n• Operating costs: ~£9,000/year\n• Net annual benefit: **£42,000**\n• Payback period: **8 months** (base case)\n\n**3-Year View:**\n• Cumulative net benefit: **£98,000**\n• Implementation cost: £28,000 (net of £8,000 funding)\n• Financing required: £15,000\n\n**Sensitivity:**\n• Best case (high adoption + accuracy): ~£60–70k annual benefit\n• Downside (slower adoption): ~£28–35k annual benefit\n\nValue drivers:\n• Reducing stockout rate from 7.8% to ~5.1% recovers lost revenue\n• Releasing ~£48k in excess inventory reduces working capital cost\n• Improved forecast accuracy reduces emergency ordering costs\n\nUse the ROI Simulator to model different assumptions interactively.`,
      citations: [
        { label: '£42k annual benefit', section: 'financing', color: '#00875a' },
        { label: '8-month payback', section: 'financing', color: '#1d4ed8' },
        { label: '£98k 3-year value', section: 'impact', color: '#00875a' },
      ],
      links: [
        { label: 'View ROI Simulator', section: 'roi-simulator' },
        { label: 'View Financing Planner', section: 'financing' },
      ],
    };
  }

  if (q.includes('risk') || q.includes('danger') || q.includes('concern') || q.includes('problem')) {
    return {
      content: `The demand & inventory optimisation use case is classified as **Low risk** — suitable for a controlled pilot. Key risks and mitigations:\n\n**Data risk** (Medium): Supplier lead-time data is inconsistent. Mitigation: validate and clean data before pilot; limit initial scope to SKUs with complete data coverage.\n\n**People risk** (Medium): Employees may over-rely on or ignore AI recommendations. Mitigation: mandatory override logging; human approval required for all reorder decisions; AI awareness training before go-live.\n\n**Governance risk** (Low-Medium): No AI policy exists currently. Mitigation: a governance gate at end of the Prepare phase requires policy sign-off before pilot proceeds.\n\n**Model accuracy risk** (Low): Forecast accuracy may be lower than expected initially. Mitigation: monthly accuracy reviews with automatic model retraining trigger if accuracy drops below threshold.\n\n**Overall risk assessment**: Low operational risk. The required human approval step and monitoring controls mean the downside is limited to suboptimal stock decisions — comparable to the current manual process. No autonomous decision-making.`,
      citations: [
        { label: 'Low risk classification', section: 'responsible-ai', color: '#00875a' },
        { label: 'Governance: 49/100', section: 'readiness', color: '#d97706' },
      ],
      links: [
        { label: 'View Responsible AI', section: 'responsible-ai' },
        { label: 'View Implementation Blueprint', section: 'implementation-blueprint' },
      ],
    };
  }

  // Default fallback
  return {
    content: `Thank you for your question. Based on BrightCart's analysis profile:\n\n**Readiness**: ${readiness.overall}/100 — ${readiness.label}\n**Priority opportunity**: ${topOpp.title} (score: ${topOpp.score}/100)\n**Estimated annual value**: £${(topOpp.valueMin / 1000).toFixed(0)}–${(topOpp.valueMax / 1000).toFixed(0)}k\n**Competitive position**: ${competitiveness.overallPercentile}th percentile\n\nHere are some questions I can help you explore:\n• Why was demand optimisation recommended?\n• How can BrightCart improve its readiness score?\n• What funding support is available?\n• What is BrightCart's biggest competitive gap?\n• How much value could AI create?\n\nPlease ask any of these or ask a specific question about the platform analysis.`,
    citations: [
      { label: 'Readiness: 68/100', section: 'readiness', color: '#db0011' },
    ],
    links: [
      { label: 'View Executive Overview', section: 'overview' },
    ],
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: '#db0011' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, onNavigate }: { msg: Message; onNavigate: (s: string) => void }) {
  const isUser = msg.role === 'user';

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const boldFormatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('• ')) {
        return (
          <li key={i} className="ml-4 text-sm leading-relaxed" style={{ color: isUser ? 'white' : '#444' }}
            dangerouslySetInnerHTML={{ __html: boldFormatted.slice(2) }} />
        );
      }
      if (/^\d+\. /.test(line)) {
        return (
          <li key={i} className="ml-4 text-sm leading-relaxed list-decimal" style={{ color: isUser ? 'white' : '#444' }}
            dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^\d+\. /, '') }} />
        );
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-sm leading-relaxed" style={{ color: isUser ? 'white' : '#444' }}
          dangerouslySetInnerHTML={{ __html: boldFormatted }} />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
          style={{ background: '#db0011' }}
        >
          <Cpu size={13} style={{ color: 'white' }} />
        </div>
      )}
      <div style={{ maxWidth: '82%' }}>
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            background: isUser ? '#db0011' : 'white',
            border: isUser ? 'none' : '1px solid #e2e2e2',
            borderTopLeftRadius: isUser ? undefined : 4,
            borderTopRightRadius: isUser ? 4 : undefined,
          }}
        >
          <div className="space-y-1">{formatContent(msg.content)}</div>
        </div>

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.citations.map((c) => (
              <button
                key={c.label}
                onClick={() => onNavigate(c.section)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all hover:shadow-sm"
                style={{
                  background: `${c.color}10`,
                  borderColor: `${c.color}40`,
                  color: c.color,
                }}
              >
                <span>{c.label}</span>
                <ExternalLink size={9} />
              </button>
            ))}
          </div>
        )}

        {/* Links */}
        {msg.links && msg.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {msg.links.map((l) => (
              <button
                key={l.label}
                onClick={() => onNavigate(l.section)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-all hover:bg-gray-50"
                style={{ borderColor: '#e2e2e2', color: '#555' }}
              >
                <ChevronRight size={10} />
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface AICopilotProps {
  onNavigate?: (section: string) => void;
}

export function AICopilot({ onNavigate }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Business Advisor for BrightCart.\n\nI have access to your full analysis: readiness assessment, competitive benchmarks, opportunity scores, financing plan, and governance profile.\n\nWhat would you like to explore?`,
      citations: [],
      links: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleNavigate = useCallback((section: string) => {
    onNavigate?.(section);
  }, [onNavigate]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const response = buildResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      ...response,
    };

    setTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 160px)', minHeight: 500 }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-2" style={{ borderBottom: '1px solid #e2e2e2' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#db0011' }}>
          <Cpu size={16} style={{ color: 'white' }} />
        </div>
        <div>
          <h1 className="font-bold" style={{ color: '#111' }}>AI Business Copilot</h1>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#888' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#00875a' }} />
            Connected to BrightCart analysis · Data-grounded responses
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} onNavigate={handleNavigate} />
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#db0011' }}
            >
              <Cpu size={13} style={{ color: 'white' }} />
            </div>
            <div className="bg-white rounded-2xl border" style={{ borderColor: '#e2e2e2' }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <div className="py-3">
          <p className="text-xs mb-2" style={{ color: '#888' }}>Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, 6).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all hover:border-red-400"
                style={{ borderColor: '#e2e2e2', color: '#555', background: 'white' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="pt-3 mt-auto"
        style={{ borderTop: '1px solid #e2e2e2' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your AI readiness, opportunities, funding, or strategy..."
            className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-red-400"
            style={{ borderColor: '#e2e2e2', color: '#111' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: '#db0011', flexShrink: 0 }}
          >
            <Send size={14} style={{ color: 'white' }} />
          </button>
        </form>
        <p className="text-xs mt-2 text-center" style={{ color: '#aaa' }}>
          Responses are generated from BrightCart&apos;s analysis data · Not financial advice
        </p>
      </div>
    </div>
  );
}
