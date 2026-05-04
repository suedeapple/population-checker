"use client";

import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";

type DataPoint = { year: string; population: number };

function formatPopulation(value: number) {
	if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
	return value.toLocaleString();
}

export default function PopulationChart({ data }: { data: DataPoint[] }) {
	return (
		<section className="population-chart">
			<ResponsiveContainer width="100%" height={280}>
				<LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 16 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
					<XAxis
						dataKey="year"
						tick={{ fill: "#8fa8cc", fontSize: 12 }}
						tickLine={false}
						axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
					/>
					<YAxis
						tickFormatter={formatPopulation}
						tick={{ fill: "#8fa8cc", fontSize: 12 }}
						tickLine={false}
						axisLine={false}
						width={56}
					/>
					<Tooltip
						contentStyle={{
							background: "#142f6e",
							border: "1px solid rgba(255,255,255,0.12)",
							borderRadius: 8,
							color: "#e8eeff",
							fontSize: 13,
						}}
						formatter={(value) => [typeof value === "number" ? value.toLocaleString() : value, "Population"]}
						labelStyle={{ color: "#8fa8cc", marginBottom: 4 }}
						cursor={{ stroke: "rgba(255,255,255,0.15)" }}
					/>
					<Line
						type="monotone"
						dataKey="population"
						stroke="#16a34a"
						strokeWidth={2}
						dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }}
						activeDot={{ r: 5, fill: "#22c55e", strokeWidth: 0 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</section>
	);
}
