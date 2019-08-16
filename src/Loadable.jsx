import React from 'react';

export default class Loadable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            renderResult: undefined,
            result: undefined
        };
    }

    render() {
        return this.state.renderResult && this.state.result ? this.state.renderResult(this.state.result) : "Loading...";
    }

    componentDidMount() {
         this._resolve();
    }

    componentDidUpdate(prevProps) {
        if (this.props.promises !== prevProps.promises) {
             for (const key in this.props.promises) {
                 if (this.props.promises.hasOwnProperty(key)) {
                     if (this.props.promises[key] !== prevProps.promises[key]) {
                        this._resolve();
                        return;
                     }
                 }
             }
        }

        if (this.props.renderResult !== this.state.renderResult) {
            this.setState({ renderResult: this.props.renderResult });
        }
    }

    async _resolve() {
        const propsPromises = this.props.promises;
        const resultPromise = recursiveObjectPromiseAll(propsPromises);

        // const timeoutResult = undefined;
        const timeoutResult = await Promise.race([resultPromise, new Promise((resolve) => { setTimeout(resolve, 200, undefined) })]); // delay Loading with 200ms to avoid blinking
        
        if (this.props.promises !== propsPromises) {
            return;
        }

        this.setState({ renderResult: this.props.renderResult, result: timeoutResult });

        // const result = (await Promise.all([resultPromise, new Promise((resolve) => { setTimeout(resolve, 300, undefined) })]))[0]; // once Loading is shown - keep it at least 300ms to avoid blinking
        const result = await resultPromise;

        if (result === timeoutResult || this.props.promises !== propsPromises) {
            return;
        }

        this.setState({ result: result });
    }
}
    
const zipObject =  (keys, values) => {
    const result = {};

    keys.forEach((key, i) => {
        result[key] = values[i];
    });

    return result;
};

const recursiveObjectPromiseAll =  (obj)=>  {
    const keys = Object.keys(obj);
    return Promise.all(keys.map(key => {
        const value = obj[key];
        // Promise.resolve(value) !== value should work, but !value.then always works
        if (typeof value === 'object' && !value.then) {
        return recursiveObjectPromiseAll(value);
        }
        return value;
    }))
        .then(result => zipObject(keys, result));
};