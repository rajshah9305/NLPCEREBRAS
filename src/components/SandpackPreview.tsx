'use client';
import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';

// --- 1. Import ONLY what we need ---
import {
  Heart, Star, User, Mail, Lock, Search, Home, Settings, Menu, X, Check, AlertCircle,
  Info, ChevronRight, ChevronLeft, Plus, Edit, Trash2, Download, Calendar, Clock,
  MapPin, Phone, ShoppingCart, CreditCard, Package, Bell, Filter, Grid, List, Eye,
  EyeOff, Loader2, RefreshCw, Play, Pause, Volume2, Bookmark, MessageCircle, Send,
  Image, File, Save, Copy, ExternalLink, Bold, Italic, Code, ListOrdered,
  ListUnordered, Sun, Moon, Cloud, Wind, Zap, Droplet, Flame, Sparkles, Award,
  TrendingUp, BarChart2, PieChart, Activity, Wifi, Battery, Shield, Key, Users,
  LogIn, LogOut,
} from 'lucide-react';

interface Props { code: string; }

export default function SandpackPreview({ code }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, [code]);

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
* {margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;}
#root{width:100%;min-height:100vh;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:#f1f1f1;}
::-webkit-scrollbar-thumb{background:#888;border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:#555;}`;

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading preview…</p>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      <Sandpack
        template="react"
        theme="light"
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
        }}
        customSetup={{
          dependencies: {
            'lucide-react': '0.263.1',
            react: '18.2.0',
            'react-dom': '18.2.0',
          },
        }}
      />
    </div>
  );
}
