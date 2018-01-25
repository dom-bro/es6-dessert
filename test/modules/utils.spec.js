import { getType, extend } from '../../src/modules/utils'

describe('测试 utils.js', () => {
  it('getType 方法', () => {
    expect(getType({})).to.equal('Object')
    expect(getType([])).to.equal('Array')
    expect(getType(/a/)).to.equal('RegExp')
    expect(getType(1)).to.equal('Number')
    expect(getType('')).to.equal('String')
    expect(getType(null)).to.equal('Null')
    expect(getType(undefined)).to.equal('Undefined')
    expect(getType(() => {})).to.equal('Function')
  })

  describe('extend 方法', function () {
    let a, b
    it('extend 01', () => {
      a = extend({}, {b: 1})
      b = {b: 1}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 02', () => {
      a = extend({a: 1}, {b: 1})
      b = {a: 1, b: 1}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 03', () => {
      a = extend({a: 1}, {a: 2})
      b = {a: 2}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 04', () => {
      a = extend({a: {b: 1}}, {a: [1]})
      b = {a: [1]}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 05-false', () => {
      a = extend({a: {b: 1}}, {a: {c: 1}})
      b = {a: {c: 1}}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 05-true', () => {
      a = extend(true, {a: {b: 1}}, {a: {c: 1}})
      b = {a: {b: 1, c: 1}}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })

    it('extend 06-false', () => {
      a = extend({a: [1, 2]}, {a: [3]})
      b = {a: [3]}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
    it('extend 06-true', () => {
      a = extend(true, {a: [1, 2]}, {a: [3]})
      b = {a: [3, 2]}
      expect(JSON.stringify(a)).to.equal(JSON.stringify(b))
    })
  })
})
