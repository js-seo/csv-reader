import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { forEach, max, mean } from 'lodash'

const data: string[] = []
fs.createReadStream(path.resolve(__dirname, '../../data.csv'))
  .pipe(csv.parse())
  .on('error', error => console.error(error))
  .on('data', row => data.push(row[0]))
  .on('end', () => {
    const map: { [key: string]: number[] } = {};
    data.forEach((row) => {
      const [key, value] = row.split(': Took ');
      if (!map[key]) map[key] = [];
      if (!value) {
        console.log('no value', row)
        return;
      }
      const numValue = Number(value.split('ms')[0])
      if (numValue > 100 * 1000) return;
      map[key].push(numValue);
    })
    forEach(map, (numbers, key) => {
      if (numbers.length < 10) return;
      console.log(`[${key}]`);
      console.log(`- Mean: ${mean(numbers)} (${numbers.length})`);
      // console.log(`- Max: ${max(numbers)}`);
    })
  });

