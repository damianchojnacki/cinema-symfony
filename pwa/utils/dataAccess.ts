import isomorphicFetch from 'isomorphic-unfetch'

import { PagedCollection } from '@/types/collection'
import { Item } from '@/types/item'
import { ENTRYPOINT } from '@/config/entrypoint'
import type {ApiError as BaseApiError} from "@damianchojnacki/cinema"

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

export interface SymfonyError {
  title: string
  description?: string
  violations?: Violation[]
}

class ApiError extends Error implements BaseApiError {
  public response: BaseApiError['response'] = undefined

  constructor(message: string, response: BaseApiError['response']) {
    super(message);

    this.response = response
  }
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

  const hostname = process.env.NEXT_PUBLIC_HOSTNAME ?? 'localhost'

  if (!Object.hasOwn(init.headers, 'Accept')) { init.headers = { ...init.headers, Accept: MIME_TYPE, 'X-Forwarded-Host': hostname } }

  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    init.headers &&
    !Object.hasOwn(init.headers, 'Content-Type')
  ) { init.headers = { ...init.headers, 'Content-Type': MIME_TYPE, 'X-Forwarded-Host': hostname } }

  const resp = await isomorphicFetch(ENTRYPOINT + id, init)
  if (resp.status === 204) return

  const data = await resp.text()
  let json = {}

  try {
    json = JSON.parse(data) as TData & Item | SymfonyError
  } catch {
    console.error('Request to: ' + ENTRYPOINT + id)
    console.error('ERROR - Cannot parse JSON:')
    console.error(data)
  }

  if (resp.ok) {
    return {
      hubURL: extractHubURL(resp)?.toString() ?? null,
      data: json as TData & Item,
      text: JSON.stringify(json)
    }
  }

  const error = json as SymfonyError

  const errorMessage = error.title
  const status = error.description ?? resp.statusText

  if (!error.violations) {
    throw new Error(errorMessage)
  }

  const errors: Record<string, string> = {}

  error.violations.map(
    (violation: Violation) =>
      (errors[violation.propertyPath] = violation.message)
  )

  throw new ApiError(errorMessage, {
    data: {
      message: status,
      errors
    }
  })
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
