import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface RevenueData {
  date: string;
  subscription?: number;
  token?: number;
  total?: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  title: string;
  loading?: boolean;
}

export const RevenueChart = ({ data, title, loading = false }: RevenueChartProps) => {
  // Format des dates pour l'affichage
  const formattedData = data.map(item => {
    const date = new Date(item.date);
    return {
      ...item,
      formattedDate: `${date.getMonth() + 1}/${date.getFullYear().toString().substring(2)}`
    };
  });

  // Regrouper les données par mois si nécessaire
  const groupedData: RevenueData[] = [];
  const dateMap: Record<string, RevenueData> = {};

  formattedData.forEach(item => {
    if (!dateMap[item.formattedDate]) {
      dateMap[item.formattedDate] = {
        date: item.formattedDate,
        subscription: 0,
        token: 0,
        total: 0
      };
      groupedData.push(dateMap[item.formattedDate]);
    }

    if (item.subscription) {
      dateMap[item.formattedDate].subscription! += item.subscription;
    }
    if (item.token) {
      dateMap[item.formattedDate].token! += item.token;
    }
    
    dateMap[item.formattedDate].total = 
      (dateMap[item.formattedDate].subscription || 0) + 
      (dateMap[item.formattedDate].token || 0);
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {loading ? (
        <div className="animate-pulse flex flex-col">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={groupedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="subscription"
                stackId="1"
                stroke="#3B82F6"
                fill="#93C5FD"
                name="Abonnements"
              />
              <Area
                type="monotone"
                dataKey="token"
                stackId="1"
                stroke="#10B981"
                fill="#6EE7B7"
                name="Tokens IA"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};