# 🚀 RAJ AI APP BUILDER - Quick Setup Guide

## ⚡ Instant Setup (30 seconds)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variable
```bash
# Create .env.local file
echo "CEREBRAS_API_KEY=csk-4txetdxrcmpdxjht5kv2t95pefkdjfvjkcep4pyetpe3xefp" > .env.local
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: http://localhost:3000

## 🎯 What You Get

✅ **Fully Functional AI App Builder**
- Real-time React component generation
- Live preview with Sandpack
- Beautiful v0.dev-inspired UI
- Production-ready code

✅ **Enterprise Features**
- TypeScript support
- Error handling
- Security headers
- Performance optimized

✅ **Ready for Deployment**
- Vercel configuration
- Environment setup
- Build optimization

## 🔧 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌐 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variable: `CEREBRAS_API_KEY`
4. Deploy!

### Other Platforms
- **Netlify**: Use `npm run build`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Use App Platform

## 🎨 Features

- **AI-Powered**: Uses Cerebras AI for code generation
- **Real-time Streaming**: Watch code generate live
- **Live Preview**: See components in action
- **Modern UI**: Clean, professional interface
- **TypeScript**: Full type safety
- **Responsive**: Works on all devices

## 🔒 Security

- Environment variables for API keys
- Input validation
- Security headers
- Error handling without data exposure

## 📱 Usage

1. **Describe Your App**: Enter what you want to build
2. **Generate**: Click "Generate App" or press Cmd/Ctrl + Enter
3. **Watch Live**: See your component being created in real-time
4. **Preview**: Interact with your component
5. **Copy Code**: Use the generated code in your projects

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### API Issues
- Verify `CEREBRAS_API_KEY` is set correctly
- Check API key permissions
- Test with simple prompts first

### Development Issues
```bash
# Check TypeScript
npm run type-check

# Check linting
npm run lint

# Test build
npm run build
```

## 🎉 You're Ready!

Your RAJ AI APP BUILDER is now fully functional and ready to generate beautiful React components with AI!

---

**Built with ❤️ by RAJ**
