import React from "react";
import { priorities } from '../../constants'
import { ResponsiveBar } from "@nivo/bar";
import Paper from '@material-ui/core/Paper'

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
    height: '50%',
    width: '50%',
    float: 'left',
    position: 'relative',


  };
  
  // const data = [
  //   { quarter: 1, earnings: 13000 },
  //   { quarter: 2, earnings: 16500 },
  //   { quarter: 3, earnings: 14250 },
  //   { quarter: 4, earnings: 19000 }
  // ];
  
  const BarChart = ({ type, data }) => {

    let keys;
    if (type === 0) {
      keys = ["none", "low", 'med', 'high']
    } else if (type === 1) {
      keys = ["bug", "featureReq", 'docReq', 'other']
    }


    return (
      <Paper style={styles}>
        <h1>Nivo basic demo</h1>
        <div style={{ height: "250px", padding:16}}>
          <ResponsiveBar 
          data={data} 
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