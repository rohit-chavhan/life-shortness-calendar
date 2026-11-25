# Deployment Instructions for Vercel

## Prerequisites

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (you can sign up with GitHub)
3. Git installed on your computer

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   # Initialize git repository (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit the changes
   git commit -m "Initial commit: Life in Weeks app"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/life-calendar.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository (`life-calendar`)
   - Vercel will auto-detect Next.js settings:
     - Framework Preset: **Next.js**
     - Root Directory: `./`
     - Build Command: `next build` (auto-detected)
     - Output Directory: `.next` (auto-detected)
   - Click **"Deploy"**

3. **Wait for deployment:**
   - Vercel will build and deploy your app (usually takes 1-2 minutes)
   - You'll get a live URL like: `https://life-calendar-username.vercel.app`

4. **Done!** 
   - Your app is now live and accessible worldwide
   - Every push to your `main` branch will automatically trigger a new deployment

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `life-calendar`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### Custom Domain (Optional)

1. Go to your project on Vercel Dashboard
2. Click on **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `mylifeinweeks.com`)
4. Follow Vercel's instructions to update your DNS records

### Environment Variables (Not needed for this app)

This app doesn't require any environment variables since it uses localStorage for data persistence.

## Automatic Deployments

Once connected to GitHub:
- **Production deployments:** Every push to `main` branch
- **Preview deployments:** Every push to other branches or pull requests
- Each deployment gets a unique URL for testing

## Troubleshooting

### Build Fails

If your build fails, check:
1. All dependencies are in `package.json`
2. Run `npm run build` locally to test
3. Check the build logs on Vercel for specific errors

### App Not Working

1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Clear browser cache and localStorage if needed

### Performance Issues

Vercel provides:
- Automatic CDN distribution
- Edge caching
- Image optimization
- Automatic HTTPS

## Monitoring

After deployment, Vercel provides:
- **Analytics:** View page views and performance
- **Logs:** Real-time function and build logs  
- **Speed Insights:** Core Web Vitals monitoring

Access these from your project dashboard on Vercel.

## Cost

This project uses:
- Static site generation (SSG)
- Client-side rendering
- No API routes or server functions

**Result:** Completely FREE on Vercel's Hobby plan!

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Discord](https://vercel.com/discord)
