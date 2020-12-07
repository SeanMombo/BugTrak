import React from "react";
import { priorities } from '../../constants'
import { ResponsiveBar } from "@nivo/bar";
import Paper from '@material-ui/core/Paper'

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    padding:'20px',

  };
  const stylesH1 = {
    marginTop:0,
    
  };

  // const data = [
  //   { quarter: 1, earnings: 13000 },
  //   { quarter: 2, earnings: 16500 },
  //   { quarter: 3, earnings: 14250 },
  //   { quarter: 4, earnings: 19000 }
  // ];
  
  const BarChart = ({ type, data }) => {
    let title = '';




    let keys;
    let colors
    if (type === 0) {
      keys = ["none", "low", 'med', 'high']
      title = 'Tickets By Priority'
      colors = { 'none': '#e91e63', 'low': '#2196f3', 'med': '#4caf50', high: '#ffc107'}

    } else if (type === 1) {
      keys = ["bug", "featureReq", 'docReq', 'other']
      title = 'Tickets By Type'
      colors = { 'bug': '#e91e63', 'featureReq': '#2196f3', 'docReq': '#4caf50', other: '#ffc107'}

    } else if (type === 2) {
      keys = ["new", "open", 'active', 'resolved']
      title = 'Tickets By Status'
      colors = { 'new': '#e91e63', 'open': '#2196f3', 'active': '#4caf50', resolved: '#ffc107'}
    }

    
    const getColor = bar => colors[bar.id]


    return (
      <Paper style={styles} elevation={3}>
        <h1 style={stylesH1}>{title}</h1>
        <div style={{ height: "250px"}}>
          <ResponsiveBar 
          data={data} 
          colors={getColor}
          keys={keys} 
          indexBy="index" 
          tooltip={({ id, value}) => (
            <strong >
                {id}: {value}
            </strong>
        )}
          />
        </div>
      </Paper>
    );
}


  export default BarChart;