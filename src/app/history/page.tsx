'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Delete } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectSection, SelectItem } from "@nextui-org/select";

export const filterOptions = [
  { key: "default", label: "Default" },
  { key: "expense", label: "Expenses" },
  { key: "investment", label: "Investments" },
  { key: "savings", label: "Savings" },
];

interface Transact {
  _id: string;
  name: string;
  amount: number;
  color?: string;
}

interface CachedData {
  transactions: Transact[];
  timestamp: number;
}

export default function List() {
  const [transactions, setTransactions] = useState<Transact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const saveToCache = (transactions: Transact[]) => {
    const cacheData: CachedData = {
      transactions,
      timestamp: Date.now()
    };
    localStorage.setItem('transactionCache', JSON.stringify(cacheData));
  };

  const getFromCache = (): Transact[] | null => {
    const cachedData = localStorage.getItem('transactionCache');
    if (!cachedData) return null;

    const { transactions, timestamp }: CachedData = JSON.parse(cachedData);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem('transactionCache');
      return null;
    }

    return transactions;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionId = e.currentTarget.id;
    setLoading(true);

    try {
      const del = await axios.delete(`/api/delete-transaction/${transactionId}`);
      if (del.status === 200) {
        const updatedTransactions = transactions.filter(t => t._id !== transactionId);
        setTransactions(updatedTransactions);
        saveToCache(updatedTransactions);

        toast({
          title: 'Success',
          description: "Transaction Deleted",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: 'Failed',
        description: "Transaction not Deleted",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    const storedSession = localStorage.getItem('session');
    if (!storedSession) {
      toast({
        title: 'Error',
        description: "No session found. Please log in.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { user } = JSON.parse(storedSession);
      const userId = user._id;
      const response = await axios.post('/api/get-transaction', { user: userId });
      const fetchedTransactions = response.data.data;
      setTransactions(fetchedTransactions);
      saveToCache(fetchedTransactions);
    } catch (error) {
      toast({
        title: 'Error',
        description: "Failed to fetch transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedTransactions = getFromCache();

    if (cachedTransactions) {
      setTransactions(cachedTransactions);
      setLoading(false);
      // Fetch in background to update cache
      fetchTransactions();
    } else {
      fetchTransactions();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4 mt-8 py-10">
        <Skeleton className="h-[100px] w-[800px] rounded-xl " />
        <Skeleton className="h-[100px] w-[800px] rounded-xl " />
        <Skeleton className="h-[100px] w-[800px] rounded-xl " />
        <div className="space-y-2">
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {transactions.length === 0 ? (
        <h1 className="text-2xl font-bold text-gray-700 text-center mt-20">
          No Transactions
        </h1>
      ) : (
        <div className="flex flex-col items-center py-8">
          <div className='flex gap-20 w-full max-w-3xl'>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Transaction History
            </h1>
            <Select
              className="max-w-sm"
              items={filterOptions}
              label="Filter By"
              defaultSelectedKeys={["default"]}
            >
              {(option) => <SelectItem>{option.label}</SelectItem>}
            </Select>
          </div>
          <div className="w-full max-w-3xl space-y-4 py-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 border-l-4"
                style={{
                  borderColor: transaction.color ?? '#e5e5e5'
                }}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{transaction.name}</span>
                  <span className="text-gray-600">Amount: ₹{transaction.amount}</span>
                </div>
                <button
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  id={transaction._id}
                  onClick={handleClick}
                  disabled={loading}
                >
                  <Delete size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}