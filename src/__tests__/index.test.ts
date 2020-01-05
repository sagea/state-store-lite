import { createStore } from '../index'

describe('simple state store', () => {
  test('should create actions from provided actions param using the payload', () => {
    const store = createStore({
      foo(state) {
        return { ...state }
      }
    }, {})
    expect(store.actions).toEqual({
      foo: expect.any(Function)
    })
  })
  test('getState should return the initial default state when first called', () => {
    const store = createStore({}, { a: 'b' })
    expect(store.getState()).toEqual({ a: 'b' })
  })
  test('store should return actions as callable functions that intake the payload for an argument', () => {
    const defaultState = { count: 0 }
    const subscription = jest.fn()
    const store = createStore({
      add(state, payload) {
        return {
          ...state,
          count: state.count + payload,
        }
      },
      subtract(state, payload) {
        return {
          ...state,
          count: state.count - payload,
        }
      }
    }, defaultState)
    store.subscribe(subscription)
    expect(store.getState()).toEqual({ count: 0 })
    store.actions.add(5)
    expect(store.getState()).toEqual({ count: 5 })
    expect(subscription).toHaveBeenCalledTimes(1)
    store.actions.add(3)
    expect(store.getState()).toEqual({ count: 8 })
    expect(subscription).toHaveBeenCalledTimes(2)
    store.actions.subtract(1)
    expect(store.getState()).toEqual({ count: 7 })
    expect(subscription).toHaveBeenCalledTimes(3)
    store.actions.subtract(6)
    expect(store.getState()).toEqual({ count: 1 })
    expect(subscription).toHaveBeenCalledTimes(4)
  })
  test('should be able to unsubscribe from store', () => {
    const subscription1 = jest.fn()
    const subscription2 = jest.fn()
    const store = createStore({
      go() { return {} }
    }, {})
    store.subscribe(subscription1)
    store.subscribe(subscription2)
    store.actions.go()
    store.actions.go()
    expect(subscription1).toHaveBeenCalledTimes(2)
    expect(subscription2).toHaveBeenCalledTimes(2)
    store.unsubscribe(subscription2)
    store.actions.go()
    store.actions.go()
    expect(subscription1).toHaveBeenCalledTimes(4)
    expect(subscription2).toHaveBeenCalledTimes(2)
    store.subscribe(subscription2)
    store.actions.go()
    store.actions.go()
    expect(subscription1).toHaveBeenCalledTimes(6)
    expect(subscription2).toHaveBeenCalledTimes(4)
    store.unsubscribe(subscription1)
    store.unsubscribe(subscription2)
    store.actions.go()
    store.actions.go()
    expect(subscription1).toHaveBeenCalledTimes(6)
    expect(subscription2).toHaveBeenCalledTimes(4)
  })
  test('should only fire subscription once if added multiple times', () => {
    const subscription = jest.fn()
    const store = createStore({
      go () { return { } }
    }, {})
    store.subscribe(subscription)
    store.subscribe(subscription)
    store.subscribe(subscription)
    store.actions.go()
    expect(subscription).toHaveBeenCalledTimes(1)
  })

  test('should throw an error for missing actions', () => {
    expect(() => {
      createStore()
    }).toThrow('Missing parameter actions')
  })
  test('should throw an error if provided actions isn`t an object or null', () => {
    expect(() => {
      createStore(123)
    }).toThrow('Invalid Param: actions must be an object')
    expect(() => {
      createStore(null)
    }).toThrow('Invalid Param: actions must be an object')
  })
  test('should throw an error for missing default state',  () => {
    expect(() => {
      createStore({})
    }).toThrow('Missing parameter defaultState')
  })
  test('should throw an error if default state is not an object', () => {
    expect(() => {
      createStore({}, 123)
    }).toThrow('Invalid Param: defaultState must be an object')
    expect(() => {
      createStore({}, null)
    }).toThrow('Invalid Param: defaultState must be an object')
  })
})