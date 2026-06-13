import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_DATA } from "../monitoring.constants";

export function TrendChart() {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Tren Kasus per Bulan</h3>
              <p className="text-xs text-gray-500">Jul 2024 – Des 2024</p>
            </div>
            <BarChart3 size={18} className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={180} key="chart-container">
            <BarChart data={CHART_DATA} barSize={12} barGap={4} key="main-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" key="grid" />
              <XAxis dataKey="bulan" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} key="xaxis" />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} key="yaxis" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} key="tooltip" />
              <Legend wrapperStyle={{ fontSize: 11 }} key="legend" />
              <Bar dataKey="BUP" fill="#3B82F6" radius={[3, 3, 0, 0]} key="bar-bup" />
              <Bar dataKey="MPP" fill="#0891B2" radius={[3, 3, 0, 0]} key="bar-mpp" />
              <Bar dataKey="PengunduranDiri" fill="#8B5CF6" radius={[3, 3, 0, 0]} key="bar-pgd" />
              <Bar dataKey="Lainnya" fill="#6B7280" radius={[3, 3, 0, 0]} key="bar-lainnya" />
            </BarChart>
          </ResponsiveContainer>
        </div>
    );
}