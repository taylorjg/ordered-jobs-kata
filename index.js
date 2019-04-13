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
  const PARSE_TABLE = [
    [/([a-z]) => ([a-z])/, m => ({ id: m[1], dependency: m[2] })],
    [/([a-z])/, m => ({ id: m[1] })]
  ]
  for (const [r, f] of PARSE_TABLE) {
    const match = r.exec(line)
    if (match) return f(match)
  }
  throw new Error(`Failed to parse line, "${line}".`)
}

module.exports = orderJobs
