'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  name: string;
  color: string;
  date: Date;
}

interface InsightsCardProps {
  filteredTransactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
}

export const InsightsCard = memo(({
  filteredTransactions,
  selectedMonth,
  selectedYear,
  monthNames
}: InsightsCardProps) => {
  const insights = useMemo(() => {
    if (!filteredTransactions.length) return [];

    const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const highestCategory = filteredTransactions.reduce((acc: Record<string, number>, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(highestCategory).sort((a, b) => b[1] - a[1])[0];

    return [
      `Total spent: ₹${total.toLocaleString()}`,
      topCategory ? `Highest spend: ${topCategory[0]} (₹${topCategory[1].toLocaleString()})` : '',
      `Number of transactions: ${filteredTransactions.length}`,
      total > 1000 ? `⚠️ Spending is on the higher side this month` : `✅ Spending looks controlled`
    ].filter(Boolean);
  }, [filteredTransactions]);

  return (
    <Card className="shadow-md border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          Insights
        </CardTitle>
        <CardDescription>
          Key highlights for {monthNames[selectedMonth - 1]} {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {insights.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm">{insight}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No insights available</p>
        )}
      </CardContent>
    </Card>
  );
});

InsightsCard.displayName = 'InsightsCard';
