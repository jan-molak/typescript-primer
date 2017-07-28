import chai = require('chai');

const expect = chai.expect;

describe('TypeScript', () => {

    describe('type system', () => {

        it('has optional types', () => {

            function greet(name) {
                return 'Hello, ' + name + '!';
            }

            // --

            expect(greet('team')).to.equal('Hello, team!');
        });

        it('allows you to specify the type explicitly too', () => {

            function greet(name: string): string {
                return 'Hello, ' + name + '!';
            }

            // --

            expect(greet('team')).to.equal('Hello, team!');
        });

        it('can have structural types', () => {

            interface Money {
                currency: string;
                amount: number;
            }

            function add(m1: Money, m2: Money): Money {
                if (m1.currency !== m2.currency) {
                    throw new Error('Can\'t add different currencies');
                }

                return {
                    currency: m1.currency,
                    amount:   m1.amount + m2.amount,
                };
            }

            // --

            const fiver  = { currency: 'GBP', amount: 5 };
            const tenner = { currency: 'GBP', amount: 10 };

            expect(add(fiver, fiver)).to.deep.equal(tenner);
        });
    });

    describe('ES6 features', () => {

        // https://github.com/lukehoban/es6features#readme

        it('has the fat arrow', () => {
            const numbers = [10, 1000, 1000000];

            const result_1 = numbers.map(function(value) {
                return Number(value).toLocaleString('en');
            });

            const result_2 = numbers.map(n => Number(n).toLocaleString('en'));

            expect(result_1).to.have.members(['10', '1,000', '1,000,000']);
            expect(result_1).to.have.members(result_2);
        });

        describe('class', () => {

            const now = () => new Date().getTime();

            it('can be implemented using Java-like syntax', () => {

                class Event {
                    private _name: string;
                    private _timestamp: number;

                    constructor(name: string, timestamp: number = now()) {
                        this._name = name;
                        this._timestamp = timestamp;
                    }

                    public name() {
                        return this._name;
                    }

                    public timestamp() {
                        return this._timestamp;
                    }
                }

                // --

                expect(new Event('something happened').name()).to.equal('something happened');
            });

            it('can be much more compact too...', () => {

                class Event {
                    constructor(public name: string, public timestamp = new Date().getTime()) {
                    }

                    toString = () => `Name: ${this.name} timestamp: ${this.timestamp}`;
                }

                // --

                const evt = new Event('something happened');
                expect(evt.name).to.equal('something happened');
            });
        });

        describe('interface', () => {

            it('can describe the behaviour of an object', () => {

                interface Comparable<T> {
                    compareTo(other: T): -1 | 0 | 1;
                }

                class Money implements Comparable<Money> {
                    constructor(public amount: number, public currency: string) {
                    }

                    compareTo(other: Money) {
                        switch (true) {
                            case this.amount > other.amount:
                                return 1;

                            case this.amount < other.amount:
                                return -1;

                            case this.amount === other.amount:
                            default:
                                return 0;
                        }
                    }
                }

                // --

                const fiver  = new Money(5, 'GBP');
                const tenner = new Money(10, 'GBP');

                expect(fiver.compareTo(tenner)).to.equal(-1);

            });

            it('can also describe a function', () => {

                interface Serialiser<T> {
                    (value: T): string;
                }

                // type Serialiser<T> = (value: T) => string;

                class Account {
                    constructor(public id: string, public value: number) {
                    }

                    serialisedUsing(serialiser: Serialiser<Account>) {
                        return serialiser(this);
                    }
                }

                // --

                const account = new Account('account_id', 1000);

                expect(account.serialisedUsing(JSON.stringify)).to.equal('{"id":"account_id","value":1000}');
            });
        });
    });
});
