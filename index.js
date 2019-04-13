const orderJobs = lines => {
  if (!lines) return ''
  const jobs = parseLines(lines)
  return jobs.map(job => job.id).join('')
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
