import React, { PureComponent } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Label } from 'recharts';


import {InputLabel, MenuItem, FormControl, Select, FormHelperText} from '@material-ui/core';

import NoData from '@/app/Pages/Stats/Components/NoData';

import { parseNumber, formatPercent } from '@/utils/number_formatting';
import { dynamicSort } from '@/utils/helperFunctions';

import { Type_Pair_Performance_Metrics } from '@/types/3Commas';
import { Type_Tooltip, Type_Pair_Performance } from '@/types/Charts';

const legendFind = (value: string) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}



const PairPerformanceBar = ({ title, data }: Type_Pair_Performance) => {

    const [sort, setSort] = React.useState('-total_profit');
    const [filter, setFilter] = React.useState('all');

    const handleChange = (event:any) => {
        setSort(event.target.value);
    };

    const hide = (id:string ) => {
        return (id == sort) ? false : true  
    }


    const handleFilterchange = (event: any) => {
        setFilter(event.target.value);
    };
    const filterData = (data: Type_Pair_Performance_Metrics[] ) => {
        data = data.sort(dynamicSort('-total_profit'));
        const length = data.length;
        const fiftyPercent = length / 2
        const twentyPercent = length / 5

        if (filter === 'top20')  {
            data = data.sort(dynamicSort('-total_profit'));
            return data.filter( (bot, index) => index < twentyPercent)
        } else if (filter === 'top50')  {
            data = data.sort(dynamicSort('-total_profit'));
            return data.filter( (bot, index) => index < fiftyPercent)
        } else if (filter === 'bottom50')  {
            data = data.sort(dynamicSort('total_profit'));
            return data.filter( (bot, index) => index < fiftyPercent)
        } else if (filter === 'bottom20')  {
            data = data.sort(dynamicSort('total_profit'));
            return data.filter( (bot, index) => index < twentyPercent)
        } else {
            return data;
        }

        

    }
    const renderChart = () => {
        if (data == undefined || data.length === 0) {
            return (<NoData />)
        } else {
            data = filterData(data)
            data = data.sort(dynamicSort(sort))

            return (<ResponsiveContainer width="100%" height="100%" minHeight="300px">
                <ComposedChart

                    data={data}

                    stackOffset="expand"
                >
                    <CartesianGrid opacity={.3} vertical={false} />
                    <Legend verticalAlign="top" height={36} />
                    <Tooltip
                        // @ts-ignore - tooltip refactoring
                        // todo - improve how tooltops can pass the values.
                        content={<CustomTooltip />}
                    />
                    <XAxis dataKey="pair"
                        angle={45}
                        dx={10}
                        // dx={15}
                        dy={10}
                        fontSize=".75em"
                        minTickGap={-200}
                        axisLine={false}
                        height={75}

                    />
                    <YAxis 
                        yAxisId="total_profit" 
                        orientation='left' 
                        hide={hide("-total_profit")} 
                        domain={[0, 'auto']} 
                        allowDataOverflow={true} offset={20}>
                        <Label value="Total Profit"
                                angle={-90}
                                dy={0}
                                dx={-20}
                            />
                    
                    </YAxis>

                    <YAxis 
                        yAxisId="avg_deal_hours" 
                        orientation='left' 
                        hide={hide("-avg_deal_hours")} 
                        domain={[0, 'auto']} 
                        allowDataOverflow={true} 
                        offset={20} >
                        <Label value="Avg. Deal Hours"
                                angle={-90}
                                dy={0}
                                dx={-20}
                            />
                    
                    </YAxis>
                    <YAxis 
                        yAxisId="bought_volume" 
                        orientation='left' 
                        hide={hide("-bought_volume") } 
                        domain={[0, 'auto']} 
                        allowDataOverflow={true} 
                        offset={40} >
                        {/* <Label value="Bought Volume"
                                angle={-90}
                                dy={0}
                                dx={-40}
                            /> */}
                    </YAxis>

                    <Bar name="Total Profit" type="monotone" yAxisId="total_profit" fillOpacity={.8}  dataKey="total_profit" fill="var(--color-CTA-dark25)" />
                    <Line  name="Bought Volume" yAxisId="bought_volume" dataKey="bought_volume" stroke="var(--color-primary)" dot={false} strokeWidth={1.75} />
                    <Line name="Avg. Deal Hours" type="monotone" yAxisId="avg_deal_hours" dataKey="avg_deal_hours" stroke="var(--color-secondary)" dot={false} strokeWidth={1.75} />

                </ComposedChart>
            </ResponsiveContainer>)
        }
    }

    return (
        <div className="boxData stat-chart bubble-chart">
            <div style={{position: "relative"}}>
                <h3 className="chartTitle">{title}</h3>
                <div style={{ position:"absolute", right: 0, top: 0, height: "50px", zIndex: 5}}>
                <FormControl  >
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        onChange={handleChange}
                        style={{width: "150px"}}
                    >
                        <MenuItem value="-total_profit">Profit</MenuItem>
                        <MenuItem value="-bought_volume">Bought Volume</MenuItem>
                        <MenuItem value="-avg_deal_hours">Avg. Deal Hours</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <div style={{ position:"absolute", left: 0, top: 0, height: "50px", zIndex: 5}}>
                <FormControl  >
                        <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            onChange={handleFilterchange}
                            style={{ width: "150px" }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="top20">Top 20%</MenuItem>
                            <MenuItem value="top50">Top 50%</MenuItem>
                            <MenuItem value="bottom50">Bottom 50%</MenuItem>
                            <MenuItem value="bottom20">Bottom 20%</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                   

                

            </div>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (active) {
        const data: Type_Pair_Performance_Metrics = payload[0].payload
        const { total_profit, avg_completed_so, avg_profit, pair, avg_deal_hours, bought_volume, number_of_deals } = data
        return (
            <div className="tooltop">
                <h4>{pair}</h4>
                <p><strong>Bought Volume:</strong> ${parseNumber(bought_volume)} </p>
                <p><strong>Deal Count:</strong> {number_of_deals} </p>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)} </p>
                <p><strong>Avg Deal Hours:</strong> {parseNumber(avg_deal_hours)} </p>
            </div>
        )
    } else {
        return null
    }
}

export default PairPerformanceBar;