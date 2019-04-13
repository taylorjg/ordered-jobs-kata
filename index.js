const I = require('immutable')

const orderJobs = input => {
  if (!input) return ''
  const jobs = parseLines(input)
  const initialSet = new I.Set()
  const initialOutput = ''
  detectCircularDependencies(jobs)
  return loop(jobs, initialSet, initialOutput)
}

const buildMap = jobs =>
  jobs.reduce((map, job) => map.set(job.id, job.dependency), new I.Map())

const followDependencies = map => dependencies => {
  const lastDependency = dependencies.slice(-1)[0]
  const nextDependency = map.get(lastDependency)
  if (nextDependency) {
    const newDependencies = [...dependencies, nextDependency]
    if (dependencies.includes(nextDependency)) {
      const badDependencies = lastDependency === nextDependency
        ? dependencies
        : newDependencies
      throw new Error(`Found circular dependency: ${badDependencies}`)
    }
    followDependencies(map)(newDependencies)
  }
}

const detectCircularDependencies = jobs => {
  const map = buildMap(jobs)
  map.mapEntries(followDependencies(map))
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
