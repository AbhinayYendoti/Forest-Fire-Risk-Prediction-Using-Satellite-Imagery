import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HistoricalData } from '../types';
import { format } from 'date-fns';

interface Props {
  data: HistoricalData[];
}

export function HistoricalChart({ data }: Props) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM d')
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="fireCount"
            stroke="#ef4444"
            name="Fire Incidents"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgTemperature"
            stroke="#f97316"
            name="Avg Temperature (°C)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgHumidity"
            stroke="#3b82f6"
            name="Avg Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}