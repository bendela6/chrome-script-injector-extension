import { Store } from "./store.ts";
import { TabDto } from "../types.ts";

export const tabStore = new Store<TabDto | undefined>(undefined);

export function startTabListener() {

  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab.id && tab.url) {
      tabStore.setData({ id: tab.id, url: tab.url });
    }
  });

  const createdListener = (tab: chrome.tabs.Tab) => {
    if (tab.id && tab.url) {
      tabStore.setData({ id: tab.id, url: tab.url });
    }
  };

  const updatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      tabStore.setData({ id: tabId, url: tab.url });
    }
  };

  chrome.tabs.onCreated.addListener(createdListener);
  chrome.tabs.onUpdated.addListener(updatedListener);

  return () => {
    chrome.tabs.onCreated.removeListener(createdListener);
    chrome.tabs.onUpdated.removeListener(updatedListener);
  };

}


