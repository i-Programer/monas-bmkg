import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomChart = ({ createChartData, nwp, mos, date, time }) => (
  <ResponsiveContainer width="100%" height={300} className="text bg-transparent">
    <LineChart
      data={createChartData(nwp, mos, date, time)}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tick={{ fill: 'blue', fontSize: 14 }} // Customize x-axis labels
      />
      <YAxis
        tick={{ fill: 'red', fontSize: 14 }} // Customize y-axis labels
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line
        type="monotone"
        dataKey="nwp"
        name="prec_nwp"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line
        type="monotone"
        dataKey="mos"
        name="prec_mos"
        stroke="#82ca9d"
      />
      <Line
        type="monotone"
        dataKey="comparison"
        name="Difference (NWP-MOS)"
        stroke="#ff7300"
      />
    </LineChart>
  </ResponsiveContainer>
);

export default CustomChart;
