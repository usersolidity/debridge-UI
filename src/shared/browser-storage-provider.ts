import { Injectable} from "@angular/core";

declare const memoryStorage: Storage;

@Injectable()
export class BrowserStorageProvider {

  public getStorage(storage: Storage): Storage {
        let x = '__storage_test__';
        try {
            storage.setItem(x, x);
            storage.removeItem(x);
            return storage;
        } catch (e) {
            return memoryStorage;
        }
    }
}
