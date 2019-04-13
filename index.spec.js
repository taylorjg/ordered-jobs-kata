const expect = require('chai').expect
const orderJobs = require('./index.js')

describe('ordered-jobs-kata tests', () => {
  
  it('no jobs', () => {
    const actual = orderJobs('')
    expect(actual).to.equal('')
  })

  it('one job with no dependencies', () => {
    const actual = orderJobs('a')
    expect(actual).to.equal('a')
  })

  it('two jobs with no dependencies', () => {
    const lines = [
      'a',
      'b'
    ]
    const actual = orderJobs(lines.join('\n'))
    expect(actual).to.equal('ab')
  })
})
