"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { io } from "socket.io-client";

type SocketData = {
  peopleIn: number;
  peopleOut: number;
  peopleInside: number;
};

// Dados simulados de média diária
const dailyAverageData = [
  { day: "Seg", average: 120 },
  { day: "Ter", average: 150 },
  { day: "Qua", average: 180 },
  { day: "Qui", average: 200 },
  { day: "Sex", average: 250 },
  { day: "Sáb", average: 300 },
  { day: "Dom", average: 220 },
];

// Dados simulados de ocupação ao longo do dia
const hourlyData = [
  { hour: "00:00", count: 20 },
  { hour: "02:00", count: 10 },
  { hour: "04:00", count: 5 },
  { hour: "06:00", count: 15 },
  { hour: "08:00", count: 50 },
  { hour: "10:00", count: 100 },
  { hour: "12:00", count: 180 },
  { hour: "14:00", count: 220 },
  { hour: "16:00", count: 250 },
  { hour: "18:00", count: 300 },
  { hour: "20:00", count: 280 },
  { hour: "22:00", count: 150 },
];

const socket = io("http://localhost:3001");

export default function Dashboard() {
  const peakDay = dailyAverageData.reduce(
    (max, item) => (item.average > max.average ? item : max),
    dailyAverageData[0]
  );
  const peakHour = hourlyData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    hourlyData[0]
  );

  const [socketData, setSocketData] = useState<SocketData>({
    peopleIn: 0,
    peopleOut: 0,
    peopleInside: 0,
  });

  useEffect(() => {
    socket.on("update_frontend", (data: SocketData) => {
      setSocketData(data);
    });

    return () => {
      socket.off("update_frontend");
    };
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard de Controle de Pessoas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Entradas
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socketData.peopleIn}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Saídas
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socketData.peopleOut}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pessoas no Estabelecimento
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socketData.peopleInside}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Média de Pessoas por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyAverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average">
                    {dailyAverageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry === peakDay ? "#ff7300" : "#8884d8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium">
                Dia de pico:{" "}
                <span className="text-orange-500 font-bold">{peakDay.day}</span>{" "}
                com média de{" "}
                <span className="text-orange-500 font-bold">
                  {peakDay.average}
                </span>{" "}
                pessoas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ocupação ao Longo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium">
                Horário de pico:{" "}
                <span className="text-blue-500 font-bold">{peakHour.hour}</span>{" "}
                com{" "}
                <span className="text-blue-500 font-bold">
                  {peakHour.count}
                </span>{" "}
                pessoas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
