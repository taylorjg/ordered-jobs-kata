const I = require('immutable')

const orderJobs = input => {
  if (!input) return ''
  const jobs = parseLines(input)
  const initialSet = new I.Set()
  const initialOutput = ''
  return loop(jobs, initialSet, initialOutput)
}

const loop = (jobs, set, output) => {
  const finalAcc = jobs.reduce((acc, job) => {
    const { set, output } = acc
    if (set.has(job.id)) return acc
    const makeNewAcc = () => ({
      set: set.add(job.id),
      output: output + job.id
    })
    return job.dependency
      ? (set.has(job.dependency) ? makeNewAcc() : acc)
      : makeNewAcc()
  }, { set, output })
  return finalAcc.set === set
    ? output
    : loop(jobs, finalAcc.set, finalAcc.output)
}

const parseLines = lines => lines.split('\n').map(parseLine)

const parseLine = line => {
  const m1 = line.match(/([a-z])\s=>\s([a-z])/)
  if (m1) return {
    id: m1[1],
    dependency: m1[2]
  }
  const m2 = line.match(/([a-z])/)
  if (m2) return {
    id: m2[1]
  }
  throw new Error(`Failed to parse line, "${line}".`)
}

module.exports = orderJobs
