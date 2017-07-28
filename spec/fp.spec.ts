import chai = require('chai');
import request = require('request-promise');
import moment  = require('moment');

const expect = chai.expect;

describe('TypeScript', () => {
    describe('functional programming', () => {

        type Timestamp = number;
        type DataPoint = [Timestamp, number];

        interface History {
            market_cap: DataPoint[];
            price:      DataPoint[];
            volume:     DataPoint[];
        }

        interface HistoryEntry {
            timestamp:  Timestamp;
            market_cap: number;
            price:      number;
            volume:     number;
        }

        const getHistory = (path: string): PromiseLike<History> => request(`http://coincap.io/history/${path}`).then(JSON.parse);

        const merge = (history: History): HistoryEntry[] => history.market_cap.map((market_cap_entry, index) => ({
            timestamp:  market_cap_entry[0],
            market_cap: market_cap_entry[1],
            price:      history.price[index][1],
            volume:     history.volume[index][1],
        }));

        const asDate = (timestamp: Timestamp): string => moment(timestamp).format('YYYY-MM-DD HH:mm:ss');

        const format = (entries: HistoryEntry[]) => entries.map(entry => `${asDate(entry.timestamp)}: $${entry.price}`);

        // const pickTop = (count: number) => (entries: HistoryEntry[]): HistoryEntry[] => entries.slice(0, count);

        const pickTop = (count: number) => (entries: HistoryEntry[]): HistoryEntry[] => entries.slice(0, count);

        const sortByTimeDesc = (entries: HistoryEntry[]) => entries.concat().sort((a, b) => {
            switch (true) {
                case a.timestamp  >  b.timestamp:
                    return -1;
                case a.timestamp  <  b.timestamp:
                    return 1;
                case a.timestamp === b.timestamp:
                default:
                    return 0;
            }
        });

        const print = <T>(data: T): T => {
            console.log(data);      // tslint:disable-line:no-console

            return data;
        }

        // http://coincap.io/history/1day/BTC

        it('is useful when processing data and writing DSLs', () =>

            getHistory('1day/BTC').then(merge).then(sortByTimeDesc).then(pickTop(10)).then(format).then(print));

    });
});
