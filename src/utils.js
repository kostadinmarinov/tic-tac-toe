// function getState(stateSetter, initialState = {}) {
//     let nextState = initialState;
//     stateSetter(state => nextState = {...nextState, ...state});
//     return nextState;
// }

export async function getStateAsync(asyncStateSetter, initialState = {}) {
    let nextState = initialState;
    await asyncStateSetter(state => nextState = {...nextState, ...state});
    return nextState;
}

// async function setStateAsync(setState, asyncStateSetter, initialState = {}) {
//     let nextState = await getStateAsync(asyncStateSetter, initialState);
//     setState(nextState);
// }

// let state = { d1:0, d2: 0 };
// let nextState = state;
// const setState = (state => nextState = { ...nextState, ...state });
// const moveState = () => state = nextState;

// function render() {
//     return (
//         <>
//             <div>
//                 <h1>Counters</h1>
//                 <Loadable promise={this.state.loadAllCounters} setState={this.setState}>
//                     {
//                         <Loadable promise={this.state.loadOnlyFirstCounter} setState={this.setState}>
//                             d1: {this.state.d1};
//                         </Loadable>
//                     } d2: {this.state.d2}
//                 </Loadable>
//             </div>
//         </>
//     );
// }

// function someAction() {
//     const state1 = getState((setState) => {
//         const r = {d1: 1, d2: 2};

//         setState({d1: state.d1 + r.d1 });
//         setState({d2: state.d2 - r.d2 });
//     })

//     const state2 = getStateAsync(async (setState) => {
//         const r = await Promise.resolve( {d1: 1, d2: 2});

//         setState({d1: state.d1 + r.d1 });
//         setState({d2: state.d2 - r.d2 });
//     })

//     const getCountersBigReturnAtTheEnd = async (setState) => {
//         const r = await Promise.resolve( {d1: 1, d2: 2});

//         return{
//             d1: state.d1 + r.d1,
//             d2: state.d2 - r.d2 
//         };
//     }

//     const loadAllCounters = getStateAsync(
//         async (setState) => {
//             const r = await Promise.resolve( {d1: 1, d2: 2});

//             setState({d1: state.d1 + r.d1 });
//             setState({d2: state.d2 - r.d2 });
//         });

//     const loadOnlyFirstCounter = getStateAsync(
//         async (setState) => {
//             const r = await Promise.resolve( {d1: 1, d2: 2});

//             setState({d1: state.d1 + r.d1 - r.d2 });
//         });
        
//     setState({loadAllCounters, loadOnlyFirstCounter});
// }