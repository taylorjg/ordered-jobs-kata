const expect = require('chai').expect
const orderJobs = require('./index.js')

describe('ordered-jobs-kata tests', () => {

  it('no jobs', () => {
    const output = orderJobs('')
    expect(output).to.be.empty
  })

  it('one job with no dependencies', () => {
    const output = orderJobs('a')
    assertOutputContainsIdsOnce(output, 'a')
  })

  it('two jobs with no dependencies', () => {
    const lines = [
      'a',
      'b'
    ]
    const output = orderJobs(lines.join('\n'))
    assertOutputContainsIdsOnce(output, 'ab')
  })

  it('simple dependency', () => {
    const lines = [
      'a',
      'b => a'
    ]
    const output = orderJobs(lines.join('\n'))
    assertOutputContainsIdsOnce(output, 'ab')
    assertJobOrder(output, 'a', 'b')
  })

  it('complex dependency', () => {
    const lines = [
      "a",
      "b => c",
      "c => f",
      "d => a",
      "e => b",
      "f"
    ]
    const output = orderJobs(lines.join('\n'))
    assertOutputContainsIdsOnce(output, 'abcdef')
    assertJobOrder(output, 'c', 'b')
    assertJobOrder(output, 'f', 'c')
    assertJobOrder(output, 'a', 'd')
    assertJobOrder(output, 'b', 'e')
  })

  const assertOutputContainsIdsOnce = (output, ids) => {
    ids.split('').forEach(id => {
      const firstIndex = output.indexOf(id)
      expect(firstIndex).to.be.gte(0)
      const nextIndex = output.indexOf(id, firstIndex + 1)
      expect(nextIndex).to.equal(-1)
    })
  }

  const assertJobOrder = (output, id1, id2) => {
    const index1 = output.indexOf(id1)
    const index2 = output.indexOf(id2)
    expect(index1).to.be.gte(0)
    expect(index2).to.be.gte(0)
    expect(index1).to.be.lt(index2)
  }
})
