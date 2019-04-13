const expect = require('chai').expect
const orderJobs = require('./index.js')

describe('ordered-jobs-kata tests', () => {
  
  it('empty input', () => {
    const actual = orderJobs('')
    expect(actual).to.equal('')
  })
})
