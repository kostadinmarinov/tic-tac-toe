import React from 'react';

export default class Loadable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            child: undefined
        };
    }

    render() {
        return this.state.child === undefined ? "Loading..." : this.state.child;
        // return this.state.data === undefined ? "Loading..." : this.renderChildren();
    }

    renderChildren() {
      return React.Children.map(this.props.children, child => (
        React.cloneElement(child, this.state.data)
      ))
    }

    componentDidMount() {
         this._resolve();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
             for (const key in this.props.data) {
                 if (this.props.data.hasOwnProperty(key)) {
                     if (this.props.data[key] !== prevProps.data[key]) {
                        this._resolve();
                     }
                 }
             }
        }
    }

    async _resolve() {
        const dataPromise = recursiveObjectPromiseAll(this.props.data);

        // const timeoutData = undefined;
        const timeoutData = await Promise.race([dataPromise, new Promise((resolve) => { setTimeout(resolve, 200, undefined) })]); // delay Loading with 200ms to avoid blinking
        this._setChild(timeoutData);
        
        // const data = (await Promise.all([dataPromise, new Promise((resolve) => { setTimeout(resolve, 500, undefined) })]))[0]; // once Loading is shown - keep it at least 500ms to avoid blinking
        const data = await dataPromise;

        if (data !== timeoutData) {
            this._setChild(data);
        }
    }

    _setChild(data) {
        const child = data ? this.props.render(data) : undefined;
        // const child = data ? this.renderChildren(data) : undefined;
        this.setState({ child });
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