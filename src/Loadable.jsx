import React from 'react';

export default class Loadable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: undefined
        };
    }

    render() {
        // return this.state.data === undefined ? "Loading..." : this.props.render(this.state.data);
        return this.state.data === undefined ? "Loading..." : this.renderChildren();
    }

    renderChildren() {
      return React.Children.map(this.props.children, child => (
        React.cloneElement(child, this.state.data)
      ))
    }

    async componentDidMount() {
        await this._resolve();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            await this._resolve();
        }
    }

    async _resolve() {
        this.setState({ data: undefined });

        const data = await this.recursiveObjectPromiseAll(this.props.data);

        this.setState({ data });
    }
    
    zipObject  (keys, values) {
        const result = {};

        keys.forEach((key, i) => {
            result[key] = values[i];
        });

        return result;
    };

    recursiveObjectPromiseAll  (obj) {
        const keys = Object.keys(obj);
        return Promise.all(keys.map(key => {
            const value = obj[key];
            // Promise.resolve(value) !== value should work, but !value.then always works
            if (typeof value === 'object' && !value.then) {
            return this.recursiveObjectPromiseAll(value);
            }
            return value;
        }))
            .then(result => this.zipObject(keys, result));
        };
    }