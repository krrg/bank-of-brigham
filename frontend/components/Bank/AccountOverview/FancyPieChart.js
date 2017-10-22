import React from "react";
import { PieChart, Pie, Cell, Text, Legend } from "recharts";
import _ from "lodash";
import Accounting from "../../../lib/accounting";
import { accountTypesMap } from "../../../constants";

import "./FancyPieChart.scss";

class FancyPieChart extends React.Component {

    renderCenterText = () => {
        const totalBalance = _.sumBy(this.props.accounts, account => account["balance"])
        const totalAccounts = this.props.accounts.length;

        return (
            <div className="PieCenterText">
                <span className="__topText">Total Balance</span>
                <span className="__balance">{Accounting.formatMoney(totalBalance)}</span>
                <span className="__accounts">for {totalAccounts} accounts</span>
            </div>
        )
    }

    renderPie = () => {
        const data = this.props.accounts.map(account => {
            return ({
                name: account["displayName"],
                value: account["balance"],
                color: accountTypesMap[account["type"]]["color"],
            })
        })

        return (
            <PieChart width={320} height={320}>
                <Pie
                    isAnimationActive={true}
                    innerRadius={135}
                    outerRadius={160}
                    data={data}
                    cx={160}
                >
                    {
                        data.map((account, index) => {
                            console.log(account);
                            return (
                                <Cell key={`index-${index}`} fill={account["color"]} />
                            )
                        })
                    }
                </Pie>
                {/* <Legend align="right" verticalAlign="middle" layout="vertical" cx="300"/> */}
            </PieChart>
        )
    }

    render() {
        return (
            <div className="FancyPieChart">
                { this.renderPie() }
                { this.renderCenterText() }
            </div>
        )
    }

}


export default FancyPieChart;