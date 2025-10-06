# Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `CEREBRAS_API_KEY`
   - Deploy!

### Option 2: Netlify

1. **Build Configuration**
   ```bash
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Add environment variable: `CEREBRAS_API_KEY`
   - Deploy!

### Option 3: Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variable: `CEREBRAS_API_KEY`
   - Deploy automatically!

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository
   - Select "Next.js" as source type
   - Add environment variable: `CEREBRAS_API_KEY`
   - Deploy!

## 🔧 Environment Setup

### Required Environment Variables

```bash
CEREBRAS_API_KEY=your_cerebras_api_key_here
```

### Local Development

1. **Create `.env.local`**
   ```bash
   echo "CEREBRAS_API_KEY=your_key_here" > .env.local
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🏗 Build Process

### Production Build

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Build Verification

```bash
# Test build locally
npm run build
npm start

# Verify on http://localhost:3000
```

## 🚀 Performance Optimization

### Next.js Optimizations

- **Image Optimization**: Automatic with Next.js Image component
- **Code Splitting**: Automatic with dynamic imports
- **Static Generation**: Where possible
- **Edge Runtime**: API routes use edge runtime for speed

### CDN Configuration

```javascript
// next.config.js optimizations
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  // Security headers included
}
```

## 🔒 Security Considerations

### Environment Variables

- Never commit API keys to version control
- Use platform-specific secret management
- Rotate keys regularly

### Security Headers

The application includes:
- HSTS headers
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### API Security

- Input validation on all endpoints
- Rate limiting (implement if needed)
- Error handling without data exposure

## 📊 Monitoring

### Health Checks

The application includes:
- API endpoint health monitoring
- Error logging
- Performance metrics

### Logging

```bash
# View logs on Vercel
vercel logs

# View logs on Railway
railway logs

# View logs on Netlify
netlify logs
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **API Key Issues**
   - Verify environment variable is set
   - Check API key validity
   - Ensure proper permissions

3. **Deployment Issues**
   - Check build logs
   - Verify environment variables
   - Test locally first

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check environment variables
console.log(process.env.CEREBRAS_API_KEY)
```

## 📈 Scaling

### Horizontal Scaling

- Use platform auto-scaling features
- Implement load balancing
- Consider CDN for static assets

### Vertical Scaling

- Monitor memory usage
- Optimize bundle size
- Use edge functions where possible

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] API key is valid and has proper permissions
- [ ] Build passes without errors
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Local testing completed
- [ ] Security headers configured
- [ ] Performance optimizations applied

## 🎯 Post-deployment

1. **Test the live application**
2. **Verify API integration**
3. **Check error monitoring**
4. **Monitor performance metrics**
5. **Set up alerts for failures**

---

For additional support, check the main README.md or create an issue in the repository.
