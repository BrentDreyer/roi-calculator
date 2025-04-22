import { useState } from 'react';

type Results = {
  currentReturn: number;
  projectedReturn: number;
  improvement: number;
  marketShareImpact: number;
  currentROI: number;
  projectedROI: number;
  aiImplementationCost: number;
  monthlyAICost: number;
  firstYearAICost: number;
  implementationTime: number;
  strategies: {
    title: string;
    description: string;
    impact: string;
    timeframe: string;
    icon: JSX.Element;
  }[];
};
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, ArrowUpRight, Zap, BarChart2, Target, TrendingUp, UserPlus } from 'lucide-react';

const AIMarketingCalculator = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [stage, setStage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    companySize: '',
    annualRevenue: 1000000,
    marketingBudget: 100000,
    aiAdoption: 'moderate',
    primaryGoal: 'market_share',
    includeAICosts: true
  });
  
  const [results, setResults] = useState<Results | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'annualRevenue' || name === 'marketingBudget' ? 
        parseFloat(value) || 0 : value
    });
  };

  const calculateROI = () => {
    // Base ROI ranges by industry
    const industryROI: Record<string, { min: number; max: number; avg: number }> = {
  'technology': { min: 2.8, max: 8.5, avg: 5.2 },
  'retail': { min: 1.9, max: 6.2, avg: 3.8 },
      'healthcare': { min: 1.8, max: 5.5, avg: 3.4 },
      'financial': { min: 2.1, max: 7.8, avg: 4.3 },
      'manufacturing': { min: 1.6, max: 4.8, avg: 2.9 },
      'other': { min: 1.5, max: 6.0, avg: 3.5 }
    };
    
    // Company size factors
    const sizeFactor: Record<string, number> = {
  'small': 0.85,
  'medium': 1.0,
      'large': 1.15,
      'enterprise': 1.25
    };
    
    // AI impact factors
    const aiImpact: Record<string, { current: number; potential: number }> = {
  'minimal': { current: 1.0, potential: 1.35 },
  'moderate': { current: 1.2, potential: 1.55 },
      'advanced': { current: 1.4, potential: 1.7 }
    };
    
    // Goal multipliers
    const goalMultiplier: Record<string, number> = {
  'sales': 1.15,
  'market_share': 1.25,
      'customer_retention': 1.3,
      'brand_awareness': 0.85
    };
    
    // Calculate base ROI for industry
    const industry = formData.industry || 'other';
    const baseROI = industryROI[industry].avg;
    
    // Apply size factor
    const companySize = formData.companySize || 'medium';
    const sizeAdjustedROI = baseROI * sizeFactor[companySize];
    
    // Current and potential ROI with AI
    const currentROI = sizeAdjustedROI * aiImpact[formData.aiAdoption].current;
    const potentialROI = sizeAdjustedROI * aiImpact[formData.aiAdoption].potential * goalMultiplier[formData.primaryGoal];
    
    // Calculate AI implementation costs
    const aiCostBase = {
      'small': 50000,
      'medium': 120000,
      'large': 250000,
      'enterprise': 500000
    };
    
    const aiAdoptionDiscount = {
      'minimal': 1.0,
      'moderate': 0.7,
      'advanced': 0.4
    };
    
    // Implementation timeline in months
    const implementationTime = {
      'small': 3,
      'medium': 4,
      'large': 6,
      'enterprise': 9
    };
    
    // Calculate AI costs
    const aiImplementationCost = formData.includeAICosts ? 
      aiCostBase[companySize] * aiAdoptionDiscount[formData.aiAdoption] : 0;
    
    const monthlyAICost = aiImplementationCost / 36; // 3 year amortization
    const firstYearAICost = monthlyAICost * (12 - implementationTime[companySize]);
    
    // Financial calculations
    const currentReturn = formData.marketingBudget * currentROI;
    const potentialGrossReturn = formData.marketingBudget * potentialROI;
    const potentialNetReturn = potentialGrossReturn - firstYearAICost;
    
    // Improvement percentage
    const improvement = ((potentialNetReturn - currentReturn) / currentReturn) * 100;
    
    // Market share impact
    const marketShareImpactBase: Record<string, number> = {
  'technology': 0.18,
  'retail': 0.15,
      'healthcare': 0.12,
      'financial': 0.11, 
      'manufacturing': 0.13,
      'other': 0.14
    };
    
    const sizeMSFactor = {
      'small': 1.4,
      'medium': 1.0,
      'large': 0.7,
      'enterprise': 0.5
    };
    
    const marketShareImpact = improvement * marketShareImpactBase[industry] * sizeMSFactor[companySize];
    
    // Set results
    setResults({
      currentReturn,
      projectedReturn: potentialNetReturn,
      improvement,
      marketShareImpact,
      currentROI,
      projectedROI: potentialROI,
      aiImplementationCost,
      monthlyAICost,
      firstYearAICost,
      implementationTime: implementationTime[companySize],
      strategies: generateStrategies(formData)
    });
    
    setStage(2);
  };
  
  const generateStrategies = (data: any) => {
    let strategies = [];
    
    // Add goal-based strategies
    if (data.primaryGoal === 'sales' || data.primaryGoal === 'market_share') {
      strategies.push({
        title: "AI-Powered Predictive Lead Scoring",
        description: "Implement machine learning to identify high-potential leads most likely to convert.",
        impact: "High",
        timeframe: "Medium",
        icon: <Target className="text-blue-600" />
      });
      
      strategies.push({
        title: "Competitive Intelligence Dashboard",
        description: "Deploy AI tools to monitor competitor positioning and pricing in real-time.",
        impact: "High", 
        timeframe: "Medium",
        icon: <BarChart2 className="text-purple-600" />
      });
    }
    
    if (data.primaryGoal === 'market_share') {
      strategies.push({
        title: "Market Expansion Analyzer",
        description: "Use AI to identify untapped market segments with highest growth potential.",
        impact: "Very High",
        timeframe: "Long",
        icon: <TrendingUp className="text-green-600" />
      });
    }
    
    if (data.industry === 'financial' || data.industry === 'healthcare') {
      strategies.push({
        title: "Personalized Customer Journey Orchestration",
        description: "Deploy AI to create individualized customer experiences across all touchpoints.",
        impact: "High",
        timeframe: "Medium",
        icon: <UserPlus className="text-indigo-600" />
      });
    }
    
    // Universal strategy
    strategies.push({
      title: "Integrated Marketing Attribution & Optimization",
      description: "Implement advanced attribution modeling to understand true ROI of each channel.",
      impact: "Very High",
      timeframe: "Medium",
      icon: <Zap className="text-yellow-600" />
    });
    
    return strategies;
  };
  
  const resetCalculator = () => {
    setStage(1);
    setResults(null);
    setShowDetails(false);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const chartData = results ? [
    { name: 'Current ROI', value: parseFloat(results.currentROI.toFixed(1)) },
    { name: 'AI-Enhanced ROI', value: parseFloat(results.projectedROI.toFixed(1)) }
  ] : [];
  
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h1 className="text-2xl font-bold">CEO's AI-Powered Marketing ROI Calculator</h1>
        <p className="opacity-90">Discover how AI-enhanced marketing strategies can drive sales and market share growth</p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'calculator' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('calculator')}
          >
            ROI Calculator
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('about')}
          >
            About Our Services
          </button>
        </nav>
      </div>
      
      {activeTab === 'calculator' && (
        <div className="p-6">
          {stage === 1 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Enter Your Company Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <select 
                    name="industry" 
                    value={formData.industry} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="retail">Retail & E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="financial">Financial Services</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <select 
                    name="companySize" 
                    value={formData.companySize} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                  >
                    <option value="">Select company size</option>
                    <option value="small">Small (1-50 employees)</option>
                    <option value="medium">Medium (51-500 employees)</option>
                    <option value="large">Large (501-5000 employees)</option>
                    <option value="enterprise">Enterprise (5000+ employees)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>
                  <input 
                    type="range" 
                    name="annualRevenue" 
                    min="100000" 
                    max="100000000" 
                    step="100000" 
                    value={formData.annualRevenue} 
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-center text-gray-700 mt-1">{formatCurrency(formData.annualRevenue)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Marketing Budget</label>
                  <input 
                    type="range" 
                    name="marketingBudget" 
                    min="10000" 
                    max={formData.annualRevenue * 0.3} 
                    step="10000" 
                    value={formData.marketingBudget} 
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-center text-gray-700 mt-1">
                    {formatCurrency(formData.marketingBudget)} 
                    ({((formData.marketingBudget / formData.annualRevenue) * 100).toFixed(1)}% of revenue)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current AI Adoption in Marketing</label>
                  <select 
                    name="aiAdoption" 
                    value={formData.aiAdoption} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                  >
                    <option value="minimal">Minimal (Basic automation only)</option>
                    <option value="moderate">Moderate (Some AI tools deployed)</option>
                    <option value="advanced">Advanced (Extensive AI integration)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Marketing Goal</label>
                  <select 
                    name="primaryGoal" 
                    value={formData.primaryGoal} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                  >
                    <option value="sales">Drive Sales Growth</option>
                    <option value="market_share">Increase Market Share</option>
                    <option value="customer_retention">Improve Customer Retention</option>
                    <option value="brand_awareness">Enhance Brand Awareness</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      id="includeAICosts"
                      name="includeAICosts"
                      type="checkbox"
                      checked={formData.includeAICosts}
                      onChange={e => setFormData({...formData, includeAICosts: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="includeAICosts" className="ml-2 block text-sm text-gray-700">
                      Include AI implementation and staffing costs in ROI calculation
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={calculateROI}
                    disabled={!formData.industry || !formData.companySize}
                    className={`w-full flex items-center justify-center px-6 py-3 border rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 ${(!formData.industry || !formData.companySize) ? 'opacity-50' : ''}`}
                  >
                    Calculate Potential ROI <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {stage === 2 && results && (
            <div>
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Your AI-Enhanced Marketing Potential</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Current Estimated Marketing Return</p>
                      <p className="text-3xl font-bold text-gray-800">{formatCurrency(results.currentReturn)}</p>
                      <p className="text-sm text-gray-500">ROI: {results.currentROI.toFixed(1)}x</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500">Projected Return with AI-Enhanced Marketing</p>
                      <p className="text-3xl font-bold text-blue-600">{formatCurrency(results.projectedReturn)}</p>
                      <p className="text-sm text-blue-600">ROI: {results.projectedROI.toFixed(1)}x</p>
                      {formData.includeAICosts && (
                        <p className="text-xs text-gray-500 mt-1">
                          (After AI implementation costs: {formatCurrency(results.firstYearAICost)})
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Potential Improvement</p>
                          <p className="text-2xl font-bold text-green-600">+{results.improvement.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Est. Market Share Impact</p>
                          <p className="text-2xl font-bold text-indigo-600">+{results.marketShareImpact.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                    
                    {formData.includeAICosts && (
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">AI Implementation Details</h4>
                          <button 
                            onClick={() => setShowDetails(!showDetails)}
                            className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {showDetails ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-gray-500">Implementation Cost:</p>
                            <p className="font-medium">{formatCurrency(results.aiImplementationCost)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Cost:</p>
                            <p className="font-medium">{formatCurrency(results.monthlyAICost)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Implementation Time:</p>
                            <p className="font-medium">{results.implementationTime} months</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amortization Period:</p>
                            <p className="font-medium">3 years</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex flex-col h-64">
                      <ResponsiveContainer width="100%" height="70%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}x`, 'ROI']} />
                          <Bar dataKey="value" name="ROI Multiplier" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                      
                      {formData.includeAICosts && (
                        <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm border border-blue-100">
                          <p className="font-medium text-blue-800 mb-1">About AI Implementation Costs</p>
                          <p className="text-gray-700">
                            These costs include AI technology, integration, customization, and necessary staff to manage the solution. Implementation time reflects the period before you'll see results.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {showDetails && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Investment Breakdown</h3>
                  <p className="text-gray-600 mb-4">
                    Here's what the {formatCurrency(results.aiImplementationCost)} AI implementation typically includes for a {formData.companySize} company in the {formData.industry} industry:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">1. AI-Powered Predictive Lead Scoring</h4>
                      <ul className="text-gray-600 text-sm ml-5 list-disc space-y-1">
                        <li>Enterprise marketing platform with AI capabilities (HubSpot, Marketo): <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '3,600-8,000' : formData.companySize === 'medium' ? '8,000-24,000' : '24,000-60,000'}/year</span></li>
                        <li>Custom machine learning model development and training: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '15,000-20,000' : formData.companySize === 'medium' ? '20,000-35,000' : '35,000-80,000'}</span></li>
                        <li>CRM integration and data pipeline setup: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '2,500-5,000' : formData.companySize === 'medium' ? '5,000-12,000' : '12,000-25,000'}</span></li>
                        <li>Historical data preparation and cleaning: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '5,000-8,000' : formData.companySize === 'medium' ? '8,000-15,000' : '15,000-30,000'}</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">2. Competitive Intelligence Dashboard</h4>
                      <ul className="text-gray-600 text-sm ml-5 list-disc space-y-1">
                        <li>AI monitoring tools (e.g., Crayon, Kompyte, Klue): <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '6,000-12,000' : formData.companySize === 'medium' ? '12,000-24,000' : '24,000-48,000'}/year</span></li>
                        <li>Custom competitive dashboard development: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '3,000-5,000' : formData.companySize === 'medium' ? '5,000-10,000' : '10,000-25,000'}</span></li>
                        <li>Data source integrations and automated collection: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '2,000-4,000' : formData.companySize === 'medium' ? '4,000-8,000' : '8,000-18,000'}</span></li>
                        <li>Alert system configuration and optimization: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '1,500-3,000' : formData.companySize === 'medium' ? '3,000-6,000' : '6,000-12,000'}</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">3. Market Expansion Analysis</h4>
                      <ul className="text-gray-600 text-sm ml-5 list-disc space-y-1">
                        <li>Market intelligence platforms with API access: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '3,000-6,000' : formData.companySize === 'medium' ? '6,000-15,000' : '15,000-36,000'}/year</span></li>
                        <li>Custom territory/segment opportunity scoring algorithm: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '8,000-12,000' : formData.companySize === 'medium' ? '12,000-22,000' : '22,000-45,000'}</span></li>
                        <li>Industry and regional market data acquisition: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '1,500-4,000' : formData.companySize === 'medium' ? '4,000-12,000' : '12,000-25,000'}</span></li>
                        <li>Opportunity visualization and reporting system: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '2,500-5,000' : formData.companySize === 'medium' ? '5,000-10,000' : '10,000-18,000'}</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">4. Integrated Marketing Attribution</h4>
                      <ul className="text-gray-600 text-sm ml-5 list-disc space-y-1">
                        <li>Multi-touch attribution modeling software: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '6,000-12,000' : formData.companySize === 'medium' ? '12,000-24,000' : '24,000-60,000'}/year</span></li>
                        <li>Integration with advertising and marketing platforms: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '1,500-3,000' : formData.companySize === 'medium' ? '3,000-8,000' : '8,000-20,000'}</span></li>
                        <li>Custom reporting dashboard development: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '3,000-5,000' : formData.companySize === 'medium' ? '5,000-12,000' : '12,000-25,000'}</span></li>
                        <li>Budget optimization algorithm setup: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '2,500-5,000' : formData.companySize === 'medium' ? '5,000-10,000' : '10,000-22,000'}</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Implementation Resources</h4>
                      <ul className="text-gray-600 text-sm ml-5 list-disc space-y-1">
                        <li>Fractional marketing technologist: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '45,000/year (0.5 FTE)' : formData.companySize === 'medium' ? '90,000/year (1 FTE)' : '180,000-315,000/year (2-3.5 FTE)'}</span></li>
                        <li>Team training and enablement: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '2,000-4,000' : formData.companySize === 'medium' ? '4,000-8,000' : '8,000-20,000'}</span></li>
                        <li>Data architecture consulting: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '3,000-6,000' : formData.companySize === 'medium' ? '6,000-15,000' : '15,000-35,000'}</span></li>
                        <li>Ongoing optimization and support: <span className="text-blue-700 font-medium">${formData.companySize === 'small' ? '800-1,500' : formData.companySize === 'medium' ? '1,500-3,500' : '3,500-8,000'}/month</span></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="text-sm text-gray-700 italic">
                      <span className="font-medium text-blue-800">Note:</span> This represents a typical investment breakdown. A personalized consultation would help determine the specific tools and approaches best suited for your unique business needs.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended AI-Enhanced Marketing Strategies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.strategies.map((strategy, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {strategy.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{strategy.title}</h4>
                          <p className="text-gray-600 mt-1 text-sm">{strategy.description}</p>
                          <div className="flex items-center mt-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${strategy.impact === 'Very High' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {strategy.impact} Impact
                            </span>
                            <span className="px-2 py-1 mx-2 text-xs font-medium rounded bg-gray-100 text-gray-800">
                              {strategy.timeframe} Term
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
                <p className="text-gray-600 mb-4">Ready to implement these AI-enhanced marketing strategies and achieve your growth targets? Our team of AI and marketing experts can help you develop a customized implementation plan.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex items-center justify-center px-6 py-3 border rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Request Consultation <ArrowUpRight className="ml-2 w-4 h-4" />
                  </button>
                  <button 
                    onClick={resetCalculator}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'about' && (
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Help CEOs Drive Sales & Market Share Growth</h2>
            <p className="text-gray-600 mb-6">Our AI and marketing consulting services are specifically designed to address the #1 challenge CEOs face today: leveraging marketing to drive measurable sales growth and market share expansion.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI-Enhanced Strategy Development</h3>
                <p className="text-gray-600">We develop marketing strategies powered by advanced AI capabilities that directly impact your bottom line, focusing on measurable sales growth.</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Marketing-to-Sales Alignment</h3>
                <p className="text-gray-600">We implement AI-powered systems that bridge the gap between marketing activities and sales outcomes, creating seamless coordination.</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Advanced Attribution Modeling</h3>
                <p className="text-gray-600">Our proprietary AI attribution models show exactly which marketing investments generate real sales, enabling intelligent budget allocation.</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Competitive Intelligence Systems</h3>
                <p className="text-gray-600">We build AI-powered competitive monitoring platforms that reveal market opportunities and help you outmaneuver competitors in real-time.</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Approach</h3>
              <p className="text-gray-700 mb-4">Unlike traditional consultancies and agencies that focus on vanity metrics, our consulting approach centers on directly tying marketing initiatives to revenue growth and market shareâ€”the metrics CEOs care about most.</p>
              <p className="text-gray-700">We combine deep marketing expertise with cutting-edge AI capabilities to create strategies that deliver measurable business impact, not just marketing outputs.</p>
            </div>
            
            <div className="text-center">
              <button 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = "mailto:BrentJDreyer@DataEM.com?subject=Schedule%20a%20Strategy%20Session"}
              >
                Schedule a Strategy Session
              </button>
              <p className="mt-2 text-sm text-gray-500">Discover how our AI-enhanced marketing approaches can help you achieve your growth targets</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-sm text-gray-500">
        Â© 2025 Brent Dreyer â€¢ DataEM.com - AI Marketing Consultancy â€¢ Helping CEOs Drive Sales & Market Share Through AI-Enhanced Marketing
      </div>
    </div>
  );
};

const App = AIMarketingCalculator;
export default App;
