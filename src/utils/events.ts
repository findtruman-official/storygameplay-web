export enum GlobalEventType {
  OpenConnectWalletModal = 'OpenConnectWalletModal',
}

class GlobalEvent extends EventTarget {
  openConnectWalletModal() {
    this.dispatchEvent(new CustomEvent(GlobalEventType.OpenConnectWalletModal));
  }
}

export const globalEvent = new GlobalEvent();
