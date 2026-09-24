export interface SensorMetric {
  id: string;
  name: string;
  location: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  lastUpdated: string;
}