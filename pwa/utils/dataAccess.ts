import isomorphicFetch from 'isomorphic-unfetch'

import { PagedCollection } from '@/types/collection'
import { Item } from '@/types/item'
import { ENTRYPOINT } from '@/config/entrypoint'

const MIME_TYPE = 'application/ld+json'

interface Violation {
  message: string
  propertyPath: string
}

export interface FetchResponse<TData> {
  hubURL: string | null
  data: TData & Item
  text: string
}

export interface FetchError {
  message: string
  status: string
  fields: Record<string, string>
}

const extractHubURL = (response: Response): null | URL => {
  const linkHeader = response.headers.get('Link')
  if (!linkHeader) return null

  const matches = /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/.exec(linkHeader)

  return matches?.[1] ? new URL(matches[1], ENTRYPOINT) : null
}

export const fetch = async <TData>(
  id: string,
  init: RequestInit = {}
): Promise<FetchResponse<TData> | undefined> => {
  if (typeof init.headers === 'undefined') init.headers = {}

  if (!Object.hasOwn(init.headers, 'Accept')) { init.headers = { ...init.headers, Accept: MIME_TYPE } }

  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    init.headers &&
    !Object.hasOwn(init.headers, 'Content-Type')
  ) { init.headers = { ...init.headers, 'Content-Type': MIME_TYPE } }

  const resp = await isomorphicFetch(ENTRYPOINT + id, init)
  if (resp.status === 204) return

  const text = await resp.text()
  const json = JSON.parse(text)
  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString() || null, // URL cannot be serialized as JSON, must be sent as string
      data: json,
      text
    }
  }

  const errorMessage = json.title
  const status = json.description || resp.statusText
  if (!json.violations) throw Error(errorMessage)
  const fields: Record<string, string> = {}
  json.violations.map(
    (violation: Violation) =>
      (fields[violation.propertyPath] = violation.message)
  )

  throw { message: errorMessage, status, fields } as FetchError
}

export const getItemPath = (
  iri: string | undefined,
  pathTemplate: string
): string => {
  if (!iri) {
    return ''
  }

  const resourceId = iri.split('/').slice(-1)[0]

  return pathTemplate.replace('[id]', resourceId)
}

export const parsePage = (resourceName: string, path: string) =>
  parseInt(
    new RegExp(`^/${resourceName}\\?page=(\\d+)`).exec(path)?.[1] ?? '1',
    10
  )

export const getItemPaths = async <TData extends Item>(
  response: FetchResponse<PagedCollection<TData>> | undefined,
  resourceName: string,
  pathTemplate: string
) => {
  if (response == null) return []

  try {
    const view = response.data.view
    const { last } = view ?? {}
    const paths =
      response.data.member?.map((resourceData) =>
        getItemPath(resourceData['@id'] ?? '', pathTemplate)
      ) ?? []
    const lastPage = parsePage(resourceName, last ?? '')

    for (let page = 2; page <= lastPage; page++) {
      paths.push(
        ...((
          await fetch<PagedCollection<TData>>(`/${resourceName}?page=${page}`)
        )?.data.member?.map((resourceData) =>
          getItemPath(resourceData['@id'] ?? '', pathTemplate)
        ) ?? [])
      )
    }

    return paths
  } catch (e) {
    console.error(e)

    return []
  }
}
