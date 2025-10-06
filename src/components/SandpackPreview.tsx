"use client";
import React, { useState, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react/unstyled";

interface SandpackPreviewProps {
  code: string;
}

export default function SandpackPreview({ code }: SandpackPreviewProps) {
  // Extract function name from code
  const functionMatch = code.match(/function\s+(\w+)/);
  const componentName = functionMatch ? functionMatch[1] : "App";

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Reset loading state after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [code]);

  // Wrap the code with proper React imports and rendering
  const wrappedCode = `import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { Heart, Star, User, Mail, Lock, Search, Home, Settings, Menu, X, Check, AlertCircle, Info, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, Edit, Trash2, Download, Upload, Share2, Calendar, Clock, MapPin, Phone, Globe, ShoppingCart, CreditCard, Package, Truck, Bell, Filter, Grid, List, Eye, EyeOff, Loader2, RefreshCw, ZoomIn, ZoomOut, Play, Pause, Volume2, VolumeX, Bookmark, Flag, ThumbsUp, MessageCircle, Send, Paperclip, Image, Video, Music, File, Folder, Save, Copy, Printer, ExternalLink, Link, Unlink, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Code, Quote, ListOrdered, ListUnordered, Smile, Meh, Frown, Sun, Moon, Cloud, CloudRain, Wind, Snowflake, Zap, Droplet, Flame, Sparkles, Award, Target, TrendingUp, TrendingDown, BarChart2, PieChart, Activity, Wifi, WifiOff, Battery, BatteryCharging, Bluetooth, Cast, Monitor, Smartphone, Tablet, Watch, Tv, Radio, Camera, Mic, MicOff, Headphones, Speaker, Shield, ShieldCheck, Lock as LockIcon, Unlock, Key, UserCheck, UserPlus, UserMinus, Users, UserX, LogIn, LogOut } from 'lucide-react';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Preview Error</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'Something went wrong'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

${code}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <${componentName} />
  </ErrorBoundary>
);`;

  // Enhanced styles with Tailwind CDN and custom improvements
  const styles = `@import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.6/dist/tailwind.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#root {
  width: 100%;
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}`;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600">Preview failed to load</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Sandpack
        template="react"
        files={{
          "/App.js": {
            code: wrappedCode,
            active: true,
          },
          "/styles.css": {
            code: styles,
          },
        }}
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: false,
          editorHeight: "100%",
          editorWidthPercentage: 0,
          showInlineErrors: true,
          autorun: true,
          autoReload: true,
          recompileMode: "delayed",
          recompileDelay: 500,
          initMode: "lazy",
          showRefreshButton: false,
          
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "^0.263.1",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
          },
        }}
        onError={(error: Error) => {
          console.error('Sandpack error:', error);
          setHasError(true);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </div>
  );
}