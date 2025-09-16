import GroupPage from '@/components/finance/GroupPage'
import { createGroup } from '@/db/finance'
import { useEffect, useState } from 'react'

export default function ExpensesDemoPage() {
  const [gid, setGid] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const g = await createGroup({
        name: 'Coloc',
        memberIds: ['Alice', 'Bob', 'Chloé'],
        defaultCurrency: 'EUR',
      })
      setGid(g.id)
    })()
  }, [])

  if (!gid) return <div>Init…</div>
  return <GroupPage groupId={gid} />
}
