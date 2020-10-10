import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [hidden, setHidden] = useState(new Set()); // for angular use simple array for hidden keys.
  const [groupBy, setGroupBy] = useState(['a'])
  const [groupByLogic, setgroupByLogic] = useState({
    'a': 'sum',
    'b': 'count',
    'c': 'sum'
  });

  const data = [
    {
      a: 1,
      b: 2,
      c: 3
    }
    , {
      a: 2,
      b: 2,
      c: 3
    }
    , {
      a: 2,
      b: 2,
      c: 4
    }
    , {
      a: 4,
      b: 2,
      c: 3
    }
  ]


  const keyFilter = (hidden, raw) => {
    return Object.keys(raw)
      .filter(key => !hidden.has(key))
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});
  }

  const groupByFilter = (groupBy, data) => {
    const groupedData = data.reduce((mappedData, row) => {
      const key = groupBy.reduce((key, k) => key + ':' + String(row[k]), "k");
      mappedData[key] = Object.keys(row).reduce((obj, k) => {
        if (groupBy.includes(k) || isNaN(row[k])) {
          obj[k] = row[k];
        }
        else {
          if (!!mappedData[key]) {
            if (groupByLogic[k] === 'sum') {
              obj[k] = (mappedData[key][k] || 0) + row[k]
            } else if (groupByLogic[k] === 'count') {
              obj[k] = (mappedData[key][k] || 0) + 1
            }
          } else {
            if (groupByLogic[k] === 'sum') {
              obj[k] = row[k]
            } else if (groupByLogic[k] === 'count') {
              obj[k] = 1
            }
          }
        }
        return obj;
      }, {})
      return mappedData
    }, {})

    return Object.values(groupedData)
  }

  const processedData = groupByFilter(groupBy, data.map(row => keyFilter(hidden, row)));


  return (
    <div className="App">
      <table border={1} cellPadding={5}>
        <thead>
          {
            Object.keys(processedData[0] || {}).map((heading, index) => (
              <th key={index}>
                {
                  heading
                }
              </th>
            ))
          }
        </thead>
        <tbody>
          {
            processedData?.map(row => (
              <tr>
                {
                  Object.keys(row).map(column => <td>{row[column]}</td>)
                }
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>
  );
}

export default App;
