const I = require('immutable')

const orderJobs = input => {
  if (!input) return ''
  const jobs = parseLines(input)
  const initialSet = new I.Set()
  const initialOutput = ''
  return loop(jobs, initialSet, initialOutput)
}

const loop = (jobs, initialSet, initialOutput) => {
  const seed = {
    set: initialSet,
    output: initialOutput
  }
  const finalAcc = jobs.reduce(
    (acc, job) => {
      const { set, output } = acc
      if (set.has(job.id)) return acc
      if (job.dependsOn) {
        if (set.has(job.dependsOn)) {
          return {
            set: set.add(job.id),
            output: output + job.id
          }
        }
        return acc
      }
      return {
        set: set.add(job.id),
        output: output + job.id
      }
    },
    seed)
  return finalAcc.set.size === initialSet.size
    ? initialOutput
    : loop(jobs, finalAcc.set, finalAcc.output)
}

const parseLines = lines => lines.split('\n').map(parseLine)

const parseLine = line => {
  const m1 = line.match(/([a-z])\s=>\s([a-z])/)
  if (m1) return {
    id: m1[1],
    dependsOn: m1[2]
  }
  const m2 = line.match(/([a-z])/)
  if (m2) return {
    id: m2[1]
  }
  throw new Error(`Failed to parse line, "${line}".`)
}

module.exports = orderJobs
