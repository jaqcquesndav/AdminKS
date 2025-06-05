import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
  DotProps
} from 'recharts';
import { useCurrencySettings } from '../../../hooks/useCurrencySettings';

interface TokenUsageData {
  date: string;
  used: number;
  cost: number;
  revenue: number;
  isPrediction?: boolean;
  formattedDate?: string;
}

interface FeatureUsageData {
  name: string;
  value: number;
}

interface TokenUsageChartProps {
  timeData: TokenUsageData[];
  featureData?: FeatureUsageData[];
  appData?: FeatureUsageData[];
  title: string;
  loading?: boolean;
  type?: 'line' | 'bar';
}

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export const TokenUsageChart = ({ 
  timeData, 
  featureData,
  appData,
  title, 
  loading = false,
  type = 'line' 
}: TokenUsageChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const { format: formatAmountInActiveCurrency } = useCurrencySettings();

  // Formater les valeurs pour une meilleure lisibilité
  const formatNumber = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Apply time frame filtering
  const filteredTimeData = useMemo(() => {
    const now = new Date();
    const cutoffDateValue = new Date(); // Changed to const
    
    switch(timeFrame) {
      case 'daily':
        cutoffDateValue.setDate(now.getDate() - 7);
        break;
      case 'weekly':
        cutoffDateValue.setDate(now.getDate() - 30);
        break;
      case 'monthly':
        cutoffDateValue.setMonth(now.getMonth() - 6);
        break;
      case 'quarterly':
        cutoffDateValue.setMonth(now.getMonth() - 12);
        break;
    }
    
    return timeData.filter(item => new Date(item.date) >= cutoffDateValue);
  }, [timeData, timeFrame]);

  // Formatage des données pour la série temporelle
  const formattedTimeData: TokenUsageData[] = useMemo(() => {
    return filteredTimeData.map(item => {
      const date = new Date(item.date);
      return {
        ...item,
        formattedDate: timeFrame === 'daily' 
          ? `${date.getDate()}/${date.getMonth() + 1}` 
          : timeFrame === 'weekly'
            ? `S${Math.ceil((date.getDate() + (new Date(date.getFullYear(), date.getMonth(), 1).getDay())) / 7)}/${date.getMonth() + 1}`
            : `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`
      };
    });
  }, [filteredTimeData, timeFrame]);

  // Calculate prediction data (simple linear regression)
  const predictionData: TokenUsageData[] | null = useMemo(() => {
    if (!showPrediction || formattedTimeData.length < 3) return null;
    
    const n = formattedTimeData.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = formattedTimeData.map(item => item.used);
    
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumXX += xValues[i] * xValues[i];
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const result: TokenUsageData[] = [...formattedTimeData];
    const predictionPoints = Math.ceil(n * 0.3);
    const lastDate = new Date(formattedTimeData[n - 1].date);
    const dayIncrement = timeFrame === 'daily' ? 1 : timeFrame === 'weekly' ? 7 : 30;
    
    for (let i = 1; i <= predictionPoints; i++) {
      const predictedValue = slope * (n + i - 1) + intercept;
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + (dayIncrement * i));
      
      result.push({
        date: newDate.toISOString(),
        formattedDate: timeFrame === 'daily' 
          ? `${newDate.getDate()}/${newDate.getMonth() + 1}` 
          : timeFrame === 'weekly'
            ? `S${Math.ceil((newDate.getDate() + (new Date(newDate.getFullYear(), newDate.getMonth(), 1).getDay())) / 7)}/${newDate.getMonth() + 1}`
            : `${newDate.getMonth() + 1}/${newDate.getFullYear().toString().slice(2)}`,
        used: predictedValue,
        cost: formattedTimeData[n - 1].cost * (predictedValue / formattedTimeData[n - 1].used),
        revenue: formattedTimeData[n - 1].revenue * (predictedValue / formattedTimeData[n - 1].used),
        isPrediction: true
      });
    }
    return result;
  }, [formattedTimeData, showPrediction, timeFrame]);

  // Calculate optimization recommendations
  const optimizationRecommendations = useMemo(() => {
    if (!featureData || featureData.length < 2) return [];
    
    // Sort features by usage
    const sortedFeatures = [...featureData].sort((a, b) => b.value - a.value);
    
    // Find the top consuming features
    const topFeatures = sortedFeatures.slice(0, 2);
    
    // Calculate total usage
    const totalUsage = featureData.reduce((sum, feature) => sum + feature.value, 0);
    
    // Generate recommendations
    return topFeatures.map(feature => {
      const percentage = (feature.value / totalUsage * 100).toFixed(1);
      return {
        feature: feature.name,
        usage: feature.value,
        percentage,
        recommendation: `Consider optimizing the '${feature.name}' feature which consumes ${percentage}% of total tokens.`
      };
    });
  }, [featureData]);

  // Rendu du graphique en fonction du type
  const renderTimeSeriesChart = () => {
    const dataToUse = showPrediction && predictionData ? predictionData : formattedTimeData;
    const predictionStartIndex = formattedTimeData.length > 0 ? formattedTimeData.length -1 : 0;
    
    const lineDotRenderer = (props: DotProps & { payload?: TokenUsageData }) => {
      const { cx, cy, stroke, payload } = props;
      if (payload?.isPrediction) {
        return <g />; // Return an empty SVG group instead of null
      }
      return <circle cx={cx as number} cy={cy as number} r={4} stroke={stroke} fill="#fff" strokeWidth={2} />;
    };

    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataToUse}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatNumber}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatAmountInActiveCurrency} // Ensure this is the intended formatter
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string, item: { payload?: TokenUsageData }) => { // item.payload is now optional
                const entryPayload = item.payload;
                if (!entryPayload) { // Handle cases where payload might be undefined
                  return [value.toString(), name];
                }
                
                const isPrediction = entryPayload.isPrediction;
                
                switch(name) {
                  case 'Tokens utilisés': 
                  case 'used': 
                    return [formatNumber(value as number), `Tokens utilisés${isPrediction ? ' (prévu)' : ''}`];
                  case 'Coût': 
                  case 'cost': 
                    return [formatAmountInActiveCurrency(value as number), `Coût${isPrediction ? ' (prévu)' : ''}`];
                  case 'Revenu': 
                  case 'revenue': 
                    return [formatAmountInActiveCurrency(value as number), `Revenu${isPrediction ? ' (prévu)' : ''}`];
                  default: return [value.toString(), name];
                }
              }}
            />
            <Legend />
            {showPrediction && predictionData && predictionData.length > predictionStartIndex && predictionStartIndex >= 0 && dataToUse[predictionStartIndex] && (
              <ReferenceLine 
                x={dataToUse[predictionStartIndex].formattedDate} 
                stroke="#888" 
                strokeDasharray="3 3" 
                label={{ value: 'Prédiction', position: 'top', fill: '#888' }} 
              />
            )}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="used" 
              stroke="#8884d8" 
              name="Tokens utilisés"
              strokeWidth={2}
              dot={lineDotRenderer} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cost" 
              stroke="#ff7300" 
              name="Coût"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#82ca9d" 
              name="Revenu"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else { 
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataToUse}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              tickFormatter={formatNumber}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number, name: string, item: { payload?: TokenUsageData }) => { // item.payload is now optional
                const entryPayload = item.payload;
                if (!entryPayload) { // Handle cases where payload might be undefined
                  return [value.toString(), name];
                }
                const isPrediction = entryPayload.isPrediction;
                if (name === 'Tokens utilisés' || name === 'used') {
                    return [formatNumber(value as number), `Tokens utilisés${isPrediction ? ' (prévu)' : ''}`];
                }
                return [value.toString(), name]; 
              }}
            />
            <Legend />
            <Bar dataKey="used" name="Tokens utilisés" >
              {dataToUse.map((entry, index) => (
                <rect key={`bar-${index}`} fill={entry.isPrediction ? 'rgba(136, 132, 216, 0.5)' : '#8884d8'} />
              ))}
            </Bar>
            {showPrediction && predictionData && predictionData.length > predictionStartIndex && predictionStartIndex >=0 && dataToUse[predictionStartIndex] && (
              <ReferenceLine 
                x={dataToUse[predictionStartIndex].formattedDate} 
                stroke="#888" 
                strokeDasharray="3 3" 
                label={{ value: 'Prédiction', position: 'top', fill: '#888' }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  // Graphique par fonctionnalité
  const renderFeatureChart = () => {
    if (!featureData) return null;
    
    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Utilisation par fonctionnalité</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tickFormatter={formatNumber}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value) => [formatNumber(value as number), 'Tokens']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Graphique par application
  const renderAppChart = () => {
    if (!appData) return null;
    
    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2">Utilisation par application</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={appData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tickFormatter={formatNumber}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value) => [formatNumber(value as number), 'Tokens']} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Render optimization recommendations
  const renderOptimizationRecommendations = () => {
    if (optimizationRecommendations.length === 0) return null;
    
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Recommendations d'optimisation</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {optimizationRecommendations.map((rec, index) => (
            <li key={index}>{rec.recommendation}</li>
          ))}
        </ul>
      </div>
    );
  };
    return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium dark:text-white">{title}</h3>
        <div className="flex space-x-2">
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button 
              className={`px-2 py-1 text-xs ${timeFrame === 'daily' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeFrame('daily')}
            >
              7J
            </button>
            <button 
              className={`px-2 py-1 text-xs ${timeFrame === 'weekly' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeFrame('weekly')}
            >
              30J
            </button>
            <button 
              className={`px-2 py-1 text-xs ${timeFrame === 'monthly' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeFrame('monthly')}
            >
              6M
            </button>
            <button 
              className={`px-2 py-1 text-xs ${timeFrame === 'quarterly' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              onClick={() => setTimeFrame('quarterly')}
            >
              1A
            </button>
          </div>
          <button 
            className={`px-2 py-1 text-xs border ${showPrediction ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'} rounded-md`}
            onClick={() => setShowPrediction(!showPrediction)}
          >
            {showPrediction ? 'Cacher prédiction' : 'Montrer prédiction'}
          </button>
        </div>
      </div>
        {loading ? (
        <div className="animate-pulse flex flex-col">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5 mb-2"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ) : (
        <>
          <div className="h-64">
            {renderTimeSeriesChart()}
          </div>
          {renderFeatureChart()}
          {renderAppChart()}
          {renderOptimizationRecommendations()}
        </>
      )}
    </div>
  );
};