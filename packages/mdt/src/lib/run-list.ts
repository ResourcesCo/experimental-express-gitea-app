import { createList, createListItem, createParagraph, createText, isList, isParagraph, isText } from "ts-mdast";
import { List, ListItem } from "mdast";
import { Attacher, Transformer } from "unified";
import visit from "unist-util-visit";
import fetch from "node-fetch";

type ListItemDataPair = [string, string | object];

export const readListItemData = (listItem: ListItem): ListItemDataPair => {
  const paragraph = listItem.children.find(isParagraph);
  const list = listItem.children.find(isList);
  const hasExtraNodes = [paragraph, list].map(
    node => node ? 1 : 0
  ).reduce((a, b) => a + b, 0) !== listItem.children.length;
  if (paragraph && !hasExtraNodes) {
    const textNode = paragraph.children.find(isText);
    if (textNode) {
      const text = textNode.value;
      const [key, value] = text.split(/:\s*(.*)/);
      if (list) {
        return [key, readListData(list)];
      } else {
        return [key, value]; // TODO: handle other data types (numbers, booleans, etc)
      }
    }
  }
  return undefined;
}

export const readListData = (list: List): object => {
  const listItemData = list.children.map(readListItemData);
  if (listItemData.every((pair) => /^\d+$/.test(pair[0]))) {
    return listItemData.map((pair) => pair[1]);
  } else {
    const result = {};
    for (const [key, value] of listItemData) {
      result[key] = value;
    }
    return result;
  }
}

export const makeRequest = async (listData: object): Promise<object | undefined> => {
  if (!('request' in listData)) return undefined;
  if (typeof listData['request'] !== 'object' || listData['request'] === null) return undefined;
  if (Object.keys(listData).length !== 1) return undefined;
  const request = listData['request'];
  if ('url' in request && typeof request['url'] === 'string') {
    const url = request['url'];
    const response = await fetch(url);
    const json = await response.json();
    return {
      status: response.status,
      body: json,
    };
  }
  return undefined;
}

export const writeListItem = (pair: ListItemDataPair) => {
  const [key, value] = pair;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return createListItem(false, false, [createParagraph([createText(`${key}: []`)])]);
    } else {
      return createListItem(false, false, [
        createParagraph([createText(`${key}:`)]),
        createList(false, 0, false, value.map((value, index) => writeListItem([String(index), value]))),
      ]);
    }
  } else if (typeof value === 'object' && value !== null) {
    if (Object.keys(value).length === 0) {
      return createListItem(false, false, [createParagraph([createText(`${key}: {}`)])]);
    } else {
      return createListItem(false, false, [
        createParagraph([createText(`${key}:`)]),
        createList(false, 0, false, Object.entries(value).map(([key, value]) => writeListItem([key, value]))),
      ]);
    }
  } else {
    return createListItem(false, false, [createParagraph([createText(`${key}: ${value}`)])]);
  }
}

/**
 * Run an action based on a tree structure in a markdown list.
 *
 * @param tree - the input
 * @param file - the file
 */
export const runList: Attacher = () => {
  const transformer: Transformer = async (tree, _) => {
    const lists = [];
    visit(tree, 'list', (list: List) => {
      lists.push(list);
      return visit.SKIP;
    });
    for (const list of lists) {
      const listData = readListData(list);
      if (listData) {
        const response = await makeRequest(listData);
        if (response) {
          list.children.push(writeListItem(['response', response]));
        }
      }
    }
  };
  return transformer;
};
