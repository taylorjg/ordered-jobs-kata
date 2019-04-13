const I = require('immutable')

const orderJobs = input => {
  if (!input) return ''
  const jobs = parseLines(input)
  const initialMap = new I.Map()
  const initialOutput = ''
  return loop(jobs, initialMap, initialOutput)
}

const loop = (jobs, initialMap, initialOutput) => {
  const seed = {
    map: initialMap,
    output: initialOutput
  }
  const finalAcc = jobs.reduce(
    (acc, job) => {
      const { map, output } = acc
      if (map.has(job.id)) return acc
      if (job.dependsOn) {
        if (map.has(job.dependsOn)) {
          return {
            map: map.set(job.id, job.id),
            output: output + job.id
          }
        }
        return acc
      }
      return {
        map: map.set(job.id, job.id),
        output: output + job.id
      }
    },
    seed)
  return finalAcc.map.size === initialMap.size
    ? initialOutput
    : loop(jobs, finalAcc.map, finalAcc.output)
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
