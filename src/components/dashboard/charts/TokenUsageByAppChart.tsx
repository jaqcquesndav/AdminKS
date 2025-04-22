import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface FeatureUsageData {
  name: string;
  value: number;
}

interface TokenUsageByAppChartProps {
  appData: FeatureUsageData[];
  title: string;
  loading?: boolean;
}

export const TokenUsageByAppChart = ({ 
  appData,
  title, 
  loading = false
}: TokenUsageByAppChartProps) => {
  const [timeFrame, setTimeFrame] = useState('year'); // 'month' ou 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const years = useMemo(() => {
    // Générer les 3 dernières années et l'année courante
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  }, []);

  const months = [
    { value: 0, label: 'Janvier' },
    { value: 1, label: 'Février' },
    { value: 2, label: 'Mars' },
    { value: 3, label: 'Avril' },
    { value: 4, label: 'Mai' },
    { value: 5, label: 'Juin' },
    { value: 6, label: 'Juillet' },
    { value: 7, label: 'Août' },
    { value: 8, label: 'Septembre' },
    { value: 9, label: 'Octobre' },
    { value: 10, label: 'Novembre' },
    { value: 11, label: 'Décembre' }
  ];

  // Simuler des données filtrées basées sur les sélections
  // Dans un cas réel, vous récupéreriez ces données depuis une API
  const filteredData = useMemo(() => {
    // Dans un cas réel, cette logique serait remplacée par un appel API avec les paramètres de filtre
    return appData;
  }, [appData, selectedYear, selectedMonth, timeFrame]);

  // Formater les valeurs pour une meilleure lisibilité
  const formatNumber = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Fonction pour obtenir une couleur basée sur le nom
  const getBarColor = (name: string): string => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe',
      '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
    ];
    
    // Utiliser un hash simple basé sur la chaîne pour obtenir un index de couleur
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex space-x-2">
          {/* Sélection du mode (année/mois) */}
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="month">Par mois</option>
            <option value="year">Par année</option>
          </select>
          
          {/* Sélection de l'année */}
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {/* Sélection du mois (visible uniquement si timeFrame === 'month') */}
          {timeFrame === 'month' && (
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip 
              formatter={(value: number) => [`${formatNumber(value)} tokens`, 'Utilisation']}
              labelFormatter={(label) => `Application: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Tokens utilisés" 
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              {...{ fill: "#8884d8" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};