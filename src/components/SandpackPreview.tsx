'use client';
import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props { 
  code: string; 
}

export default function SandpackPreview({ code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, [code]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => setIsLoading(false), 1200);
  };

  // --- 2. Add React import ---
  const wrappedCode = `import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import * as lucide from 'lucide-react';
const { Heart, Star, User, Mail, Lock, Search, Home, Settings, Menu, X, Check, AlertCircle, Info, ChevronRight, ChevronLeft, Plus, Edit, Trash2, Download, Calendar, Clock, MapPin, Phone, ShoppingCart, CreditCard, Package, Bell, Filter, Grid, List, Eye, EyeOff, Loader2, RefreshCw, Play, Pause, Volume2, Bookmark, MessageCircle, Send, Image, File, Save, Copy, ExternalLink, Bold, Italic, Code, ListOrdered, ListUnordered, Sun, Moon, Cloud, Wind, Zap, Droplet, Flame, Sparkles, Award, TrendingUp, BarChart2, PieChart, Activity, Wifi, Battery, Shield, Key, Users, LogIn, LogOut } = lucide;

class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false};}
  static getDerivedStateFromError(){return {hasError:true};}
  render(){if(this.state.hasError)return <div className="p-4 bg-red-50 border border-red-200 rounded-lg">Preview Error</div>;return this.props.children;}
}

${code}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
`;

  const styles = `@import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.6/dist/tailwind.min.css');

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Animation utilities */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Modern button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn-primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.btn-primary:hover {
  background: hsl(var(--primary) / 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
}

.btn-secondary {
  background: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.btn-secondary:hover {
  background: hsl(var(--secondary) / 0.8);
}

/* Card styles */
.card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Input styles */
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}

/* Gradient backgrounds */
.gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
}

.gradient-secondary {
  background: linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--muted)));
}`;

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">Loading preview</p>
          <p className="text-gray-500 text-sm">Compiling your React component...</p>
        </div>
      </div>
    </div>
  );

  if (hasError) return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center space-y-4 p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-2">
          <p className="text-red-700 font-medium">Preview Error</p>
          <p className="text-red-600 text-sm">Something went wrong while rendering the component</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full relative">
      <Sandpack
        key={key}
        template="react"
        theme={{
          colors: {
            surface1: '#ffffff',
            surface2: '#f8fafc',
            surface3: '#f1f5f9',
            clickable: '#64748b',
            base: '#1e293b',
            disabled: '#94a3b8',
            hover: '#475569',
            accent: '#f97316',
            error: '#ef4444',
            errorSurface: '#fef2f2',
            warning: '#f59e0b',
            warningSurface: '#fffbeb',
          },
          syntax: {
            plain: '#1e293b',
            comment: '#64748b',
            keyword: '#7c3aed',
            tag: '#dc2626',
            punctuation: '#64748b',
            definition: '#059669',
            property: '#0ea5e9',
            static: '#dc2626',
            string: '#059669',
          },
          font: {
            body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            mono: '"Fira Code", "Consolas", "Monaco", monospace',
            size: '14px',
            lineHeight: '1.5',
          },
        }}
        files={{
          '/App.js': wrappedCode,
          '/styles.css': styles,
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: false,
          editorHeight: '100%',
          editorWidthPercentage: 0,
          showInlineErrors: true,
          autorun: true,
          autoReload: true,
          recompileMode: 'delayed',
          recompileDelay: 300,
          initMode: 'immediate',
          showRefreshButton: false,
          showConsole: false,
          showConsoleButton: false,
          bundlerURL: undefined,
          startRoute: '/',
          skipEval: false,
          fileResolver: {
            isFile: async (path: string) => true,
            readFile: async (path: string) => '',
          },
        }}
        customSetup={{
          dependencies: {
            'lucide-react': '0.263.1',
            react: '18.2.0',
            'react-dom': '18.2.0',
            'framer-motion': '10.16.4',
          },
        }}
      />
      
      {/* Refresh Button Overlay */}
      <button
        onClick={handleRefresh}
        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md z-10"
        title="Refresh preview"
      >
        <RefreshCw className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}
