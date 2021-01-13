declare module 'remark-slug' {
  import {Node} from 'unist'

  export default function slug(): (node: Node) => void
}

declare module 'rehype-highlight' {
  import {Node} from 'unist'

  export default function github(
    settings?: {
      subset?: boolean,
      prefix?: string,
      ignoreMissing?: boolean,
      plainText?: Array,
      aliases?: object,
      languages?: object,
    }
  ): (node: Node) => void
}