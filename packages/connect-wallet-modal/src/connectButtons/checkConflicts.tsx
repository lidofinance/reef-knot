import { ConflictCheck } from '../constants/conflictChecks'

type ConflictsCheckResult = {
  hasConflicts: boolean
  conflictingAppsArray: string[]
  conflictingApps: string
}

const checkConflicts = (checks: ConflictCheck[]): ConflictsCheckResult => {
  const conflictingAppsArray = checks
    .filter(([checkerFn]) => checkerFn())
    .map(([, appName]) => appName)
  const conflictingApps = conflictingAppsArray.join(', ')
  const hasConflicts = !!conflictingAppsArray.length

  return { hasConflicts, conflictingApps, conflictingAppsArray }
}

export default checkConflicts
