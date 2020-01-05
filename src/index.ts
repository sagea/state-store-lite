
export type Subscription = () => unknown
export type ActionReducer<State> = (...args: [State, any]) => State;
export type ActionReducers<State> = { [id: string]: ActionReducer<State> }
export type ActionReducersToAction<Actions> = {
  [P in keyof Actions]: 
    Actions[P] extends (...args: any[]) => any
      ? Parameters<Actions[P]>[1] extends undefined
        ? () => unknown
        : undefined extends Parameters<Actions[P]>[1]
          ? (payload?: Parameters<Actions[P]>[1]) => unknown
          : (payload: Parameters<Actions[P]>[1]) => unknown
      : never
}
export interface SimpleStore<State, Actions extends ActionReducers<State>> {
  readonly subscribe: (subscription: Subscription) => unknown;
  readonly unsubscribe: (subscription: Subscription) => unknown;
  readonly getState: () => State;
  readonly actions: ActionReducersToAction<Actions>;
}

export const createStore = <State, T extends ActionReducers<State>>(actionReducers: T, defaultState: State): SimpleStore<State, T> => {
  if (actionReducers === undefined) {
    throw new Error('Missing parameter actions')
  }
  if (typeof actionReducers !== 'object' || actionReducers === null) {
    throw new Error('Invalid Param: actions must be an object')
  }
  if (defaultState === undefined) {
    throw new Error('Missing parameter defaultState');
  }
  if (typeof defaultState !== 'object' || defaultState === null) {
    throw new Error('Invalid Param: defaultState must be an object')
  }
  const subscriptions = new Set<Subscription>()
  let state: State = defaultState
  const getState = ():State  => state
  const setState = (newState: State) => {
    state = newState
    subscriptions.forEach(subscription => subscription())
  }
  const subscribe = (subscription: Subscription): void => {
    subscriptions.add(subscription)
  }
  const unsubscribe = (subscription: Subscription): void => {
    subscriptions.delete(subscription)
  }
  const actions = Object.entries(actionReducers)
    .reduce((actions, [methodName, method]) => {
      return {
        ...actions,
        [methodName]: (payload: Parameters<typeof method>[1]) => {
          setState(method(getState(), payload));
        }
      }
    }, {} as ActionReducersToAction<T>)
    return {
      get subscribe() { return subscribe },
      get unsubscribe() { return unsubscribe },
      get getState() { return getState },
      get actions() { return actions },
    }
}
