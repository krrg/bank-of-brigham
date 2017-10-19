import React from "react";
import { PieChart, Pie, Cell, Text, Legend } from "recharts";
import _ from "lodash";

/*
$darkBackground: #1b292e;
$lightHighlight: #e67f20;
$darkHighlight: #9d3c1b;
*/

const colors = [
    "#3C6E71", "#5B85AA", "#372248"
]

const FancyPieChart = ({accounts}) => {
    const data = accounts.map(account => {
        return ({
            name: account["displayName"],
            value: account["balance"]
        })
    })

    const totalBalance = _.sumBy(accounts, account => account["balance"])
    console.log(totalBalance);

    return (
        <PieChart width={480} height={280}>
            <Pie
                isAnimationActive={true}
                innerRadius={110}
                outerRadius={140}
                data={data}
                cx={140}
            >
                {
                    data.map((account, index) => {
                        console.log(account);
                        return (
                            <Cell key={`index-${index}`} fill={colors[index % colors.length]} />
                        )
                    })
                }
            </Pie>
            {/* <Legend align="right" verticalAlign="middle" layout="vertical" cx="300"/> */}
        </PieChart>
    )
}

export default FancyPieChart;