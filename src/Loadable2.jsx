import React from 'react';

export default class Loadable2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            children: null,
        };
    }

    render() {
        return this.state.children;
    }

    componentDidMount() {
        if (this.props.promise) {
            this._resolve();
        } else if (this.state.children) {
            this.setState({ children: null });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.promise) {
            if (this.props.promise !== prevProps.promise) {
                this._resolve();
            } else if (this.props.renderResult !== prevProps.renderResult) {
                this.setState({ children: this.props.renderResult() });
            }
        } else if (this.state.children) {
            this.setState({ children: null });
        }
    }

    async _resolve() {
        const promise = this.props.promise;

        // const timeoutResult = undefined;
        let result = await Promise.race([promise, new Promise((resolve) => { setTimeout(resolve, 200, undefined) })]); // delay Loading with 200ms to avoid blinking
        
        if (this.props.promise !== promise) {
            return;
        }

        if (!result) {
            this.setState({ children: "Loading..." });

            // const result = (await Promise.all([resultPromise, new Promise((resolve) => { setTimeout(resolve, 300, undefined) })]))[0]; // once Loading is shown - keep it at least 300ms to avoid blinking
            result = await promise;

            if (this.props.promise !== promise) {
                return;
            }
        }

        if (result) {
            this.props.setState(result);
        }
        else {
            this.setState({ children: this.props.renderResult() });
        }
    }
}
