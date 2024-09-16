import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layout";
import Chart from "../Chart/Chart"; // Assuming Chart is correctly implemented
import { useGlobalContext } from "../../context/globalContext";
import History from "../History/RecentHistory"; // Assuming History is the component you previously built
import { Pie } from "react-chartjs-2"; // For pie charts if needed
import { Tooltip, BarChart, XAxis, YAxis, Legend, CartesianGrid, Bar } from "recharts";
import { Typography, Box } from '@mui/material';


// Helper functions for generating chart data
const generateExpenseChartData = (expenses) => {
  const categories = {};
  expenses.forEach((expense) => {
    const { category, amount } = expense;
    if (categories[category]) {
      categories[category] += amount;
    } else {
      categories[category] = amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
      },
    ],
  };

  return data;
};

const generateIncomeChartData = (incomes) => {
  const categories = {};
  incomes.forEach((income) => {
    const { category, amount } = income;
    if (categories[category]) {
      categories[category] += amount;
    } else {
      categories[category] = amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  return data;
};

const Dashboard = ({ isDarkMode }) => {
  const {
    totalExpenses,
    incomes,
    expenses,
    totalIncome,
    totalBalance,
    getIncomes,
    getExpenses,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  const expensesPieChartData = generateExpenseChartData(expenses);
  const incomePieChartData = generateIncomeChartData(incomes);

  const totalIncome2 = incomes.reduce((total, income) => total + income.amount, 0);
  const totalExpenses2 = expenses.reduce((total, expense) => total + expense.amount, 0);

  const barChartData = [
    { name: "Total Income", amount: totalIncome2 },
    { name: "Total Expenses", amount: totalExpenses2 },
  ];

  return (
    <DashboardStyled isDarkMode={isDarkMode}>
      <InnerLayout>
        <h1>Dashboard</h1>
        {/* Income vs Expense Chart and Recent History */}
        <div className="top-section">
          <div className="chart-wrapper">
            <Chart />
          </div>
          <div className="history-wrapper">
            <h2>Recent Expense History</h2>
            <History recentOnly={true} limit={3} /> 
            <Box className="min-max-container">
                                    <Typography variant="h6" className="salary-title">
                                        Min <span>Income</span> Max
                                    </Typography>
                                    <div className="salary-item">
                                        <Typography>${Math.min(...incomes.map(item => item.amount))}</Typography>
                                        <Typography>${Math.max(...incomes.map(item => item.amount))}</Typography>
                                    </div>

                                    <Typography variant="h6" className="salary-title">
                                        Min <span>Expense</span> Max
                                    </Typography>
                                    <div className="salary-item">
                                        <Typography>${Math.min(...expenses.map(item => item.amount))}</Typography>
                                        <Typography>${Math.max(...expenses.map(item => item.amount))}</Typography>
                                    </div>
                                </Box>
          </div>
        </div>

        {/* KPI and Bar Chart Section */}
        <div className="bottom-section">
          <div className="kpi-wrapper">
            <div className="kpi-item">
              <h2>Total Balance</h2>
              <p>Rs. {totalBalance()}</p>
            </div>
            <div className="kpi-item">
              <h2>Total Income</h2>
              <p>Rs. {totalIncome()}</p>
            </div>
            <div className="kpi-item">
              <h2>Total Expense</h2>
              <p>Rs. {totalExpenses()}</p>
            </div>
          </div>

          <div className="bar-chart-wrapper">
            <h2>Amount</h2>
            <BarChart
              width={600}
              height={300}
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
};

const DashboardStyled = styled.div`
  .top-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    margin-top: 2%;

    .chart-wrapper {
      flex: 8;
      margin-right: 2rem;
      height: 530px; /* Adjust height as needed */
      overflow: hidden; /* Hide any overflow content */
    }

    .history-wrapper {
      flex: 4;
      background: #FCF6F9;
      border: 2px solid #FFFFFF;
      padding: 1rem;
      border-radius: 20px;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      height: 350px; /* Adjust height as needed */
      overflow: hidden; /* Hide any overflow content */
    }
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    gap: 1rem; /* Add gap between the sections */

    .kpi-wrapper {
      flex: 4;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly; /* Make sure KPIs are spaced evenly */
      gap: 1.5rem;
      margin-right: 1rem;

      .kpi-item {
        flex: 1; /* Ensures equal width for all KPIs */
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        padding: 1rem;
        border-radius: 20px;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        text-align: center;
        width: 100%; /* Auto width */
        height: 150px; /* Fixed height */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h2 {
          margin-bottom: 0.5rem;
          color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
        }

        p {
          font-size: 1.5rem;
          color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
        }
      }
    }

    .bar-chart-wrapper {
      flex: 2;
      background: #FCF6F9;
      border: 2px solid #FFFFFF;
      padding: 1rem;
      border-radius: 20px;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      display: flex;
      justify-content: center; /* Center the Bar Chart */
      margin-bottom:
      align-items: center; /* Vertically center the Bar Chart */
    }
  }
`;

export default Dashboard;
