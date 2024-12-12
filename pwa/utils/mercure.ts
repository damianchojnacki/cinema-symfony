import { useEffect, useState } from 'react'
import { PagedCollection, isPagedCollection } from '@/types/collection'
import { Item, isItem } from '@/types/item'

const mercureSubscribe = <T extends Item | PagedCollection<Item> | undefined>(
  hubURL: string,
  data: T | PagedCollection<T>,
  setData: (data: T) => void,
) => {
  if (!data?.['@id']) throw new Error('@id is missing')

  const url = new URL(hubURL, window.origin)

  url.searchParams.append(
    'topic',
    new URL(data['@id'], window.origin).toString(),
  )

  const eventSource = new EventSource(url.toString())

  eventSource.addEventListener('message', (event: MessageEvent<string>) =>
    setData(JSON.parse(event.data) as T),
  )

  return eventSource
}

export const useMercure = <
  TData extends Item | PagedCollection<Item> | undefined,
>(
  deps: TData,
  hubURL: string | null,
): TData => {
  const [data, setData] = useState(deps)

  useEffect(() => {
    setData(deps)
  }, [deps])

  useEffect(() => {
    if (!hubURL || (data == null)) {
      return
    }

    if (!isPagedCollection<Item>(data) && !isItem(data)) {
      console.error('Object sent is not in JSON-LD format.')

      return
    }

    if (
      isPagedCollection<Item>(data) && (data.member != null) && data.member.length !== 0
    ) {
      const eventSources: EventSource[] = []
      // It's a PagedCollection
      data.member.forEach((obj, pos) => {
        eventSources.push(
          mercureSubscribe(hubURL, obj, (datum) => {
            if (data.member != null) {
              data.member[pos] = datum
            }
            setData({ ...data })
          }),
        )
      })

      return () => eventSources.forEach((eventSource) => eventSource.close())
    }

    // It's a single object
    const eventSource = mercureSubscribe<TData>(hubURL, data, setData)

    return () => {
      eventSource.close()
    }
  }, [data])

  return data
}
