'use client';

import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Edit3, Save, X } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  name: string;
  color: string;
  date: Date;
  description?: string;
}

interface RecentTransactionsProps {
  recentTransactions: Transaction[];
  filteredTransactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  monthNames: string[];
  onUpdate?: (updated: Transaction) => void;
}

export const RecentTransactions = memo(({
  recentTransactions,
  filteredTransactions,
  selectedMonth,
  selectedYear,
  monthNames,
  onUpdate
}: RecentTransactionsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const userData = useSelector((state: any) => state.auth?.userData);
  const userId = userData?.user?._id;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  return (
    <Card className="shadow-md border border-border hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest transactions for {monthNames[selectedMonth - 1]} {selectedYear}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4 mt-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0" 
                    style={{ backgroundColor: `${transaction.color}30` }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: transaction.color }}
                    />
                  </div>
                  <div>
                    {editingId === transaction._id ? (
                      <div className="flex flex-col">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-background border-input rounded px-2 py-1 text-sm" />
                        <input value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="bg-background border-input rounded px-2 py-1 text-sm mt-1" />
                        <div className="flex gap-2 mt-2">
                          <button onClick={async () => {
                            if (isSaving) return;
                            setIsSaving(true);
                            try {
                              const payload: any = { id: transaction._id, name: editName, amount: editAmount };
                              if (userId) payload.user = userId;
                              const res = await axios.patch('/api/update-transaction', payload);
                                  if (res.data?.success) {
                                    toast({ title: 'Updated', description: 'Transaction updated', variant: 'default' });
                                    setEditingId(null);
                                    const updatedTx = res.data.data;
                                    if (onUpdate) onUpdate(updatedTx as Transaction);
                                    else router.refresh();
                                  } else {
                                toast({ title: 'Error', description: res.data?.message || 'Failed to update', variant: 'destructive' });
                              }
                            } catch (err) {
                              toast({ title: 'Error', description: 'Failed to update transaction', variant: 'destructive' });
                            } finally {
                              setIsSaving(false);
                            }
                          }} className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded flex items-center gap-2">
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">{transaction.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-medium ${
                    transaction.type === 'Income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </div>
                  <button onClick={() => {
                    setEditingId(transaction._id);
                    setEditName(transaction.name);
                    setEditAmount(String(transaction.amount));
                  }} className="p-1 rounded hover:bg-accent/40">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredTransactions.length > 5 && (
              <div className="pt-4 text-center">
                <Link 
                  href="/history" 
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View all transactions for {monthNames[selectedMonth - 1]}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[260px] p-6 bg-accent/30 rounded-lg">
            <Clock className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-center mb-2">No transactions for {monthNames[selectedMonth - 1]} {selectedYear}</p>
            <Link href="/add-transaction" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Add your first transaction
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentTransactions.displayName = 'RecentTransactions';