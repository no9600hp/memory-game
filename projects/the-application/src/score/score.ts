import { createTime } from '../create-time/create-time'
import { DatabaseService } from '../database/database.service'
import { Statistic } from '../statistic/statistic'
import { IStatistic } from '../statistic/statistic.d'
import { EventEmitter } from '@angular/core'

/**
 * Functionality for getting, adding, sorting, removing, and clearing
 * for indexeddb and scores list.
 */
export class Score {
  /**
   * Holder for `scores`
   */
  private _scores: Statistic[]

  /**
   * Indexeddb Store Name
   */
  protected storeName: string = 'defaultStore'

  /**
   * Tell whether to sort the list on construction.
   */
  protected sortOnConstruction: boolean = false

  /**
   * Emit a data change for material table.
   */
  public dataChange: EventEmitter<string>

  /**
   * List of scores.
   */
  public get scores(): Statistic[] {
    if (typeof this._scores === 'undefined') {
      this._scores = []
    } else if (!Array.isArray(this._scores)) {
      this._scores = [this._scores]
    }

    return this._scores
  }

  constructor(protected database: DatabaseService) {
    this.dataChange = new EventEmitter<string>()
    this.getScores()
  }

  /**
   * Get scores from indexeddb then push them to scores list.
   *
   * Only On Construction.
   */
  private getScores(): void {
    this.getAll()
      .then((val: Statistic[]): void => {
        val.forEach((item: Statistic): void => {
          this.addScoreStatistic(item)
        })

        if (this.sortOnConstruction) {
          this.sort()
        }

        this.dataChange.emit('getAll')
      })
      .catch((error: DOMException): void => {
        if (error.message === 'Database not set') {
          let self: this

          self = this

          window.setTimeout((): void => {
            self.getScores()
          }, 100)
        } else {
          console.error(error.message)
        }
      })
  }

  /**
   * Sort scores by best score.
   */
  public sort(): void {
    this.scores.sort((a: Statistic, b: Statistic): 1 | -1 | 0 => {
      if (a.flips > b.flips) {
        return 1
      }
      if (a.flips < b.flips) {
        return -1
      }

      let aT: number
      let bT: number

      aT = createTime(a)
      bT = createTime(b)

      if (aT < bT) {
        return -1
      }
      if (aT > bT) {
        return 1
      }
      return 0
    })

    this.dataChange.emit('sorted')
  }

  /**
   * Append statistic to the scores list.
   *
   * @param statistic `Statistic` to add to scores list
   */
  public addScoreStatistic(statistic: Statistic): void {
    this.scores.push(statistic)
  }

  /**
   * Clear scores list.
   */
  public clearScores(): void {
    this.scores.splice(0, this.scores.length)
  }

  /**
   * Get from indexeddb.
   * Resolve with Statistic[].
   * Reject with error.
   */
  private async getAll(): Promise<Statistic[]> {
    return await new Promise(
      (
        resolve: (value: Statistic[]) => void,
        reject: (reason: DOMException) => void
      ): void => {
        if (this.database.database && this.database.ready) {
          let objectStore: IDBObjectStore
          let request: IDBRequest<IStatistic[]>
          let transation: IDBTransaction

          transation = this.database.database.transaction(
            this.storeName,
            'readonly'
          )

          objectStore = transation.objectStore(this.storeName)

          request = objectStore.getAll()

          request.onerror = function(event: Event): void {
            reject(this.error)
          }

          request.onsuccess = function(event: Event): void {
            let result: Statistic[]

            result = this.result.map<Statistic>(
              (val: IStatistic): Statistic => {
                return new Statistic(val)
              }
            )

            resolve(result)
          }
        } else {
          let error: DOMException

          error = new DOMException('Database not set')

          reject(error)
        }
      }
    )
  }

  /**
   * Add to indexeddb.
   * Resolve with keyID.
   * Reject with error.
   *
   * @param statistic `Statistic` to add to indexeddb
   */
  public async add(statistic: Statistic): Promise<Statistic> {
    let self: this

    this.addScoreStatistic(statistic)

    self = this

    return await new Promise(
      (
        resolve: (value: Statistic) => void,
        reject: (reason: DOMException) => void
      ): void => {
        if (this.database.database && this.database.ready) {
          let add: IStatistic
          let objectStore: IDBObjectStore
          let request: IDBRequest<IDBValidKey>
          let transaction: IDBTransaction

          add = Statistic.toJSON(statistic)

          transaction = this.database.database.transaction(
            this.storeName,
            'readwrite'
          )

          objectStore = transaction.objectStore(this.storeName)

          request = objectStore.add(add)

          request.onsuccess = function(event: Event): void {
            statistic.keyID = this.result as number

            self.dataChange.emit('add')

            resolve(statistic)
          }

          request.onerror = function(event: Event): void {
            reject(this.error)
          }
        } else {
          let error: DOMException

          error = new DOMException('Database not set')

          reject(error)
        }
      }
    )
  }

  /**
   * Clear indexeddb.
   * Resolve with undefined.
   * Reject with error.
   */
  public async clear(): Promise<void> {
    let self: this

    this.clearScores()

    self = this

    return await new Promise(
      (
        resolve: (value: void) => void,
        reject: (reason: DOMException) => void
      ): void => {
        if (this.database.database && this.database.ready) {
          let objectStore: IDBObjectStore
          let request: IDBRequest<undefined>
          let transaction: IDBTransaction

          transaction = this.database.database.transaction(
            this.storeName,
            'readwrite'
          )

          objectStore = transaction.objectStore(this.storeName)

          request = objectStore.clear()

          request.onsuccess = function(event: Event): void {
            self.dataChange.emit('clear')

            resolve(this.result)
          }

          request.onerror = function(event: Event): void {
            reject(this.error)
          }
        } else {
          let error: DOMException

          error = new DOMException('Database not set')

          reject(error)
        }
      }
    )
  }

  /**
   * Delete from indexeddb.
   * Resolve with undefined.
   * Reject with error.
   *
   * @param key `number` to remove from indexeddb
   */
  public async delete(key: number): Promise<undefined> {
    let self: this

    self = this

    return await new Promise(
      (
        resolve: (value: undefined) => void,
        reject: (reason: DOMException) => void
      ): void => {
        if (this.database.database && this.database.ready) {
          let objectStore: IDBObjectStore
          let request: IDBRequest<undefined>
          let transaction: IDBTransaction

          transaction = this.database.database.transaction(
            this.storeName,
            'readwrite'
          )

          objectStore = transaction.objectStore(this.storeName)

          request = objectStore.delete(key)

          request.onsuccess = function(event: Event): void {
            self.dataChange.emit('delete')

            resolve(this.result)
          }

          request.onerror = function(event: Event): void {
            reject(this.error)
          }
        } else {
          let error: DOMException

          error = new DOMException('Database not set')

          reject(error)
        }
      }
    )
  }
}
