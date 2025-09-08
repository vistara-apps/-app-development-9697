# WildSound AI 🐾

**Understand your pet's every bark and meow.**

WildSound AI is a comprehensive web application that helps pet owners interpret their pet's vocalizations and body language to better understand their needs and emotions using advanced AI analysis.

## 🚀 Features

### Core Features
- **🎵 Vocalization Analysis**: Upload audio clips of your pet's sounds and get AI-powered insights into their emotional state and intentions
- **📹 Body Language Decoder**: Analyze video clips to understand your pet's physical cues and body language
- **🎯 Activity & Enrichment Suggestions**: Get personalized activity recommendations based on your pet's breed, age, and observed behaviors

### Premium Features
- **📊 Advanced Analytics**: Detailed insights and trends about your pet's behavior
- **📈 Analysis History**: Track your pet's emotional patterns over time
- **🎮 Personalized Activity Plans**: AI-generated activities tailored to your pet's specific needs
- **📱 Multiple Pet Profiles**: Manage multiple pets in one account
- **📄 Export Reports**: Download detailed analysis reports

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Lucide React icons, Framer Motion animations
- **Backend**: Supabase (Authentication, Database, Storage)
- **AI Analysis**: OpenAI GPT-4 API
- **Payments**: Stripe
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/-app-development-9697.git
cd -app-development-9697
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Supabase Setup

#### Database Schema
Run the following SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  analysis_count INTEGER DEFAULT 0,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet profiles table
CREATE TABLE pet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(255),
  age VARCHAR(50),
  temperament TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  emotion VARCHAR(100),
  confidence INTEGER,
  intent VARCHAR(255),
  urgency VARCHAR(50),
  description TEXT,
  suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper function for incrementing analysis count
CREATE OR REPLACE FUNCTION increment_analysis_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET analysis_count = analysis_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
```

#### Storage Buckets
Create the following storage buckets in Supabase:
- `analyses` - for storing uploaded audio/video files

#### Row Level Security (RLS)
Enable RLS and create policies for secure data access:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Pet profiles policies
CREATE POLICY "Users can manage own pet profiles" ON pet_profiles FOR ALL USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users can manage own analyses" ON analyses FOR ALL USING (auth.uid() = user_id);
```

### 5. OpenAI Setup

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add the key to your `.env` file
4. Ensure you have sufficient credits for API usage

### 6. Stripe Setup (Optional)

1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Create product and price objects for your subscription plans
4. Update the price IDs in `src/lib/stripe.js`

### 7. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ActivitySuggestionCard.jsx
│   ├── AnalysisResult.jsx
│   ├── AudioUploader.jsx
│   ├── AuthModal.jsx
│   ├── Header.jsx
│   ├── PetProfile.jsx
│   ├── PremiumCTA.jsx
│   └── VideoUploader.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── lib/               # Utility libraries and services
│   ├── database.js    # Database operations
│   ├── openai.js      # OpenAI API integration
│   ├── stripe.js      # Stripe payment integration
│   └── supabase.js    # Supabase client configuration
├── pages/             # Page components
│   ├── AnalyzePage.jsx
│   ├── DashboardPage.jsx
│   ├── HomePage.jsx
│   └── PricingPage.jsx
├── App.jsx            # Main app component
├── index.css          # Global styles
└── main.jsx           # App entry point
```

## 🎨 Design System

The app uses a carefully crafted design system with:

- **Colors**: Dark theme with purple/blue accents
- **Typography**: Modern font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions

## 💳 Subscription Plans

### Free Tier
- 3 analyses per month
- Basic vocalization analysis
- Limited activity suggestions

### Basic Plan ($5/month)
- 50 analyses per month
- Full vocalization analysis
- Basic body language analysis
- Personalized activity suggestions
- Analysis history

### Premium Plan ($15/month)
- Unlimited analyses
- Advanced vocalization analysis
- Full body language analysis
- AI-powered activity plans
- Priority support
- Export analysis reports
- Multiple pet profiles

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Build the project locally
2. Upload the `dist` folder to Netlify
3. Configure environment variables

## 🧪 Testing

The application includes comprehensive error handling and fallback mechanisms:
- Mock data for development without API keys
- Graceful degradation when services are unavailable
- User-friendly error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/vistara-apps/-app-development-9697/issues) page
2. Create a new issue with detailed information
3. Contact support at support@wildsound.ai

## 🙏 Acknowledgments

- OpenAI for providing advanced AI capabilities
- Supabase for the excellent backend-as-a-service platform
- The React and Vite communities for amazing tools
- All pet owners who inspired this project

---

**Made with ❤️ for pet lovers everywhere** 🐕🐱
