import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

// --- TS Interfaces ---
export interface StatItem {
  title: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  orders: number;
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface DashboardData {
  stats: StatItem[];
  chartData: ChartDataPoint[];
  transactions: Transaction[];
}

// --- Mock Data Generator ---
// We simulate an endpoint response using a Promise and setTimeout
const fetchDashboardDataMock = async (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: [
          { title: 'Total Orders', value: '125', subtext: 'All orders placed by customers', icon: 'file-text' },
          { title: 'Total Products', value: '34', subtext: 'Products available for customers', icon: 'box' },
          { title: 'Total Customer', value: '642', subtext: 'Customers who placed orders', icon: 'users' },
          { title: 'Total Revenue', value: '$82.12K', subtext: 'Total revenue generated', icon: 'dollar' },
        ],
        chartData: [
          { date: 'Mon', orders: 21 },
          { date: 'Tue', orders: 28 },
          { date: 'Wed', orders: 17 },
          { date: 'Thu', orders: 24 },
          { date: 'Fri', orders: 32 },
          { date: 'Sat', orders: 14 },
          { date: 'Sun', orders: 26 },
        ],
        transactions: [
          { id: 'TX-001', user: 'Liam Johnson', amount: 350.0, status: 'Completed', date: '2023-10-01T12:00:00Z' },
          { id: 'TX-002', user: 'Olivia Smith', amount: 120.5, status: 'Pending', date: '2023-10-01T12:30:00Z' },
          { id: 'TX-003', user: 'Noah Williams', amount: 95.0, status: 'Completed', date: '2023-10-01T14:15:00Z' },
          { id: 'TX-004', user: 'Emma Brown', amount: 1500.0, status: 'Failed', date: '2023-10-02T09:45:00Z' },
          { id: 'TX-005', user: 'James Jones', amount: 45.0, status: 'Completed', date: '2023-10-02T11:20:00Z' },
        ],
      });
    }, 100); 
  });
};

export const useDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardDataMock,
  });
};
